import React, {useEffect, useRef} from 'react';

// import { Container } from './styles';

function Reclameaq() {
    const scriptRef = useRef(null)
    useEffect(()=>{
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.id = 'ra-embed-reputation';
        script.src = 'https://s3.amazonaws.com/raichu-beta/selos/bundle.js';
        script.async = true
        script['data-id'] = "LVd2bGl1QlhZdjVVR3VrQzpiaW9zdGV2aQ=="
        script['data-target'] = "reputation-ra"
        script['data-model'] = "2" 
        scriptRef.current.appendChild(script);
    },[])
    return (
        <div style={{position:'relative', left: '15px', paddingTop:'7px'}} id="reputation-ra" ref={scriptRef}>
            <script type="text/javascript" id="ra-embed-reputation" src="https://s3.amazonaws.com/raichu-beta/selos/bundle.js" data-id="LVd2bGl1QlhZdjVVR3VrQzpiaW9zdGV2aQ==" data-target="reputation-ra" data-model="2"></script>
        </div>
    );
}

export { Reclameaq };