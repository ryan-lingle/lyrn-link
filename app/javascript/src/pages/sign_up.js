import React, { useState, useContext, useEffect } from 'react';
import Context from '../context';
import Logo from '../assets/lyrnlinkblack.svg';
import { Loader, ErrorBox, Form, PasswordConditions } from '../components';
import { clientId, useGsi, callback } from '../hooks/use_gsi';
import { parseQuery } from '../utils';
window.callback = callback;

const Login = ({ location, match }) => {
    const { api, state } = useContext(Context);

    useEffect(() => {
        const params = parseQuery(location.search);
        if (params.token)
            localStorage.setItem('token', params.token);

        if (params.g)
            api.getIndexGroup(params.g);
        
    }, []);

    useEffect(() => {
        if (state.group?.id)
            localStorage.setItem('group_id', state.group.id);
    }, [ state.group ]);

    useGsi();
    
    const [password, setPassword] = useState('');
    const [passwordCopy, setPasswordCopy] = useState('');

    async function onSubmit(params) {
        if (PasswordConditions.allConditionsPass(password, passwordCopy)) {
            params.password = password;
            api.createUser(params);
        }
    }

    const error = state.errors.login;

    return(
        <div className="auth-container" >
            <div className="auth-heading">
                {
                    state.group?.image_url &&

                    <img
                        style={{
                            height: '200px',
                            borderRadius: '5px',
                            marginBottom: '5px',
                        }}
                        src={state.group.image_url}
                    />
                }
                <div className="mega-heading">
                    {state.group?.title ? `Join ${state.group.title} on Lyrnlink` : 'Sign up for lyrnlink'}
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