import React, { useState, useRef, useEffect } from 'react';

const Editable = ({ readOnly, value, onUpdate, className, defaultValue, textArea=false }) => {
	const input = useRef();
	const form = useRef();
	const [edit, setEdit] = useState(false);

	function handleEdit(e) {
		e.preventDefault();
		setEdit(true);
	};

	function handleUpdate(e) {
		e.preventDefault();
		setEdit(false);
		onUpdate(input.current.value);
	};

	if (!readOnly && edit) {
		return(
			<form onSubmit={handleUpdate} ref={form} >
				<div className="edit-input">
					{
						textArea

						? 	<textarea
								className={className}
								ref={input}
								defaultValue={value}
								autoFocus={true}
								onBlur={handleUpdate}
								style={{width: '100%', maxWidth: '100%'}}
								onKeyPress={(e) => e.which == 13 ? handleUpdate(e) : null}
							/>
						
						: 	<input
								className={className}
								ref={input}
								defaultValue={value}
								autoFocus={true}
								onBlur={handleUpdate}
							/>
					}
				</div>
			</form>
		);
	} else {
		return(
			<div 
				className={(readOnly ? '' : 'editable ') + className}
				onDoubleClick={handleEdit}
			>
				<div>{value || defaultValue}</div>
				<i className="fas fa-pen-square edit-pencil" onClick={handleEdit} />
			</div>
		);
	}
};

export default Editable;