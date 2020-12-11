import React, { useContext, useRef } from 'react';
import Context from '../context';
import Logo from '../assets/logo.png';
import { ErrorBox } from '../components';

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
                            Welcome Back!
                    </div>
                    <div className="main-heading">
                        Sign in to edit your lyrnlink
                    </div>
                </div>
                <div className="btn-item auth-button" onClick={() => api.requestToken()}>
                    <i className="fab fa-twitter" style={{marginRight: '5px'}} />
                    Sign in with Twitter
                </div>
            </div>
            <div className="auth-heading">
                <div className="little-body">
                        Don't have a lyrnlink yet? <a href="/signup">Sign Up</a>
                </div>
            </div>
        </div>
    )
}

export default Login;