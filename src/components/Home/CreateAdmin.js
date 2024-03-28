import React, { useState, useEffect } from 'react';
import SideNavbar from './SideNavbar';
import { useParams, useNavigate } from 'react-router-dom';
import { createCompanyAdmin } from '../Api/Company_api';
import { toast } from 'react-toastify';
import { Button, Layout, Menu, theme } from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  PlusOutlined,
  LogoutOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import SuperAdminDashboard from './SuperAdminDashboard';
import ProfileSupAdmin from '../AuthSuperAdmin/ProfileSupAdmin';
import ChangePasswordSupAdmin from '../AuthSuperAdmin/ChangePasswordSupAdmin';
import AddCompany from './AddCompany';
import Cookies from 'js-cookie';

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

const CreateAdmin = () => {
  const { companyID } = useParams();
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [selectedItemKey, setSelectedItemKey] = useState(items[0].key);

  const handleMenuItemClick = (key, path) => {
    setSelectedItemKey(key);
    navigate(path);
  };

  const handleLogout = () => {
    Cookies.remove('token');
    toast.success('Logout Successfully');
    navigate('/');
  };

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    mobile_number: '',
    company_id: companyID,
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        errors[key] = `${key.replace('_', ' ')} is required`;
      }
    });
    if (Object.keys(errors).length === 0) {
      submitFormData();
    } else {
      setFormErrors(errors);
    }
  };

  const submitFormData = async (e) => {
    try {
      const response = await createCompanyAdmin(formData);

      if (response.success === true) {
        navigate('/dashboard');
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Failed to create company admin');
    }
  };

  return (
    <Layout>
      <Sider
        className=""
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {}}
        onCollapse={(collapsed, type) => {}}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          selectedKeys={[selectedItemKey]}
          style={{ height: '100vh' }}
        >
          {items.map((item) => (
            <Menu.Item
              key={item.key}
              icon={item.icon}
              onClick={() => handleMenuItemClick(item.key, item.path)}
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
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <div>
              <div>
                <div className="contact-form-wrapper d-flex justify-content-center">
                  <form
                    className="contact-form"
                    onSubmit={handleSubmit}
                    style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }}
                  >
                    <h2 className="title text-center mb-3">Create Admin</h2>

                    <div>
                      <input
                        type="text"
                        className="form-control rounded border-white mb-3 form-input"
                        id="first_name"
                        name="first_name"
                        placeholder="First Name"
                        value={formData.first_name}
                        onChange={handleChange}
                      />
                      {formErrors.first_name && (
                        <div className="text-danger">
                          {formErrors.first_name}
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        type="text"
                        className="form-control rounded border-white mb-3 form-input"
                        id="last_name"
                        name="last_name"
                        placeholder="Last Name"
                        value={formData.last_name}
                        onChange={handleChange}
                      />
                      {formErrors.last_name && (
                        <div className="text-danger">
                          {formErrors.last_name}
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        type="email"
                        className="form-control rounded border-white mb-3 form-input"
                        id="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      {formErrors.email && (
                        <div className="text-danger">{formErrors.email}</div>
                      )}
                    </div>
                    <div>
                      <input
                        type="password"
                        className="form-control rounded border-white mb-3 form-input"
                        id="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      {formErrors.password && (
                        <div className="text-danger">{formErrors.password}</div>
                      )}
                    </div>
                    <div>
                      <input
                        type="text"
                        className="form-control rounded border-white mb-3 form-input"
                        id="mobile_number"
                        name="mobile_number"
                        placeholder="Mobile Number"
                        value={formData.mobile_number}
                        onChange={handleChange}
                      />
                      {formErrors.mobile_number && (
                        <div className="text-danger">
                          {formErrors.mobile_number}
                        </div>
                      )}
                    </div>

                    <div className="submit-button-wrapper">
                      <input type="submit" value="Submit" />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default CreateAdmin;
