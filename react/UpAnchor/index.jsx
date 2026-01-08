import React from 'react';
import icon from '../../assets/icons/UpArrow.svg'
import './index.global.css'

function UpAnchor() {
    return (
        <a className='MobileUpAnchor' href='#top'>
            <img src={icon} alt="Arrow" />
        </a>
    );
}

export default UpAnchor;