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
                <div className="auth-heading">
                    <div className="big-heading">
                        Welcome back
                    </div>
                    <div className="tiny-heading">
                        Login to edit your lyrnlink
                    </div>
                </div>
                <ErrorBox error={error} />
                <div className="btn-black" onClick={() => api.requestToken()}>
                    Sign in with Twitter
                </div>
            </div>
        </div>
    )
}

export default Login;