import React, { useContext, useState } from 'react';
import Context from '../context';
import Logo from '../assets/lyrnlinkblack.svg';
import { ErrorBox, Form, PasswordConditions } from '../components';
import { clientId, useGsi, callback } from '../hooks/use_gsi';
window.callback = callback;

const Login = ({ location }) => {
    const { api, state } = useContext(Context);

    useGsi();
    
    const [password, setPassword] = useState('');
    const [passwordCopy, setPasswordCopy] = useState('');

    async function onSubmit(params) {
        if (PasswordConditions.allConditionsPass(password, passwordCopy)) {
            params.password = password;
            api.createUser(params);
        }
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
                <div className="btn-item auth-button" style={{padding: '10px'}} onClick={() => api.requestToken()}>
                    <i className="fab fa-twitter" style={{marginRight: '10px'}} />
                    Sign In with Twitter
                </div>
                <div id="g_id_onload"
                     data-client_id={clientId}
                     data-callback="callback">
                </div>
                <div
                    style={{
                        width: '100%',
                        padding: '20px',
                        textAlign: 'center',
                    }}
                    className="g_id_signin"
                    data-type="standard"
                ></div>
                <hr/>

                <div className="auth-description main-heading">
                    Or Sign Up with Email
                </div>
                <Form
                    onSubmit={onSubmit}
                    submitCopy="Sign Up"
                    type="login"
                    col="12"
                    inputs={[
                        {
                            label: 'Name',
                            type: 'text',
                            key: 'name',
                            placeholder: 'Benjamin Franklin'
                        },
                        {
                            label: 'Link',
                            type: 'text',
                            key: 'handle',
                            placeholder: '/MrElectric'
                        },
                        {
                            label: 'Email',
                            type: 'email',
                            key: 'email',
                            placeholder: 'benjamin@junto.club'
                        }
                    ]}
                >
                    <div className="col-md-12">
                        <div className="input-primary">
                            <label>Password</label>
                            <input 
                                value={password}
                                onChange={({ target }) => setPassword(target.value)} 
                                type="password"
                                placeholder="password"
                            />
                        </div>
                        <div className="input-primary">
                            <label>Verify Password</label>
                            <input 
                                value={passwordCopy}  
                                onChange={({ target }) => setPasswordCopy(target.value)} 
                                type="password"
                                placeholder="password"
                            />
                        </div>
                        <PasswordConditions password={password} passwordCopy={passwordCopy} />
                    </div>
                </Form>
                <hr/>
                <div className="auth-footing main-body">
                    By signing up for lyrnlink, you agree to our <a href="https://www.lyrn.link/privacy">Privacy Poloicy</a> and <a href="https://www.lyrn.link/terms">Terms of Use</a>. We won't post anything to twitter without your permission.
                </div>
            </div>
            <div style={{margin: '15px'}}>
                Already got a lyrnlink? <a className="underline" href="/signin">Sign In</a>
            </div>
        </div>
    )
}

export default Login;