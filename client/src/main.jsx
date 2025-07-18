import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout/MainLayout';
import Menu from './components/Menu/Menu';
import Chats from './pages/Chats/Chats';
import Main from './pages/Main/Main';
import Login from './pages/Login/Login';
import Chat from './pages/Chat/Chat';
import Register from './pages/Register/Register';
import { RouterProvider } from 'react-router-dom';
import { SocketProvider } from './context/SocketProvider';
import { Provider } from 'react-redux';
import { store } from './app/store';
import './index.css';

const router = createBrowserRouter([
    {
        path: '/',
        element: <ProtectedRoute />,
        children: [
            {
                path: '/',
                element: <Chats />
            },
            {
                path: '/chat/:chatId',
                element: <Chat />
            }
        ]
    },
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
]);

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <SocketProvider>
            <Menu />
            <RouterProvider router={router} />
        </SocketProvider>
    </Provider>
);
