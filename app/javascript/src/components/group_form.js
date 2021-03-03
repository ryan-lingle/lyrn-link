import React from 'react';
import { Form } from '../components';

const GroupForm = ({ onSubmit }) => {
	return(
		<Form
		    onSubmit={onSubmit}
		    submitCopy="Create Group"
		    type="groups"
		    inputs={[
		        {
		            label: 'Group Name',
		            key: 'name',
		            type: 'text',
		        },
		        {
		            label: 'Group Description',
		            key: 'description',
		            type: 'text',
		        },
		    ]}
		/>
	);
};

export default GroupForm;