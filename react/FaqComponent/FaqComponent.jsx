import React, { useState } from 'react'
import style from './style.css'

// Função utilitária para remover tags HTML
const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

const FaqComponent = ({ 
    faqs, 
    allowMultipleOpen = false, 
    customStyles = {}, 
    activeStructuredData = true,
    keyPrefix = 'faq'
}) => {
    const [openIndex, setOpenIndex] = useState(null)
    const [openAccordions, setOpenAccordions] = useState({})

    const handleToggle = (idx) => {
        if (allowMultipleOpen) {
            const accordionKey = `${keyPrefix}-${idx}`;
            setOpenAccordions(prev => ({
                ...prev,
                [accordionKey]: !prev[accordionKey]
            }));
        } else {
            setOpenIndex(openIndex === idx ? null : idx)
        }
    }

    const isOpen = (idx) => {
        if (allowMultipleOpen) {
            const accordionKey = `${keyPrefix}-${idx}`;
            return openAccordions[accordionKey];
        }
        return openIndex === idx;
    }

    // Geração do JSON-LD FAQPage
    const faqStructuredData = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': faqs?.map(faq => ({
            '@type': 'Question',
            'name': stripHtml(faq.question),
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': stripHtml(faq.answer),
            },
        })),
    }

    if (!faqs || !Array.isArray(faqs)) return null;

    // Usar estilos customizados se fornecidos, senão usar os padrão
    const wrapperClass = style.faqWrapper;
    const itemClass = style.faqItem;
    const questionClass = style.faqQuestion;
    const answerClass = style.faqAnswer;
    const answerOpenClass = style.faqAnswerOpen;
    const answerInnerClass = style.faqAnswerInner;
    const arrowClass = style.arrow;
    const arrowOpenClass = style.arrowOpen;

    return (
        <div className={wrapperClass}>
            {activeStructuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(faqStructuredData)}
                </script>
            )}
            {faqs.map((faq, idx) => (
                <div key={idx} className={itemClass}>
                    <button
                        className={questionClass}
                        aria-expanded={isOpen(idx)}
                        aria-controls={`${keyPrefix}-content-${idx}`}
                        id={`${keyPrefix}-question-${idx}`}
                        tabIndex={0}
                        onClick={() => handleToggle(idx)}
                        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleToggle(idx)}
                        type="button"
                    >
                        {faq.question.includes('<') ? (
                            <div dangerouslySetInnerHTML={{ __html: faq.question }} />
                        ) : (
                            <h2 dangerouslySetInnerHTML={{ __html: faq.question }} />
                        )}
                        <span
                            className={
                                isOpen(idx)
                                    ? `${arrowClass} ${arrowOpenClass}`
                                    : arrowClass
                            }
                            aria-hidden="true"
                        >
                            {isOpen(idx) ? '-' : '+'}
                        </span>
                    </button>
                    <div
                        id={`${keyPrefix}-content-${idx}`}
                        role="region"
                        aria-labelledby={`${keyPrefix}-question-${idx}`}
                        className={
                            isOpen(idx)
                                ? `${answerClass} ${answerOpenClass}`
                                : answerClass
                        }
                    >
                        <div
                            className={answerInnerClass}
                            dangerouslySetInnerHTML={{
                                __html: faq.answer,
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}

FaqComponent.schema = {
    name: 'faq',
    title: 'FAQ',
    description: 'Componente de perguntas frequentes',
    type: 'object',
    properties: {
        faqs: {
            title: 'Perguntas e Respostas',
            type: 'array',
            activeStructuredData: {
                title: 'Ativar RichSnippet FAQPage',
                type: 'boolean',
                default: true,
            },
            items: {
                type: 'object',
                properties: {
                    question: {
                        title: 'Pergunta',
                        type: 'string',
                        description: 'Preencha em HTML',
                    },
                    answer: {
                        title: 'Resposta',
                        type: 'string',
                        description: 'Preencha em HTML',
                        widget: {
                            "ui:widget": "textarea"
                        }
                    },
                },
            },
        },
    },
}

export default FaqComponent 