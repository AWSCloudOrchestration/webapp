import UserRoutes from './v1/user.route.js';
import ProductRoutes from './v1/product.route.js';

const routes = [
  {
    path: '/v1/user',
    route: UserRoutes,
  },
  {
    path: '/v1/product',
    route: ProductRoutes,
  },
];

export default (app) => {
  routes.forEach((route) => {
    app.use(route.path, route.route);
  });
};

