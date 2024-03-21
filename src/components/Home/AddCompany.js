import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AddComapny.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Base_Url } from '../Api/Base_url';
import { Modal } from 'antd';
import Spinner from '../Common/CustomSpinner';

const AddCompany = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company_name: '',
    company_email: '',
    company_contact_number: '',
    max_cards: '',
    contact_person_name: '',
    contact_person_email: '',
    trial_duration: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDurationChange = (value) => {
    setFormData({ ...formData, trial_duration: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (
      !formData.company_name ||
      !formData.company_email ||
      !formData.company_contact_number ||
      !formData.max_cards ||
      !formData.contact_person_name ||
      !formData.contact_person_email ||
      !formData.trial_duration
    ) {
      toast.error('All fields are required');
      setIsSubmitting(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.company_email)) {
      toast.error('Invalid Comapny email address');
      setIsSubmitting(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_person_email)) {
      toast.error('Invalid Contact Person email address');
      setIsSubmitting(false);
      return;
    }

    if (!/^\d{10}$/.test(formData.company_contact_number)) {
      toast.error('Company contact number must be exactly 10 numbers');
      setIsSubmitting(false);
      return;
    }

    if (!/^\d+$/.test(formData.max_cards)) {
      toast.error('Maximum cards must contain only numbers');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(`${Base_Url}createCompany`, formData);
      console.log('object', formData);
      if (response.status === 201) {
        toast.success(response.data.message);
        setFormData({
          company_name: '',
          company_email: '',
          company_contact_number: '',
          max_cards: '',
          contact_person_name: '',
          contact_person_email: '',
          trial_duration: '',
        });
        // navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {isSubmitting && <Spinner />}
      <div className="p-2">
        <div className="contact-form-wrapper d-flex justify-content-center">
          <form
            onSubmit={handleSubmit}
            className="contact-form"
            style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }}
          >
            <h2 className="title text-center mb-3">Create Company</h2>

            <div>
              <input
                type="text"
                className="form-control rounded border-white mb-3 form-input"
                id="company_name"
                name="company_name"
                placeholder="Company Name"
                value={formData.company_name}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                type="text"
                className="form-control rounded border-white mb-3 form-input"
                id="company_email"
                name="company_email"
                placeholder="Company Email"
                value={formData.company_email}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                type="text"
                className="form-control rounded border-white mb-3 form-input"
                id="company_contact_number"
                name="company_contact_number"
                placeholder="Company Contact Number"
                value={formData.company_contact_number}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                type="number"
                className="form-control rounded border-white mb-3 form-input"
                id="max_cards"
                name="max_cards"
                placeholder="Maximun Cards"
                value={formData.max_cards}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                type="text"
                className="form-control rounded border-white mb-3 form-input"
                id="contact_person_name"
                name="contact_person_name"
                placeholder="Contact Person Name"
                value={formData.contact_person_name}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                type="text"
                className="form-control rounded border-white mb-3 form-input"
                id="contact_person_email"
                name="contact_person_email"
                placeholder="Contact Person Email"
                value={formData.contact_person_email}
                onChange={handleChange}
              />
            </div>

            <div>
              <select
                className="form-control rounded border-white mb-3 form-input"
                value={formData.trialDuration}
                onChange={(e) => handleDurationChange(e.target.value)}
              >
                <option value="">Select Trial Duration</option>
                <option value="1">1 Month</option>
                <option value="12">12 Months</option>
                <option value="24">24 Months</option>
                <option value="36">36 Months</option>
              </select>
            </div>
            <div className="submit-button-wrapper">
              <input type="submit" value="Submit" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCompany;
