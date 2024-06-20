
import { useEffect } from 'react';

const CryptoScript = () => {
    
useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://prime.altubots.com/tag/mercadaodosoculos/a616e99fcc304320b43f2c76/tag.js';
    document.head.appendChild(script);
    }, []);

  return null
}

export default CryptoScript