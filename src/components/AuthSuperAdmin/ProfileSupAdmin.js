// import React, { useState, useEffect } from 'react';
// import './ProfileSupAdmin.css';
// import {
//   fetchProfileData,
//   updateProfileData,
//   uploadProfileImage,
// } from '../Api/Auth_api';
// import Cookies from 'js-cookie';
// import { FaDiamond } from 'react-icons/fa6';
// import { toast } from 'react-toastify';

// function ProfileSupAdmin() {
//   const [profileData, setProfileData] = useState({
//     name: '',
//     email: '',
//     avatar: '',
//   });
//   const [selectedFile, setSelectedFile] = useState(null);

//   useEffect(() => {
//     const token = Cookies.get('token');
//     const fetchData = async () => {
//       try {
//         const data = await fetchProfileData(token);
//         setProfileData(data);
//       } catch (error) {}
//     };

//     fetchData();
//   }, []);

//   const handleUpdateProfile = async () => {
//     if (!profileData.name.trim() || !profileData.email.trim()) {
//       toast.error('Name and email cannot be empty.');
//       return;
//     }

//     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailPattern.test(profileData.email)) {
//       toast.error('Please enter a valid email address.');
//       return;
//     }

//     try {
//       const token = Cookies.get('token');

//       if (selectedFile) {
//         const uploadResponse = await uploadProfileImage(token, selectedFile);

//         profileData.avatar = uploadResponse.url;
//       }
//       const response = await updateProfileData(token, profileData);
//       toast.success(response.message || 'Profile updated successfully.');
//     } catch (error) {
//       toast.error('Error updating profile.');
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setProfileData({ ...profileData, [name]: value });
//   };

//   const handleFileChange = async (e) => {
//     const file = e.target.files[0];
//     setSelectedFile(file);
//     try {
//       const token = Cookies.get('token');
//       const uploadResponse = await uploadProfileImage(token, file);
//       // Assuming uploadResponse contains the URL of the uploaded image
//       const updatedAvatar = uploadResponse.data; // Extracting the data field from the response
//       const updatedProfileData = { ...profileData, avatar: updatedAvatar };
//       setProfileData(updatedProfileData);
//       // Save the avatar URL to local storage
//       localStorage.setItem('avatar', updatedAvatar);
//       toast.success(
//         uploadResponse.message || 'Profile Pic uploaded successfully.'
//       );
//     } catch (error) {
//       console.error('Error uploading profile image:', error);
//       toast.error('Error uploading profile image.');
//     }
//   };

//   return (
//     <div className="containerCard">
//       <div className="text-center mb-5">
//         <h1 className="text-dark">
//           <b className="text-primary">SuperAdmin</b> Profile
//         </h1>
//         <p className="sec-icon fs-3">
//           <FaDiamond className="text-dark" />
//         </p>
//       </div>
//       <div class="row align-item-center d-flex justify-content-center mb-3">
//         <div class="container-1 col-md-6 col-lg-6 col-12">
//           <div class=" text-center">
//             <div class="profile-pic">
//               <label class="-label" for="file">
//                 <span class="glyphicon glyphicon-camera"></span>
//                 <span>Change Image</span>
//               </label>
//               <input
//                 id="file"
//                 type="file"
//                 onChange={handleFileChange}
//                 className="imgChange"
//               />
//               <img
//                 className="changeProfile"
//                 id="output"
//                 src={profileData.avatar}
//                 width="200"
//                 alt="Profile Avatar"
//               />
//             </div>
//             <h5 className="my-3 text-white">{profileData.name}</h5>
//             <p className="mb-1 text-white">{profileData.email}</p>
//           </div>
//         </div>
//         <div class="container-2 col-12  col-md-6 col-lg-6">
//           <form className="w-100">
//             <div class="form-group groupInputProfile mb-3 p-2">
//               <label for="labelProfile">Name</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="exampleInputPassword1"
//                 name="name"
//                 value={profileData.name}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <div class="form-group groupInputProfile mb-3 p-2">
//               <label for="exampleInputEmail1 mb-2">Email address</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="exampleInputEmail1"
//                 aria-describedby="emailHelp"
//                 name="email"
//                 value={profileData.email}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <button
//               type="button"
//               className="btn btn-primary"
//               onClick={handleUpdateProfile}
//             >
//               Update Profile
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProfileSupAdmin;

import React, { useState, useEffect } from 'react';
import './ProfileSupAdmin.css';
import {
  fetchProfileData,
  updateProfileData,
  uploadProfileImage,
} from '../Api/Auth_api';
import Cookies from 'js-cookie';
import { FaDiamond } from 'react-icons/fa6';
import { toast } from 'react-toastify';

function ProfileSupAdmin() {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    avatar: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedAvatar, setUploadedAvatar] = useState('');

  useEffect(() => {
    const token = Cookies.get('token');
    const fetchData = async () => {
      try {
        const data = await fetchProfileData(token);
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchData();
  }, []);

  const handleUpdateProfile = async () => {
    if (!profileData.name.trim() || !profileData.email.trim()) {
      toast.error('Name and email cannot be empty.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(profileData.email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    try {
      const token = Cookies.get('token');

      let avatarUrl = profileData.avatar;

      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);
        const uploadResponse = await uploadProfileImage(formData);
        avatarUrl = uploadResponse.data.data;
        console.log('object', uploadResponse);
      }

      const response = await updateProfileData(token, {
        name: profileData.name,
        email: profileData.email,
        avatar: avatarUrl,
      });

      toast.success(response.message || 'Profile updated successfully.');
    } catch (error) {
      toast.error('Error updating profile.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  return (
    <div className="containerCard">
      <div className="text-center mb-5">
        <h1 className="text-dark">
          <b className="text-primary">SuperAdmin</b> Profile
        </h1>
        <p className="sec-icon fs-3">
          <FaDiamond className="text-dark" />
        </p>
      </div>
      <div className="row align-item-center d-flex justify-content-center mb-3">
        <div className="container-1 col-md-6 col-lg-6 col-12">
          <div className=" text-center">
            <div className="profile-pic">
              <label className="-label" htmlFor="file">
                <span className="glyphicon glyphicon-camera"></span>
                <span>Change Image</span>
              </label>
              <input
                id="file"
                type="file"
                onChange={handleFileChange}
                className="imgChange"
              />
              <img
                className="changeProfile"
                id="output"
                src={profileData.avatar}
                width="200"
                alt="Profile Avatar"
              />
            </div>
            <h5 className="my-3 text-white">{profileData.name}</h5>
            <p className="mb-1 text-white">{profileData.email}</p>
          </div>
        </div>
        <div className="container-2 col-12 col-md-6 col-lg-6">
          <form className="w-100">
            <div className="form-group groupInputProfile mb-3 p-2">
              <label htmlFor="labelProfile">Name</label>
              <input
                type="text"
                className="form-control"
                id="exampleInputPassword1"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group groupInputProfile mb-3 p-2">
              <label htmlFor="exampleInputEmail1 mb-2">Email address</label>
              <input
                type="text"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleUpdateProfile}
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfileSupAdmin;
