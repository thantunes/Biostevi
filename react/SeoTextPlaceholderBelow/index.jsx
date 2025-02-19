import React, { useState } from 'react'
import styles from './style.module.css'

const SeoTextPlaceholderBelow = props => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleContent = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div>
      <div
        className={`${styles.wrapperContentSeo} ${
          isExpanded ? styles.expanded : ''
        }`}
      >
        <div dangerouslySetInnerHTML={{ __html: props.content }}></div>
      </div>
      {props.content && (
        <button className={styles.btnReadMore} onClick={toggleContent}>
          {isExpanded ? 'Ler menos' : 'Ler mais'}
        </button>
      )}
    </div>
  )
}

SeoTextPlaceholderBelow.schema = {
  name: 'seo-text-placeholder-below',
  title: 'Texto SEO abaixo',
  description: 'Texto SEO abaixo',
  type: 'object',
  properties: {
    content: {
      title: 'Conteúdo',
      type: 'string',
    },
  },
}

export default SeoTextPlaceholderBelow
