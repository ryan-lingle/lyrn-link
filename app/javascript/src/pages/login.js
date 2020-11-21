import React, { useContext, useRef } from 'react';
import Context from '../context';
import Logo from '../assets/logo.png';
import { Submit, ErrorBox } from '../components';
// import '../style/auth.css';

const Login = ({ location }) => {
    const { api, state } = useContext(Context);
    const email = useRef();
    const password = useRef();

    

    async function handleSignUp(e) {
        e.preventDefault();
        api.login({
            email: email.current.value,
            password: password.current.value,
        }, location.state && location.state.from);
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
            <form 
                style={{
                    width: '100%',
                }}
                onSubmit={handleSignUp} 
            >
                <div className="input-primary">
                    <label>Email</label>
                    <input ref={email} type="email"/>
                </div>
                <div className="input-primary">
                    <label>Password</label>
                    <input ref={password} type="password"/>
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: '15px',
                }}>
                    <a
                        className="btn-soft"
                        href="reset_password"
                        style={{
                            flexGrow: 1,
                            textAlign: 'left',
                            marginRight: '10px',
                            fontSize: 'xx-small',
                        }}
                    >
                        <i class="fas fa-question-circle"></i>
                        &nbsp;
                        Oops, I forgot my password.
                    </a>
                    <Submit
                        copy="Login"
                        loading={loading}
                    />
                </div>
            </form>
        </div>
    )
}

export default Login;