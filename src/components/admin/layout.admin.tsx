import React, { useState, useEffect } from 'react';
import {
    AppstoreOutlined,
    ExceptionOutlined,
    ApiOutlined,
    UserOutlined,
    BankOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    AliwangwangOutlined,
    BugOutlined,
    ScheduleOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Space, message, Avatar, Button } from 'antd';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { useAppSelector } from '@/redux/hooks';
import { isMobile } from 'react-device-detect';
import type { MenuProps } from 'antd';

const { Content, Sider } = Layout;

const LayoutAdmin = () => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('');
    const user = useAppSelector(state => state.account.user);
    const [menuItems, setMenuItems] = useState<MenuProps['items']>([]);
    const roleName = useAppSelector(state => state.account.user.role.name);

    useEffect(() => {
        if (!roleName) return;

        const fixedMenu = [
            ...(roleName === 'ADMIN' ? [
                { label: <Link to='/admin'>DashBoard</Link>, key: '/admin', icon: <ScheduleOutlined /> },
                { label: <Link to='/admin/user'>User</Link>, key: '/admin/user', icon: <UserOutlined /> },
                { label: <Link to='/admin/product'>Product</Link>, key: '/admin/product', icon: <BankOutlined /> },
                { label: <Link to='/admin/productDetail'>Product Detail</Link>, key: '/admin/productDetail', icon: <BankOutlined /> },
                { label: <Link to='/admin/order'>Order</Link>, key: '/admin/order', icon: <ApiOutlined /> },
                { label: <Link to='/admin/color'>Color</Link>, key: '/admin/color', icon: <ScheduleOutlined /> },
                { label: <Link to='/admin/category'>Category</Link>, key: '/admin/category', icon: <AliwangwangOutlined /> },
                { label: <Link to='/admin/size'>Size</Link>, key: '/admin/size', icon: <ApiOutlined /> },
            ] : []),
            ...(roleName === 'STAFF' ? [
                { label: <Link to='/admin'>DashBoard</Link>, key: '/admin', icon: <ScheduleOutlined /> },
                { label: <Link to='/admin/createOrder'>Tạo đơn hàng</Link>, key: '/admin/createOrder', icon: <ExceptionOutlined /> }
            ] : [])
        ];
        setMenuItems(fixedMenu);
    }, [roleName]);

    useEffect(() => {
        setActiveMenu(location.pathname);
    }, [location]);

    const itemsDropdown = [
        {
            label: <Link to={'/'}>Trang chủ</Link>,
            key: 'home',
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}
            >Đăng xuất</label>,
            key: 'logout',
        },
    ];

    return (
        <>
            <Layout style={{ marginLeft: !isMobile ? (collapsed ? 80 : 200) : 0, transition: 'all 0.2s' }}
                className="layout-admin"
            >
                {!isMobile ? (
                    <Sider
                        theme='light'
                        collapsible
                        collapsed={collapsed}
                        onCollapse={(value) => setCollapsed(value)}
                        width={200} // bạn có thể thay đổi width tùy theo thiết kế
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            height: '100vh',
                            zIndex: 1000,
                            overflow: 'auto',
                            background: '#fff',
                            boxShadow: '2px 0 6px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <div
                            style={{
                                height: 64,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontSize: 18,
                                borderBottom: '1px solid #f0f0f0',
                            }}
                        >
                            <BugOutlined style={{ marginRight: 8 }} />
                            {!collapsed && 'ADMIN'}
                        </div>

                        <Menu
                            selectedKeys={[activeMenu]}
                            mode="inline"
                            items={menuItems}
                            onClick={(e) => setActiveMenu(e.key)}
                            style={{ borderRight: 0 }}
                        />
                    </Sider>
                ) : (
                    <Menu
                        selectedKeys={[activeMenu]}
                        items={menuItems}
                        onClick={(e) => setActiveMenu(e.key)}
                        mode="horizontal"
                    />
                )}


                <Layout>
                    {!isMobile &&
                        <div className='admin-header' style={{ display: "flex", justifyContent: "space-between", marginRight: 20 }}>
                            <Button
                                type="text"
                                icon={collapsed ? React.createElement(MenuUnfoldOutlined) : React.createElement(MenuFoldOutlined)}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                }}
                            />

                            <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                                <Space style={{ cursor: "pointer" }}>
                                    Welcome {user?.name}
                                    <Avatar> {user?.name?.substring(0, 2)?.toUpperCase()} </Avatar>

                                </Space>
                            </Dropdown>
                        </div>
                    }
                    <Content style={{ padding: '15px' }}>
                        <Outlet />
                    </Content>
                    {/* <Footer style={{ padding: 10, textAlign: 'center' }}>
                        React Typescript series Nest.JS &copy; Hỏi Dân IT - Made with <HeartTwoTone />
                    </Footer> */}
                </Layout>
            </Layout>

        </>
    );
};

export default LayoutAdmin;