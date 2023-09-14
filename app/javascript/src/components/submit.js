import React from 'react';
import BtnSpinner from './btn_spinner.js';
import { withStuff } from  '../hocs';

const Submit = ({ copy, loading, type, style, className="btn-black", state }) => {
    loading = loading || state.loading[type];

    if (loading) return <BtnSpinner style={style} className={className} />;

    return(
        <input
            className={className}
            type="submit"
            value={copy}
            style={style}
        />
    );
}

export default withStuff(Submit, {
    state: true,
});