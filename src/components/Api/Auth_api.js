import Cookies from 'js-cookie';
import { Base_Url } from './Base_url';
import axios from 'axios';

export async function registerSuperAdmin(data) {
  try {
    const response = await fetch(`${Base_Url}registerSuperAdmin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw error;
  }
}

// export async function registerSuperAdmin(data) {
//   try {
//     // Check if avatar is provided, if not, remove it from the data object
//     if (!data.avatar) {
//       delete data.avatar;
//     }

//     const response = await fetch(`${Base_Url}registerSuperAdmin`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//     });
//     const responseData = await response.json();
//     return responseData;
//   } catch (error) {
//     throw error;
//   }
// }

export const loginSuperAdmin = async (email, password) => {
  try {
    const response = await axios.post(`${Base_Url}loginSuperAdmin`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Login failed');
  }
};

export const forgetPasswordSuperAdmin = async (email) => {
  try {
    const response = await axios.post(`${Base_Url}forgetPassword`, {
      email,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Forget Password failed');
  }
};

export const fetchProfileData = async (token) => {
  try {
    const response = await axios.get(`${Base_Url}showSAProfile`, {
      headers: {
        Authorization: token,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export async function changePasswordAPI(oldPassword, newPassword) {
  const url = `${Base_Url}changePassword`;
  const token = Cookies.get('token');
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({ oldPassword, newPassword }),
  };

  const response = await fetch(url, requestOptions);
  const data = await response.json();
  return data;
}

export const updateProfileData = async (token, profileData) => {
  try {
    const response = await axios.put(
      `${Base_Url}api/v1/superAdmin/editSAProfile`,
      profileData,
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

export async function ResetPasswordSuperAdmin(resetPassCred) {
  const url = `${Base_Url}resetPassword`;
  const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(resetPassCred),
  };

  const response = await fetch(url, requestOptions);
  const data = await response.json();
  return data;
}

export const uploadProfileImage = async (formData) => {
  try {
    const response = await axios.post(`${Base_Url}uploadSAProfile`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return {
      success: true,
      message: 'Profile Pic uploaded successfully.',
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        'An error occurred while uploading profile image.',
    };
  }
};
