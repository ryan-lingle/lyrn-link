import React, { useState, useContext } from 'react';
import { NewList, ListTab } from '../components';
import Context from '../context';

const Admin = () => {
    const { state } = useContext(Context);
    
    return(
        <div>
            <div className="card-wrapper new-list">
                {state.user.lists.map((list, i) =>
                    <ListTab {...list} key={i} />
                )}
                <NewList />
            </div>
        </div>
    );
};

export default Admin;