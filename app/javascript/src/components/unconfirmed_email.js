import React, { useContext } from 'react';
import Context from '../context';
import NoItemsUser from '../assets/noitemsuser.png';

const UnconfirmedEmail = ({ email }) => {
    const { api, state } = useContext(Context);

	return(
		<div className="container" >
			<div className="todo-card">
				<img 
                    className="todo-img"
                    src={NoItemsUser} 
                    alt="Lyrn Link No Items" 
                />
				<div className="todo-text">
                    <div className="big-heading">Please confirm your email to continue.</div>
                    <div className="main-heading">We've sent an email to <strong>{state.user.email}</strong>. Please open it and follow its directions to confirm your email address.</div>
                </div>
                <div className="todo-btns">
                    <div className="btn-black" onClick={api.sendConfirmationEmail}>
                        Resend Email
                    </div>
                </div>
			</div>
		</div>
	);
};

export default UnconfirmedEmail;