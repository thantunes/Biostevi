import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useProduct } from "vtex.product-context";
import FaqComponent from "../FaqComponent/FaqComponent.jsx";
import "./index.global.css";

function DescriptionContructor({ children }) {
    const productContextValue = useProduct();
    const product = useMemo(() => productContextValue?.product, [productContextValue]);
    const properties = useMemo(() => product?.properties || [], [product]);
    
    // Mover faqData para dentro do componente como state
    const [faqData, setFaqData] = useState([]);
    const [isVideoVisible, setIsVideoVisible] = useState(false);
    const videoRef = useRef(null);

    // Função para remover HTML e extrair texto limpo
    function removeHTMLTags(htmlString) {
        if (!htmlString) return "";
        return htmlString.replace(/<[^>]*>/g, '').trim();
    }

    // Função para adicionar pergunta ao faqData se não existir
    const addQuestionToFaqData = useCallback((question, answer) => {
        setFaqData(prev => {
            const questionExists = prev.some(faq => faq.question === question);
            if (!questionExists) {
                return [...prev, { question, answer }];
            }
            return prev;
        });
    }, []);

    // Função para criar dados estruturados FAQPage
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

    // Nova função para retornar array de partes
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
        
        // Usar regex para dividir por h2, preservando todo o conteúdo
        const h2Regex = /<h2[^>]*>.*?<\/h2>/gi;
        const h2Matches = htmlString.match(h2Regex) || [];
        
        if (h2Matches.length === 0) {
            // Se não há h2s, retorna como um único item de conteúdo sem accordion
            return [{ isContent: true, content: htmlString }];
        }
        
        // Dividir o HTML usando os h2s como separadores
        const parts = htmlString.split(h2Regex);
        const result = [];
        
        // O primeiro part é o conteúdo antes do primeiro h2
        if (parts[0] && parts[0].trim()) {
            result.push({ isContent: true, content: parts[0].trim() });
        }
        
        // Processar cada seção (h2 + conteúdo após ele)
        for (let i = 0; i < h2Matches.length; i++) {
            const h2Match = h2Matches[i];
            const content = parts[i + 1] || ""; // Conteúdo após este h2
            
            // Extrair apenas o texto do h2 para o título
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
        
        return (
            <div>
                {accordionData.map((item, idx) => {
                    if (item.isContent) {
                        // Conteúdo sem accordion
                        return <div key={`content-${idx}`} dangerouslySetInnerHTML={{ __html: splitPorTags(item.content) }} />;
                    }
                    
                    if (item.isAccordion) {
                        if (item.question.includes("?")) {
                            addQuestionToFaqData(item.question, item.answer);
                        }

                        const contentParts = splitPorTags(item.answer);

                        // Usar FaqComponent para o accordion
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

    // Criar dados estruturados FAQPage
    const faqStructuredData = useMemo(() => createFAQStructuredData(faqData), [faqData]);

    // Inserir dados estruturados no head
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

        // Converter para formato do FaqComponent
        const accordionData = titulos.map((titulo, idx) => {
            const tituloNumber = titulo.name.match(/Titulo(\d+)/)?.[1];
            const paragrafosRelacionados = paragrafos.filter(p => 
                tituloNumber ? p.name.includes(`Paragrafo${tituloNumber}`) : true
            );
            
            const content = (paragrafosRelacionados.length > 0 ? paragrafosRelacionados : paragrafos)
                .map((paragrafo) => splitPorTags(paragrafo.values[0]))
                .join('');

            if (titulo.values?.[0].includes("?")) {
                addQuestionToFaqData(titulo.values?.[0], content);
            } else if (content.includes("?")) {
                const contentParts = splitPorTagsAsArray(content);
                const questions = [];

                for (let i = 0; i < contentParts.length; i++) {
                    const part = contentParts[i];
                    if (part.includes("?")) {
                        questions.push(part);
                    } else if (questions.length > 0 && !part.includes("?")) {
                        // Se já temos uma pergunta e encontramos uma resposta
                        const lastQuestion = questions[questions.length - 1];
                        const answer = part;
                        
                        addQuestionToFaqData(lastQuestion, answer);
                    }
                }
            }
            
            return {
                question: titulo.values?.[0] || "",
                answer: content
            };
        });

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
    };

    return (
        <div className="CustomDescData">
            {product?.description ? (
                <div className="DescBox" id="MetaTag-PDP">
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
                                className="vtex-product-specifications-1-x-specificationValue MobileStyle"
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
                    {/* Outras seções */}
                    {["Benefícios", "Composição", "Modo de Usar"].map((section) => (
                        <div className="BlockStyle Default-prop" key={section}>
                            <div className="Default-Data">
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

                    {/* Seção Advertência com FaqComponent */}
                    {properties.some((e) => e.name.includes("Advertência") && e.values[0]) && (
                        <div className="BlockStyle Default-prop" id="Advertencia">
                            <div className="Default-Data" id="InformaImp">
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


