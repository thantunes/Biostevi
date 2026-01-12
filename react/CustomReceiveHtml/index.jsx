const schema = {
  name: 'custom-receive-html',
  title: 'Conteudo em HTML Customizavel',
  type: 'object',
  properties: {
    html_content: { title: 'Conteudo em HTML', type: 'string', default: '', widget: { 'ui:widget': 'textarea' } },
  },
} 

function CustomReceiveHtml({ html_content = '' }) {
  return <div dangerouslySetInnerHTML={{ __html: html_content }} />
}

CustomReceiveHtml.schema = schema

export default CustomReceiveHtml
