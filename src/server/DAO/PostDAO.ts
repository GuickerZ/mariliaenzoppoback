import { AppDataSource } from '../database/data-source';
import { Post } from '../database/entities/Post.entity';

export const PostDAO = {
  create: async (content: string, userId: number) => {
    const repo = AppDataSource.getRepository(Post);
    const post = repo.create({ content, creator: { id: userId } });
    return await repo.save(post);
  },

  createInCommunity: async (content: string, userId: number, communityId: number) => {
    const repo = AppDataSource.getRepository(Post);
    const post = repo.create({ content, creator: { id: userId }, community: { id: communityId } as any });
    return await repo.save(post);
  },

  getByUserId: async (userId: number) => {
    return await AppDataSource.getRepository(Post).find({
      where: { creator: { id: userId } },
      relations: {
        creator: true,
        community: true,
      },
      order: { createdAt: 'DESC' },
    });
  },

  getByCommunityId: async (communityId: number) => {
    return await AppDataSource.getRepository(Post).find({
      where: { community: { id: communityId } as any },
      relations: { creator: true, community: true },
      order: { createdAt: 'DESC' },
    });
  },

  countByUserId: async (userId: number) => {
    return await AppDataSource.getRepository(Post).count({ where: { creator: { id: userId } } });
  },

  listDatesByUserId: async (userId: number) => {
    // Return only createdAt ordered desc for streak calc
    return await AppDataSource.getRepository(Post)
      .createQueryBuilder('post')
      .select('post.createdAt', 'createdAt')
      .where('post.creatorId = :userId', { userId })
      .orderBy('post.createdAt', 'DESC')
      .getRawMany<{ createdAt: Date }>();
  },

  listRandom: async ({ limit = 5 } = {}) => {
    // queryBuilder
    return await AppDataSource.getRepository(Post)
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.creator', 'creator')
      .leftJoinAndSelect('post.community', 'community')
      .orderBy('RANDOM()')
      .limit(limit)
      .getMany();
  },

  hasUserLiked: async (postId: number, userId: number) => {
    const count = await AppDataSource.getRepository(Post)
      .createQueryBuilder('post')
      .innerJoin('post.likedBy', 'user', 'user.id = :userId', { userId })
      .where('post.id = :postId', { postId })
      .getCount();
    return count > 0;
  },

  addLike: async (postId: number, userId: number) => {
    const already = await PostDAO.hasUserLiked(postId, userId);
    if (already) return false;
    await AppDataSource.createQueryBuilder()
      .relation(Post, 'likedBy')
      .of(postId)
      .add(userId);
    return true;
  },

  removeLike: async (postId: number, userId: number) => {
    const already = await PostDAO.hasUserLiked(postId, userId);
    if (!already) return false;
    await AppDataSource.createQueryBuilder()
      .relation(Post, 'likedBy')
      .of(postId)
      .remove(userId);
    return true;
  },

  listLikedPostIdsByUserIn: async (userId: number, postIds: number[]) => {
    if (!postIds.length) return [] as number[];
    const rows = await AppDataSource.getRepository(Post)
      .createQueryBuilder('post')
      .select('post.id', 'id')
      .innerJoin('post.likedBy', 'user', 'user.id = :userId', { userId })
      .where('post.id IN (:...postIds)', { postIds })
      .getRawMany<{ id: number }>();
    return rows.map(r => Number(r.id));
  },

  listDislikedPostIdsByUserIn: async (userId: number, postIds: number[]) => {
    if (!postIds.length) return [] as number[];
    const rows = await AppDataSource.getRepository(Post)
      .createQueryBuilder('post')
      .select('post.id', 'id')
      .innerJoin('post.dislikedBy', 'user', 'user.id = :userId', { userId })
      .where('post.id IN (:...postIds)', { postIds })
      .getRawMany<{ id: number }>();
    return rows.map(r => Number(r.id));
  },

  hasUserDisliked: async (postId: number, userId: number) => {
    const count = await AppDataSource.getRepository(Post)
      .createQueryBuilder('post')
      .innerJoin('post.dislikedBy', 'user', 'user.id = :userId', { userId })
      .where('post.id = :postId', { postId })
      .getCount();
    return count > 0;
  },

  addDislike: async (postId: number, userId: number) => {
    const already = await PostDAO.hasUserDisliked(postId, userId);
    if (already) return false;
    await AppDataSource.createQueryBuilder()
      .relation(Post, 'dislikedBy')
      .of(postId)
      .add(userId);
    return true;
  },

  removeDislike: async (postId: number, userId: number) => {
    const already = await PostDAO.hasUserDisliked(postId, userId);
    if (!already) return false;
    await AppDataSource.createQueryBuilder()
      .relation(Post, 'dislikedBy')
      .of(postId)
      .remove(userId);
    return true;
  },

  getById: async (id: number) => {
    return await AppDataSource.getRepository(Post).findOne({
      where: { id },
      relations: { creator: true, community: true },
    });
  },

  incrementQualidade: async (postId: number, by: number = 1) => {
    const repo = AppDataSource.getRepository(Post);
    await repo.increment({ id: postId }, 'qualidade', by);
    return await repo.findOne({ where: { id: postId }, relations: { creator: true, community: true } });
  },

  decrementQualidade: async (postId: number, by: number = 1) => {
    const repo = AppDataSource.getRepository(Post);
    await repo.decrement({ id: postId }, 'qualidade', by);
    return await repo.findOne({ where: { id: postId }, relations: { creator: true, community: true } });
  },

  incrementNaoGostou: async (postId: number, by: number = 1) => {
    const repo = AppDataSource.getRepository(Post);
    await repo.increment({ id: postId }, 'naoGostou', by);
    return await repo.findOne({ where: { id: postId }, relations: { creator: true, community: true } });
  },

  decrementNaoGostou: async (postId: number, by: number = 1) => {
    const repo = AppDataSource.getRepository(Post);
    await repo.decrement({ id: postId }, 'naoGostou', by);
    return await repo.findOne({ where: { id: postId }, relations: { creator: true, community: true } });
  },

  countByDayInRange: async (userId: number, from: Date, to: Date) => {
    // Postgres: date_trunc to group by day
    const rows = await AppDataSource.getRepository(Post)
      .createQueryBuilder('post')
      .select("DATE_TRUNC('day', post.createdAt)", 'day')
      .addSelect('COUNT(*)', 'count')
      .where('post.creatorId = :userId', { userId })
      .andWhere('post.createdAt >= :from AND post.createdAt < :to', { from, to })
      .groupBy("DATE_TRUNC('day', post.createdAt)")
      .orderBy("DATE_TRUNC('day', post.createdAt)", 'ASC')
      .getRawMany<{ day: string; count: string }>();

    return rows;
  }
};
