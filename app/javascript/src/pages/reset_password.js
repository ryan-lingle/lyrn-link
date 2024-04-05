import React, { useState } from "react";
import { withStuff } from '../hocs';
import Logo from '../assets/logo.png';
import { PasswordConditions, Form } from "../components";

const ChangePassword = ({ match, api }) => {
  const token = match.params.token
  const [password, setPassword] = useState("");
  const [passwordCopy, setPasswordCopy] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit() {
    if (PasswordConditions.allConditionsPass(password, passwordCopy)) {
      const res = await api.changePassword({
        password,
        token,
      });

      if (res) {
        setSuccess(true);
      }
    }
  }


  return (
    <div className="font-move auth-container">
      <img className="auth-logo" src={Logo} alt="move logo" />
      {
        success

        ?   <div className="rounded p-3 bg-move-green-light text-left mt-4">
                <div className="text-lg font-bold mb-3">Password changed successfully</div>
                <a href="/signin">
                    You can now sign in with your new password.
                </a>
            </div>
        
        :   <>
              <h2 className='text-lg font-bold mt-4'>Reset Password</h2>
              <Form
                onSubmit={handleSubmit}
                submitCopy="Change Password"
                type="reset_password"
                col="12"
              >
                <>
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
                </>
              </Form>
              <div className="mt-4">
                <PasswordConditions password={password} passwordCopy={passwordCopy} />
              </div>
            </>
        }
    </div>
  );
};

export default withStuff(ChangePassword, { api: true });
