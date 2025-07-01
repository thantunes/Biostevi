import React, { useEffect, useState } from 'react';
import './index.global.css';

const AnchorsShelf = () => {
    const [anchors, setAnchors] = useState([]);
    
    useEffect(() => {
        const checkPerformaElements = () => {
            // Busca todos os elementos que contenham 'vtex-product-context-provider' e 'performa' na classe
            const performaElements = document.querySelectorAll('.vtex-product-context-provider performa');
            const foundAnchors = [];
            
            performaElements.forEach((element) => {
                // Busca o span com classe performa-vitrine-title dentro do elemento
                const titleSpan = element.querySelector('.performa-vitrine-title');
                
                if (titleSpan && titleSpan.textContent && element.children.length > 0) {
                    // Extrai o ID do elemento ou cria um baseado no índice
                    const elementId = element.id || element.getAttribute('id');
                    
                    if (elementId) {
                        foundAnchors.push({
                            id: elementId,
                            title: titleSpan.textContent.trim()
                        });
                    }
                }
            });
            
            if (foundAnchors.length > 0) {
                setAnchors(foundAnchors);
            } else {
                // Retry após 100ms se não encontrou elementos
                setTimeout(checkPerformaElements, 100);
            }
        };
        
        checkPerformaElements();
    }, []);

    if (anchors.length === 0) {
        return null;
    }

    return (
        <div className="AnchorsShelfContainer">
            {anchors.map((anchor) => (
                <div key={anchor.id} className="divAnchors">
                    <a 
                        href={`#${anchor.id}`} 
                        className="vtex-store-link-0-x-link vtex-store-link-0-x-link--PDPAnchor"
                    >
                        <span className="vtex-store-link-0-x-label vtex-store-link-0-x-label--PDPAnchor">
                            {anchor.title}
                        </span>
                    </a>
                </div>
            ))}
        </div>
    );
};

export default AnchorsShelf;

