import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import store from './store/store.js';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import MainPage from './MainPage.jsx';
import SearchPage from './components/searchPage.jsx';
import CommunityPage from './components/communityPage.jsx';
import VendorsPage from './components/vendorsPage.jsx';
import UserPage from './components/user.jsx';
import LoginPage from './components/login.jsx';
import RegisterPage from './components/register.jsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
    children: [
      {
        path: "", // Default child for `/`
        element: <SearchPage />
      },
      {
        path: "communityPage", // Remove leading `/`
        element: <CommunityPage />
      },
      {
        path: "vendors",
        element: <VendorsPage />
      },
      {
        path: "user",
        element: <UserPage />
      }
    ]
  },
  {
    path: "/iframe/community",
    element: <CommunityPage />
  },
  {
    path: "/iframe/searchPage",
    element: <SearchPage />
  },
  {
    path: "/iframe/userPage",
    element: <UserPage />,
    children:[
      {
        path: "", // Default child for `/`
        element: <LoginPage />
      },
      {
        path: "registerPage", // Remove leading `/`
        element: <RegisterPage />
      }
    ]
  },
  {
    path: "/iframe/vendorsPage",
    element: <VendorsPage />
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
