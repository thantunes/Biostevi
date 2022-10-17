import React, { useEffect, useState } from 'react';
import { useProduct } from 'vtex.product-context'
import './index.global.css'
// import { Container } from './styles';

function DescriptionContructor() {
    const productContextValue = useProduct()
    console.log(productContextValue)
    const [data, setData] = useState([])
    const [FullData, setFullData] = useState()
    useEffect(() => {
        // let arraydados = productContextValue.product.properties
        // let arry = []
        // for (var i = 0; i < arraydados.length; i++) {
        //     if (arraydados[i].name.includes("Linha")) {
        //         arry.push(arraydados[i])
        //     }
        // }
        // setData(arry)
        const VanillaComponents = document.querySelectorAll("[data-specification-group='Descrição de Produto Personalizada']")

        VanillaComponents.forEach((e) => {
            e.style.display = "none"
            e.style.height = "0"
        })
    }, [])

    useEffect(() => {
        let arraydados = productContextValue.product.properties
        // let DadosDeLinha = [] //check
        // let DadosImg = []
        // let DadosCheckIn = []
        // let DadosDefault = []
        // for (var i = 0; i < arraydados.length; i++) {
        //     if (arraydados[i].name.includes("Linha")) {
        //         DadosDeLinha.push(arraydados[i])
        //     } else if (arraydados[i].name.includes("Imagem primeira linha")) {
        //         DadosImg.push(arraydados[i])
        //     } else if (arraydados[i].name.includes("Texto primeira linha")) {
        //         DadosImg.push(arraydados[i])
        //     } else if (arraydados[i].name.includes("Check-in")) {
        //         DadosCheckIn.push(arraydados[i])
        //     } else {
        //         DadosDefault.push(arraydados[i])
        //     }
        // }
        // console.log(
        //     "linha:", DadosDeLinha,
        //     "img:", DadosImg,
        //     "check:", DadosCheckIn,
        //     "dafault:", DadosDefault
        // )
        // setDataDefault(DadosDefault)
        // setDataLinha(DadosDeLinha)
        // setDataImg(DadosImg)
        // setDataCheckIn(DadosCheckIn)
        setData(arraydados)
        setFullData(productContextValue)
    }, [])
    let ConvertStringToHTML = function (str) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(str, 'text/html');
        return doc.body;
    };
    return (
        <div className='CustomDescData'>
            <p className='DescBox' dangerouslySetInnerHTML={{ __html: FullData?.product.description }}></p>
            {
                data.map((e) => {
                    if (e.name.includes("Benefícios")) {
                        return (
                            <div className='BlockStyle'>

                                <div className='Default-Data'>
                                    <h2 id='Beneficios'>Benefícios</h2>
                                    {
                                        data.map((e) => {
                                            if (e.name.includes("Benefícios")) {
                                                const value = e.values
                                                return <span style={{ whiteSpace: "break-spaces" }} data-specification-value={e.values[0]} dangerouslySetInnerHTML={{__html: e.values[0]}}></span>
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
                            <div className='BlockStyle'>

                                <div className='Default-Data'>
                                    <h2 id='Composicao'>Composição</h2>
                                    {
                                        data.map((e) => {
                                            if (e.name.includes("Composição")) {
                                                const value = e.values
                                                return <span style={{ whiteSpace: "break-spaces" }} data-specification-value={e.values[0]} dangerouslySetInnerHTML={{__html: e.values[0]}}></span>
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
                            <div className='BlockStyle'>

                                <div className='Default-Data'>
                                    <h2 id='ModoDeUsar'>Modo de Usar</h2>
                                    {
                                        data.map((e) => {
                                            if (e.name.includes("Modo de Usar")) {
                                                const value = e.values
                                                return <span style={{ whiteSpace: "break-spaces" }} data-specification-value={e.values[0]} dangerouslySetInnerHTML={{__html: e.values[0]}}></span>
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
                    if (e.values[0].includes('class="descricao-pdp-full"')) {
                        return <div className='vtex-product-specifications-1-x-specificationValue' dangerouslySetInnerHTML={{ __html: e.values[0] }}></div>
                    } else {
                        if (e.name.includes("Linha1-Paragrafo")) {
                            return (
                                <div className='BlockStyle'>
                                    {
                                    }
                                    {data.map((e) => {
                                        if (e.name.includes("Linha1-Banner")) {
                                            return <img src={`https://stevia.vteximg.com.br/arquivos/${e.values}`} alt="" />
                                        }
                                    })}
                                    <div>
                                        {
                                            data.map((e) => {
                                                if (e.name.includes("Linha1-Titulo")) {
                                                    return <h2 dangerouslySetInnerHTML={{ __html: e.values[0]}}></h2>
                                                }
                                            })
                                        }
                                        {
                                            data.map((e) => {
                                                if (e.values[0].includes('div')) {
                                                    return null
                                                } else {
                                                    console.log(e.values[0].includes("div"))
                                                    if (e.name.includes("Linha1-Paragrafo")) {
                                                        return <p dangerouslySetInnerHTML={{ __html: e.values[0]}}></p>
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
                                <div className='BlockStyle'>
                                    <div>
                                        {
                                            data.map((e) => {
                                                if (e.name.includes("Linha2-Titulo")) {
                                                    return <h2 dangerouslySetInnerHTML={{ __html: e.values[0]}}></h2>
                                                }
                                            })
                                        }
                                        {
                                            data.map((e) => {
                                                if (e.values[0].includes('class="descricao-pdp-full"')) {
                                                    return null
                                                    console.log("linha 6 existe")
                                                } else {
                                                    console.log(e.values[0].includes('class="descricao-pdp-full"'))
                                                    if (e.name.includes("Linha2-Paragrafo")) {
                                                        return <p dangerouslySetInnerHTML={{ __html: e.values[0]}}></p>
                                                    }
                                                }

                                            })
                                        }
                                    </div>
                                    {data.map((e) => {
                                        if (e.name.includes("Linha2-Banner")) {
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
                        if (e.name.includes("Linha3-Paragrafo")) {
                            return (
                                <div className='BlockStyle'>
                                    {data.map((e) => {
                                        if (e.name.includes("Linha3-Banner")) {
                                            return <img src={`https://stevia.vteximg.com.br/arquivos/${e.values}`} alt="" />
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
                                                    console.log("linha 6 existe")
                                                    return null
                                                } else {
                                                    if (e.name.includes("Linha3-Paragrafo")) {
                                                        return <p dangerouslySetInnerHTML={{__html: e.values[0]}}></p>
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
                                                    return <h2>{e.values[0]}</h2>
                                                }
                                            })
                                        }
                                        {
                                            data.map((e) => {
                                                if (e.values[0].includes('class="descricao-pdp-full"')) {
                                                    return null
                                                } else {
                                                    if (e.name.includes("Linha4-Paragrafo")) {
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
                        if (e.name.includes("Linha5-Paragrafo")) {
                            return (
                                <div className='BlockStyle HorizontalBanner'>

                                    <div>
                                        {
                                            data.map((e) => {
                                                if (e.values[0].includes('class="descricao-pdp-full"') || e.values[0].includes('<br />') ) {
                                                    return null
                                                } else {
                                                    if (e.name.includes("Linha5-Paragrafo")) {
                                                        return <p>{e.values[0]}</p>
                                                    }
                                                }

                                            })
                                        }
                                    </div>
                                    {data.map((e) => {
                                        if (e.name.includes("Linha5-Banner")) {
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
                                        if (e.name.includes("Linha5-Banner")) {
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
                    if (e.name.includes("Linha8-VIDEO")) {
                        return <div className='vtex-product-specifications-1-x-specificationValue teste' dangerouslySetInnerHTML={{ __html: e.values[0]}}></div>
                    } else {
                        return null
                    }

                })
            }
            {
                data.map((e) => {
                    if (e.name.includes("Ultima Sessão-Linha1-Paragrafo1")) {
                        return <div dangerouslySetInnerHTML={{ __html: e.values[0]}}></div>
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
                                            <div>
                                                {data.map((e) => {
                                                    if (e.name.includes("Imagem-SegundoBloco")) {
                                                        return <img src={`https://stevia.vtexassets.com/arquivos/${e.values}`} />
                                                    }
                                                })}
                                                <h3>
                                                    {
                                                        data.map((e) => {
                                                            if (e.name.includes("Segundo-Bloco-Check-in-Titulo")) {
                                                                return <h3>{e.values}</h3>
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
                                            <div>
                                                {
                                                    data.map((e) => {
                                                        if (e.name.includes("Segunda-linha Segundo Bloco Check-in Imagem")) {
                                                            return <img src={`https://stevia.vtexassets.com/arquivos/${e.values}`} />
                                                        }
                                                    })}
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
                    if (e.name.includes("Advertência")) {
                        return (
                            <div className='BlockStyle'>

                                <div className='Default-Data'>
                                    <h2 id='Advertencia'>Advertência</h2>
                                    {
                                        data.map((e) => {
                                            if (e.name.includes("Advertência")) {
                                                const value = e.values
                                                return <span style={{ whiteSpace: "break-spaces" }} data-specification-value={e.values[0]} dangerouslySetInnerHTML={{__html: e.values[0]}}></span>
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