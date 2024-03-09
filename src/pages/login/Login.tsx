import { Button, Checkbox, Form, Input, message, App } from 'antd';
import styles from './index.module.less';

import api from '@/api';
import { Login } from '@/types/api';
import storage from '@/utils/storage';

const onFinish = async (values: Login.params) => {
    const data = await api.login(values);
    storage.set('token', data);
    message.success('登录成功');
    // const params = new URLSearchParams(location.search);
    // TODO 跳转页面
};

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
};

type FieldType = {
    userAccount?: string;
    userPassword?: string;
    remember?: string;
};

export default function LoginFC() {
    const { message, notification, modal } = App.useApp();
    return (
        <div className={styles.login}>
            <div className={styles.loginWrapper}>
                <div className={styles.title}>Login</div>
                <Form
                    name="basic"
                    // labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        label="UserAccount"
                        name="userAccount"
                        rules={[{ required: true, message: 'Please input your userAccount!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Password"
                        name="userPassword"
                        rules={[{ required: true, message: 'Please input your userPassword!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item<FieldType>
                        name="remember"
                        valuePropName="checked"
                        wrapperCol={{ offset: 8, span: 16 }}
                    >
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                    {/* block是按钮会占一行 */}
                    <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
                        <Button type="primary" htmlType="submit" block>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}
