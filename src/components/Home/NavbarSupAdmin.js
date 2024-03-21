import React, { useState } from 'react';
import { Button, Layout, Menu, theme } from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  PlusOutlined,
  LogoutOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import {
  useNavigate,
  useParams,
  useLocation,
  Routes,
  Route,
} from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import SuperAdminDashboard from './SuperAdminDashboard';
import ProfileSupAdmin from '../AuthSuperAdmin/ProfileSupAdmin';
import ChangePasswordSupAdmin from '../AuthSuperAdmin/ChangePasswordSupAdmin';
import AddCompany from './AddCompany';
import LogoImage from '../../assets/icons/logo.png';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const items = [
  {
    key: '1',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
    content: <SuperAdminDashboard />,
    path: '/dashboard',
  },
  {
    key: '2',
    icon: <UserOutlined />,
    label: 'Profile',
    content: <ProfileSupAdmin />,
    path: '/dashboard',
  },
  {
    key: '3',
    icon: <SettingOutlined />,
    label: 'Change Password',
    content: <ChangePasswordSupAdmin />,
    path: '/dashboard',
  },
  {
    key: '4',
    icon: <PlusOutlined />,
    label: 'Create Company',
    content: <AddCompany />,
    path: '/dashboard',
  },
];

const NavbarSupAdmin = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [selectedItemKey, setSelectedItemKey] = useState(items[0].key);
  const navigate = useNavigate();

  const params = useParams();

  const wildcardParam = params['*'];

  const location = useLocation();
  const nextPath = location.pathname.substring(
    location.pathname.indexOf('/dashboard') + '/dashboard'.length + 1
  );

  const handleMenuItemClick = (key) => {
    setSelectedItemKey(key);
  };

  const handleLogout = () => {
    Cookies.remove('token');
    toast.success('Logout Successfully');
    navigate('/');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        className=""
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {}}
        onCollapse={(collapsed, type) => {}}
      >
        <div className="demo-logo-vertical">
          <img
            src={LogoImage}
            alt="Logo"
            style={{
              width: '100%',
              padding: '16px 0',
              backgroundColor: '#272C3B',
            }}
          />
        </div>

        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          selectedKeys={[selectedItemKey]}
          style={{ height: '100%', backgroundColor: '#272C3B' }}
        >
          {items.map((item) => (
            <Menu.Item
              key={item.key}
              icon={item.icon}
              onClick={() => handleMenuItemClick(item.key)}
              style={{
                color: 'white',
                backgroundColor:
                  selectedItemKey === item.key ? '#12A0A2' : undefined,
              }}
            >
              {item.label}
            </Menu.Item>
          ))}
          <div className="p-2 mt-2">
            <Button
              danger
              type="primary fw-bold"
              className="w-100"
              shape="round"
              onClick={handleLogout}
              icon={<LogoutOutlined />}
            >
              Logout
            </Button>
          </div>
        </Menu>
      </Sider>
      <Layout>
        <Content
          style={{
            margin: '24px 16px 0',
          }}
        >
          <div>
            {items.find((item) => item.key === selectedItemKey)?.content}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default NavbarSupAdmin;
