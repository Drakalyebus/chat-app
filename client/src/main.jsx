import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout/MainLayout';
import Error from './pages/Error/Error';
import Menu from './components/Menu/Menu';
import Chats from './pages/Chats/Chats';
import Main from './pages/Main/Main';
import Login from './pages/Login/Login';
import Chat from './pages/Chat/Chat';
import InviteCode from './pages/InviteCode/InviteCode';
import Register from './pages/Register/Register';
import { RouterProvider } from 'react-router-dom';
import { SocketProvider } from './context/SocketProvider';
import AntiProtectedRoute from './components/AntiProtectedRoute';
import { Provider } from 'react-redux';
import { store } from './app/store';
import './index.css';

const router = createBrowserRouter([
    {
        path: '/',
        errorElement: <Error />,
        element: <ProtectedRoute />,
        children: [
            {
                path: '/',
                element: <Chats />
            },
            {
                path: '/chat/:chatId',
                element: <Chat />
            },
            {
                path: '/invite-code',
                element: <InviteCode />
            }
        ]
    },
    {
        path: '/',
        element: <AntiProtectedRoute />,
        children: [
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/register',
                element: <Register />
            },
            {
                path: '/welcome',
                element: <Main />
            }
        ]
    }
]);

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <SocketProvider>
            <Menu />
            <RouterProvider router={router} />
        </SocketProvider>
    </Provider>
);
