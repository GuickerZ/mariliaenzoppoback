import { Request, Response } from 'express';
import { CommunityDAO } from 'Src/server/DAO/CommunityDAO';
import { PostDAO } from 'Src/server/DAO/PostDAO';
import { DiscussionDAO } from 'Src/server/DAO/DiscussionDAO';

export class CommunityController {
  public static async create(req: Request, res: Response) {
    const userId = req.header('idUsuario');
    const { name, description } = req.body as { name?: string; description?: string };

    if (!name) return res.status(400).json({ error: 'Nome da comunidade é obrigatório' });

    const community = await CommunityDAO.create(name, description, Number(userId));
    return res.status(201).json(community);
  }

  public static async list(req: Request, res: Response) {
    const communities = await CommunityDAO.listWithCounts();
    return res.status(200).json(communities);
  }

  public static async listWithCounts(req: Request, res: Response) {
    const communities = await CommunityDAO.listWithCounts();
    return res.status(200).json(communities);
  }

  public static async join(req: Request, res: Response) {
    const userId = req.headers["idUsuario"];
    const communityId = Number(req.params.id);

    if (!communityId) return res.status(400).json({ error: 'ID da comunidade inválido' });

    const updated = await CommunityDAO.addMember(communityId, Number(userId));
    if (!updated) return res.status(404).json({ error: 'Comunidade não encontrada' });

    return res.status(200).json(updated);
  }

  public static async listPosts(req: Request, res: Response) {
    const communityId = Number(req.params.id);
    if (!communityId) return res.status(400).json({ error: 'ID da comunidade inválido' });

    const posts = await PostDAO.getByCommunityId(communityId);

    const userIdHeader = req.header('idUsuario');

    if (!userIdHeader) return res.status(200).json(posts.map(p => ({ ...p, hasLiked: false, hasDisliked: false })));

    const userId = Number(userIdHeader);
    const likedIds = await PostDAO.listLikedPostIdsByUserIn(userId, posts.map(p => p.id));
    const dislikedIds = await PostDAO.listDislikedPostIdsByUserIn(userId, posts.map(p => p.id));
    const likedSet = new Set(likedIds);
    const dislikedSet = new Set(dislikedIds);

    return res.status(200).json(posts.map(p => ({ ...p, hasLiked: likedSet.has(p.id), hasDisliked: dislikedSet.has(p.id) })));
  }

  public static async createPost(req: Request, res: Response) {
    const userId = req.headers["idUsuario"];
    const communityId = Number(req.params.id);
    const { content } = req.body as { content?: string };

    if (!content) return res.status(400).json({ error: 'Conteúdo obrigatório' });

    const post = await PostDAO.createInCommunity(content, Number(userId), communityId);
    await DiscussionDAO.ensureRootForPost(post.id);
    return res.status(201).json(post);
  }

  public static async details(req: Request, res: Response) {
    const userIdHeader = req.headers["idUsuario"];
    const communityId = Number(req.params.id);
    if (!communityId) return res.status(400).json({ error: 'ID da comunidade inválido' });

    const details = await CommunityDAO.getDetailsWithDiscussions(communityId, userIdHeader ? Number(userIdHeader) : undefined);
    if (!details) return res.status(404).json({ error: 'Comunidade não encontrada' });

    return res.status(200).json(details);
  }
}
