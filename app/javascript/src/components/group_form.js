import React, { useContext } from 'react';
import { Form } from '../components';
import Context from '../context';

const GroupForm = ({ onSubmit }) => {
	const { api } = useContext(Context);

	async function handleSubmit(params) {
		await api.createGroup(params);
		onSubmit();
	};

	return(
		<Form
		    onSubmit={handleSubmit}
		    submitCopy="Create Group"
		    type="create_group"
		    col="12"
		    inputs={[
		        {
		            label: 'Group Name',
		            key: 'name',
		            type: 'text',
		            col: '12'
		        },
		        {
		            label: 'Group Description',
		            key: 'description',
		            type: 'textarea',
		            col: '12',
		            rows: '10'
		        },
		    ]}
		/>
	);
};

export default GroupForm;