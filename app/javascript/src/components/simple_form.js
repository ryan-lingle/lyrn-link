import React, { useRef } from 'react';
import { parseInputValues } from '../utils';

const SimpleForm = ({ id, onSubmit, type, children, submit, submitCopy="Submit", _ref_, style, className }) => {
	const form = useRef();

	function handleSubmit(e) {
		e.preventDefault();
		const formData = new FormData(_ref_ ? _ref_.current : form.current);
		let params = {};
		for (let pair of formData.entries()) {
			params[pair[0]] = pair[1];
		};
		return onSubmit(parseInputValues(params));
	};

	return(
		<form id={id} onSubmit={handleSubmit} ref={_ref_ || form} style={style} className={className} >
			{children}
            {
            	submit &&
            	<input
                    className="btn-block"
                    type="submit"
                    value={submitCopy}
                />
           	}
		</form>
	);
};

export default SimpleForm;