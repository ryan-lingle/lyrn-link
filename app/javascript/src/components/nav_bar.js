import React, { useEffect, useContext, useState } from 'react';
import Logo from '../assets/whitelogo.svg';
import Context from '../context';

const NavBar = ({ location }) => {
    const { api, state } = useContext(Context);
    const [showHam, setShowHam] = useState(false);
    const isLoggedIn = state.current_user_id ? 1 : 0;

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
                    <a href={isLoggedIn ? '/admin' : '/'} >
                        <img 
                            className="nav-logo"
                            src={Logo} 
                            alt="Lyrn Link Logo" 
                        />
                    </a>
                </div>
                {
                    isLoggedIn

                    ?   <div className="nav-profile">
                            {
                                state.current_user_profile_picture

                                ?   <img 
                                        src={state.current_user_profile_picture} 
                                        className="nav-avatar" 
                                        onClick={() => setShowHam(prev => !prev)}
                                    />

                                :   <i 
                                        className="fal fa-user-circle" 
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
                                <a href="/admin" >
                                    <i className="fas fa-link" style={{marginRight: '5px'}} />
                                    My Link
                                </a>
                                <a href="#" onClick={api.signOut} >
                                    <i className="fas fa-sign-out-alt" style={{marginRight: '5px'}} />
                                    Sign Out
                                </a>
                            </div>
                         </div>

                    :   <div className="navlinks">
                            <a href="/signup">
                                Sign Up
                            </a>
                            <a href="/signin">
                                Sign In
                            </a>
                        </div>
                }
                 
            </div>
        </div>
    );
}

export default NavBar;