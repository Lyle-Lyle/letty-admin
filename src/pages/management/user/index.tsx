import { Button, Form, Table, Input, Select, Space } from 'antd';

export default function UserList() {
    return (
        <div className="user-list">
            <Form className="search-form" layout="inline" initialValues={{ state: 0 }}>
                <Form.Item name="userId" label="用户ID">
                    <Input />
                </Form.Item>
                <Form.Item name="userName" label="用户名称">
                    <Input />
                </Form.Item>
                <Form.Item name="state" label="状态">
                    <Select style={{ width: 120 }}>
                        <Select.Option value={0}>所有</Select.Option>
                        <Select.Option value={1}>在职</Select.Option>
                        <Select.Option value={2}>离职</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button type="primary">搜索</Button>
                        <Button type="primary">重置</Button>
                    </Space>
                </Form.Item>
            </Form>
            <div className="base-table">
                <div className="header-wrapper">
                    <div className="title">用户列表</div>
                    <div className="action">
                        <Button type="primary">新增</Button>
                        <Button type="primary" danger>
                            批量删除
                        </Button>
                    </div>
                </div>
                <Table datasource={datasource} columns={columns} />
            </div>
        </div>
    );
}
