import React, { useState, useRef } from 'react';

const Editable = ({ readOnly, value, onUpdate, className }) => {
	const input = useRef();
	const [edit, setEdit] = useState(false);

	function handleUpdate(e) {
		e.preventDefault();
		setEdit(false);
		onUpdate(input.current.value);
	};

	if (!readOnly && edit) {
		return(
			<form onSubmit={handleUpdate}>
				<input
					className={className}
					ref={input}
					defaultValue={value}
					onBlur={handleUpdate}
				/>
			</form>
		);
	} else {
		return(
			<div 
				className={className}
				onDoubleClick={(e) => { e.preventDefault(); setEdit(true); }}
			>
				{value}
			</div>
		);
	}
};

export default Editable;