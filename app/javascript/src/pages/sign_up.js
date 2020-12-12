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
            <div className="auth-heading">
                <div className="mega-heading">
                        Sign up for lyrnlink
                </div>
                <div className="big-heading">
                    The #1 spot to share your learning
                </div>
            </div>
            <div className="auth-card">
                <ErrorBox error={error} />
                <div className="auth-description huge-body" style={{fontWeight: 'normal'}}>
                    Currently, we require you to sign up with your <b>Twitter</b> account. The twitter universe lends itself to be a rich community of learners, which bodes well for lyrnlink. Authentication via Twitter allows us to ensure you a seamless onboarding experience.
                </div>
                <div className="btn-item auth-button" onClick={() => api.requestToken()}>
                    <i className="fab fa-twitter" style={{marginRight: '10px'}} />
                    Sign Up with Twitter
                </div>
                <div className="auth-button main-body">
                    We won't post anything to your account without your permission.
                </div>
            </div>
            <div className="auth-footing">
                <div className="tiny-heading">
                        By signing up for lyrnlink, you agree to our Privacy Policy and Terms of Use.
                </div>
                <div className="little-body" style={{marginTop: '15px'}}>
                        Already got a lyrnlink? <a href="/signin">Sign In</a>
                </div>
            </div>
        </div>
    )
}

export default Login;