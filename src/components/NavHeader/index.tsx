import { MenuFoldOutlined, SmileOutlined } from '@ant-design/icons';
import { Breadcrumb, Dropdown, Switch } from 'antd';

import styles from './index.module.less';

// dorpdown items
const items: MenuProps['items'] = [
    {
        key: '1',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                Email
            </a>
        ),
    },
    {
        key: '2',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                logout
            </a>
        ),
        icon: <SmileOutlined />,
        disabled: true,
    },
];

export default function NavHeader() {
    const breadList = [
        {
            title: 'Home',
        },
        {
            title: 'workbench',
        },
    ];
    return (
        <div className={styles.navHeader}>
            <div className={styles.left}>
                <MenuFoldOutlined />
                <Breadcrumb items={breadList} style={{ marginLeft: 10 }} />
            </div>
            <div className={styles.right}>
                <Switch
                    checkedChildren="dark"
                    unCheckedChildren="default"
                    style={{ marginRight: 10 }}
                />
                <Dropdown menu={{ items }} trigger={['click']}>
                    <span className={styles.username}>Lyle</span>
                </Dropdown>
            </div>
        </div>
    );
}
