import React, { useMemo } from 'react';
import { useProduct } from 'vtex.product-context';

function CheckBeneficiosProduct() {
    const productContextValue = useProduct();

    const product = useMemo(() => productContextValue?.product, [productContextValue]);
    const properties = useMemo(() => product?.properties || [], [product]);

    return (
        <div className="vtex-CheckBeneficiosProduct--wrapper">
            {properties.length > 0 && (
                <div className="vtex-CheckBeneficiosProduct--block">
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
                                <ul key={name} className="vtex-CheckBeneficiosProduct--list">
                                    {lines.map((text, index) =>
                                        <li className="vtex-CheckBeneficiosProduct--item" key={`${name}-${index}`}>
                                            <div>✅</div>
                                            <p>{text.replace('- ', '').replace(';', '').replace('✅', '')}</p>
                                        </li>
                                    )}
                                </ul>
                            );
                        })}
                </div>
            )}
        </div>
    );
}

export default CheckBeneficiosProduct;

