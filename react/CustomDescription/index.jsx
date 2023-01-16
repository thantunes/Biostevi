import React from 'react';
import { useProduct } from 'vtex.product-context'

// import { Container } from './styles';

function CustomDescription() {
    const productContextValue = useProduct()
    return (
        <div>
            <a class="Descricao--Inline" href="#MetaTag-PDP">
                <p  dangerouslySetInnerHTML={{ __html: productContextValue.product.metaTagDescription }}></p>
            </a>
        </div>
    );
}

export { CustomDescription };