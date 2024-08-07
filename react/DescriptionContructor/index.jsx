import React, { useEffect, useState } from 'react';
import { useProduct } from 'vtex.product-context'
import './index.global.css'

function DescriptionContructor({children}) {
    const productContextValue = useProduct()
    const [data, setData] = useState([])
    const [FullData, setFullData] = useState()
    
    useEffect(() => {
        const VanillaComponents = document.querySelectorAll("[data-specification-group='Descrição de Produto Personalizada']")

        VanillaComponents.forEach((e) => {
            e.style.display = "none"
            e.style.height = "0"
        })
    }, [])

    useEffect(() => {
        let arraydados = productContextValue.product.properties
        setData(arraydados)
        setFullData(productContextValue)
    }, [])
    return (
        <div className='CustomDescData'>
            <p className='DescBox' dangerouslySetInnerHTML={{ __html: FullData?.product.description }} id="MetaTag-PDP"></p>
            {
                data.map((e) => {
                    if (e.values[0].includes('class="descricao-pdp-full"')) {
                        return null
                    } else {
                        if (e.name == "Linha1-Paragrafo") {
                            return (
                                <div className='BlockStyle'>
                                    {data.map((e) => {
                                        if (e.name.includes("Linha1-Banner")) {
                                            return <img src={`https://stevia.vteximg.com.br/arquivos/${e.values}`} style={{ maxWidth: "30%", borderRadius: "20px" }} alt="" />
                                        }
                                    })}
                                    <div>
                                        {
                                            data.map((e) => {
                                                if (e.name.includes("Linha1-Titulo")) {
                                                    return <h2 dangerouslySetInnerHTML={{ __html: e.values[0] }}></h2>
                                                }
                                            })
                                        }
                                        {
                                            data.map((e) => {
                                                console.log(e, e.values[0].includes('div'))
                                                if (e.values[0].includes('<div')) {
                                                    return null
                                                } else {
                                                    if (e.name.includes("Linha1-Paragrafo")) {
                                                        console.log(e)
                                                        return <p className={`MobileStyle linha1 ${e.values[0].includes("<a") ? "TemLink" : ""}`} dangerouslySetInnerHTML={{ __html: e.values[0] }}></p>
                                                    }
                                                }

                                            })
                                        }
                                    </div>
                                </div>
                            );
                        }
                    }
                })

            }
            {
                data.map((e) => {
                    if (e.values[0].includes('class="descricao-pdp-full"')) {
                        return null
                    } else {
                        if (e.name.includes("Linha2-Paragrafo")) {
                            return (
                                <div className='BlockStyle Linha2'>
                                    <div>
                                        {
                                            data.map((e) => {
                                                if (e.name.includes("Linha2-Titulo")) {
                                                    return <h2 dangerouslySetInnerHTML={{ __html: e.values[0] }}></h2>
                                                }
                                            })
                                        }
                                        {
                                            data.map((e) => {
                                                if (e.values[0].includes('class="descricao-pdp-full"')) {
                                                    return null
                                                } else {
                                                    console.log("linha 2 pdp-full", e.values[0].includes('class="descricao-pdp-full"'))
                                                    if (e.name.includes("Linha2-Paragrafo")) {
                                                        console.log("value:", e.values, e.values[0].includes("<a"))
                                                        return <p className={`MobileStyle Linha2 ${e.values[0].includes("<a") ? "TemLink" : ""}`} dangerouslySetInnerHTML={{ __html: e.values[0] }}></p>
                                                    }
                                                }

                                            })
                                        }
                                    </div>
                                    {data.map((e) => {
                                        if (e.name.includes("Linha2-Banner")) {
                                            return <img src={`https://stevia.vteximg.com.br/arquivos/${e.values}`} style={{ maxWidth: "30%", borderRadius: "20px" }} alt="" />
                                        }
                                    })}
                                </div>
                            );
                        }
                    }

                })
            }
            {
                data.map((e) => {
                    if (e.values[0].includes('class="descricao-pdp-full"')) {
                        return null
                    } else {
                        if (e.name.includes("Linha3-Paragrafo")) {
                            return (
                                <div className='BlockStyle'>
                                    {data.map((e) => {
                                        if (e.name.includes("Linha3-Banner")) {
                                            return <img src={`https://stevia.vteximg.com.br/arquivos/${e.values}`} style={{ maxWidth: "30%", borderRadius: "20px" }} alt="" />
                                        }
                                    })}
                                    <div>
                                        {
                                            data.map((e) => {
                                                if (e.name.includes("Linha3-Titulo")) {
                                                    return <h2>{e.values[0]}</h2>
                                                }
                                            })
                                        }
                                        {
                                            data.map((e) => {
                                                if (e.values[0].includes('class="descricao-pdp-full"')) {
                                                    return null
                                                } else {
                                                    if (e.name.includes("Linha3-Paragrafo")) {
                                                        return <p className={`MobileStyle Linha3 ${e.values[0].includes("<a") ? "TemLink" : ""}`} dangerouslySetInnerHTML={{ __html: e.values[0] }}></p>
                                                    }
                                                }

                                            })
                                        }
                                    </div>
                                </div>
                            );
                        }
                    }

                })
            }
            {
                data.map((e) => {
                    if (e.values[0].includes('class="descricao-pdp-full"')) {
                        return null
                    } else {
                        if (e.name.includes("Linha4-Paragrafo")) {
                            return (
                                <div className='BlockStyle'>

                                    <div>
                                        {
                                            data.map((e) => {
                                                if (e.name.includes("Linha4-Titulo")) {
                                                    return <h2 dangerouslySetInnerHTML={{ __html: e.values[0] }}></h2>
                                                }
                                            })
                                        }
                                        {
                                            data.map((e) => {
                                                if (e.values[0].includes('class="descricao-pdp-full"')) {
                                                    return null
                                                } else {
                                                    if (e.name.includes("Linha4-Paragrafo")) {
                                                        return <p className='MobileStyle linha4' dangerouslySetInnerHTML={{ __html: e.values[0] }}></p>
                                                    }
                                                }

                                            })
                                        }
                                    </div>
                                    {data.map((e) => {
                                        if (e.name.includes("Linha4-Banner")) {
                                            return <img src={`https://stevia.vteximg.com.br/arquivos/${e.values}`} style={{ maxWidth: "30%", borderRadius: "20px" }} alt="" />
                                        }
                                    })}
                                </div>
                            );
                        }
                    }

                })
            }
            {
                data.map((e) => {
                    if (e.values[0].includes('class="descricao-pdp-full"')) {
                        return <div className='vtex-product-specifications-1-x-specificationValue MobileStyle' dangerouslySetInnerHTML={{ __html: e.values[0] }}></div>
                    } else {
                        if (e.name.includes("Linha5-Paragrafo")) {
                            return (
                                <div className='BlockStyle HorizontalBanner Linha5' style={{ marginTop: "15px" }}>

                                    <div>
                                        {
                                            data.map((e) => {
                                                if (e.name.includes("Linha5-Titulo")) {
                                                    return <h2 dangerouslySetInnerHTML={{ __html: e.values[0] }}></h2>
                                                }
                                            })
                                        }
                                        {
                                            data.map((e) => {
                                                if (e.values[0].includes('class="descricao-pdp-full"') || e.values[0].includes('<br />')) {
                                                    return null
                                                } else {
                                                    if (e.name.includes("Linha5-Paragrafo")) {
                                                        return <p dangerouslySetInnerHTML={{ __html: e.values[0] }}></p>
                                                    }
                                                }

                                            })
                                        }
                                    </div>
                                    {data.map((e) => {
                                        if (e.name.includes("Linha5-Banner")) {
                                            return <img src={`https://stevia.vteximg.com.br/arquivos/${e.values}`} style={{ borderRadius: "20px" }} alt="" />
                                        }
                                    })}
                                </div>
                            );
                        }
                    }

                })
            }
            {
                data.map((e) => {
                    if (e.values[0].includes('class="descricao-pdp-full"')) {
                        return null
                    } else {
                        if (e.name.includes("Linha6-Paragrafo")) {
                            return (
                                <div className='BlockStyle'>

                                    <div>
                                        {
                                            data.map((e) => {
                                                if (e.name.includes("Linha6-Titulo")) {
                                                    return <h2>{e.values[0]}</h2>
                                                }
                                            })
                                        }
                                        {
                                            data.map((e) => {
                                                if (e.values[0].includes('class="descricao-pdp-full"')) {
                                                    console.log("linha 6 existe")
                                                } else {
                                                    if (e.name.includes("Linha6-Paragrafo")) {
                                                        return <p>{e.values[0]}</p>
                                                    }
                                                }

                                            })
                                        }
                                    </div>
                                    {data.map((e) => {
                                        if (e.name.includes("Linha4-Banner")) {
                                            return <img src={`https://stevia.vteximg.com.br/arquivos/${e.values}`} alt="" />
                                        }
                                    })}
                                </div>
                            );
                        }
                    }

                })
            }
            {
                data.map((e) => {
                    if (e.values[0].includes('class="descricao-pdp-full"')) {
                        return null
                    } else {
                        if (e.name.includes("Linha7-Paragrafo")) {
                            return (
                                <div className='BlockStyle Linha2'>
                                    <div>
                                        {
                                            data.map((e) => {
                                                if (e.name.includes("Linha7-Titulo")) {
                                                    return <h2 dangerouslySetInnerHTML={{ __html: e.values[0] }}></h2>
                                                }
                                            })
                                        }
                                        {
                                            data.map((e) => {
                                                if (e.values[0].includes('class="descricao-pdp-full"')) {
                                                    return null
                                                    console.log("linha 6 existe")
                                                } else {
                                                    console.log("linha 2 pdp-full", e.values[0].includes('class="descricao-pdp-full"'))
                                                    if (e.name.includes("Linha7-Paragrafo")) {
                                                        console.log("value:", e.values, e.values[0].includes("<a"))
                                                        return <p className={`MobileStyle Linha2 ${e.values[0].includes("<a") ? "TemLink" : ""}`} dangerouslySetInnerHTML={{ __html: e.values[0] }}></p>
                                                    }
                                                }

                                            })
                                        }
                                    </div>
                                    {data.map((e) => {
                                        if (e.name.includes("Linha7-Banner")) {
                                            return <img src={`https://stevia.vteximg.com.br/arquivos/${e.values}`} style={{ maxWidth: "30%", borderRadius: "20px" }} alt="" />
                                        }
                                    })}
                                </div>
                            );
                        }
                    }

                })
            }
            {
                data.map((e) => {
                    if (e.name.includes("Linha8-VIDEO")) {
                        return <div className='vtex-product-specifications-1-x-specificationValue teste' dangerouslySetInnerHTML={{ __html: e.values[0] }}></div>
                    } else {
                        return null
                    }

                })
            }
            {
                data.map((e) => {
                    if (e.name.includes("Ultima Sessão-Linha1-Paragrafo1")) {
                        return <div dangerouslySetInnerHTML={{ __html: e.values[0] }}></div>
                    } else {
                    }

                })
            }
            {
                data.map((e) => {
                    if (e.name.includes("Primeiro Bloco Check-in Texto")) {
                        return (
                            <div className='BlockStyle tableCenter'>
                                <table>
                                    <tr className='TableContentBox'>
                                        <td>
                                            {data.map((e) => {
                                                if (e.name.includes("Imagem-PrimeiroBloco")) {
                                                    return <img src={`https://stevia.vtexassets.com/arquivos/${e.values}`} />
                                                }
                                            })}
                                            <div>
                                                <h3>
                                                    {
                                                        data.map((e) => {
                                                            if (e.name.includes("Primeiro-Bloco Check-in-Titulo")) {
                                                                return <p>{e.values}</p>
                                                            }
                                                        })}
                                                </h3>
                                                <p>
                                                    {
                                                        data.map((e) => {
                                                            if (e.name.includes("Primeiro-Bloco-Check-in-Texto")) {
                                                                return <p>{e.values}</p>
                                                            }
                                                        })}
                                                </p>
                                            </div>
                                        </td>
                                        <td className='TableSpacer'></td>
                                        <td>

                                            {data.map((e) => {
                                                if (e.name.includes("Imagem-SegundoBloco")) {
                                                    return <img src={`https://stevia.vtexassets.com/arquivos/${e.values}`} />
                                                }
                                            })}
                                            <div>
                                                <h3>
                                                    {
                                                        data.map((e) => {
                                                            if (e.name.includes("Segundo-Bloco-Check-in-Titulo")) {
                                                                return <p>{e.values}</p>
                                                            }
                                                        })}
                                                </h3>
                                                <p>
                                                    {
                                                        data.map((e) => {
                                                            if (e.name.includes("Segundo -Bloco-Check-in-Texto")) {
                                                                return <p>{e.values}</p>
                                                            }
                                                        })}
                                                </p>
                                            </div>

                                        </td>
                                    </tr>
                                    <tr className='TableContentBox'>
                                        <td>
                                            {data.map((e) => {
                                                if (e.name.includes("Segunda-linha Primeiro Bloco Check-in Imagem")) {
                                                    return <img src={`https://stevia.vtexassets.com/arquivos/${e.values}`} />
                                                }
                                            })}
                                            <div>
                                                <h3>
                                                    {
                                                        data.map((e) => {
                                                            if (e.name.includes("Segunda-linha Primeiro Bloco Check-in Titulo")) {
                                                                return <p>{e.values}</p>
                                                            }
                                                        })}
                                                </h3>
                                                <p>
                                                    {
                                                        data.map((e) => {
                                                            if (e.name.includes("Segunda-linha Primeiro Bloco Check-in Texto")) {
                                                                return <p>{e.values}</p>
                                                            }
                                                        })}
                                                </p>
                                            </div>
                                        </td>
                                        <td className='TableSpacer'></td>
                                        <td>

                                            {
                                                data.map((e) => {
                                                    if (e.name.includes("Segunda-linha Segundo Bloco Check-in Imagem")) {
                                                        return <img src={`https://stevia.vtexassets.com/arquivos/${e.values}`} />
                                                    }
                                                })}
                                            <div>
                                                <h3>
                                                    {
                                                        data.map((e) => {
                                                            if (e.name.includes("Segunda-linha Segundo Bloco Check-in Titulo")) {
                                                                console.log(e)
                                                                return <p>{e.values}</p>
                                                            }
                                                        })}
                                                </h3>
                                                <p>
                                                    {
                                                        data.map((e) => {
                                                            if (e.name.includes("Segunda-linha Segundo Bloco Check-in Texto")) {
                                                                console.log(e)
                                                                return <p>{e.values}</p>
                                                            }
                                                        })}
                                                </p>
                                            </div>

                                        </td>
                                    </tr>
                                </table>
                            </div>
                        );
                    } else {
                        return null
                    }
                })
            }
            {
                data.map((e) => {
                    if (e.name.includes("Ultima Sessão-Linha1-Paragrafo2")) {
                        return (
                            <div>
                                <div dangerouslySetInnerHTML={{ __html: e.values[0] }}></div>
                            </div>
                        )

                    } else {
                        null
                    }

                })
            }
            {
                data.map((e) => {
                    if (e.name.includes("Ultima Sessão-Linha2-Paragrafo1")) {
                        return (
                            <div>
                                <div dangerouslySetInnerHTML={{ __html: e.values[0] }}></div>
                            </div>
                        )

                    } else {
                        null
                    }

                })
            }
            {
                data.map((e) => {
                    if (e.name.includes("Benefícios")) {
                        return (
                            <div className='BlockStyle Default-prop'>

                                <div className='Default-Data'>
                                    <h2 id='Beneficios'>Benefícios</h2>
                                    {
                                        data.map((e) => {
                                            if (e.name.includes("Benefícios")) {
                                                const value = e.values
                                                return <span style={{ whiteSpace: "break-spaces" }} data-specification-value={e.values[0]} dangerouslySetInnerHTML={{ __html: e.values[0] }}></span>
                                            }
                                        })
                                    }
                                </div>
                            </div>
                        );
                    }
                })
            }
            {
                data.map((e) => {
                    if (e.name.includes("Composição")) {
                        return (
                            <div className='BlockStyle Default-prop'>

                                <div className='Default-Data'>
                                    <h2 id='Composicao'>Composição</h2>
                                    {
                                        data.map((e) => {
                                            if (e.name.includes("Composição")) {
                                                const value = e.values
                                                return <span style={{ whiteSpace: "break-spaces" }} data-specification-value={e.values[0]} dangerouslySetInnerHTML={{ __html: e.values[0] }}></span>
                                            }
                                        })
                                    }
                                </div>
                            </div>
                        );
                    }
                })
            }
            {
                data.map((e) => {
                    if (e.name.includes("Modo de Usar")) {
                        return (
                            <div className='BlockStyle Default-prop'>

                                <div className='Default-Data'>
                                    <h2 id='ModoDeUsar'>Modo de Usar</h2>
                                    {
                                        data.map((e) => {
                                            if (e.name.includes("Modo de Usar")) {
                                                const value = e.values
                                                return <span style={{ whiteSpace: "break-spaces" }} data-specification-value={e.values[0]} dangerouslySetInnerHTML={{ __html: e.values[0] }}></span>
                                            }
                                        })
                                    }
                                </div>
                            </div>
                        );
                    }
                })
            }
            <div className='BlockStyle Default-prop'>
                <div className='Default-Data' id='InformaImp'>
                    {children}
                </div>
            </div>
            {
                data.map((e) => {
                    if (e.name.includes("Advertência")) {
                        return (
                            <div className='BlockStyle Default-prop'>

                                <div className='Default-Data'>
                                    <h2 id='Advertencia'>Advertência</h2>
                                    {
                                        data.map((e) => {
                                            if (e.name.includes("Advertência")) {
                                                const value = e.values
                                                return <span style={{ whiteSpace: "break-spaces" }} data-specification-value={e.values[0]} dangerouslySetInnerHTML={{ __html: e.values[0] }}></span>
                                            }
                                        })
                                    }
                                </div>
                            </div>
                        );
                    }
                })
            }

        </div>
    );
}

export default DescriptionContructor;