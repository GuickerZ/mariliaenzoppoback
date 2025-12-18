import { AppDataSource } from '../database/data-source';
import { Discussion } from '../database/entities/Discussion.entity';
import { IsNull, Not } from 'typeorm';

export const DiscussionDAO = {
  ensureRootForPost: async (postId: number) => {
    const repo = AppDataSource.getRepository(Discussion);
    const existing = await repo.findOne({ where: { post: { id: postId } as any, parent: IsNull() } });
    if (existing) return existing;
    const root = repo.create({ post: { id: postId } as any, content: null, parent: null });
    return await repo.save(root);
  },

  createReply: async (postId: number, userId: number, content: string) => {
    const repo = AppDataSource.getRepository(Discussion);
    const root = await DiscussionDAO.ensureRootForPost(postId);
    const reply = repo.create({
      post: { id: postId } as any,
      creator: { id: userId } as any,
      content,
      parent: { id: root.id } as any,
    });
    return await repo.save(reply);
  },

  listRepliesByPost: async (postId: number) => {
    return await AppDataSource.getRepository(Discussion).find({
      where: { post: { id: postId } as any, parent: Not(IsNull()) },
      relations: { creator: true },
      order: { createdAt: 'ASC' },
    });
  },

  listByPostExcludingRoot: async (postId: number) => {
    return await AppDataSource.getRepository(Discussion)
      .createQueryBuilder('d')
      .leftJoinAndSelect('d.creator', 'creator')
      .where('d.postId = :postId', { postId })
      .andWhere('d.parentId IS NOT NULL')
      .orderBy('d.createdAt', 'ASC')
      .getMany();
  },

  countRepliesByUserId: async (userId: number) => {
    return await AppDataSource.getRepository(Discussion)
      .createQueryBuilder('d')
      .where('d.creatorId = :userId', { userId })
      .andWhere('d.parentId IS NOT NULL')
      .getCount();
  }
};
