import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { Dispatch, SetStateAction } from 'react';

type Props = {
    colorBgContainer: string;
    collapsed: boolean;
    setCollapsed: Dispatch<SetStateAction<boolean>>;
};

const AdminHeader = ({ colorBgContainer, collapsed, setCollapsed }: Props) => {
    return <Header style={{ padding: 0, background: colorBgContainer }}></Header>;
};

export default AdminHeader;
