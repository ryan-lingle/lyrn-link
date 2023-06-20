import React from 'react';
import Spinner from '../assets/spinner.svg';

const Loader = () => (
    <div style={{ textAlign: 'center' }} className="spinner" >
        <div><img src={Spinner} alt="loading" className='m-auto'/></div>
        <div className="huge-heading" style={{fontWeight:'bold'}}>Hold tight. We're turning the page...</div>
    </div>
);

export default Loader;