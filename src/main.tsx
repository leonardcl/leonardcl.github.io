import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import App from './App.tsx';
import Blog from './Blog.tsx';
import NotFoundPage from './NotFoundPage.tsx';
import RlFundamentalConcept1 from './components/markdown_blogs/1-rl-fundamentalconcept.tsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/blog",
    element: <Blog />,
  },
  {
    path: "/blog/1-rl-fundamentalconcept",
    element: <RlFundamentalConcept1 />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
