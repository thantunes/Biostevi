import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useProduct } from "vtex.product-context";
import FaqComponent from "../FaqComponent/FaqComponent.jsx";

function DescriptionContructor({ children }) {
    const productContextValue = useProduct();
    const product = useMemo(() => productContextValue?.product, [productContextValue]);
    const properties = useMemo(() => product?.properties || [], [product]);
    
    const [faqData, setFaqData] = useState([]);
    const [isVideoVisible, setIsVideoVisible] = useState(false);
    const videoRef = useRef(null);

    function removeHTMLTags(htmlString) {
        if (!htmlString) return "";
        return htmlString.replace(/<[^>]*>/g, '').trim();
    }

    const processFAQData = useCallback((question, answer) => {
        setFaqData(prev => {
            const questionExists = prev.some(faq => faq.question === question);
            if (!questionExists) {
                return [...prev, { question, answer }];
            }
            return prev;
        });
    }, []);

    function createFAQStructuredData(faqData) {
        if (!faqData || faqData.length === 0) return null;
        
        return {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqData.map(faq => ({
                "@type": "Question",
                "name": removeHTMLTags(faq.question),
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": removeHTMLTags(faq.answer)
                }
            }))
        };
    }

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

    function splitPorTagsAsArray(texto) {
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
            .filter((e) => e !== "");

        return newArrayText;
    }

    function createAccordionFromHTML(htmlString) {
        if (!htmlString) return [];
        
        const h2Regex = /<h2[^>]*>.*?<\/h2>/gi;
        const h2Matches = htmlString.match(h2Regex) || [];
        
        if (h2Matches.length === 0) {
            return [{ isContent: true, content: htmlString }];
        }
        
        const parts = htmlString.split(h2Regex);
        const result = [];
        
        if (parts[0] && parts[0].trim()) {
            result.push({ isContent: true, content: parts[0].trim() });
        }

        for (let i = 0; i < h2Matches.length; i++) {
            const h2Match = h2Matches[i];
            const content = parts[i + 1] || "";
            
            const h2TextMatch = h2Match.match(/<h2[^>]*>(.*?)<\/h2>/i);
            const title = h2TextMatch ? h2TextMatch[1] : h2Match;
            
            result.push({
                isAccordion: true,
                question: title,
                answer: content.trim()
            });
        }
        
        return result;
    }

    const AccordionRenderer = ({ htmlString, keyPrefix }) => {
        const accordionData = createAccordionFromHTML(htmlString);
        
        useEffect(() => {
            accordionData.forEach((item) => {
                if (item.isAccordion && item.question.includes("?")) {
                    processFAQData(item.question, item.answer);
                }
            });
        }, [htmlString, processFAQData]);
        
        return (
            <div>
                {accordionData.map((item, idx) => {
                    if (item.isContent) {
                        return <div key={`content-${idx}`} dangerouslySetInnerHTML={{ __html: splitPorTags(item.content) }} />;
                    }
                    
                    if (item.isAccordion) {
                        const contentParts = splitPorTags(item.answer);

                        return (
                            <FaqComponent
                                key={`accordion-${idx}`}
                                faqs={[{ question: item.question, answer: contentParts }]}
                                allowMultipleOpen={true}
                                activeStructuredData={false}
                                keyPrefix={`${keyPrefix}-${idx}`}
                            />
                        );
                    }
                    
                    return null;
                })}
            </div>
        );
    };

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

    const faqStructuredData = useMemo(() => createFAQStructuredData(faqData), [faqData]);

    useEffect(() => {
        if (faqStructuredData) {
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.text = JSON.stringify(faqStructuredData);
            document.head.appendChild(script);

            return () => {
                if (document.head.contains(script)) {
                    document.head.removeChild(script);
                }
            };
        }
    }, [faqStructuredData]);

    const renderContent = useCallback((namePrefix, className, includeImages = true) => {
        const filteredData = properties.filter(
            (e) => e.name?.includes(namePrefix) && !e.name?.includes(`Ultima Sessão-${namePrefix}`)
        );

        const titulos = filteredData.filter(e => e.name?.includes(`${namePrefix}-Titulo`));
        const paragrafos = filteredData.filter(e => 
            !e.values[0].includes('class="descricao-pdp-full"') &&
            e.name.includes(`${namePrefix}-Paragrafo`)
        );

        const accordionData = titulos.map((titulo, idx) => {
            const tituloNumber = titulo.name.match(/Titulo(\d+)/)?.[1];
            const paragrafosRelacionados = paragrafos.filter(p => 
                tituloNumber ? p.name.includes(`Paragrafo${tituloNumber}`) : true
            );
            
            const content = (paragrafosRelacionados.length > 0 ? paragrafosRelacionados : paragrafos)
                .map((paragrafo) => splitPorTags(paragrafo.values[0]))
                .join('');

            return {
                question: titulo.values?.[0] || "",
                answer: content
            };
        });

        useEffect(() => {
            accordionData.forEach((item) => {
                if (item.question.includes("?")) {
                    processFAQData(item.question, item.answer);
                } else if (item.answer.includes("?")) {
                    const contentParts = splitPorTagsAsArray(item.answer);
                    const questions = [];

                    for (let i = 0; i < contentParts.length; i++) {
                        const part = contentParts[i];
                        if (part.includes("?")) {
                            questions.push(part);
                        } else if (questions.length > 0 && !part.includes("?")) {
                            const lastQuestion = questions[questions.length - 1];
                            const answer = part;
                            
                            processFAQData(lastQuestion, answer);
                        }
                    }
                }
            });
        }, [namePrefix, processFAQData]);

        return (
            <div className={`vtex-DescriptionContructor--block ${className}`}>
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
                
                {accordionData.length > 0 && (
                    <FaqComponent
                        faqs={accordionData}
                        allowMultipleOpen={true}
                        activeStructuredData={false}
                        keyPrefix={`content-${namePrefix}`}
                    />
                )}
            </div>
        );
    }, [properties, processFAQData]);

    return (
        <div className="vtex-DescriptionContructor--wrapper">
            {product?.description ? (
                <div className="vtex-DescriptionContructor--desc-box" id="MetaTag-PDP">
                    <AccordionRenderer 
                        htmlString={product.description} 
                        keyPrefix="product-description"
                    />
                </div>
            ) : null}
            {properties.length > 0 && (
                <>
                    {properties.map((e) =>
                        e.values?.[0]?.includes('class="descricao-pdp-full"') ? (
                            <div
                                key={e.name}
                                className="vtex-product-specifications-1-x-specificationValue vtex-DescriptionContructor--mobile"
                            >
                                <AccordionRenderer 
                                    htmlString={e.values[0]} 
                                    keyPrefix={`property-${e.name}`}
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
                                    keyPrefix="linha8-video"
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
                                        keyPrefix={`ultima-sessao-linha1-p1`}
                                    />
                                </div>
                            );
                        }
                        return null;
                    })}
                    {properties.some((e) => e.name.includes("Imagem-PrimeiroBloco")) && (
                        <div className="vtex-DescriptionContructor--block vtex-DescriptionContructor--table-center">
                            <table>
                                {["Primeiro", "Segundo"].map((prefix, rowIndex) => (
                                    <tr className="vtex-DescriptionContructor--table-row" key={`row-${rowIndex}`}>
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
                                        <td className="vtex-DescriptionContructor--table-spacer"></td>
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
                                        keyPrefix={`ultima-sessao-linha1-p2`}
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
                                        keyPrefix={`ultima-sessao-linha2-p1`}
                                    />
                                </div>
                            );
                        }
                        return null;
                    })}
                    {["Benefícios", "Composição", "Modo de Usar"].map((section) => (
                        <div className="vtex-DescriptionContructor--block vtex-DescriptionContructor--default-block" key={section}>
                            <div className="vtex-DescriptionContructor--default-data">
                                {properties.some((e) => e.name.includes(section) && e.values[0]) && (
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
                                )}
                                {properties.map((e) =>
                                    e?.name?.includes(section) && e?.values?.[0] ? (
                                        <span
                                            key={e.name}
                                            style={{ whiteSpace: "break-spaces" }}
                                            dangerouslySetInnerHTML={{ __html: splitPorTags(e.values[0]) }}
                                        ></span>
                                    ) : null
                                )}
                            </div>
                        </div>
                    ))}

                    {properties.some((e) => e.name.includes("Advertência") && e.values[0]) && (
                        <div className="vtex-DescriptionContructor--block vtex-DescriptionContructor--default-block" id="Advertencia">
                            <div className="vtex-DescriptionContructor--default-data" id="InformaImp">
                                <FaqComponent
                                    faqs={properties
                                        .filter((e) => e?.name?.includes("Advertência") && e?.values?.[0])
                                        .map((e) => ({
                                            question: "Advertência",
                                            answer: splitPorTags(e.values[0])
                                        }))}
                                    allowMultipleOpen={true}
                                    activeStructuredData={false}
                                    keyPrefix="advertencia-section"
                                />
                                {children}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default DescriptionContructor;


