import React from 'react';
import Spinner from '../assets/animation.gif';

const Loader = () => (
    <div style={{ textAlign: 'center' }} className="spinner" >
        <img src={Spinner} alt="loading" />
    </div>
);

export default Loader;