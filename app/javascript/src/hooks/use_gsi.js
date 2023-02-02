import React, { useEffect } from 'react';
import { api } from '../api';
export const clientId = '1024626087417-qk8ggas3c5d0414i9ghptenrs6toipkv.apps.googleusercontent.com';


export function callback(res) {
	console.log(res)
	api.googleLogin(res);
};

export function useGsi() {

	useEffect(() => {
		google.accounts.id.initialize({
			client_id: clientId,
			callback,
		});

		google.accounts.id.prompt(notification => {
			console.log(notification)
		});
	}, []);
	
};
