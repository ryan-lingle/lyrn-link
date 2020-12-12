import React, { useContext, useRef } from 'react';
import Context from '../context';
import Logo from '../assets/logo.png';
import { Submit, ErrorBox } from '../components';

const Login = ({ location }) => {
    const { api, state } = useContext(Context);

    async function loginWithTwitter() {
        api.request
    }

    const loading = state.loading.login;
    const error = state.errors.login;

    return(
        <div className="auth-container" >
            <img 
                className="auth-logo"
                src={Logo} 
                alt="lyrn list logo" 
            />
            <div className="auth-card">
                <ErrorBox error={error} />
                <div className="auth-heading">
                    <div className="big-heading">
                            Sign up for Lyrnliink!
                    </div>
                    <div className="main-heading">
                        #1 place to share where you learn
                    </div>
                </div>
                <div className="btn-item auth-button" onClick={() => api.requestToken()}>
                    <i className="fab fa-twitter" style={{marginRight: '5px'}} />
                    Sign in with Twitter
                </div>
                <div className="tiny-heading">
                        By signing up for lyrnlink, you agree to our Privacy Policy and Terms of Use.
                </div>
            </div>
            <div className="auth-heading">
                <div className="little-body">
                        Already got a lyrnlink? <a href="/signin">Sign In</a>
                </div>
            </div>
        </div>
    )
}

export default Login;