import React, { useEffect } from 'react'

const schema = {
  name: 'custom-receive-html',
  title: 'Conteudo em HTML Customizavel',
  type: 'object',
  properties: {
    html_content: { title: 'Conteudo em HTML', type: 'string', default: '', widget: { 'ui:widget': 'textarea' } },
    remove_header_footer: { title: 'Remover header e footer ao carregar', type: 'boolean', default: false },
  },
}

function CustomReceiveHtml({ html_content = '', remove_header_footer = false }) {
  useEffect(() => {
    if (!remove_header_footer || typeof window === 'undefined') return
    if (!window.location?.pathname?.includes('/template-em-branco')) return

    const BODY = 'no-header-footer', ID = 'no-header-footer-styles'
    const sel = ['.vtex-store-header-2-x-container', '.vtex-flex-layout-0-x-flexRowContent--main-header', '.vtex-store-footer-2-x-footerLayout', '.vtex-flex-layout-0-x-flexRow--menu-link', '.vtex-flex-layout-0-x-flexRow--hintup-skeleton', 'header', 'footer']
    const css = sel.map(s => `body.${BODY} ${s}`).join(',') + '{display:none!important;visibility:hidden!important;height:0!important;overflow:hidden!important}'

    document.body.classList.add(BODY)
    if (!document.getElementById(ID)) { const el = document.createElement('style'); el.id = ID; el.appendChild(document.createTextNode(css)); document.head.appendChild(el) }

    return () => { document.body.classList.remove(BODY); const el = document.getElementById(ID); if (el) el.parentNode.removeChild(el) }
  }, [remove_header_footer])

  return <div dangerouslySetInnerHTML={{ __html: html_content }} />
}

CustomReceiveHtml.schema = schema

export default CustomReceiveHtml
