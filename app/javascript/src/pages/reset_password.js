import React, { useRef, useState, useContext } from 'react';
import Context from '../context';
import Logo from '../assets/logo.png';
import { Submit, ErrorBox } from '../components';
// import '../style/auth.css';

const ResetPassword = () => {
    const email = useRef();
    const [sent, setSent] = useState(false);
    const { api, state } = useContext(Context);

    async function handleSubmit(e) {
        e.preventDefault();
        const res = await api.createPasswordReset(email.current.value);
        if (res) setSent(res.success);
    }

    const loading = state.loading.login;
    const error = state.errors.login;
    
    return(
        <div className="auth-container" >
            <img 
                className="auth-logo"
                src={Logo} 
                alt="Lyrn Link Logo" 
            />
            <ErrorBox error={error} />
            {
                sent

                ?

                    <div>
                        <div className="b-copy">
                            Password Reset Sent
                        </div>
                        <div className="p-copy">
                            A password reset link was sent to the email, {email.current.value}.
                        </div>
                        <br/>
                        <div className="p-copy">
                            If you don’t see it in a couple of minutes, check your spam forlder. It was sent from noreply@lyrn.link. 
                        </div>
                        <a
                            href="login"
                            className="primary-btn"
                            style={{
                                marginTop: '15px',
                                float: 'right',
                            }}
                        >
                            Back to Login
                        </a>
                    </div>


                :   <div>
                        <div className="b-copy">
                            Forgot your password?
                        </div>
                        <div className="p-copy">
                            Please enter your account’s email address and we’ll send you a secure link to reset your password.
                        </div>
                        <form 
                            onSubmit={handleSubmit} 
                        >
                            <div className="input-primary">
                                <label>Email</label>
                                <input 
                                    ref={email} 
                                    type="email"
                                />
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginTop: '15px',
                            }}>
                                <a 
                                    href="login" 
                                    className="btn-soft"
                                    style={{
                                        flexGrow: 1,
                                        textAlign: 'right',
                                        marginRight: '10px',
                                    }}
                                >
                                    Back to login
                                </a>
                                <Submit copy="Reset" loading={loading} />
                            </div>
                        </form>
                    </div>
            }
            
        </div>
    )

}

export default ResetPassword;