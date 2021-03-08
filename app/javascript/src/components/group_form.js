import React from 'react';
import { Form } from '../components';

const GroupForm = () => {
	return(
		<Form
		    onSubmit="createGroup"
		    submitCopy="Create Group"
		    type="create_group"
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