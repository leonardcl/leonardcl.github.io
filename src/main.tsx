import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import App from './App.tsx';
import NotFoundPage from './NotFoundPage.tsx';
import RewardSignal from './components/v2/RewardSignal.tsx';
import RouteLoading from './components/v2/RouteLoading.tsx';
import './index.css';

/**
 * The homepage stays eager — it's the landing page, and a flash of a loader
 * there would cost more than the bytes saved. Everything else splits out:
 * the playgrounds are self-contained, and the article route pulls in
 * highlight.js and KaTeX, which nothing else needs and which every visitor
 * was previously downloading just to read the front page.
 */
const Blog = lazy(() => import('./Blog.tsx'));
const BlogPost = lazy(() => import('./components/BlogPost.tsx'));
const Blessed = lazy(() => import('./components/Blessed.tsx'));
const GradientDescentTool = lazy(() => import('./components/GradientDescentTool.tsx'));
const Boids = lazy(() => import('./components/Boids.tsx'));
const PixelCam = lazy(() => import('./components/PixelCam.tsx'));
const FogOfWar = lazy(() => import('./components/FogOfWar.tsx'));
const TicTacToeRL = lazy(() => import('./components/TicTacToeRL.tsx'));
const RagPipeline = lazy(() => import('./components/RagPipeline.tsx'));
const PlayTheAir = lazy(() => import('./components/PlayTheAir.tsx'));

const page = (element: React.ReactNode) => (
  <Suspense fallback={<RouteLoading />}>{element}</Suspense>
);

const router = createBrowserRouter([
  {
    path: "/*",
    element: <App />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/blog",
    element: page(<Blog />),
  },
  {
    path: "/blog/:slug",
    element: page(<BlogPost />),
  },
  {
    path: "/blessed",
    element: page(<Blessed />),
  },
  {
    path: "/gradient-descent",
    element: page(<GradientDescentTool />),
  },
  {
    path: "/boids",
    element: page(<Boids />),
  },
  {
    path: "/pixel-cam",
    element: page(<PixelCam />),
  },
  {
    path: "/fog-of-war",
    element: page(<FogOfWar />),
  },
  {
    path: "/tictactoe-rl",
    element: page(<TicTacToeRL />),
  },
  {
    path: "/rag-pipeline",
    element: page(<RagPipeline />),
  },
  {
    path: "/play-the-air",
    element: page(<PlayTheAir />),
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <HashRouter> */}
      <RouterProvider router={router} />
    {/* </HashRouter> */}
    {/* Mounted once, globally — listens on every page for the reward signal. */}
    <RewardSignal />
  </React.StrictMode>
);
