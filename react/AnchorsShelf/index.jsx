import React, { useEffect, useState } from 'react';
import FlexLayout from 'vtex.flex-layout/FlexLayout';

const AnchorsShelf = ({ anchors = [] }) => {
    const [dynamicAnchors, setDynamicAnchors] = useState([]);
    
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
                            title: titleSpan.textContent.trim(),
                            href: `#${elementId}`
                        });
                    }
                }
            });
            
            if (foundAnchors.length > 0) {
                setDynamicAnchors(foundAnchors);
            } else {
                // Retry após 100ms se não encontrou elementos
                setTimeout(checkPerformaElements, 100);
            }
        };
        
        checkPerformaElements();
    }, [dynamicAnchors]);

    // Combina anchors configurados com anchors dinâmicos
    const allAnchors = [...anchors, ...dynamicAnchors];
    
    if (allAnchors.length === 0) {
        return null;
    }

    return (
        <FlexLayout
            row
        >
            {allAnchors.slice(0, 5).map((anchor) => (
                <a 
                    key={anchor.id}
                    href={anchor.href} 
                    className="vtex-store-link-0-x-link vtex-store-link-0-x-link--PDPAnchor"
                >
                    <span className="vtex-store-link-0-x-label vtex-store-link-0-x-label--PDPAnchor">
                        {anchor.title}
                    </span>
                </a>
            ))}
        </FlexLayout>
    );
};

AnchorsShelf.schema = {
    title: 'Anchors Shelf',
    description: 'Componente para exibir lista de anchors configuráveis e dinâmicos',
    type: 'object',
    properties: {
        anchors: {
            title: 'Lista de Anchors',
            description: 'Anchors pré-configurados que sempre aparecem primeiro',
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: {
                        title: 'ID do Anchor',
                        description: 'Identificador único do anchor',
                        type: 'string'
                    },
                    title: {
                        title: 'Título do Anchor',
                        description: 'Texto que será exibido no link',
                        type: 'string'
                    },
                    href: {
                        title: 'Link do Anchor',
                        description: 'URL de destino do anchor (ex: #secao)',
                        type: 'string'
                    }
                },
                required: ['id', 'title', 'href']
            }
        }
    }
};

export default AnchorsShelf;

