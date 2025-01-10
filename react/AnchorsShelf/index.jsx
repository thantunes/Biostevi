import React, { useEffect, useState } from 'react';
import './index.global.css';

function AnchorsShelf() {
    const [shelf2, setShelf2] = useState(false);
    const [shelf3, setShelf3] = useState(false);
    
    useEffect(() => {
        const checkShelf2 = () => {
            const shelf2Element = document.querySelector('#performa2');
            if (shelf2Element && shelf2Element.children.length > 0) {
                setShelf2(true);
            } else {
                setTimeout(checkShelf2, 100);
            }
        };
        const checkShelf3 = () => {
            const shelf3Element = document.querySelector('#performa3');
            if (shelf3Element && shelf3Element.children.length > 0) {
                setShelf3(true);
            } else {
                setTimeout(checkShelf3, 100);
            }
        };
        if(!shelf2) checkShelf2();
        if(!shelf3) checkShelf3();
    }, []);

    return (
        <div className={"AnchorsShelfContainer"}>
            {shelf2 && <div style={{width: "20%", maxWidth: "20%"}}>
                <a href="#performa2" class="vtex-store-link-0-x-link vtex-store-link-0-x-link--PDPAnchor">
                    <span class="vtex-store-link-0-x-label vtex-store-link-0-x-label--PDPAnchor">Mais Vendidos</span>
                </a>
            </div>}
            {shelf3 && <div style={{width: "20%", maxWidth: "20%"}}>
                <a href="#performa3" class="vtex-store-link-0-x-link vtex-store-link-0-x-link--PDPAnchor">
                    <span class="vtex-store-link-0-x-label vtex-store-link-0-x-label--PDPAnchor">Selecionados Para Você</span>
                </a>
            </div>} 
        </div>
    );
}

export default AnchorsShelf;

