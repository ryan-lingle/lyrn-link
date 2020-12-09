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
            <ErrorBox error={error} />
            <div onClick={() => api.requestToken()} className="btn">
                Sign in with Twitter
            </div>
        </div>
    )
}

export default Login;