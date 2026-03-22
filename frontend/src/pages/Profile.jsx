// import { useState, useEffect } from "react";
// import '../style/profile.css';
// import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import WeatherCard from "../components/WeatherCard";
// import FooterComponents from "../components/FooterComponents";

// function Profile(){
//   const { user, setUser } = useAuth();
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await fetch('https://weather-backend-001h.onrender.com/api/user/me', {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         });

//         if (!res.ok) {
//           throw new Error(`Server responded with ${res.status}`);
//         }

//         const data = await res.json();
//         setUser(data.user);
//       } catch (err) {
//         console.error('Failed to fetch user:', err);
//         setError('⚠️ Unable to load profile. Please check your connection or try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, [setUser]);

//   // Show skeletons while loading
//   if (loading && !error && !user) {
//     return (
//       <div className="profileCard">
//         <div className="banner skeleton"></div>
//         <div className="profilePicWrap profile-body">
//           <div className="avatar-container">
//             <div className="skeleton avatar-skeleton"></div>
//           </div>
//           <div className="user-info mt-3">
//             <div className="skeleton skeleton-text short"></div>
//             <div className="skeleton skeleton-text"></div>
//             <div className="skeleton skeleton-text"></div>
//             <div className="skeleton skeleton-text long"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Show error if fetch fails
//   if (error) {
//     return (
//       <div className="profileCard">
//         <p className="error-message">{error}</p>
//         <button onClick={() => window.location.reload()} className="btn btn-warning">
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="profileCard row">
//         <div className="banner"></div>

//         <div className="profilePicWrap profile-body col-10 col-sm-10 col-md-3 col-lg-3">
//           <div className="avatar-container" style={{justifySelf:"center"}}>
//             <img
//               className="profilePic avatar"
//               src={
//                 user?.photo
//                   ? `https://weather-backend-001h.onrender.com/uploads/${user.photo}`
//                   : 'https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small/profile-icon-design-free-vector.jpg'
//               }
//               alt="Profile-Picture"
//             />
//           </div>

//           <div className="user-info mt-3">
//             <div className="username">{user?.username || 'Guest'}</div>
//             <br />
//             <span>{user?.email}</span>
//             <br />
//             <span>{user?.location}</span>
//             <p className="mt-2">{user?.bio}</p>
//           </div>
          
//           <div className="profileButtonWrap">
//             <div>
//               <Link to='/profileForm'>
//                 <button type="button" className="btn btn-primary" disabled>Edit Profile</button>
//               </Link>
//             </div>
//             <div>
//               <Link to='/profileSettings'>
//                 <button type='button' className='btn btn-primary' disabled>Settings</button>
//               </Link>
//             </div>
//           </div>
//         </div>

//         <div className="weatherComponent col-10 col-sm-10 col-md-7 col-lg-7">
//           <WeatherCard />
//         </div>

//         <Link to='/favoriteCities' className="favorite-card">
//           <span><i className="bi bi-geo-alt-fill"></i></span>
//           <p>Favorite Cities</p>
//         </Link>
//       </div>
//       <FooterComponents />
//     </>
//   );
// }

// export default Profile;





import { useState } from "react";
import '../style/profile.css';
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import WeatherCard from "../components/WeatherCard";
import FooterComponents from "../components/FooterComponents";

function Profile(){
  const { user } = useAuth();

  // Default guest fallback
  const guestUser = {
    username: "Guest",
    email: "",
    location: "",
    bio: "",
    photo: null
  };

  const displayUser = user || guestUser;

  return (
    <>
      <div className="profileCard row">
        <div className="banner"></div>

        <div className="profilePicWrap profile-body col-10 col-sm-10 col-md-3 col-lg-3">
          <div className="avatar-container" style={{justifySelf:"center"}}>
            <img
              className="profilePic avatar"
              src={
                displayUser.photo
                  ? `https://weather-backend-001h.onrender.com/uploads/${displayUser.photo}`
                  : 'https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small/profile-icon-design-free-vector.jpg'
              }
              alt="Profile-Picture"
            />
          </div>

          <div className="user-info mt-3">
            <div className="username">{displayUser.username}</div>
            <br />
            <span>{displayUser.email}</span>
            <br />
            <span>{displayUser.location}</span>
            <p className="mt-2">{displayUser.bio}</p>
          </div>
          
          <div className="profileButtonWrap">
            <div>
              <Link to='/profileForm' style={{cursor:'no-drop'}}>
                <button type="button" className="btn btn-primary" disabled>Edit Profile</button>
              </Link>
            </div>
            <div>
              <Link to='/profileSettings' style={{cursor:'no-drop'}}>
                <button type='button' className='btn btn-primary' disabled>Settings</button>
              </Link>
            </div>
          </div>
        </div>

        <div className="weatherComponent col-10 col-sm-10 col-md-7 col-lg-7">
          <WeatherCard />
        </div>

        <Link to='/favoriteCities' className="favorite-card">
          <span><i className="bi bi-geo-alt-fill"></i></span>
          <p>Favorite Cities</p>
        </Link>
      </div>
      <FooterComponents />
    </>
  );
}

export default Profile;