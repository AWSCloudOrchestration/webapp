import UserRoutes from './v1/user.route.js';

const routes = [
  {
    path: '/v1/user',
    route: UserRoutes,
  },
];

export default (app) => {
  routes.forEach((route) => {
    app.use(route.path, route.route);
  });
};

