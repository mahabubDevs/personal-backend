import express from 'express';
import { UserRoutes } from '../modules/user/user.routes';
import { BlogRoutes } from '../modules/blog/blog.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';


const router = express.Router();

const apiRoutes = [
    { path: "/user", route: UserRoutes },
    { path: "/blog", route: BlogRoutes },
    { path: "/auth", route: AuthRoutes },
  // new user subscription route added

]

apiRoutes.forEach(route => router.use(route.path, route.route));
export default router;