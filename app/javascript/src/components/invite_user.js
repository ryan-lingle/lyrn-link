import React, { useContext } from 'react';
import { Search, ItemCard, ErrorBox } from '../components';
import Context from '../context';

const InviteUser = () => {
	const { api, state } = useContext(Context);

	return(
        <div>
            <ErrorBox error={state.errors.group_relationship} />
    		<Search 
                type='users'
                placeholder='Search for a user to invite...'
                search={(_, term, length) => api.userSearch(term, length)}
                fetchMore={false}
            >
            	{(result, clearResults) =>
            		<div onClick={() => {
                        api.createGroupRelationship({
                        	group_id: state.group.id,
                        	user_id: result.id,
                        	accepted: false,
                        });
                        clearResults();
                    }} >
                        <ItemCard
                            readOnly={true}
                            rank={false}
                            searchResult={true}
                            {...result}
                        />
                    </div>
            	}
            </Search>
        </div>
	);
};

export default InviteUser;