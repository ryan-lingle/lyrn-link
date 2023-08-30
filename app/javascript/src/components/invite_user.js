import React, { useContext, useState } from 'react';
import { Search, ItemCard, ErrorBox, SuccessBox } from '../components';
import Context from '../context';

const InviteUser = () => {
	const { api, state } = useContext(Context);
    const [term, setTerm] = useState();

    function bottom(clearResults) {
        if (term?.includes('@')) {
            return(
                <div
                    onClick={() => {
                        api.createGroupInvite({
                            group_id: state.group.id,
                            email: term
                        });
                        setTerm('');
                        clearResults();
                    }}
                    className="search-item"
                    style={{padding: '10px'}}
                >
                    Invite <strong>{term}</strong> by email
                </div>
            );
        } else {
            return;
        }
    };

	return(
        <div>
            <SuccessBox success={state.success.group_relationship} />
            <ErrorBox error={state.errors.group_relationship} />
    		<Search 
                type='users'
                placeholder='Search for a user to invite or type in an email...'
                search={({ term, length }) => {
                    api.userSearch(term, length)
                }}
                onChange={term => setTerm(term)}
                bottom={bottom}
                fetchMore={false}
            >
            	{(result, clearResults, input) =>
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