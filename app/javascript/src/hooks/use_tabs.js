import React, { useEffect } from 'react';

export default function useTabs(var) {
	useEffect(() => {

	    const changeTab = () => {

	        const wire = window.location.pathname.split('/');
	        const path = wire[wire.length - 1];
	        if (path) api.store.reduce({
	            type: 'set_list_index',
	            listType: path,
	        });
	        window.removeEventListener('popstate', changeTab);

	    }

	    window.addEventListener('popstate', changeTab);

	    () => window.removeEventListener('popstate', changeTab);

	}, [state.listIndex]);
}