import React from 'react';

export {default as observer} from './observer.js';

export function parseQuery(queryString) {
    if (queryString) {
        const paramStrings = queryString.substring(1).split('&');
        return paramStrings.reduce((params, paramString) => {
            const [key, value] = paramString.split('=');
            params[key] = value;
            return params;
        }, {});
    } else {
        return {};
    }
}

export function capitalize(string="") {
    if (Array.isArray(string)) {
        return string.map(s => capitalize(s));
    } else {
        const split = string.split('');
        split[0] = split[0].toUpperCase();
        return split.join('');
    };
}


export function parseInputValues(params) {
	return Object.keys(params).reduce((np, key) => {
		const split = key.split('.');
		const v = params[key];
		split.reduce((_np_, s, i) => {
			if (!Number.isNaN(parseInt(s)))
				s = parseInt(s);
			// if last item of split, set param
			if (split.length === i +  1) {
				_np_[s] = v;
			} else {
				const inSet = !Number.isNaN(parseInt(split[i + 1]));
				_np_[s] =  _np_[s] || (inSet ? [] : {});
			}
			return _np_[s];
		}, np);
		return np;
	}, {});
};

