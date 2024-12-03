import React, { useMemo } from 'react';
import { useProduct } from 'vtex.product-context';
import './index.global.css';

function CheckBeneficiosProduct() {
    const productContextValue = useProduct();

    const product = useMemo(() => productContextValue?.product, [productContextValue]);
    const properties = useMemo(() => product?.properties || [], [product]);

    return (
        <div className="CustomData">
            {properties.length > 0 && (
                <div className="Block">
                    <h2>Benefícios</h2>
                    {properties
                        .filter(({ name, values: [value] }) => name.includes('Check-in Curto') && value)
                        .map(({ name, values: [value] }) => (
                            <p key={name} dangerouslySetInnerHTML={{ __html: value }} />
                        ))}
                </div>
            )}
        </div>
    );
}

export default CheckBeneficiosProduct;

