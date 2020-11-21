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


