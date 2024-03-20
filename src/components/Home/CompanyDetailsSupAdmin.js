import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { editCompanyDetails } from '../Api/Company_api';
import Cookies from 'js-cookie';
import './CompanyDetailsSupAdmin.css';
import AdminDetailsModal from './AdminDetailsModal';
import SideNavbar from './SideNavbar';
import { toast } from 'react-toastify';
import { Base_Url } from '../Api/Base_url';
import { Modal } from 'react-bootstrap';
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
import LogoImage from '../../assets/icons/logoLight.png';

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

function CompanyDetailsSupAdmin() {
  const [companyDetails, setCompanyDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedAdminDetails, setSelectedAdminDetails] = useState(null);
  const { companyID } = useParams();
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);

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

  const handleUpdateModal = () => {
    setModalVisible(true);
  };

  const fetchCompanyDetails = async () => {
    try {
      const token = Cookies.get('token');
      const headers = {
        Authorization: token,
        'Content-Type': 'application/json',
      };
      const url = `${Base_Url}companyDetails?company_id=${companyID}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch company details');
      }

      const responseData = await response.json();
      const companyData = responseData.data[0];
      setCompanyDetails(companyData);
    } catch (error) {
      toast.error('Error fetching company details:', error);
    }
  };

  useEffect(() => {
    fetchCompanyDetails();
  }, [companyID]);

  const toggleModal = () => {
    const companyAdminId =
      companyDetails?.company_admin_data[0]?.company_admin_id;
    setSelectedAdminDetails(companyAdminId);
    setShowModal(!showModal);
  };

  const handleFileChange = async (event) => {
    try {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('image', file);

      const token = Cookies.get('token');
      const response = await fetch(`${Base_Url}uploadCompanyLogoForSA`, {
        method: 'POST',
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload company logo');
      }

      const responseData = await response.json();
      if (responseData.success === true) {
        toast.success(responseData.message);
        setCompanyDetails({
          ...companyDetails,
          company_logo: responseData.data,
        });
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEditCompany = async (confirmed) => {
    if (!confirmed) {
      setModalVisible(false);
      return;
    }

    if (!companyDetails) {
      return;
    }

    const alphabetPattern = /^[a-zA-Z\s]+$/;
    let invalidField = null;
    const trimmedCompanyName = companyDetails?.company_name?.trim() || '';
    const trimmedContactPersonName =
      companyDetails?.contact_person_name?.trim() || '';
    const trimmedContactPersonDesignation =
      companyDetails?.contact_person_designation?.trim() || '';

    if (!alphabetPattern.test(trimmedCompanyName)) {
      invalidField = 'Company Name';
    } else if (!alphabetPattern.test(trimmedContactPersonName)) {
      invalidField = 'Contact Person Name';
    } else if (!alphabetPattern.test(trimmedContactPersonDesignation)) {
      invalidField = 'Contact Person Designation';
    }

    if (invalidField) {
      toast.error(`Please enter alphabet characters only in ${invalidField}`);
      return;
    }

    const maxCardsPattern = /^\d+$/;
    if (!maxCardsPattern.test(companyDetails.max_cards)) {
      toast.error('Please enter a valid number for Maximum Cards.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailPattern.test(companyDetails.company_email)) {
      toast.error('Please enter a valid company email address....');
      return;
    }
    if (!emailPattern.test(companyDetails.contact_person_email)) {
      toast.error('Please enter a valid company email address....');
      return;
    }

    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(companyDetails.company_contact_number)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    if (!phonePattern.test(companyDetails.contact_person_mobile)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    const requiredFields = [
      'company_name',
      'company_email',
      'description',
      'company_address',
      'company_contact_number',
      'max_cards',
      'contact_person_name',
      'contact_person_designation',
      'contact_person_email',
      'contact_person_mobile',
      'company_logo',
    ];

    const emptyFields = requiredFields.some((field) => !companyDetails[field]);

    if (emptyFields) {
      toast.error('All fields are required to fill');
      return;
    }

    try {
      const token = Cookies.get('token');
      const updatedData = {
        company_id: companyDetails.id,
        company_name: companyDetails.company_name,
        company_email: companyDetails.company_email,
        description: companyDetails.description,
        company_address: companyDetails.company_address,
        company_contact_number: companyDetails.company_contact_number,
        max_cards: companyDetails.max_cards,
        contact_person_name: companyDetails.contact_person_name,
        contact_person_designation: companyDetails.contact_person_designation,
        contact_person_email: companyDetails.contact_person_email,
        contact_person_mobile: companyDetails.contact_person_mobile,
        company_logo: companyDetails.company_logo,
      };

      const response = await editCompanyDetails(token, updatedData);
      if (response.success === true) {
        toast.success(response.message);
        setCompanyDetails(response.updatedData);
        fetchCompanyDetails();
        setModalVisible(false);
      }
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  const handleCreateAdmin = () => {
    navigate(`/dashboard/create-admin/${companyDetails.id}`);
  };

  const handleAdminUpdate = (adminId) => {};

  return (
    <Layout>
      <Sider
        className=""
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {}}
        onCollapse={(collapsed, type) => {}}
      >
        <div className="demo-logo-vertical bg-white">
          <img
            src={LogoImage}
            alt="Logo"
            style={{ width: '100%', padding: '16px 0' }}
          />
        </div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={['1']}
          selectedKeys={[selectedItemKey]}
          style={{ height: '100%' }}
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
            {/* <div className="containerbody">
              <div className="card cardConatiner">
                <div
                  className="row card-header mb-2"
                  style={{
                    backgroundColor: '#0f8ede14',
                  }}
                >
                  <div className="logo_image col-3">
                    <label className="-labelLogo" for="file">
                      <span className="glyphicon glyphicon-camera-logo"></span>
                      <span className="text-center text_change_logo">
                        Change Logo
                      </span>
                    </label>
                    <input
                      id="file"
                      type="file"
                      onChange={handleFileChange}
                      className="logoChange"
                    />
                    <img
                      className="changeLogo"
                      id="output"
                      src={companyDetails?.company_logo}
                      width="50px"
                      alt="Profile Avatar"
                    />
                  </div>

                  <div className="col-9 d-flex align-items-center">
                    <h3
                      style={{
                        color: '#2558a1',
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                        fontFamily: 'Lucida Sans',
                      }}
                    >
                      {companyDetails?.company_name}
                    </h3>
                  </div>
                </div>

                <div className="row">
                  <div className="col">
                    <div className="input-group-details">
                      <label className="labelTag-details">Company Name</label>
                      <input
                        type="text"
                        className="inputTag-details"
                        placeholder="Enter company name"
                        value={companyDetails?.company_name || ''}
                        onChange={(e) =>
                          setCompanyDetails({
                            ...companyDetails,
                            company_name: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  {companyDetails && (
                    <div className="col">
                      <div className="input-group-details">
                        <label className="labelTag-details">
                          Company Email
                        </label>
                        <input
                          type="text"
                          className="inputTag-details"
                          placeholder="Enter company email"
                          value={companyDetails.company_email || ''}
                          onChange={(e) =>
                            setCompanyDetails({
                              ...companyDetails,
                              company_email: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="row">
                  <div className="col">
                    <div className="input-group-details">
                      <label className="labelTag-details">Description</label>
                      <textarea
                        type="text"
                        className="inputTag-details"
                        placeholder="Enter description"
                        value={companyDetails?.description || ''}
                        onChange={(e) =>
                          setCompanyDetails({
                            ...companyDetails,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="input-group-details">
                      <label className="labelTag-details">
                        Company Address
                      </label>
                      <input
                        type="text"
                        className="inputTag-details"
                        placeholder="Enter company address"
                        value={companyDetails?.company_address || ''}
                        onChange={(e) =>
                          setCompanyDetails({
                            ...companyDetails,
                            company_address: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="input-group-details">
                      <label className="labelTag-details">Company Phone</label>
                      <input
                        type="text"
                        className="inputTag-details"
                        placeholder="Enter company phone"
                        value={companyDetails?.company_contact_number || ''}
                        onChange={(e) =>
                          setCompanyDetails({
                            ...companyDetails,
                            company_contact_number: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col">
                    <div className="input-group-details">
                      <label className="labelTag-details">Maximun Cards</label>
                      <input
                        type="text"
                        className="inputTag-details"
                        placeholder="Enter maximun cards"
                        value={companyDetails?.max_cards || ''}
                        onChange={(e) =>
                          setCompanyDetails({
                            ...companyDetails,
                            max_cards: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="input-group-details">
                      <label className="labelTag-details">Used Cards</label>
                      <input
                        readOnly
                        type="text"
                        className="inputTag-details"
                        placeholder="0"
                        value={companyDetails?.used_cards}
                        onChange={(e) =>
                          setCompanyDetails({
                            ...companyDetails,
                            used_cards: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="input-group-details">
                      <label className="labelTag-details">
                        Contact Person Name
                      </label>
                      <input
                        type="text"
                        className="inputTag-details"
                        placeholder="Enter contact person name"
                        value={companyDetails?.contact_person_name}
                        onChange={(e) =>
                          setCompanyDetails({
                            ...companyDetails,
                            contact_person_name: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="input-group-details">
                      <label className="labelTag-details">
                        Contact Person Designation
                      </label>
                      <input
                        type="text"
                        className="inputTag-details"
                        placeholder="Enter contact person designation"
                        value={companyDetails?.contact_person_designation || ''}
                        onChange={(e) =>
                          setCompanyDetails({
                            ...companyDetails,
                            contact_person_designation: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="input-group-details">
                      <label className="labelTag-details">
                        Contact Person Email
                      </label>
                      <input
                        type="text"
                        className="inputTag-details"
                        placeholder="Enter contact person email"
                        value={companyDetails?.contact_person_email || ''}
                        onChange={(e) =>
                          setCompanyDetails({
                            ...companyDetails,
                            contact_person_email: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="input-group-details">
                      <label className="labelTag-details">
                        Contact Person Mobile
                      </label>
                      <input
                        type="text"
                        className="inputTag-details"
                        placeholder="Enter contact person mobile
                  "
                        value={companyDetails?.contact_person_mobile || ''}
                        onChange={(e) =>
                          setCompanyDetails({
                            ...companyDetails,
                            contact_person_mobile: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  {companyDetails &&
                  companyDetails.status == 'activated' &&
                  (companyDetails?.company_admin_data[0].is_active === true ||
                    companyDetails?.company_admin_data[0].is_active ===
                      null) ? (
                    <>
                      {companyDetails.company_admin_data[0]?.company_admin_id ==
                      null ? (
                        <div className="col-sm-12 col-md-6 col-lg-6">
                          <button
                            className="button-group"
                            onClick={handleCreateAdmin}
                          >
                            Create Admin
                          </button>
                        </div>
                      ) : (
                        <div className="col-sm-12 col-md-6 col-lg-6">
                          <button
                            className="button-group"
                            onClick={() => toggleModal()}
                          >
                            Company Admin Data
                          </button>
                        </div>
                      )}
                      <div className="col-sm-12 col-md-6 col-lg-6">
                        <button
                          className="button-group"
                          onClick={handleUpdateModal}
                        >
                          Update Details
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="col-sm-12 col-md-12 col-lg-12">
                      <button
                        className="button-group"
                        onClick={() => toggleModal()}
                      >
                        Company Admin Data
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div> */}
            <div className="m-3">
              <div
                className="row card-header mb-2"
                style={{
                  backgroundColor: '#0f8ede14',
                }}
              >
                <div className="logo_image col-md-3 col-lg-3 col-sm-2">
                  <label className="-labelLogo" for="file">
                    <span className="glyphicon glyphicon-camera-logo"></span>
                    <span className="text-center text_change_logo">
                      Change Logo
                    </span>
                  </label>
                  <input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    className="logoChange"
                  />
                  <img
                    className="changeLogo"
                    id="output"
                    src={companyDetails?.company_logo}
                    width="50px"
                    alt="Profile Avatar"
                  />
                </div>
                <div className="col-md-9 col-lg-9 col-sm-10 d-flex align-items-center">
                  <h3
                    style={{
                      color: '#2558a1',
                      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    {companyDetails?.company_name}
                  </h3>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <div className="input-group-details">
                    <label className="labelTag-details">Company Name</label>
                    <input
                      type="text"
                      className="inputTag-details"
                      placeholder="Enter company name"
                      value={companyDetails?.company_name || ''}
                      onChange={(e) =>
                        setCompanyDetails({
                          ...companyDetails,
                          company_name: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                {companyDetails && (
                  <div className="col">
                    <div className="input-group-details">
                      <label className="labelTag-details">Company Email</label>
                      <input
                        type="text"
                        className="inputTag-details"
                        placeholder="Enter company email"
                        value={companyDetails.company_email || ''}
                        onChange={(e) =>
                          setCompanyDetails({
                            ...companyDetails,
                            company_email: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="row">
                <div className="col">
                  <div className="input-group-details">
                    <label className="labelTag-details">Description</label>
                    <textarea
                      type="text"
                      className="inputTag-details"
                      placeholder="Enter description"
                      value={companyDetails?.description || ''}
                      onChange={(e) =>
                        setCompanyDetails({
                          ...companyDetails,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <div className="input-group-details">
                    <label className="labelTag-details">Company Address</label>
                    <input
                      type="text"
                      className="inputTag-details"
                      placeholder="Enter company address"
                      value={companyDetails?.company_address || ''}
                      onChange={(e) =>
                        setCompanyDetails({
                          ...companyDetails,
                          company_address: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="input-group-details">
                    <label className="labelTag-details">Company Phone</label>
                    <input
                      type="text"
                      className="inputTag-details"
                      placeholder="Enter company phone"
                      value={companyDetails?.company_contact_number || ''}
                      onChange={(e) =>
                        setCompanyDetails({
                          ...companyDetails,
                          company_contact_number: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="input-group-details">
                    <label className="labelTag-details">Maximun Cards</label>
                    <input
                      type="text"
                      className="inputTag-details"
                      placeholder="Enter maximun cards"
                      value={companyDetails?.max_cards || ''}
                      onChange={(e) =>
                        setCompanyDetails({
                          ...companyDetails,
                          max_cards: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="input-group-details">
                    <label className="labelTag-details">Used Cards</label>
                    <input
                      readOnly
                      type="text"
                      className="inputTag-details"
                      placeholder="0"
                      value={companyDetails?.used_cards}
                      onChange={(e) =>
                        setCompanyDetails({
                          ...companyDetails,
                          used_cards: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="input-group-details">
                    <label className="labelTag-details">
                      Contact Person Name
                    </label>
                    <input
                      type="text"
                      className="inputTag-details"
                      placeholder="Enter contact person name"
                      value={companyDetails?.contact_person_name}
                      onChange={(e) =>
                        setCompanyDetails({
                          ...companyDetails,
                          contact_person_name: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="input-group-details">
                    <label className="labelTag-details">
                      Contact Person Designation
                    </label>
                    <input
                      type="text"
                      className="inputTag-details"
                      placeholder="Enter contact person designation"
                      value={companyDetails?.contact_person_designation || ''}
                      onChange={(e) =>
                        setCompanyDetails({
                          ...companyDetails,
                          contact_person_designation: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="input-group-details">
                    <label className="labelTag-details">
                      Contact Person Email
                    </label>
                    <input
                      type="text"
                      className="inputTag-details"
                      placeholder="Enter contact person email"
                      value={companyDetails?.contact_person_email || ''}
                      onChange={(e) =>
                        setCompanyDetails({
                          ...companyDetails,
                          contact_person_email: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="input-group-details">
                    <label className="labelTag-details">
                      Contact Person Mobile
                    </label>
                    <input
                      type="text"
                      className="inputTag-details"
                      placeholder="Enter contact person mobile
                  "
                      value={companyDetails?.contact_person_mobile || ''}
                      onChange={(e) =>
                        setCompanyDetails({
                          ...companyDetails,
                          contact_person_mobile: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                {companyDetails &&
                companyDetails.status == 'activated' &&
                (companyDetails?.company_admin_data[0].is_active === true ||
                  companyDetails?.company_admin_data[0].is_active === null) ? (
                  <>
                    {companyDetails.company_admin_data[0]?.company_admin_id ==
                    null ? (
                      <div className="col-sm-12 col-md-6 col-lg-6">
                        <button
                          className="button-group"
                          onClick={handleCreateAdmin}
                        >
                          Create Admin
                        </button>
                      </div>
                    ) : (
                      <div className="col-sm-12 col-md-6 col-lg-6">
                        <button
                          className="button-group"
                          onClick={() => toggleModal()}
                        >
                          Company Admin Data
                        </button>
                      </div>
                    )}
                    <div className="col-sm-12 col-md-6 col-lg-6">
                      <button
                        className="button-group"
                        onClick={handleUpdateModal}
                      >
                        Update Details
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="col-sm-12 col-md-12 col-lg-12">
                    <button
                      className="button-group"
                      onClick={() => toggleModal()}
                    >
                      Company Admin Data
                    </button>
                  </div>
                )}
              </div>
            </div>

            <AdminDetailsModal
              isOpen={showModal}
              onClose={toggleModal}
              adminDetails={companyDetails?.company_admin_data[0]}
              onAdminUpdate={handleAdminUpdate}
            />

            {modalVisible && (
              <Modal show={modalVisible} onHide={() => setModalVisible(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>{`Do you want to Update details of this company?`}</Modal.Body>
                <Modal.Footer>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleEditCompany(true)}
                  >
                    Yes
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => setModalVisible(false)}
                  >
                    No
                  </button>
                </Modal.Footer>
              </Modal>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default CompanyDetailsSupAdmin;
