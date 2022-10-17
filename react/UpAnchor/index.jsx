import React from 'react';
import icon from '../../assets/icons/UpArrow.svg'
import './index.global.css'
// import { Container } from './styles';

function UpAnchor() {
    return (
        <a className='MobileUpAnchor' href='#top'>
            <img src={icon} alt="Arrow" />
        </a>
    );
}

export default UpAnchor;