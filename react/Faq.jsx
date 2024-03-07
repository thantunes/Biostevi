import { useEffect } from 'react';
import style from './Faq/index.css';
function Faq(props) {
    useEffect(() => {
        document.getElementsByTagName('body')[0].insertAdjacentHTML('afterbegin', '<h1 style="display:none">Biostévi Pharma</h1>')
    }, [])
    return (
        <div className={style.container}>
            <div className="vtex-rich-text-0-x-container vtex-rich-text-0-x-container--shelfTitle flex tl items-start justify-start t-body c-on-base"><div class="vtex-rich-text-0-x-wrapper vtex-rich-text-0-x-wrapper--shelfTitle"><p class="lh-copy vtex-rich-text-0-x-paragraph vtex-rich-text-0-x-paragraph--shelfTitle">Duvidas frequentes</p></div></div>
            {
                props?.list &&
                props?.list.map((e, i) => (
                    <details className={style.FaqButton}>
                        <summary>{e.title}</summary>
                        <p>{e.resposta}</p>
                    </details>
                ))
            }
        </div>
    )
}
Faq.defaultProps = {
    list: [
        {
            title: "Pergunta 1",
            resposta: "resposta 1"
        },
        {
            title: "Pergunta 2",
            resposta: "resposta 3"
        }
    ]
}
Faq.schema = {
    title: "Faq Box",
    description: "Perguntas",
    type: "object",
    properties: {
        list: {
            type: "array",
            title: 'Perguntas',
            default: Faq.defaultProps,
            items: {
                properties: {
                    "__editorItemTitle": {
                        "title": "ID de Visualização",
                        "description": "Só será visível dentro do Site Editor",
                        "type": "string"
                    },
                    title: {
                        title: 'Titulo da Pergunta',
                        description: 'Titulo da Pergunta',
                        type: 'string',
                        widget: {
                            "ui:widget": "textarea"
                        },
                    },
                    resposta: {
                        title: 'Resposta',
                        description: 'Reposta',
                        type: 'string',
                        widget: {
                            "ui:widget": "textarea"
                        },
                    }
                }

            }

        }
    }
}

export default Faq;