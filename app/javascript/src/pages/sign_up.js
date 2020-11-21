import React, { useContext, useState } from 'react';
import { PasswordConditions, Form } from '../components';
import Context from '../context';
import Logo from '../assets/logo.png';
import { userParams } from '../params';

const SignUp = ({ match }) => {
    
    const { token } = match.params;
    const { api } = useContext(Context);

    const [password, setPassword] = useState('');
    const [passwordCopy, setPasswordCopy] = useState('');

    function onSubmit(params) {        
        if (PasswordConditions.allConditionsPass(password, passwordCopy)) {
            params.password = password;
            api.createUser(params);
        }
    }

    return(
        <div className="auth-container" >
            <img 
                className="auth-logo"
                src={Logo} 
                alt="Lyrn List Logo" 
            />
            <Form
                onSubmit={onSubmit}
                submitCopy="Sign up"
                type="login"
                col="12"
                inputs={userParams()}
            >
                <div className="col-md-12">
                    <div className="input-primary">
                        <label>New Password</label>
                        <input 
                            value={password} 
                            onChange={({ target }) => setPassword(target.value)} 
                            type="password"
                        />
                    </div>
                    <div className="input-primary">
                        <label>Verify Password</label>
                        <input 
                            value={passwordCopy} 
                            onChange={({ target }) => setPasswordCopy(target.value)} 
                            type="password"
                        />
                    </div>
                    <PasswordConditions password={password} passwordCopy={passwordCopy} />
                </div>
            </Form>
        </div>
    )
}

export default SignUp;