import { ConfigProvider, App as AntdApp } from 'antd';
import './App.less';
import Login from './pages/login/Login';
import { RouterProvider } from 'react-router-dom';
import router from './router/index';

function App() {
    return (
        <ConfigProvider theme={{ token: { colorPrimary: ' #ae2fd0' } }}>
            <AntdApp>
                <RouterProvider router={router} />
            </AntdApp>
        </ConfigProvider>
    );
}

export default App;
