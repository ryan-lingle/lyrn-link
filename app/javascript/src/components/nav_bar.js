import React, { useEffect, useContext, useState } from 'react';
import Logo from '../assets/icon.png';
import Context from '../context';

const NavBar = ({ location }) => {
    const { api, state } = useContext(Context);
    const [showHam, setShowHam] = useState(false);

    function current(path, match=null) {
        if (path == '/') {
            return location.pathname ==  path;
        } else {
            return location.pathname.includes(match || path);
        }
    }

    function username() {
        if (state.user)
            return state.user.username;
    }

    return(
        <div className="nav-bg">
            <div className="nav">
                <div className="nav-logo">
                    <a href="/" >
                        <img 
                            className="nav-logo"
                            src={Logo} 
                            alt="[app name] logo" 
                        />
                    </a>
                </div>
                <div className="navlinks">
                    <a href="/admin" className={current("/") ? "nav-current" : ""}>
                        Admin
                    </a>
                </div>
                <div className="nav-profile">
                    <div className="nav-profile-details" >
                        <div className="nav-name">
                            {username()}
                        </div>
                        <div className="nav-agency">
                        </div>
                    </div>
                    {
                        state.user.profile_picture_url

                        ?   <img 
                                src={state.user.profile_picture_url} 
                                className="nav-avatar" 
                                onClick={() => setShowHam(prev => !prev)}
                            />

                        :   <i 
                                className="far fa-user-circle" 
                                id="default-avatar" 
                                onClick={() => setShowHam(prev => !prev)}
                            />
                    }
                    <div 
                        className="hamburger-menu"
                        style={{
                            display: showHam ? "" : "none",
                        }}
                    >   
                        <a href="/admin" className="mobile-only-link" >Admin</a>
                        <a href="/profile" >
                            Profile
                        </a>
                        <a onClick={() => {
                            localStorage.clear();
                            window.location.href = "/signin";
                        }}>
                            Sign Out</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NavBar;