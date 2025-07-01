import React, { useMemo, useState, useEffect, useRef } from "react";
import { useProduct } from "vtex.product-context";
import "./index.global.css";

function splitPorTags(texto) {
    const regex = /(<[^>]+>.*?<\/[^>]+>|<[^>]+>.*?(?=<|$)|[^\n]+|(?<=\n(?=\S))|(?=\n(?=\S))|(?<=\n\n))/g;
    const splitedText = texto.match(regex);
    const newArrayText = splitedText
        .map((element) => {
            const trimmed = element.trim();

            if (trimmed === "\n" || trimmed === "" || trimmed === "<p></p>" || trimmed.match(/^\s*$/)) {
                return "";
            }

            if ((trimmed.startsWith("<b") && trimmed.endsWith("</b>")) || (trimmed.startsWith("<a") && trimmed.endsWith("</a>")) || (trimmed.startsWith("<strong") && trimmed.endsWith("</strong>"))) {
                return `<p>${trimmed}</p>`;
            } else if (trimmed.startsWith("<")) {
                return trimmed;
            }

            return `<p>${trimmed}</p>`;
        })
        .filter((e) => e !== "")
        .map((e, i, array) => {
            if (i === array.length - 1 && e.endsWith("</p>")) {
                return e.replace("</p>", "");
            }
            return e;
        });

    return newArrayText.join("");
}

function createAccordionFromHTML(htmlString) {
    if (!htmlString) return { preContent: "", accordionSections: [] };
    
    // Criar um parser temporário para trabalhar com o HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    
    const elements = Array.from(tempDiv.children);
    const accordionSections = [];
    let preContent = "";
    let currentSection = null;
    let foundFirstH2 = false;
    
    elements.forEach((element) => {
        if (element.tagName === 'H2') {
            // Se já existe uma seção atual, salvá-la
            if (currentSection) {
                accordionSections.push(currentSection);
            }
            
            // Iniciar nova seção
            currentSection = {
                title: element.innerHTML,
                content: ""
            };
            foundFirstH2 = true;
            
        } else if (currentSection) {
            // Adicionar conteúdo à seção atual
            currentSection.content += element.outerHTML;
            
        } else if (!foundFirstH2) {
            // Conteúdo antes do primeiro h2
            preContent += element.outerHTML;
        }
    });
    
    // Adicionar a última seção se existir
    if (currentSection) {
        accordionSections.push(currentSection);
    }
    
    return { preContent, accordionSections };
}

const AccordionRenderer = ({ htmlString, accordionKeyPrefix, openAccordions, handleAccordionToggle }) => {
    const { preContent, accordionSections } = createAccordionFromHTML(htmlString);
    
    if (accordionSections.length === 0) {
        // Se não há h2s, retorna o conteúdo processado normalmente
        return <div dangerouslySetInnerHTML={{ __html: splitPorTags(htmlString) }} />;
    }
    
    return (
        <div>
            {/* Conteúdo antes do primeiro h2 */}
            {preContent && (
                <div dangerouslySetInnerHTML={{ __html: preContent }} />
            )}
            
            {/* Renderizar accordions */}
            {accordionSections.map((section, idx) => {
                const accordionKey = `${accordionKeyPrefix}-h2-${idx}`;
                const isOpen = openAccordions[accordionKey];
                
                return (
                    <div key={accordionKey} className="accordion-item">
                        <button
                            className="accordion-title"
                            aria-expanded={isOpen}
                            aria-controls={`accordion-content-${accordionKey}`}
                            id={`accordion-question-${accordionKey}`}
                            tabIndex={0}
                            onClick={() => handleAccordionToggle(accordionKey)}
                            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleAccordionToggle(accordionKey)}
                            type="button"
                        >
                            <h2 dangerouslySetInnerHTML={{ __html: section.title }}></h2>
                            <span
                                className={`accordion-arrow ${isOpen ? 'accordion-arrow-open' : ''}`}
                                aria-hidden="true"
                            >
                                {isOpen ? '-' : '+'}
                            </span>
                        </button>
                        
                        <div
                            id={`accordion-content-${accordionKey}`}
                            role="region"
                            aria-labelledby={`accordion-question-${accordionKey}`}
                            className={`accordion-content ${isOpen ? 'accordion-content-open' : ''}`}
                        >
                            <div 
                                className="accordion-content-inner"
                                dangerouslySetInnerHTML={{ __html: section.content }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

function DescriptionContructor({ children }) {
    const productContextValue = useProduct();

    const product = useMemo(() => productContextValue?.product, [productContextValue]);
    const properties = useMemo(() => product?.properties || [], [product]);

    const [isVideoVisible, setIsVideoVisible] = useState(false);
    const [openAccordions, setOpenAccordions] = useState({});

    const videoRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVideoVisible(true);
                    observer.disconnect();
                }
            },
            { root: null, rootMargin: "0px", threshold: 1 }
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) observer.unobserve(videoRef.current);
        };
    }, []);

    const handleAccordionToggle = (accordionKey) => {
        setOpenAccordions(prev => ({
            ...prev,
            [accordionKey]: !prev[accordionKey]
        }));
    };

    const renderContent = (namePrefix, className, includeImages = true) => {
        const filteredData = properties.filter(
            (e) => e.name?.includes(namePrefix) && !e.name?.includes(`Ultima Sessão-${namePrefix}`)
        );

        // Agrupar títulos e parágrafos
        const titulos = filteredData.filter(e => e.name?.includes(`${namePrefix}-Titulo`));
        const paragrafos = filteredData.filter(e => 
            !e.values[0].includes('class="descricao-pdp-full"') &&
            e.name.includes(`${namePrefix}-Paragrafo`)
        );

        return (
            <div className={`BlockStyle ${className}`}>
                {includeImages &&
                    filteredData.map((e) =>
                        e.name?.includes(`${namePrefix}-Banner`) ? (
                            <img
                                key={e.name}
                                src={`https://stevia.vteximg.com.br/arquivos/${e.values || ""}`}
                                style={{ maxWidth: "30%", borderRadius: "20px" }}
                                alt=""
                                loading="lazy"
                            />
                        ) : null
                    )}
                
                <div>
                    {titulos.map((titulo, idx) => {
                        const accordionKey = `${namePrefix}-${idx}`;
                        const isOpen = openAccordions[accordionKey];
                        
                        // Encontrar parágrafos relacionados ao título atual
                        const tituloNumber = titulo.name.match(/Titulo(\d+)/)?.[1];
                        const paragrafosRelacionados = paragrafos.filter(p => 
                            tituloNumber ? p.name.includes(`Paragrafo${tituloNumber}`) : true
                        );
                        
                        return (
                            <div key={titulo.name} className="accordion-item">
                                <button
                                    className="accordion-title"
                                    aria-expanded={isOpen}
                                    aria-controls={`accordion-content-${accordionKey}`}
                                    id={`accordion-question-${accordionKey}`}
                                    tabIndex={0}
                                    onClick={() => handleAccordionToggle(accordionKey)}
                                    onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleAccordionToggle(accordionKey)}
                                    type="button"
                                >
                                    <h2 dangerouslySetInnerHTML={{ __html: titulo.values?.[0] || "" }}></h2>
                                    <span
                                        className={`accordion-arrow ${isOpen ? 'accordion-arrow-open' : ''}`}
                                        aria-hidden="true"
                                    >
                                        {isOpen ? '-' : '+'}
                                    </span>
                                </button>
                                
                                <div
                                    id={`accordion-content-${accordionKey}`}
                                    role="region"
                                    aria-labelledby={`accordion-question-${accordionKey}`}
                                    className={`accordion-content ${isOpen ? 'accordion-content-open' : ''}`}
                                >
                                    <div className="accordion-content-inner">
                                        {(paragrafosRelacionados.length > 0 ? paragrafosRelacionados : paragrafos).map((paragrafo) => (
                                            <div
                                                key={paragrafo.name}
                                                className={`MobileStyle ${className} ${paragrafo.values[0].includes("<a") ? "TemLink" : ""}`}
                                                dangerouslySetInnerHTML={{ __html: splitPorTags(paragrafo.values[0]) }}
                                            ></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="CustomDescData">
            {product?.description ? (
                <div className="DescBox" id="MetaTag-PDP">
                    <AccordionRenderer 
                        htmlString={product.description} 
                        accordionKeyPrefix="product-description"
                        openAccordions={openAccordions}
                        handleAccordionToggle={handleAccordionToggle}
                    />
                </div>
            ) : null}
            {properties.length > 0 && (
                <>
                    {properties.map((e) =>
                        e.values?.[0]?.includes('class="descricao-pdp-full"') ? (
                            <div
                                key={e.name}
                                className="vtex-product-specifications-1-x-specificationValue MobileStyle"
                            >
                                <AccordionRenderer 
                                    htmlString={e.values[0]} 
                                    accordionKeyPrefix={`property-${e.name}`}
                                    openAccordions={openAccordions}
                                    handleAccordionToggle={handleAccordionToggle}
                                />
                            </div>
                        ) : null
                    ).filter(Boolean)}
                    {["Linha1", "Linha2", "Linha3", "Linha4", "Linha5", "Linha6", "Linha7"].map((linha) =>
                        linha ? renderContent(linha, linha, linha) : null
                    )}
                    <div ref={videoRef}>
                        {isVideoVisible && properties.some((e) => e.name.includes("Linha8-VIDEO")) ? (
                            <div className="vtex-product-specifications-1-x-specificationValue">
                                <AccordionRenderer 
                                    htmlString={properties.find((e) => e.name.includes("Linha8-VIDEO")).values?.[0] || ""} 
                                    accordionKeyPrefix="linha8-video"
                                    openAccordions={openAccordions}
                                    handleAccordionToggle={handleAccordionToggle}
                                />
                            </div>
                        ) : null}
                    </div>
                    {properties.map((e) => {
                        if (e.name.includes("Ultima Sessão-Linha1-Paragrafo1")) {
                            return (
                                <div key={e.name}>
                                    <AccordionRenderer 
                                        htmlString={e.values[0]} 
                                        accordionKeyPrefix={`ultima-sessao-linha1-p1`}
                                        openAccordions={openAccordions}
                                        handleAccordionToggle={handleAccordionToggle}
                                    />
                                </div>
                            );
                        }
                        return null;
                    })}
                    {properties.some((e) => e.name.includes("Imagem-PrimeiroBloco")) && (
                        <div className="BlockStyle tableCenter">
                            <table>
                                {["Primeiro", "Segundo"].map((prefix, rowIndex) => (
                                    <tr className="TableContentBox" key={`row-${rowIndex}`}>
                                        <td>
                                            <img
                                                loading="lazy"
                                                alt=""
                                                src={`https://stevia.vtexassets.com/arquivos/${
                                                    properties.find((e) =>
                                                        e.name.includes(
                                                            prefix === "Primeiro"
                                                                ? "Imagem-PrimeiroBloco"
                                                                : "Imagem-SegundoBloco"
                                                        )
                                                    )?.values || ""
                                                }`}
                                            />
                                            <div>
                                                <h3>
                                                    {properties.find((e) =>
                                                        e.name.includes(
                                                            prefix === "Primeiro"
                                                                ? "Primeiro-Bloco Check-in-Titulo"
                                                                : "Segundo-Bloco-Check-in-Titulo"
                                                        )
                                                    )?.values || ""}
                                                </h3>
                                                <p>
                                                    {properties.find((e) =>
                                                        e.name.includes(
                                                            prefix === "Primeiro"
                                                                ? "Primeiro-Bloco-Check-in-Texto"
                                                                : "Segundo -Bloco-Check-in-Texto"
                                                        )
                                                    )?.values || ""}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="TableSpacer"></td>
                                        <td>
                                            <img
                                                loading="lazy"
                                                alt=""
                                                src={`https://stevia.vtexassets.com/arquivos/${
                                                    properties.find((e) =>
                                                        e.name.includes(
                                                            prefix === "Primeiro"
                                                                ? "Segunda-linha Primeiro Bloco Check-in Imagem"
                                                                : "Segunda-linha Segundo Bloco Check-in Imagem"
                                                        )
                                                    )?.values || ""
                                                }`}
                                            />
                                            <div>
                                                <h3>
                                                    {properties.find((e) =>
                                                        e.name.includes(
                                                            prefix === "Primeiro"
                                                                ? "Segunda-linha Primeiro Bloco Check-in Titulo"
                                                                : "Segunda-linha Segundo Bloco Check-in Titulo"
                                                        )
                                                    )?.values || ""}
                                                </h3>
                                                <p>
                                                    {properties.find((e) =>
                                                        e.name.includes(
                                                            prefix === "Primeiro"
                                                                ? "Segunda-linha Primeiro Bloco Check-in Texto"
                                                                : "Segunda-linha Segundo Bloco Check-in Texto"
                                                        )
                                                    )?.values || ""}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </table>
                        </div>
                    )}
                    {properties.map((e) => {
                        if (e?.name?.includes("Ultima Sessão-Linha1-Paragrafo2")) {
                            return (
                                <div key={e.name}>
                                    <AccordionRenderer 
                                        htmlString={e.values[0]} 
                                        accordionKeyPrefix={`ultima-sessao-linha1-p2`}
                                        openAccordions={openAccordions}
                                        handleAccordionToggle={handleAccordionToggle}
                                    />
                                </div>
                            );
                        }
                        return null;
                    })}
                    {properties.map((e) => {
                        if (e.name.includes("Ultima Sessão-Linha2-Paragrafo1")) {
                            return (
                                <div key={e.name}>
                                    <AccordionRenderer 
                                        htmlString={e.values?.[0] || ""} 
                                        accordionKeyPrefix={`ultima-sessao-linha2-p1`}
                                        openAccordions={openAccordions}
                                        handleAccordionToggle={handleAccordionToggle}
                                    />
                                </div>
                            );
                        }
                        return null;
                    })}
                    {["Benefícios", "Composição", "Modo de Usar", "Advertência"].map((section) => (
                        <>
                            {section === "Advertência" && (
                                <div className="BlockStyle Default-prop">
                                    <div className="Default-Data" id="InformaImp">
                                        {children}
                                    </div>
                                </div>
                            )}
                            <div className="BlockStyle Default-prop">
                                <div className="Default-Data">
                                    {properties.some((e) => e.name.includes(section) && e.values[0]) && (
                                        <div className="accordion-item">
                                            <button
                                                className="accordion-title"
                                                aria-expanded={openAccordions[`section-${section}`]}
                                                aria-controls={`accordion-content-section-${section}`}
                                                id={`accordion-question-section-${section}`}
                                                tabIndex={0}
                                                onClick={() => handleAccordionToggle(`section-${section}`)}
                                                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleAccordionToggle(`section-${section}`)}
                                                type="button"
                                            >
                                                <h2
                                                    id={
                                                        section === "Modo de Usar"
                                                            ? "ModoDeUsar"
                                                            : section
                                                                .normalize("NFD")
                                                                .replace(/[\u0300-\u036f]/g, "")
                                                                .replace(/\s/g, "")
                                                                .replace(/ /g, "")
                                                    }
                                                >
                                                    {section}
                                                </h2>
                                                <span
                                                    className={`accordion-arrow ${openAccordions[`section-${section}`] ? 'accordion-arrow-open' : ''}`}
                                                    aria-hidden="true"
                                                >
                                                    {openAccordions[`section-${section}`] ? '-' : '+'}
                                                </span>
                                            </button>
                                            
                                            <div
                                                id={`accordion-content-section-${section}`}
                                                role="region"
                                                aria-labelledby={`accordion-question-section-${section}`}
                                                className={`accordion-content ${openAccordions[`section-${section}`] ? 'accordion-content-open' : ''}`}
                                            >
                                                <div className="accordion-content-inner">
                                                    {properties.map((e) =>
                                                        e?.name?.includes(section) && e?.values?.[0] ? (
                                                            <div key={e.name} style={{ whiteSpace: "break-spaces" }}>
                                                                <AccordionRenderer 
                                                                    htmlString={e.values[0]} 
                                                                    accordionKeyPrefix={`section-${section.toLowerCase().replace(/\s/g, '-')}-${e.name}`}
                                                                    openAccordions={openAccordions}
                                                                    handleAccordionToggle={handleAccordionToggle}
                                                                />
                                                            </div>
                                                        ) : null
                                                    )}
                                                </div>
                                            </div>
                                        </div>
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


