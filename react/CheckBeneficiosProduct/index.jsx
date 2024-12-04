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
                            <ul key={name} className="CheckBeneficiosProduct-list">
                                {value.split(/\r?\n/).map((text, index) => <li key={`${name}-${index}`}>{text}</li>)}
                            </ul>
                        ))}
                </div>
            )}
        </div>
    );
}

export default CheckBeneficiosProduct;

