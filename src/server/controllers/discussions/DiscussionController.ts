import { Request, Response } from 'express';
import { DiscussionDAO } from '../../DAO/DiscussionDAO';

export class DiscussionController {
  public static async create(req: Request, res: Response) {
    const userId = Number(req.headers["idUsuario"]);
    const postId = Number(req.params.postId);
    const { content } = req.body as { content?: string };

    if (!postId) return res.status(400).json({ error: 'ID do post inválido' });
    if (!content) return res.status(400).json({ error: 'Conteúdo obrigatório' });

    const reply = await DiscussionDAO.createReply(postId, userId, content);
    return res.status(201).json(reply);
  }

  public static async list(req: Request, res: Response) {
    const postId = Number(req.params.postId);
    if (!postId) return res.status(400).json({ error: 'ID do post inválido' });

    const replies = await DiscussionDAO.listByPostExcludingRoot(postId);
    return res.status(200).json(replies);
  }
}
