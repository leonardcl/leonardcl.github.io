import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import App from './App.tsx';
import Blog from './Blog.tsx';
import NotFoundPage from './NotFoundPage.tsx';
import BlogPost from './components/BlogPost.tsx';
import Blessed from './components/Blessed.tsx';
import GradientDescentTool from './components/GradientDescentTool.tsx';
import Boids from './components/Boids.tsx';
import PixelCam from './components/PixelCam.tsx';
import FogOfWar from './components/FogOfWar.tsx';
import TicTacToeRL from './components/TicTacToeRL.tsx';
import RagPipeline from './components/RagPipeline.tsx';
import RewardSignal from './components/v2/RewardSignal.tsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: "/*",
    element: <App />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/blog",
    element: <Blog />,
  },
  {
    path: "/blog/:slug",
    element: <BlogPost />,
  },
  {
    path: "/blessed",
    element: <Blessed />,
  },
  {
    path: "/gradient-descent",
    element: <GradientDescentTool />,
  },
  {
    path: "/boids",
    element: <Boids />,
  },
  {
    path: "/pixel-cam",
    element: <PixelCam />,
  },
  {
    path: "/fog-of-war",
    element: <FogOfWar />,
  },
  {
    path: "/tictactoe-rl",
    element: <TicTacToeRL />,
  },
  {
    path: "/rag-pipeline",
    element: <RagPipeline />,
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
