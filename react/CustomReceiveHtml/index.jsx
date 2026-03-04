const schema = {
  name: 'custom-receive-html',
  title: 'Conteudo em HTML Customizavel',
  type: 'object',
  properties: {
    html_content: { title: 'Conteudo em HTML', type: 'string', default: '', widget: { 'ui:widget': 'textarea' } },
    hideHeaderFooter: {
      title: 'Ocultar header e footer',
      description: 'Oculta o header e footer da página (template em branco)',
      type: 'boolean',
      default: false,
    },
  },
}

function CustomReceiveHtml({ html_content = '', hideHeaderFooter = false }) {
  const content = <div dangerouslySetInnerHTML={{ __html: html_content }} />

  if (hideHeaderFooter) {
    return <div data-template-type="blank">{content}</div>
  }

  return content
}

CustomReceiveHtml.schema = schema

export default CustomReceiveHtml
