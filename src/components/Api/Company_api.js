import Cookies from 'js-cookie';
import { Base_Url } from './Base_url';
import axios from 'axios';

export async function getCompaniesByStatus(token, status) {
  const response = await fetch(`${Base_Url}companyList?status=${status}`, {
    headers: {
      Authorization: token,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${status} companies`);
  }
  return response.json();
}

export async function getCompanyDetails(companyId) {
  const url = `${Base_Url}companyDetails?company_id=${companyId}`;
  const token = Cookies.get('token');
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch company details');
  }

  return response.json();
}

export const editCompanyDetails = async (token, updatedData) => {
  try {
    const response = await axios.put(
      `${Base_Url}editCompanyDetails`,
      updatedData,
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createCompanyAdmin = async (formData) => {
  try {
    const token = Cookies.get('token');
    const response = await fetch(`${Base_Url}createCompanyAdmin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Failed to create company admin');
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw error;
  }
};

export async function deactivateCompanyAndCompanyAdmin(companyId, requestBody) {
  try {
    const token = Cookies.get('token');

    const response = await fetch(
      `${Base_Url}deactivateCompanyAndCompanyAdmin`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to deactivate company');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function editCompanyAdmin(adminDetails) {
  try {
    const token = Cookies.get('token');
    const response = await fetch(`${Base_Url}editCompanyAdmin`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(adminDetails),
    });

    if (!response.ok) {
      throw new Error('Failed to update company admin details');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export const fetchCardListsForSA = async (companyId, token) => {
  try {
    const url = `${Base_Url}cardListsForSA?company_id=${companyId}`;
    const response = await fetch(url, {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: 'Failed to fetch card lists' };
  }
};
