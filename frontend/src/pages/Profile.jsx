import { useState, useEffect } from "react"
import '../style/profile.css'
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import WeatherCard from "../components/WeatherCard";
import FooterComponents from "../components/FooterComponents";

function Profile(){
    // const {user} = useAuth();
    const { user, setUser } = useAuth();

    if(!user){
        return (
            <div className="profileCard">
                <div className="banner skeleton"></div>
                <div className="profilePicWrap profile-body">
                <div className="avatar-container">
                    <div className="skeleton avatar-skeleton"></div>
                </div>
                <div className="user-info mt-3">
                    <div className="skeleton skeleton-text short"></div>
                    <div className="skeleton skeleton-text"></div>
                    <div className="skeleton skeleton-text"></div>
                    <div className="skeleton skeleton-text long"></div>
                </div>
                </div>
            </div>
        );
    }

    useEffect(() => {
    const fetchUser = async () => {
        try {
        const res = await fetch('https://weather-backend-001h.onrender.com/api/user/profile', {
            headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await res.json();
        setUser(data.user); // assuming you have setUser from context or local state
        } catch (err) {
        console.error('Failed to fetch user:', err);
        }
    };

    fetchUser();
    }, []);

    return(
        <>
            <div className="profileCard row">
                <div className="banner"></div>

                <div className="profilePicWrap profile-body col-10 col-sm-10 col-md-3 col-lg-3">
                    <div className="avatar-container" style={{justifySelf:"center"}}>
                        <img
                        className="profilePic avatar"
                        src={
                            user?.photo
                            // ? `${import.meta.env.VITE_UPLOADS_URL}/${user.photo}`
                            ? `https://weather-backend-001h.onrender.com/uploads/${user.photo}`
                            : 'https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small/profile-icon-design-free-vector.jpg'
                        }
                        alt="Profile-Picture"
                        />
                    </div>

                    <div className="user-info mt-3">
                        <div className="username">{user?.username || 'Guest'}</div>
                        <br />
                        <span>{user?.email}</span>
                        <br />
                        <span>{user?.location}</span>
                        <p className="mt-2">{user?.bio}</p>
                    </div>
                    
                    <div className="profileButtonWrap">
                        <div>
                            <Link to='/profileForm'>
                                <button type="button" className="btn btn-primary">Edit Profile</button>
                            </Link>
                        </div>
                        <div>
                            <Link to='/profileSettings'>
                                <button type='button' className='btn btn-primary'>Settings</button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="weatherComponent col-10 col-sm-10 col-md-7 col-lg-7">
                    <WeatherCard />
                </div>
                <Link to='/favoriteCities' className="favorite-card">
                    <span><i class="bi bi-geo-alt-fill"></i></span>
                    <p>Favorite Cities</p>
                </Link>
            </div>
            <FooterComponents />
        </>
    )
}

export default Profile;