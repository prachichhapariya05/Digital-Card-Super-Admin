import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { editCompanyAdmin } from '../Api/Company_api';
import { toast } from 'react-toastify';

function AdminDetailsModal({
  isOpen,
  onClose,
  adminDetails: initialAdminDetails,
  onAdminUpdate,
  companyStatus,
}) {
  const [adminDetails, setAdminDetails] = useState(initialAdminDetails);
  const [confirmUpdate, setConfirmUpdate] = useState(false);

  useEffect(() => {
    setAdminDetails(initialAdminDetails);
  }, [initialAdminDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleUpdateAdmin = async () => {
    if (!confirmUpdate) {
      setConfirmUpdate(true);
      return;
    }

    if (
      !adminDetails.first_name ||
      !adminDetails.last_name ||
      !adminDetails.email ||
      !adminDetails.mobile_number
    ) {
      toast.error('Please fill all fields.');
      return;
    }

    const alphabetPattern = /^[a-zA-Z]+$/;
    if (!alphabetPattern.test(adminDetails.first_name)) {
      toast.error('Please enter a valid first name.');
      return;
    }
    if (!alphabetPattern.test(adminDetails.last_name)) {
      toast.error('Please enter a valid last name.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(adminDetails.email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(adminDetails.mobile_number)) {
      toast.error('Please enter a valid 10-digit phone number.');
      return;
    }

    try {
      const payload = {
        admin_id: adminDetails.company_admin_id,
        first_name: adminDetails.first_name,
        last_name: adminDetails.last_name,
        email: adminDetails.email,
        phone_number: adminDetails.mobile_number,
      };

      const response = await editCompanyAdmin(payload);
      if (response.success) {
        toast.success(response.message);
        onAdminUpdate(response.admin_id);
        onClose();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Error updating admin:', error);
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose}>
      <div className="modal-content">
        <div className="modal-header border-none">
          <h3
            className="modal-title"
            style={{
              color: '#2558a1',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
            }}
          >
            Company Admin Data
          </h3>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
          ></button>
        </div>
        <div className="modal-body">
          <div className="input-group-details">
            <label className="labelTag-details">Admin First Name:</label>
            <input
              type="text"
              className="inputTag-details"
              name="first_name"
              placeholder="Enter First Name"
              value={adminDetails?.first_name || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-group-details">
            <label className="labelTag-details"> Admin Last Name: </label>
            <input
              type="text"
              className="inputTag-details"
              name="last_name"
              placeholder="Enter Last Name"
              value={adminDetails?.last_name || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-group-details">
            <label className="labelTag-details">Admin Email:</label>
            <input
              type="text"
              className="inputTag-details"
              name="email"
              placeholder="Enter Email"
              value={adminDetails?.email || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-group-details">
            <label className="labelTag-details">Admin Phone:</label>
            <input
              type="text"
              className="inputTag-details"
              name="mobile_number"
              placeholder="Enter Phone Number"
              value={adminDetails?.mobile_number || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>
        {confirmUpdate && (
          <div className="text-center mt-3 p-2">
            <p>Are you sure you want to update the admin details?</p>
            <button
              className="btn btn-primary me-2"
              onClick={handleUpdateAdmin}
            >
              Yes
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setConfirmUpdate(false)}
            >
              No
            </button>
          </div>
        )}
      </div>

      <div className="row mb-3 p-2">
        {companyStatus !== 'deactivated' && !confirmUpdate && (
          <div className="col-sm-12 col-md-12 col-lg-12">
            <button className="button-group" onClick={handleUpdateAdmin}>
              Update Admin Data
            </button>
          </div>
        )}
      </div>
      {/* </div> */}
    </Modal>
  );
}

export default AdminDetailsModal;
