import React, { useEffect, useContext, useState } from 'react';
import Logo from '../assets/logo.png';
import Context from '../context';

const NavBar = ({ location }) => {
    const { state } = useContext(Context);
    const [showHam, setShowHam] = useState(false);
    const isLoggedIn = localStorage.getItem('authToken') ? 1 : 0;

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
        <div className="nav-bg fixed-top">
            <div className="nav flex-between">
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
                    {
                        isLoggedIn

                            ?   <a href="/admin">
                                    Admin
                                </a>

                            :   <a href="/signup">
                                    Sign Up
                                </a>
                    }
                </div>
            </div>
        </div>
    );
}

export default NavBar;