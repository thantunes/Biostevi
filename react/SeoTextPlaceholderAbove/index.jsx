import React from 'react'
import styles from './style.module.css'

const SeoTextPlaceholderAbove = props => {
  return (
    <div className={styles.wrapperContentSeo}>
      <div dangerouslySetInnerHTML={{ __html: props.content }}></div>
    </div>
  )
}

SeoTextPlaceholderAbove.schema = {
  name: 'seo-text-placeholder',
  title: 'Texto SEO acima',
  description: 'Texto SEO acima',
  type: 'object',
  properties: {
    content: {
      title: 'Conteúdo',
      type: 'string',
    },
  },
}

export default SeoTextPlaceholderAbove
