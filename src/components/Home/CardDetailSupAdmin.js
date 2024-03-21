import React, { useEffect, useState } from 'react';
import { Col, Container, Image, Row } from 'react-bootstrap';
import { FaShareAlt } from 'react-icons/fa';
import axios from 'axios';
import Cookies from 'js-cookie';
import './CardDetails.css';
import { Base_Url } from '../Api/Base_url';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMapLocationDot, FaUserPlus } from 'react-icons/fa6';
import WhatsAppCustomIcon from '../../assets/icons/whatsapp.png';
import InstagramCustomIcon from '../../assets/icons/instagram.png';
import TelegramCustomIcon from '../../assets/icons/telegram.png';
import LinkedInCustomIcon from '../../assets/icons/linkedin.png';
import WeChatCustomIcon from '../../assets/icons/wechat.png';
import LineCustomIcon from '../../assets/icons/line.png';
import YouTubeCustomIcon from '../../assets/icons/youtube.png';
import TikTokCustomIcon from '../../assets/icons/tiktok.png';
import FacebookCustomIcon from '../../assets/icons/facebook.png';
import Destination from '../../assets/icons/destination.png';
import 小红书 from '../../assets/icons/xhs.png';
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
import { toast } from 'react-toastify';
import LogoImage from '../../assets/icons/logo.png';
import CustomSpinner from '../Common/CustomSpinner';

const { Content, Sider } = Layout;
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

function ViewDigitalCard() {
  const [cardDetails, setCardDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { cardID } = useParams();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [selectedItemKey, setSelectedItemKey] = useState(items[0].key);
  const navigate = useNavigate();

  // const handleMenuItemClick = (key, path) => {
  //   setSelectedItemKey(key);
  //   navigate(path);
  // };

  const handleLogout = () => {
    Cookies.remove('token');
    toast.success('Logout Successfully');
    navigate('/');
  };

  useEffect(() => {
    const fetchCardDetails = async () => {
      try {
        const token = Cookies.get('token');
        const response = await axios.get(
          `${Base_Url}cardDetailsForSA?card_id=${cardID}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (response.data.success) {
          setCardDetails(response.data.data);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error('Error fetching card details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCardDetails();
  }, [cardID]);

  function extractMainContent(htmlString) {
    if (!htmlString) {
      return '';
    }
    const cleanHtmlString = htmlString.replace(/'/g, '');
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = cleanHtmlString;
    const mainContentElement = tempDiv.querySelector('.markdown.prose');
    const mainContent = mainContentElement ? mainContentElement.innerHTML : '';

    return mainContent;
  }

  const openLocationUrl = () => {
    window.open(cardDetails.location, '_blank');
  };

  const handleMenuItemClick = (key, path, url) => {
    setSelectedItemKey(key);
    if (url) {
      window.open(url, '_blank');
    } else {
      navigate(path);
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
          // mode="inline"
          defaultSelectedKeys={['1']}
          selectedKeys={[selectedItemKey]}
          style={{ height: '100vh', backgroundColor: '#272C3B' }}
        >
          {items.map((item) => (
            <Menu.Item
              key={item.key}
              icon={item.icon}
              onClick={() => handleMenuItemClick(item.key, item.path)}
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
            <Container fluid className="viewDigitalBusinessCardContainer">
              <Row>
                <h1 className="text-center text-dark ">
                  Digital Business Card Details
                </h1>
              </Row>
              <Row>
                <Col lg={3} md={0} sm={0}></Col>
                <Col lg={6} md={12} sm={12} className="my-5">
                  {loading ? (
                    <CustomSpinner />
                  ) : (
                    cardDetails && (
                      <div className="viewBusinessCardContainer">
                        <div className="viewCardContainer border">
                          <div className="viewCardImagesSection">
                            <Image
                              className="viewCardImages_profileImage"
                              src={
                                cardDetails.profile_picture ||
                                'https://cf.shopee.ph/file/13ac71187230bae1b72226fa0cd962b1'
                              }
                              roundedCircle
                              alt="Profile"
                              height={150}
                              width={150}
                            />
                          </div>
                          <div className="viewCardDetails p-4">
                            <div className="viewCardProfileBioDetails">
                              <Row className="align-items-center">
                                <Col lg={8} md={8} sm={8}>
                                  <div className="view_card_content_title">{`${cardDetails?.first_name} ${cardDetails?.last_name}`}</div>
                                  <div className="view_card_content_sub_title">{`${cardDetails?.designation} at ${cardDetails?.company_name}`}</div>
                                </Col>
                                <Col lg={4} md={4} sm={4}>
                                  <span className="float-end">
                                    <Image
                                      src={cardDetails.company_logo}
                                      roundedCircle
                                      height={50}
                                      width={50}
                                    />
                                  </span>
                                </Col>
                              </Row>
                            </div>
                            <div className="viewCardCompanyBioDetails">
                              <Row className="align-items-center">
                                <Col lg={8} md={8} sm={8}>
                                  <label className="fw-bold text-black">
                                    Company Location
                                  </label>
                                  <div className="view_card_content_sub_title">
                                    {cardDetails.company_address}
                                  </div>
                                </Col>
                                <Col lg={4} md={4} sm={4}>
                                  <a
                                    href={cardDetails.location}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <FaMapLocationDot className="float-end text-black fs-2" />
                                  </a>

                                  <a
                                    href={cardDetails.location}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {' '}
                                    <img
                                      src={Destination}
                                      style={{ width: '30px' }}
                                      className="social_custom_icon"
                                    />
                                  </a>
                                </Col>
                              </Row>
                            </div>
                            <div className="viewCardAboutMe">
                              <Row className="my-3">
                                <label className="fw-bold text-black">
                                  About Me
                                </label>

                                <div className="">{cardDetails.bio}</div>
                              </Row>
                            </div>
                            <div className="viewCardProductAndServices">
                              <Row
                                className="my-3"
                                style={{
                                  display: cardDetails.product_and_services
                                    ? 'flex'
                                    : 'none',
                                }}
                              >
                                <label className="fw-bold text-black">
                                  Product And Services
                                </label>
                                <div>{cardDetails.product_and_services}</div>
                              </Row>
                            </div>
                            <div className="viewCardCompanyInfo">
                              <Row className="mt-1 align-items-center">
                                <Col
                                  lg={6}
                                  md={6}
                                  sm={6}
                                  xs={6}
                                  className="mb-3"
                                >
                                  <label className="fw-bold text-black">
                                    Email
                                  </label>
                                  <div>{cardDetails.user_email}</div>
                                </Col>
                                <Col
                                  lg={6}
                                  md={6}
                                  sm={6}
                                  xs={6}
                                  className="mb-3"
                                >
                                  <label className="fw-bold text-black">
                                    Contact No.
                                  </label>
                                  <div>{cardDetails.contact_number}</div>
                                </Col>
                                <Col
                                  lg={6}
                                  md={6}
                                  sm={6}
                                  xs={6}
                                  className="mb-3"
                                >
                                  <label className="fw-bold text-black">
                                    Company Email
                                  </label>
                                  <div>{cardDetails.company_email}</div>
                                </Col>
                                <Col
                                  lg={6}
                                  md={6}
                                  sm={6}
                                  xs={6}
                                  className="mb-3"
                                >
                                  <label className="fw-bold text-black">
                                    Company Website
                                  </label>
                                  <div>{cardDetails.company_website_url}</div>
                                </Col>
                                <Col
                                  lg={6}
                                  md={6}
                                  sm={6}
                                  xs={6}
                                  className="mb-3"
                                >
                                  <label className="fw-bold text-black">
                                    Company Phone
                                  </label>
                                  <div>{cardDetails.company_email}</div>
                                </Col>
                              </Row>
                            </div>
                            <div className="viewCardSocialLinks">
                              <Row className="my-3">
                                <Col lg={6} md={6} sm={6} xs={6}>
                                  <Button
                                    className="w-100 d-flex align-items-center"
                                    size="large"
                                    onClick={() =>
                                      handleMenuItemClick(
                                        null,
                                        null,
                                        cardDetails.facebook
                                      )
                                    }
                                  >
                                    <img
                                      className="social_custom_icon float-start"
                                      src={FacebookCustomIcon}
                                      alt="Facebook Icon"
                                      style={{
                                        maxHeight: '100%',
                                        maxWidth: '10%',
                                      }}
                                    />
                                    <span className="button-content float-start mx-2">
                                      Facebook
                                    </span>
                                  </Button>
                                </Col>
                                <Col lg={6} md={6} sm={6} xs={6}>
                                  <Button
                                    className="w-100 d-flex align-items-center"
                                    size="large"
                                    onClick={() =>
                                      handleMenuItemClick(
                                        null,
                                        null,
                                        cardDetails.instagram
                                      )
                                    }
                                  >
                                    <img
                                      className="social_custom_icon float-start"
                                      src={InstagramCustomIcon}
                                      alt="Instagram Icon"
                                      style={{
                                        maxHeight: '100%',
                                        maxWidth: '10%',
                                      }}
                                    />
                                    <span className="button-content float-start mx-2">
                                      Instagram
                                    </span>
                                  </Button>
                                </Col>
                              </Row>
                              <Row className="my-3">
                                <Col lg={6} md={6} sm={6} xs={6}>
                                  <Button
                                    className="w-100 d-flex align-items-center"
                                    size="large"
                                    onClick={() =>
                                      handleMenuItemClick(
                                        null,
                                        null,
                                        cardDetails.linkedin
                                      )
                                    }
                                  >
                                    <img
                                      className="social_custom_icon float-start"
                                      src={LinkedInCustomIcon}
                                      alt="LinkedIn Icon"
                                      style={{
                                        maxHeight: '100%',
                                        maxWidth: '10%',
                                      }}
                                    />
                                    <span className="button-content float-start mx-2">
                                      Linkedin
                                    </span>
                                  </Button>
                                </Col>
                                <Col lg={6} md={6} sm={6} xs={6}>
                                  <Button
                                    className="w-100 d-flex align-items-center"
                                    size="large"
                                    onClick={() =>
                                      handleMenuItemClick(
                                        null,
                                        null,
                                        cardDetails.whatsapp
                                      )
                                    }
                                  >
                                    <img
                                      className="social_custom_icon float-start"
                                      src={WhatsAppCustomIcon}
                                      alt="WhatsApp Icon"
                                      style={{
                                        maxHeight: '100%',
                                        maxWidth: '10%',
                                      }}
                                    />
                                    <span className="button-content float-start mx-2">
                                      WhatsApp
                                    </span>
                                  </Button>
                                </Col>
                              </Row>
                              <Row className="my-3">
                                <Col lg={6} md={6} sm={6} xs={6}>
                                  <Button
                                    className="w-100 d-flex align-items-center"
                                    size="large"
                                    onClick={() =>
                                      handleMenuItemClick(
                                        null,
                                        null,
                                        cardDetails.youtube
                                      )
                                    }
                                  >
                                    <img
                                      className="social_custom_icon float-start"
                                      src={YouTubeCustomIcon}
                                      alt="YouTube Icon"
                                      style={{
                                        maxHeight: '100%',
                                        maxWidth: '10%',
                                      }}
                                    />
                                    <span className="button-content float-start mx-2">
                                      Youtube
                                    </span>
                                  </Button>
                                </Col>
                                <Col lg={6} md={6} sm={6} xs={6}>
                                  <Button
                                    className="w-100 d-flex align-items-center"
                                    size="large"
                                    onClick={() =>
                                      handleMenuItemClick(
                                        null,
                                        null,
                                        cardDetails.tiktok
                                      )
                                    }
                                  >
                                    <img
                                      className="social_custom_icon float-start"
                                      src={TikTokCustomIcon}
                                      alt="Tiktok Icon"
                                      style={{
                                        maxHeight: '100%',
                                        maxWidth: '10%',
                                      }}
                                    />
                                    <span className="button-content float-start mx-2">
                                      Tiktok
                                    </span>
                                  </Button>
                                </Col>
                              </Row>
                              <Row className="my-3">
                                <Col lg={6} md={6} sm={6} xs={6}>
                                  <Button
                                    className="w-100 d-flex align-items-center"
                                    size="large"
                                    onClick={() =>
                                      handleMenuItemClick(
                                        null,
                                        null,
                                        cardDetails.xiao_hong_shu
                                      )
                                    }
                                  >
                                    <img
                                      className="social_custom_icon float-start"
                                      src={小红书}
                                      alt="小红书 Icon"
                                      style={{
                                        maxHeight: '100%',
                                        maxWidth: '10%',
                                      }}
                                    />
                                    <span className="button-content float-start mx-2">
                                      小红书
                                    </span>
                                  </Button>
                                </Col>
                                <Col lg={6} md={6} sm={6} xs={6}>
                                  <Button
                                    className="w-100 d-flex align-items-center"
                                    size="large"
                                    onClick={() =>
                                      handleMenuItemClick(
                                        null,
                                        null,
                                        cardDetails.we_chat
                                      )
                                    }
                                  >
                                    <img
                                      className="social_custom_icon float-start"
                                      src={WeChatCustomIcon}
                                      alt="Wechat Icon"
                                      style={{
                                        maxHeight: '100%',
                                        maxWidth: '10%',
                                      }}
                                    />
                                    <span className="button-content float-start mx-2">
                                      Wechat
                                    </span>
                                  </Button>
                                </Col>
                              </Row>
                              <Row className="my-3">
                                <Col lg={6} md={6} sm={6} xs={6}>
                                  <Button
                                    className="w-100 d-flex align-items-center"
                                    size="large"
                                    onClick={() =>
                                      handleMenuItemClick(
                                        null,
                                        null,
                                        cardDetails.line
                                      )
                                    }
                                  >
                                    <img
                                      className="social_custom_icon float-start"
                                      src={LineCustomIcon}
                                      alt="Line Icon"
                                      style={{
                                        maxHeight: '100%',
                                        maxWidth: '10%',
                                      }}
                                    />
                                    <span className="button-content float-start mx-2">
                                      Line
                                    </span>
                                  </Button>
                                </Col>
                                <Col lg={6} md={6} sm={6} xs={6}>
                                  <Button
                                    className="w-100 d-flex align-items-center"
                                    size="large"
                                    onClick={() =>
                                      handleMenuItemClick(
                                        null,
                                        null,
                                        cardDetails.telegram
                                      )
                                    }
                                  >
                                    <img
                                      className="social_custom_icon float-start"
                                      src={TelegramCustomIcon}
                                      alt="Telegram Icon"
                                      style={{
                                        maxHeight: '100%',
                                        maxWidth: '10%',
                                      }}
                                    />
                                    <span className="button-content float-start mx-2">
                                      Telegram
                                    </span>
                                  </Button>
                                </Col>
                              </Row>
                            </div>
                            <div className="viewCardShareLinks">
                              <Row className="my-3">
                                <Col lg={4} md={4} sm={4} xs={3}>
                                  <Button
                                    className="w-100"
                                    size="large"
                                    icon={<FaShareAlt />}
                                  ></Button>
                                </Col>
                                <Col
                                  lg={8}
                                  md={8}
                                  sm={8}
                                  xs={9}
                                  className="ps-0"
                                >
                                  <Button
                                    className="w-100 bg-black text-white"
                                    size="large"
                                    // onClick={handleAddToContacts}
                                  >
                                    <FaUserPlus className="fs-3 me-3" /> Save To
                                    Phonebook
                                  </Button>
                                </Col>
                              </Row>
                            </div>

                            <div className="viewCardQRCode">
                              <center>
                                {/* <img src={cardDetails.qr_url} alt="QR Code" /> */}
                              </center>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </Col>
                <Col lg={3} md={0} sm={0}></Col>
              </Row>
            </Container>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default ViewDigitalCard;
