import React, { useState, useEffect } from 'react';
import './SuperAdminDashboard.css';
import {
  getCompaniesByStatus,
  deactivateCompanyAndCompanyAdmin,
} from '../Api/Company_api';
import Cookies from 'js-cookie';
import { MdOutlineEditNote } from 'react-icons/md';
import { AiFillCreditCard } from 'react-icons/ai';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import { IoIosSearch } from 'react-icons/io';

function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('activated');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [companyIdToChangeStatus, setCompanyIdToChangeStatus] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  };
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleActivateDeactivate = (companyId, status) => {
    setCompanyIdToChangeStatus(companyId);
    setNewStatus(status);
    setModalVisible(true);
  };
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toISOString().split('T')[0];
  };

  const fetchCompanies = async () => {
    try {
      const token = Cookies.get('token');
      const response = await getCompaniesByStatus(token, selectedStatus);

      if (response.success) {
        const companiesWithZeroUsedCards = response.data.map((company) => ({
          ...company,
          used_cards: company.used_cards === null ? 0 : company.used_cards,
        }));
        setCompanies(companiesWithZeroUsedCards);
        setError(null);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('Failed to fetch companies');
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [selectedStatus]);

  const handleStatusUpdate = async (companyId, newStatus) => {
    try {
      if (newStatus !== 'activated' && newStatus !== 'deactivated') {
        throw new Error('Invalid Status');
      }

      const requestBody = {
        status: newStatus,
        company_id: companyId,
      };
      const response = await deactivateCompanyAndCompanyAdmin(
        companyId,
        requestBody
      );
      if (response.success) {
        toast.success(response.message);
        fetchCompanies();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(`Failed to ${newStatus} company`);
    }
  };

  const filteredCompanies = companies.filter((company) => {
    return selectedStatus === 'activated'
      ? company.status === 'activated'
      : company.status !== 'activated';
  });

  const confirmActivateDeactivate = async (confirmed) => {
    if (confirmed) {
      try {
        const requestBody = {
          status: newStatus,
          company_id: companyIdToChangeStatus,
        };
        const response = await deactivateCompanyAndCompanyAdmin(
          companyIdToChangeStatus,
          requestBody
        );
        if (response.success) {
          toast.success(response.message);
          fetchCompanies();
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error(`Failed to ${newStatus} company`);
      }
    }
    setModalVisible(false);
  };

  const searchedCompanies = filteredCompanies.filter((company) =>
    company.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCompanies = searchedCompanies.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleNavigateToCardList = (companyId) => {
    navigate(`/card-list-sup-admin/${companyId}`);
  };

  return (
    <div className="">
      <div className="container">
        <div className="row my-4">
          <div className="col-6">
            <div>
              <h1 className="company-list-name">COMPANY LIST</h1>
            </div>
          </div>
          <div className="col-6">
            <select
              className="form-select dropdown_activate"
              aria-label="Default select example"
              onChange={(e) => handleStatusChange(e)}
              value={selectedStatus}
            >
              <option value="activated">Activated</option>
              <option value="deactivated">Deactivated</option>
            </select>
          </div>
        </div>

        {error && <h2 className="text-center align-item-center">{error}</h2>}
        <div className="card border-0 p-2 mb-3">
          <div className="search-box mb-3">
            <button className="btn-search">
              <IoIosSearch />
            </button>
            <input
              type="text"
              className="input-search"
              placeholder="Type to Search..."
              onChange={handleSearch}
              value={searchTerm}
              style={{ color: 'black' }}
            />
          </div>
          <div
            className="table-responsive rounded-3"
            style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }}
          >
            {searchedCompanies.length === 0 ? (
              <p className="text-center">No companies found.</p>
            ) : (
              <table className="table table-striped responsive">
                <thead>
                  <tr className="text-center">
                    {/* <th scope="col">#</th> */}
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Contact</th>
                    <th scope="col">Created</th>
                    <th scope="col">Remaining_duration </th>
                    <th scope="col">Max_Cards</th>
                    <th scope="col">Used Cards</th>
                    <th scope="col">Cards List</th>
                    <th scope="col">Details</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCompanies.map((company, index) => (
                    <tr key={index} className="text-center align-item-center">
                      {/* <th scope="row">{index + 1}</th> */}
                      <td>{company.company_name}</td>
                      <td>{company.company_email}</td>
                      <td>{company.company_contact_number}</td>
                      <td>{formatDate(company.created_at)}</td>
                      <td>{company.remaining_duration}</td>
                      <td>{company.max_cards}</td>
                      <td>{company.used_cards}</td>
                      <td>
                        <div className="rounded-pill">
                          <NavLink
                            to={`/dashboard/card-list-sup-admin/${company.id}/${company.company_name}`}
                          >
                            <AiFillCreditCard className="fs-3 text-primary" />
                          </NavLink>
                        </div>
                      </td>
                      <td>
                        <div className="rounded-pill">
                          <NavLink
                            to={`/dashboard/company-details-super-admin/${company.id}`}
                          >
                            <MdOutlineEditNote className="text-info fs-2 fw-bold" />
                          </NavLink>
                        </div>
                      </td>
                      <td>
                        {selectedStatus === 'activated' ? (
                          <button
                            className="btn btn-secondary"
                            data-bs-target="#staticBackdrop"
                            onClick={() =>
                              handleActivateDeactivate(
                                company.id,
                                'deactivated'
                              )
                            }
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            className="btn btn-primary"
                            data-bs-target="#staticBackdrop"
                            onClick={() =>
                              handleActivateDeactivate(company.id, 'activated')
                            }
                          >
                            Activate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {companies.length > itemsPerPage && (
            <nav aria-label="Page navigation example">
              <ul className="pagination justify-content-center">
                <li
                  className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    <span aria-hidden="true">&laquo;</span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                </li>
                {Array.from(
                  {
                    length: Math.ceil(searchedCompanies.length / itemsPerPage),
                  },
                  (_, index) => (
                    <li
                      key={index}
                      className={`page-item ${
                        currentPage === index + 1 ? 'active' : ''
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  )
                )}
                <li
                  className={`page-item ${
                    currentPage ===
                    Math.ceil(searchedCompanies.length / itemsPerPage)
                      ? 'disabled'
                      : ''
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    <span aria-hidden="true">&raquo;</span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </li>
              </ul>
            </nav>
          )}{' '}
        </div>

        {modalVisible && (
          <Modal show={modalVisible} onHide={() => setModalVisible(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>{`Do you want to ${newStatus} this company?`}</Modal.Body>
            <Modal.Footer>
              <button
                className="btn btn-secondary"
                onClick={() => confirmActivateDeactivate(true)}
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
    </div>
  );
}

export default SuperAdminDashboard;
