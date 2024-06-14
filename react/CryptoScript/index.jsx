
import { useEffect } from 'react';

const CryptoScript = () => {
    console.log("first")
    
useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js';
    document.head.appendChild(script);
    }, []);

  return null
}

export default CryptoScript