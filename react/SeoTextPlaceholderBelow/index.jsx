import React, { useState, useRef, useEffect } from "react";
import styles from './style.module.css'

const SeoTextPlaceholderBelow = props => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showReadMore, setShowReadMore] = useState(false)
  const contentRef = useRef(null)

  const handleToggleContent = () => {
    setIsExpanded((prev) => !prev)
  }

  useEffect(() => {
    if (contentRef.current) {
      const el = contentRef.current
      // Pega o line-height computado
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight)
      const maxHeight = lineHeight * 8
      // Se a altura real for maior que a altura máxima de 8 linhas, mostra o botão
      setShowReadMore(el.scrollHeight > maxHeight)
    }
  }, [props.content])

  return (
    <div>
      <div
        ref={contentRef}
        className={`${styles.wrapperContentSeo} ${isExpanded ? styles.expanded : ''}`}
        aria-expanded={isExpanded}
      >
        <div dangerouslySetInnerHTML={{ __html: props.content }}></div>
      </div>
      {showReadMore && (
        <button
          className={styles.btnReadMore}
          onClick={handleToggleContent}
          aria-label={isExpanded ? 'Ler menos conteúdo' : 'Ler mais conteúdo'}
        >
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
