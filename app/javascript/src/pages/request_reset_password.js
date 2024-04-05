import React, { useState } from 'react';
import Logo from '../assets/logo.png';
import { Form } from '../components';
import { withStuff } from '../hocs';

const RequestResetPasssword = ({ api }) => {
    const [success, setSuccess] = useState(false);
    const [email, setEmail] = useState()

    async function handleSubmit({ email }) {
        const res = await api.requestResetPassword(email);

        if (res) {
            setEmail(email);
            setSuccess(true);
        }
    };


    return(
        <div className="font-move auth-container">
            <img 
                className="auth-logo mx-auto"
                src={Logo} 
                alt="Lyrnlink Logo" 
            />
            {
                success

                ?   <div className="rounded p-3 bg-move-gray-light text-left mt-4">
                        <div className="text-lg font-bold mb-3">Check your email</div>
                        <p>
                            We've sent an email to <strong>{email}</strong> with a link that you can use to set your password.
                            <br />
                            If you don’t see an email from us in a few minutes, check your spam.
                        </p>
                    </div>
                
                :   <>
                        <h2 className='text-lg font-bold mt-4'>Reset Password</h2>
                        <p>Enter an email address to reset password</p>
                        <Form
                            onSubmit={handleSubmit}
                            submitCopy="Send Email"
                            type="reset_password"
                            col="12"
                            inputs={[
                                {
                                    label: 'Email',
                                    type: 'email',
                                    key: 'email',
                                }
                            ]}
                        />
                    </>
            }
        </div>
    )
};

export default withStuff(RequestResetPasssword, {
    api: true,
});