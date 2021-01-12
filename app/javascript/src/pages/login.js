import React, { useContext, useRef } from 'react';
import Context from '../context';
import Logo from '../assets/logo.png';
import { ErrorBox, Form } from '../components';

const Login = ({ location }) => {
    const { api, state } = useContext(Context);

    const loading = state.loading.login;
    const error = state.errors.login;

    return(
        <div className="auth-container" >
            <img 
                className="auth-logo"
                src={Logo} 
                alt="lyrn list logo" 
            />
            <div className="auth-heading">
                <div className="big-heading">
                    The #1 spot to share your learning
                </div>
            </div>
            <div className="auth-card">
                <ErrorBox error={error} />
                <div className="btn-item auth-button" onClick={() => api.requestToken()}>
                    <i className="fab fa-twitter" style={{marginRight: '10px'}} />
                    Sign in with Twitter
                </div>
                <hr/>
                <div className="auth-description main-heading">
                    Or Sign In with Email
                </div>
                <Form
                    onSubmit={api.login}
                    submitCopy="Sign In"
                    type="login"
                    col="12"
                    inputs={[
                        {
                            label: 'Email',
                            type: 'email',
                            key: 'email',
                            placeholder: 'ben@electricity.co'
                        },
                        {
                            label: 'Password',
                            type: 'password',
                            key: 'password'
                        }
                    ]}
                />
                <div className="auth-button main-body">
                    Remember, we won't post anything to Twitter without your permission.
                </div>
            </div>
            <div className="auth-footing">
                <div className="little-body" style={{marginTop: '15px'}}>
                        Don't have a lyrnlink yet? <a href="/signup">Sign Up</a>
                </div>
            </div>


        </div>
    )
}

export default Login;