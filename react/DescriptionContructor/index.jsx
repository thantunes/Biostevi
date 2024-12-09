import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useProduct } from 'vtex.product-context';
import './index.global.css';

function DescriptionContructor({ children }) {
    const productContextValue = useProduct();

    const product = useMemo(() => productContextValue?.product, [productContextValue]);
    const properties = useMemo(() => product?.properties || [], [product]);

    const [isVideoVisible, setIsVideoVisible] = useState(false);

    const videoRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVideoVisible(true);
                    observer.disconnect();
                }
            },
            { root: null, rootMargin: '0px', threshold: 1 }
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) observer.unobserve(videoRef.current);
        };
    }, []);


    const renderContent = (namePrefix, className, includeImages = true) => {
        const filteredData = properties.filter((e) => e.name?.includes(namePrefix));
        return (
            <div className={`BlockStyle ${className}`}>
                {includeImages &&
                    filteredData.map((e) =>
                        e.name?.includes(`${namePrefix}-Banner`) ? (
                            <img
                                key={e.name}
                                src={`https://stevia.vteximg.com.br/arquivos/${e.values || ''}`}
                                style={{ maxWidth: '30%', borderRadius: '20px' }}
                                alt=""
                                loading="lazy"
                            />
                        ) : null
                    )}
                <div>
                    {filteredData.map((e) =>
                        e.name?.includes(`${namePrefix}-Titulo`) ? (
                            <h2 key={e.name} dangerouslySetInnerHTML={{ __html: e.values?.[0] || '' }}></h2>
                        ) : null
                    )}

                    {filteredData.map((e) =>
                        !e.values?.[0]?.includes('class="descricao-pdp-full"') &&
                            e.name?.includes(`${namePrefix}-Paragrafo`) ? (
                            <div
                                key={e.name}
                                className={`MobileStyle ${className} ${e.values?.[0]?.includes('<a') ? 'TemLink' : ''}`}
                                dangerouslySetInnerHTML={{ __html: e.values?.[0] || '' }}
                            ></div>
                        ) : null
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="CustomDescData">
            {product?.description ? (
                <div
                    className="DescBox"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                    id="MetaTag-PDP"
                ></div>
            ) : null}
            {properties.length > 0 && (
                <>
                    {properties.map((e) =>
                        e.values?.[0]?.includes('class="descricao-pdp-full"') ? (
                            <div
                                key={e.name}
                                className="vtex-product-specifications-1-x-specificationValue MobileStyle"
                                dangerouslySetInnerHTML={{ __html: e.values[0] }}
                            ></div>
                        ) : null
                    )}
                    {['Linha1', 'Linha2', 'Linha3', 'Linha4', 'Linha5', 'Linha6', 'Linha7'].map((linha) =>
                        linha ? renderContent(linha, linha, linha) : null
                    )}
                    <div ref={videoRef}>
                        {isVideoVisible && properties.some((e) => e.name.includes('Linha8-VIDEO')) ? (
                            <div
                                className="vtex-product-specifications-1-x-specificationValue"
                                dangerouslySetInnerHTML={{
                                    __html: properties.find((e) => e.name.includes('Linha8-VIDEO')).values?.[0] || '',
                                }}
                            ></div>
                        ) : null}
                    </div>
                    {properties.map((e) => {
                        if (e.name.includes("Ultima Sessão-Linha1-Paragrafo1")) {
                            return <div dangerouslySetInnerHTML={{ __html: e.values?.[0] || '' }}></div>
                        }
                        return null;
                    })}
                    {properties.some((e) => e.name.includes('Imagem-PrimeiroBloco')) &&
                        <div className="BlockStyle tableCenter">
                            <table>
                                {['Primeiro', 'Segundo'].map((prefix, rowIndex) => (
                                    <tr className="TableContentBox" key={`row-${rowIndex}`}>
                                        <td>
                                            <img
                                                loading="lazy"
                                                alt=""
                                                src={`https://stevia.vtexassets.com/arquivos/${properties.find(
                                                    (e) => e.name.includes(prefix === 'Primeiro' ? 'Imagem-PrimeiroBloco' : 'Imagem-SegundoBloco')
                                                )?.values || ''}`}
                                            />
                                            <div>
                                                <h3>
                                                    {properties.find((e) => e.name.includes(prefix === 'Primeiro' ? 'Primeiro-Bloco Check-in-Titulo' : 'Segundo-Bloco-Check-in-Titulo'))?.values || ''}
                                                </h3>
                                                <p>
                                                    {properties.find((e) => e.name.includes(prefix === 'Primeiro' ? 'Primeiro-Bloco-Check-in-Texto' : 'Segundo -Bloco-Check-in-Texto'))?.values || ''}
                                                </p>
                                            </div>
                                        </td>
                                        <td className='TableSpacer'></td>
                                        <td>
                                            <img
                                                loading="lazy"
                                                alt=""
                                                src={`https://stevia.vtexassets.com/arquivos/${properties.find(
                                                    (e) => e.name.includes(prefix === 'Primeiro' ? 'Segunda-linha Primeiro Bloco Check-in Imagem' : 'Segunda-linha Segundo Bloco Check-in Imagem')
                                                )?.values || ''}`}
                                            />
                                            <div>
                                                <h3>
                                                    {properties.find((e) => e.name.includes(prefix === 'Primeiro' ? 'Segunda-linha Primeiro Bloco Check-in Titulo' : 'Segunda-linha Segundo Bloco Check-in Titulo'))?.values || ''}
                                                </h3>
                                                <p>
                                                    {properties.find((e) => e.name.includes(prefix === 'Primeiro' ? 'Segunda-linha Primeiro Bloco Check-in Texto' : 'Segunda-linha Segundo Bloco Check-in Texto'))?.values || ''}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </table>
                        </div>
                    }
                    {/* {properties.find((e) => e.name.includes('Imagem-PrimeiroBloco'))?.values (
                        <div className="BlockStyle tableCenter">
                            <table>
                                {['Primeiro', 'Segundo'].map((prefix, rowIndex) => (
                                    properties.find((e) => e.name.includes(`Imagem-${prefix}Bloco`))?.values &&
                                    properties.find((e) => e.name.includes(`Segunda-linha ${prefix} Bloco Check-in Imagem`))?.values &&
                                    (
                                        <tr className="TableContentBox" key={`row-${rowIndex}`}>
                                            <td>
                                                <img
                                                    loading="lazy"
                                                    alt=""
                                                    src={`https://stevia.vtexassets.com/arquivos/${properties.find(
                                                        (e) => e.name.includes(prefix === 'Primeiro' ? 'Imagem-PrimeiroBloco' : 'Segunda-linha Primeiro Bloco Check-in Imagem')
                                                    ).values}`}
                                                />
                                                <div>
                                                    <h3>
                                                        {properties.find((e) => e.name.includes(prefix === 'Primeiro' ? 'Primeiro-Bloco Check-in-Titulo' : 'Segunda-linha Primeiro Bloco Check-in Titulo'))?.values}
                                                    </h3>
                                                    <p>
                                                        {properties.find((e) => e.name.includes(prefix === 'Primeiro' ? 'Primeiro-Bloco-Check-in-Texto' : 'Segunda-linha Primeiro Bloco Check-in Texto'))?.values}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className='TableSpacer'></td>
                                            <td>
                                                <img
                                                    loading="lazy"
                                                    alt=""
                                                    src={`https://stevia.vtexassets.com/arquivos/${properties.find(
                                                        (e) => e.name.includes(prefix === 'Primeiro' ? 'Imagem-SegundoBloco' : 'Segunda-linha Segundo Bloco Check-in Imagem')
                                                    ).values}`}
                                                />
                                                <div>
                                                    <h3>
                                                        {properties.find((e) => e.name.includes(prefix === 'Primeiro' ? 'Segundo-Bloco-Check-in-Titulo' : 'Segunda-linha Segundo Bloco Check-in Titulo'))?.values}
                                                    </h3>
                                                    <p>
                                                    {properties.find((e) => e.name.includes(prefix === 'Primeiro' ? 'Segundo -Bloco-Check-in-Texto' : 'Segunda-linha Segundo Bloco Check-in Texto'))?.values}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                ))}
                            </table>
                        </div>
                    )} */}
                
                    {properties.map((e) => {
                        if (e?.name?.includes("Ultima Sessão-Linha1-Paragrafo2")) {
                            return (
                                <div>
                                    <div dangerouslySetInnerHTML={{ __html: e?.values?.[0] || '' }}></div>
                                </div>
                            )
                        }
                    })}
                    {properties.map((e) => {
                        if (e.name.includes("Ultima Sessão-Linha2-Paragrafo1")) {
                            return (
                                <div>
                                    <div dangerouslySetInnerHTML={{ __html: e.values?.[0] || '' }}></div>
                                </div>
                            );
                        }
                        return null;
                    })}
                    {['Benefícios', 'Composição', 'Modo de Usar', 'Advertência'].map((section) => (
                        <>
                            {section === 'Advertência' && (
                                <div className="BlockStyle Default-prop">
                                    <div className="Default-Data" id="InformaImp">
                                        {children}
                                    </div>
                                </div>
                            )}
                            <div className="BlockStyle Default-prop">
                                <div className="Default-Data">
                                    {properties.some((e) => e?.name?.includes(section) && e?.values?.[0]) && (
                                        <h2 id={section === 'Modo de Usar' ? 'ModoDeUsar' : section.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s/g, '').replace(/ /g, '')}>{section}</h2>
                                    )}
                                    {properties.map((e) =>
                                        e?.name?.includes(section) && e?.values?.[0] ? (
                                            <span
                                                key={e?.name}
                                                style={{ whiteSpace: 'break-spaces' }}
                                                dangerouslySetInnerHTML={{ __html: e?.values?.[0] || '' }}
                                            ></span>
                                        ) : null
                                    )}
                                </div>
                            </div>
                        </>
                    ))}
                </>
            )}
        </div>
    );
}

export default DescriptionContructor;
