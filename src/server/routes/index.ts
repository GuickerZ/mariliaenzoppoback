import { Router } from 'express';
import { SigninController } from '../controllers/users/SigninController';
import { SignupController } from '../controllers/users/SignupController';
import { ensureAuthenticated } from '../shared/middlewares';
import { asyncHandler } from './asyncHandler';
import { PostController } from '../controllers/posts/PostController';
import { CommunityController } from '../controllers/communities/CommunityController';
import { StatsController } from '../controllers/stats/StatsController';
import { DiscussionController } from '../controllers/discussions/DiscussionController';

const router = Router();

router.get('/', (req, res) => {
  res.send('API Running!');
});

router.post('/cadastrar', asyncHandler(SignupController.create));
router.post('/entrar', SigninController.create);
router.get('/entrar', ensureAuthenticated, SigninController.show);

router.get('/posts/me', ensureAuthenticated, asyncHandler(PostController.show));
router.post('/posts', ensureAuthenticated, asyncHandler(PostController.create));
router.get('/posts', asyncHandler(PostController.listRandom));
router.post('/posts/:id/like', ensureAuthenticated, asyncHandler(PostController.like));
router.post('/posts/:id/unlike', ensureAuthenticated, asyncHandler(PostController.unlike));
router.post('/posts/:id/dislike', ensureAuthenticated, asyncHandler(PostController.dislike));
router.post('/posts/:id/undislike', ensureAuthenticated, asyncHandler(PostController.undislike));

// Communities
router.post('/communities', ensureAuthenticated, asyncHandler(CommunityController.create));
router.get('/communities', asyncHandler(CommunityController.list));
router.get('/communities-with-counts', asyncHandler(CommunityController.listWithCounts));
router.post('/communities/:id/join', ensureAuthenticated, asyncHandler(CommunityController.join));
router.get('/communities/:id/posts', asyncHandler(CommunityController.listPosts));
router.post('/communities/:id/posts', ensureAuthenticated, asyncHandler(CommunityController.createPost));
router.get('/communities/:id', ensureAuthenticated, asyncHandler(CommunityController.details));

// Me Stats
router.get('/me/stats', ensureAuthenticated, asyncHandler(StatsController.me));
router.get('/me/activity/weekly', ensureAuthenticated, asyncHandler(StatsController.weeklyActivity));
router.get('/me/insights', ensureAuthenticated, asyncHandler(StatsController.insights));

// Discussions (single level under post root)
router.get('/posts/:postId/discussions', asyncHandler(DiscussionController.list));
router.post('/posts/:postId/discussions', ensureAuthenticated, asyncHandler(DiscussionController.create));

export { router };
