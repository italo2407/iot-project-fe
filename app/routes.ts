import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/Index.tsx'),
  route('login', 'routes/Login.tsx'),
  route(
    'app',
    'routes/AppLayout.tsx',
    {}, // Este es tu layout protegido
    [
      index('routes/Home.tsx'), // Página principal dentro del layout
      route('logs', 'routes/Log.tsx'),
    ]
  ),
] satisfies RouteConfig;
