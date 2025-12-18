import { AppDataSource } from '../database/data-source';
import { Community } from '../database/entities/Community.entity';
import { User } from '../database/entities/User.entity';
import { Discussion } from '../database/entities/Discussion.entity';

export const CommunityDAO = {
  create: async (name: string, description: string | undefined, creatorId: number) => {
    const repo = AppDataSource.getRepository(Community);
    const community = repo.create({
      name,
      description,
      creator: { id: creatorId } as User,
      members: [{ id: creatorId } as User],
    });
    return await repo.save(community);
  },

  getById: async (id: number) => {
    return await AppDataSource.getRepository(Community).findOne({
      where: { id },
      relations: { creator: true, members: true },
    });
  },

  list: async () => {
    return await AppDataSource.getRepository(Community).find({
      relations: { creator: true },
      order: { createdAt: 'DESC' },
    });
  },

  listWithCounts: async () => {
    const qb = AppDataSource.getRepository(Community)
      .createQueryBuilder('c')
      .leftJoin('c.members', 'm')
      .leftJoin('c.posts', 'p')
      .leftJoin(Discussion, 'd', 'd.postId = p.id AND d.parentId IS NOT NULL')
      .leftJoin('c.creator', 'creator')
      .select('c')
      .addSelect('COUNT(DISTINCT m.id)', 'membersCount')
      .addSelect('COUNT(DISTINCT p.id)', 'postsCount')
      .addSelect('COUNT(DISTINCT CASE WHEN d.id IS NOT NULL THEN p.id END)', 'discussionsCount')
      .addSelect('COUNT(d.id)', 'repliesCount')
      .addSelect('creator.id', 'creator_id')
      .groupBy('c.id')
      .addGroupBy('creator.id')
      .orderBy('c.createdAt', 'DESC');

    const rows = await qb.getRawAndEntities();
    return rows.entities.map((entity, idx) => {
      const raw = rows.raw[idx];
      return {
        ...entity,
        membersCount: Number(raw.membersCount || 0),
        postsCount: Number(raw.postsCount || 0),
        discussionsCount: Number(raw.discussionsCount || 0),
      } as any;
    });
  },

  addMember: async (communityId: number, userId: number) => {
    const communityRepo = AppDataSource.getRepository(Community);
    const userRepo = AppDataSource.getRepository(User);

    const community = await communityRepo.findOne({ where: { id: communityId }, relations: { members: true } });
    if (!community) return null;

    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) return null;

    const alreadyMember = community.members?.some(m => m.id === userId);
    if (!alreadyMember) {
      community.members = [...(community.members || []), user];
      await communityRepo.save(community);
    }

    return community;
  },

  countByMemberId: async (userId: number) => {
    // count communities where user is in members junction table
    return await AppDataSource.getRepository(Community)
      .createQueryBuilder('community')
      .leftJoin('community.members', 'member')
      .where('member.id = :userId', { userId })
      .getCount();
  },

  getDetailsWithDiscussions: async (communityId: number, userId?: number) => {
    const communityRepo = AppDataSource.getRepository(Community);

    const community = await communityRepo.findOne({
      where: { id: communityId },
      relations: { creator: true },
    });
    if (!community) return null;

    const isMember = userId ? await communityRepo
      .createQueryBuilder('c')
      .leftJoin('c.members', 'm')
      .where('c.id = :communityId', { communityId })
      .andWhere('m.id = :userId', { userId })
      .getExists() : false;

    const membersCount = await communityRepo
      .createQueryBuilder('c')
      .leftJoin('c.members', 'm')
      .where('c.id = :communityId', { communityId })
      .select('COUNT(DISTINCT m.id)', 'cnt')
      .getRawOne<{ cnt: string }>()
      .then(r => Number(r?.cnt || 0));

    const discussionsCount = await AppDataSource.getRepository(Discussion)
      .createQueryBuilder('d')
      .leftJoin('d.post', 'p')
      .where('p.communityId = :communityId', { communityId })
      .andWhere('d.parentId IS NOT NULL')
      .select('COUNT(DISTINCT p.id)', 'cnt')
      .getRawOne<{ cnt: string }>()
      .then(r => Number(r?.cnt || 0));

    const discussions = await AppDataSource.getRepository(Discussion)
      .createQueryBuilder('d')
      .leftJoinAndSelect('d.creator', 'creator')
      .leftJoinAndSelect('d.post', 'p')
      .where('p.communityId = :communityId', { communityId })
      .andWhere('d.parentId IS NOT NULL')
      .orderBy('d.createdAt', 'ASC')
      .getMany();

    return { community, isMember, discussions, membersCount, discussionsCount };
  },
};
