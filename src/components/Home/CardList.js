// import React, { useState, useEffect } from 'react';
// import { Button, Layout, Menu, theme } from 'antd';
// import {
//   UserOutlined,
//   SettingOutlined,
//   PlusOutlined,
//   LogoutOutlined,
//   DashboardOutlined,
// } from '@ant-design/icons';
// import { useNavigate, useParams } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import Cookies from 'js-cookie';
// import SuperAdminDashboard from './SuperAdminDashboard';
// import ProfileSupAdmin from '../AuthSuperAdmin/ProfileSupAdmin';
// import ChangePasswordSupAdmin from '../AuthSuperAdmin/ChangePasswordSupAdmin';
// import AddCompany from './AddCompany';
// import { fetchCardListsForSA } from '../Api/Company_api';
// import './CardList.css';
// import { IoIosSearch } from 'react-icons/io';
// import { FaDiamond } from 'react-icons/fa6';

// const { Header, Content, Sider } = Layout;
// const { SubMenu } = Menu;

// const items = [
//   {
//     key: '1',
//     icon: <DashboardOutlined />,
//     label: 'Dashboard',
//     content: <SuperAdminDashboard />,
//     path: '/dashboard',
//   },
//   {
//     key: '2',
//     icon: <UserOutlined />,
//     label: 'Profile',
//     content: <ProfileSupAdmin />,
//     path: '/dashboard',
//   },
//   {
//     key: '3',
//     icon: <SettingOutlined />,
//     label: 'Change Password',
//     content: <ChangePasswordSupAdmin />,
//     path: '/dashboard',
//   },
//   {
//     key: '4',
//     icon: <PlusOutlined />,
//     label: 'Create Company',
//     content: <AddCompany />,
//     path: '/dashboard',
//   },
// ];

// const CardList = () => {
//   const {
//     token: { colorBgContainer, borderRadiusLG },
//   } = theme.useToken();
//   const [selectedItemKey, setSelectedItemKey] = useState(items[0].key);
//   const navigate = useNavigate();
//   const [cardLists, setCardLists] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const { companyID } = useParams();
//   const { companyName } = useParams();

//   const handleMenuItemClick = (key, path) => {
//     setSelectedItemKey(key);
//     navigate(path);
//   };

//   const handleLogout = () => {
//     Cookies.remove('token');
//     toast.success('Logout Successfully');
//     navigate('/');
//   };

//   useEffect(() => {
//     const fetchCardLists = async () => {
//       try {
//         const token = Cookies.get('token');
//         const data = await fetchCardListsForSA(companyID, token);
//         if (data.success) {
//           setCardLists(data.data);
//         } else {
//           // toast.error(data.message);
//         }
//       } catch (error) {
//         toast.error('Error fetching card lists:', error);
//       }
//     };

//     fetchCardLists();
//   }, [companyID]);

//   const truncateBio = (text, maxWords) => {
//     if (!text) return '';

//     const words = text.split(' ');
//     if (words.length > maxWords) {
//       return words.slice(0, maxWords).join(' ') + '...';
//     }
//     return text;
//   };

//   const handleSearchInputChange = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const filteredCardLists = cardLists.filter((card) =>
//     `${card.first_name} ${card.last_name} ${card.email}`
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase())
//   );

//   return (
//     <>
//       <Layout>
//         <Sider
//           className=""
//           breakpoint="lg"
//           collapsedWidth="0"
//           onBreakpoint={(broken) => {}}
//           onCollapse={(collapsed, type) => {}}
//         >
//           <div className="demo-logo-vertical" />
//           <Menu
//             theme="dark"
//             mode="inline"
//             defaultSelectedKeys={['1']}
//             selectedKeys={[selectedItemKey]}
//             style={{ height: '100vh' }}
//           >
//             {items.map((item) => (
//               <Menu.Item
//                 key={item.key}
//                 icon={item.icon}
//                 onClick={() => handleMenuItemClick(item.key, item.path)}
//               >
//                 {item.label}
//               </Menu.Item>
//             ))}

//             <div className="p-2 mt-2">
//               <Button
//                 danger
//                 type="primary fw-bold"
//                 className="w-100"
//                 shape="round"
//                 onClick={handleLogout}
//                 icon={<LogoutOutlined />}
//               >
//                 Logout
//               </Button>
//             </div>
//           </Menu>
//         </Sider>
//         <Layout>
//           <Content>
//             <div>
//               <div className="">
//                 <section
//                   id="advertisers"
//                   className="advertisers-service-sec pt-5 pb-5"
//                 >
//                   <div className="container ">
//                     <div className="row">
//                       <div className="section-header text-center">
//                         <h2 className="fw-bold fs-1">
//                           <span className="b-class-secondary">
//                             {companyName}{' '}
//                           </span>
//                           Card List
//                         </h2>
//                         <p className="sec-icon">
//                           <FaDiamond className="text-dark fs-2" />
//                         </p>
//                       </div>
//                     </div>
//                     {filteredCardLists.length === 0 ? (
//                       <p className="text-center fs-3 d-flex justify-content-center align-item-center">
//                         No card lists found
//                       </p>
//                     ) : (
//                       <div className="card p-2 mt-2 border-none">
//                         {filteredCardLists.length > 0 && (
//                           <div className="cards-search-box mb-3">
//                             <button className="btn-search-cards">
//                               <IoIosSearch />
//                             </button>
//                             <input
//                               type="text"
//                               className="input-search-cards"
//                               placeholder="Type to Search..."
//                               onChange={handleSearchInputChange}
//                               value={searchQuery}
//                               style={{ color: 'black' }}
//                             />
//                           </div>
//                         )}

//                         <div className="row d-flex justify-content-center align-item-center mt-5 col-sm-12">
//                           {filteredCardLists.map((card) => (
//                             <div
//                               key={card.id}
//                               className="col-md-4 mx-auto mb-4"
//                             >
//                               <div className="service-card">
//                                 <div className="icon-wrapper">
//                                   <img
//                                     src={card.profile_picture}
//                                     style={{ width: '70px' }}
//                                   ></img>
//                                 </div>
//                                 <div className="text-center">
//                                   <h3>
//                                     {card.first_name} {card.last_name}
//                                   </h3>
//                                   <p>{card.designation}</p>
//                                   <button
//                                     className="btn_details"
//                                     onClick={() =>
//                                       navigate(
//                                         `/dashboard/card-details-super-admin/${card.id}`
//                                       )
//                                     }
//                                   >
//                                     View Details
//                                   </button>
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </section>
//               </div>
//             </div>
//           </Content>
//         </Layout>
//       </Layout>
//     </>
//   );
// };

// export default CardList;

import React, { useState, useEffect } from 'react';
import { Button, Layout, Menu, theme } from 'antd';
import ViewDetails from '../../assets/icons/file.png';
import {
  UserOutlined,
  SettingOutlined,
  PlusOutlined,
  LogoutOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import SuperAdminDashboard from './SuperAdminDashboard';
import ProfileSupAdmin from '../AuthSuperAdmin/ProfileSupAdmin';
import ChangePasswordSupAdmin from '../AuthSuperAdmin/ChangePasswordSupAdmin';
import AddCompany from './AddCompany';
import { fetchCardListsForSA } from '../Api/Company_api';
import './CardList.css';
import { IoIosSearch } from 'react-icons/io';
import { FaDiamond } from 'react-icons/fa6';
import LogoImage from '../../assets/icons/logo.png';
import CustomSpinner from '../Common/CustomSpinner';

const { Header, Content, Sider } = Layout;
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

const CardList = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [selectedItemKey, setSelectedItemKey] = useState(items[0].key);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [cardLists, setCardLists] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { companyID } = useParams();
  const { companyName } = useParams();

  const handleMenuItemClick = (key, path) => {
    setSelectedItemKey(key);
    navigate(path);
  };

  const handleLogout = () => {
    Cookies.remove('token');
    toast.success('Logout Successfully');
    navigate('/');
  };

  useEffect(() => {
    const fetchCardLists = async () => {
      try {
        const token = Cookies.get('token');
        const data = await fetchCardListsForSA(companyID, token);
        if (data.success) {
          setCardLists(data.data);
        } else {
          // toast.error(data.message);
        }
      } catch (error) {
        toast.error('Error fetching card lists:', error);
      } finally {
        setLoading(false); // Set loading to false after API call is completed
      }
    };

    fetchCardLists();
  }, [companyID]);

  const truncateBio = (text, maxWords) => {
    if (!text) return '';

    const words = text.split(' ');
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...';
    }
    return text;
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredCardLists = cardLists.filter((card) =>
    `${card.first_name} ${card.last_name} ${card.email}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <>
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
              style={{ width: '100%', padding: '16px 0' }}
            />
          </div>
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
          <Content>
            <div>
              <div style={{ background: 'white' }}>
                <section
                  id="advertisers"
                  className="advertisers-service-sec pt-5 pb-5"
                >
                  <div className="container">
                    <div className="row">
                      <div className="section-header text-center">
                        <h2 className="fw-bold fs-1">
                          <span className="b-class-secondary">
                            {companyName}{' '}
                          </span>
                          Card List
                        </h2>
                        <p className="sec-icon">
                          <FaDiamond className="text-dark fs-2" />
                        </p>
                      </div>
                    </div>
                    {loading ? (
                      <CustomSpinner /> // Render a spinner while loading
                    ) : filteredCardLists.length === 0 ? (
                      <p className="text-center fs-3 d-flex justify-content-center mt-5 align-item-center">
                        No card lists found
                      </p>
                    ) : (
                      <div className="card p-2 mt-2 border-none table-responsive">
                        {filteredCardLists.length > 0 && (
                          <div className="cards-search-box mb-3">
                            <button className="btn-search-cards">
                              <IoIosSearch />
                            </button>
                            <input
                              type="text"
                              className="input-search-cards"
                              placeholder="Type to Search..."
                              onChange={handleSearchInputChange}
                              value={searchQuery}
                              style={{ color: 'black' }}
                            />
                          </div>
                        )}

                        <table className="table table-striped ">
                          <thead>
                            <tr>
                              <th>First Name</th>
                              <th>Last Name</th>
                              <th>Email</th>
                              <th>Designation</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredCardLists.map((card) => (
                              <tr key={card.id}>
                                <td>{card.first_name}</td>
                                <td>{card.last_name}</td>
                                <td>{card.user_email}</td>
                                <td>{card.designation}</td>
                                <td>
                                  {/* <button
                                    className="btn btn-primary"
                                    onClick={() =>
                                      navigate(
                                        `/dashboard/card-details-super-admin/${card.id}`
                                      )
                                    }
                                  >
                                    View Details
                                  </button> */}
                                  <img
                                    className=""
                                    style={{ width: '30px' }}
                                    src={ViewDetails}
                                    onClick={() =>
                                      navigate(
                                        `/dashboard/card-details-super-admin/${card.id}`
                                      )
                                    }
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default CardList;
