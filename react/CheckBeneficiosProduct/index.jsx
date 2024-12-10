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
                        .filter(({ name, values: [value] }) => (
                            (name.includes('Check-in Curto') && value) ||
                            (!properties.some(property => property.name.includes('Check-in Curto')) &&
                            name.includes('Benefícios') && value.split(/\r?\n/).some(text => text.startsWith('-')))
                        ))
                        .map(({ name, values: [value] }) => {
                            const lines = value
                                .split(/\r?\n/)
                                .slice(0, 5);

                            return (
                                <ul key={name} className="CheckBeneficiosProduct-list">
                                    {lines.map((text, index) => <li key={`${name}-${index}`}>{text.replace('- ', '✅ ').replace(';', '')}</li>)}
                                </ul>
                            );
                        })}
                </div>
            )}
        </div>
    );
}

export default CheckBeneficiosProduct;

