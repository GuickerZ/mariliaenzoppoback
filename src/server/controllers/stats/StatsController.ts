import { Request, Response } from 'express';
import { PostDAO } from '../../DAO/PostDAO';
import { CommunityDAO } from '../../DAO/CommunityDAO';
import { DiscussionDAO } from '../../DAO/DiscussionDAO';

function calcConsecutiveStreak(dates: Date[]): number {
  if (!dates.length) return 0;

  // Normalize to date-only strings to handle multiple posts per day
  const daySet = new Set(
    dates.map(d => new Date(d).toISOString().slice(0, 10))
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let cursor = new Date(today);

  // If no post today, streak ends at 0 (resets)
  if (!daySet.has(cursor.toISOString().slice(0, 10))) {
    // Optionally compute last streak ending at last activity day
    // But requirement typically expects current streak; return 0
    return 0;
  }

  // Count backwards consecutive days
  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (daySet.has(key)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export class StatsController {
  public static async me(req: Request, res: Response) {
    const userId = Number(req.headers["idUsuario"]);

    const [totalPosts, totalCommunities, postDatesRaw] = await Promise.all([
      PostDAO.countByUserId(userId),
      CommunityDAO.countByMemberId(userId),
      PostDAO.listDatesByUserId(userId),
    ]);

    const dates = postDatesRaw.map(r => new Date(r.createdAt));
    const streak = calcConsecutiveStreak(dates);

    return res.status(200).json({
      totalPosts,
      totalCommunities,
      consecutiveDaysStreak: streak,
    });
  }

  public static async weeklyActivity(req: Request, res: Response) {
    const userId = Number(req.headers["idUsuario"]);

    const today = new Date();
    const dow = (today.getDay() + 6) % 7; // 0 = Monday
    const monday = new Date(today);
    monday.setDate(today.getDate() - dow);
    monday.setHours(0, 0, 0, 0);
    const nextMonday = new Date(monday);
    nextMonday.setDate(monday.getDate() + 7);

    const rows = await PostDAO.countByDayInRange(userId, monday, nextMonday);

    const map = new Map<string, number>();
    rows.forEach(r => map.set(new Date(r.day).toISOString().slice(0,10), Number(r.count)));

    const days = ['Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'];
    const result = [] as { day: string; posts: number }[];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const key = d.toISOString().slice(0,10);
      result.push({ day: days[i], posts: map.get(key) || 0 });
    }

    return res.status(200).json(result);
  }

  public static async insights(req: Request, res: Response) {
    const userId = Number(req.headers["idUsuario"]);

    const [totalPosts, communitiesJoined, totalDiscussions] = await Promise.all([
      PostDAO.countByUserId(userId),
      CommunityDAO.countByMemberId(userId),
      DiscussionDAO.countRepliesByUserId(userId),
    ]);

    return res.status(200).json({
      totalPosts,
      totalDiscussions,
      communitiesJoined,
      averageReadTime: 0,
      feedbacksGiven: 0,
      feedbackQualityAvg: 0,
      discussionsStarted: 0,
    });
  }
}
