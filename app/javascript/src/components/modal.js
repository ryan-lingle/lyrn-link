import React from 'react';

const Modal = ({ heading, children, show, onClose }) => {
	
	return(
		<div>
			<div 
				id="overlay"
				onClick={onClose}
				style={{display: show ? '' : 'none'}}
			></div>
			<div className="moodal" style={{display: show ? '' : 'none'}} >
				<div className="moodal-heading flex-between">
					<div className="big-heading">
						{heading}
					</div>
					<i className="fa-solid fa-circle-xmark" onClick={onClose} />
				</div>
				<div className="moodal-body">
					{children}
				</div>
			</div>
		</div>
	);
};

export default Modal;