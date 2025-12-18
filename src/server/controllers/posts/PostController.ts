import { Request, Response } from 'express';
import { PostDAO } from 'Src/server/DAO/PostDAO';

export class PostController {
  public static async create(req: Request, res: Response) {
    const userId = req.header('idUsuario');
    const { content } = req.body;

    if (!content) return res.status(400).json({ error: "Conteúdo obrigatório" });

    const post = await PostDAO.create(content, Number(userId));

    return res.status(201).json(post);
  }

  public static async show(req: Request, res: Response) {
    const userId = Number(req.header('idUsuario'));
    const posts = await PostDAO.getByUserId(userId);

    const likedIds = await PostDAO.listLikedPostIdsByUserIn(userId, posts.map(p => p.id));
    const dislikedIds = await PostDAO.listDislikedPostIdsByUserIn(userId, posts.map(p => p.id));
    const likedSet = new Set(likedIds);
    const dislikedSet = new Set(dislikedIds);

    const payload = posts.map(p => ({ ...p, hasLiked: likedSet.has(p.id), hasDisliked: dislikedSet.has(p.id) }));
    return res.status(200).json(payload);
  }

  public static async listRandom(req: Request, res: Response) {
    const posts = await PostDAO.listRandom({limit: 5});

    const userIdHeader = req.header('idUsuario');
    if (!userIdHeader) return res.status(200).json(posts.map(p => ({ ...p, hasLiked: false, hasDisliked: false })));

    const userId = Number(userIdHeader);
    const likedIds = await PostDAO.listLikedPostIdsByUserIn(userId, posts.map(p => p.id));
    const dislikedIds = await PostDAO.listDislikedPostIdsByUserIn(userId, posts.map(p => p.id));
    const likedSet = new Set(likedIds);
    const dislikedSet = new Set(dislikedIds);

    return res.status(200).json(posts.map(p => ({ ...p, hasLiked: likedSet.has(p.id), hasDisliked: dislikedSet.has(p.id) })));
  }

  public static async like(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'ID inválido' });

    const userId = Number(req.headers["idUsuario"]);

    const post = await PostDAO.getById(id);
    if (!post) return res.status(404).json({ error: 'Post não encontrado' });

    // Se usuário estiver com dislike, remove antes de dar like
    if (await PostDAO.hasUserDisliked(id, userId)) {
      await PostDAO.removeDislike(id, userId);
      await PostDAO.decrementNaoGostou(id, 1);
    }

    const added = await PostDAO.addLike(id, userId);
    if (added) await PostDAO.incrementQualidade(id, 1);

    const updated = await PostDAO.getById(id);
    return res.status(200).json({ ...updated!, hasLiked: true, hasDisliked: false });
  }

  public static async unlike(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'ID inválido' });

    const userId = Number(req.headers["idUsuario"]);

    const post = await PostDAO.getById(id);
    if (!post) return res.status(404).json({ error: 'Post não encontrado' });

    const removed = await PostDAO.removeLike(id, userId);
    if (removed) await PostDAO.decrementQualidade(id, 1);

    const updated = await PostDAO.getById(id);
    return res.status(200).json({ ...updated!, hasLiked: false });
  }

  public static async dislike(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'ID inválido' });

    const userId = Number(req.headers["idUsuario"]);

    const post = await PostDAO.getById(id);
    if (!post) return res.status(404).json({ error: 'Post não encontrado' });

    // Se usuário estiver com like, remove antes de dar dislike
    if (await PostDAO.hasUserLiked(id, userId)) {
      await PostDAO.removeLike(id, userId);
      await PostDAO.decrementQualidade(id, 1);
    }

    const added = await PostDAO.addDislike(id, userId);
    if (added) await PostDAO.incrementNaoGostou(id, 1);

    const updated = await PostDAO.getById(id);
    return res.status(200).json({ ...updated!, hasLiked: false, hasDisliked: true });
  }

  public static async undislike(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'ID inválido' });

    const userId = Number(req.headers["idUsuario"]);

    const post = await PostDAO.getById(id);
    if (!post) return res.status(404).json({ error: 'Post não encontrado' });

    const removed = await PostDAO.removeDislike(id, userId);
    if (removed) await PostDAO.decrementNaoGostou(id, 1);

    const updated = await PostDAO.getById(id);
    return res.status(200).json({ ...updated!, hasDisliked: false });
  }
};
