import React, { useState } from 'react'
import style from './style.css'

// Função utilitária para remover tags HTML
const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

const FaqComponent = ({ faqs }) => {
    const [openIndex, setOpenIndex] = useState(null)

    const handleToggle = idx => {
        setOpenIndex(openIndex === idx ? null : idx)
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

    if (!faqs) return null;

    return (
        <div className={style.faqWrapper}>
            <script type="application/ld+json">
                {JSON.stringify(faqStructuredData)}
            </script>
            {faqs?.map((faq, idx) => (
                <div key={idx} className={style.faqItem}>
                    <button
                        className={style.faqQuestion}
                        aria-expanded={openIndex === idx}
                        aria-controls={`faq-content-${idx}`}
                        id={`faq-question-${idx}`}
                        tabIndex={0}
                        onClick={() => handleToggle(idx)}
                        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleToggle(idx)}
                        type="button"
                    >
                        <div dangerouslySetInnerHTML={{ __html: faq.question }} />
                        <span
                            className={
                                openIndex === idx
                                    ? `${style.arrow} ${style.arrowOpen}`
                                    : style.arrow
                            }
                            aria-hidden="true"
                        >
                            {openIndex === idx ? '-' : '+'}
                        </span>
                    </button>
                    <div
                        id={`faq-content-${idx}`}
                        role="region"
                        aria-labelledby={`faq-question-${idx}`}
                        className={
                            openIndex === idx
                                ? `${style.faqAnswer} ${style.faqAnswerOpen}`
                                : style.faqAnswer
                        }
                    >
                        <div
                            className={style.faqAnswerInner}
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
                    },
                },
            },
        },
    },
}

export default FaqComponent 