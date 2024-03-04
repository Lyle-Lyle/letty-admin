import { ConfigProvider } from 'antd';
import './App.css';
import Login from './pages/login/Login';
import { RouterProvider } from 'react-router-dom';
import router from './router/index';

function App() {
    return (
        <ConfigProvider theme={{ token: { colorPrimary: ' #ae2fd0' } }}>
            <RouterProvider router={router}></RouterProvider>
        </ConfigProvider>
    );
}

export default App;
