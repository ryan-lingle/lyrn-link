import React, { useEffect, useContext } from 'react';
import { Loader, ErrorBox, Table } from '../components';
import Context from '../context';

const schema = {
	name: {
		textAlign: 'left',
		bold: true,
	},
	link: {
		textAlign: 'right',
		children: ({ datum }) => <a href={datum.link}>{datum.link}</a>,
	},
}

const Users = () => {
	const { state, api } = useContext(Context);

	useEffect(() => {
		api.getUsers();
	}, []);

	const loading = state.loading.users;
	const error = state.errors.users;

	if (loading) return <Loader />;
	if (error) return <ErrorBox error={error} />;

	return(
		<div className="container">
			<div className="card text-center" style={{marginTop: '50px', padding: '20px'}} >
				<div className="big-heading">COUNT: {state.userCount}</div>
			</div>
			<Table
				schema={schema}
				data={state.users}
			/>
		</div>
	);
};

export default Users;