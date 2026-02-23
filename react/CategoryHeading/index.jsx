import React from 'react'
import Richtext from 'vtex.rich-text/index'

const CategoryHeading = (props) => {
  const hasChildren = props.children != null && React.Children.count(props.children) > 0
  const hasTitle = typeof props.title === 'string' && props.title.length > 0
  const hasContent = hasChildren || hasTitle

  if (!hasContent) {
    return null
  }

  return (
    <div className="vtex-CategoryHeading--categoryHeading">
      {hasTitle ? <Richtext text={props.title} /> : props.children}
    </div>
  )
}

CategoryHeading.schema = {
  name: 'category-heading',
  title: 'Category Heading',
  description: 'Recebe o título via children (ex.: search-title.v2) ou texto em "H1 Customizado". Sem importar vtex.search-result ou vtex.rich-text.',
  type: 'object',
  properties: {
    title: {
      title: 'H1 Customizado',
      description: 'Texto simples (fallback quando não há children). Para HTML use um bloco rich-text como child.',
      type: 'string',
    },
    blockClass: {
      title: 'Block Class',
      description: 'Classe CSS para customização do container do título.',
      type: 'string',
    },
  },
}

export default CategoryHeading
