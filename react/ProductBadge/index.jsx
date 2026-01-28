import React from 'react'
import { useRuntime } from 'vtex.render-runtime'
import './index.global.css'

const ProductBadge = ({
  text = '',
  textColor = '#ffffff',
  backgroundColor = '#00B67A',
  borderColor = 'transparent',
  borderWidth = '0px',
  borderRadius = '4px',
  fontSize = '14px',
  fontWeight = '700',
  padding = '6px 12px',
  position = 'top-left',
  fontFamily = 'Signika'
}) => {
  const runtime = useRuntime()
  
  // Verifica se está na página home
  const isHomePage = runtime?.page === 'store.home' || runtime?.route?.canonicalPath === '/'

  // Se não estiver na home, não renderiza nada
  if (!isHomePage) return null

  // Se não houver texto, não renderiza nada
  if (!text) return null

  const positionClass = {
    'top-left': 'topLeft',
    'top-right': 'topRight',
    'bottom-left': 'bottomLeft',
    'bottom-right': 'bottomRight'
  }[position] || 'topLeft'

  const badgeStyle = {
    color: textColor,
    backgroundColor: backgroundColor,
    border: `${borderWidth} solid ${borderColor}`,
    borderRadius: borderRadius,
    fontSize: fontSize,
    fontWeight: fontWeight,
    padding: padding,
    fontFamily: fontFamily
  }

  return (
    <div 
      className={`productBadgeWrapper ${positionClass}`}
      data-product-badge="true"
      data-position={position}
      data-badge-wrapper="true"
    >
      <span 
        className="productBadge"
        style={badgeStyle}
      >
        {text}
      </span>
    </div>
  )
}

ProductBadge.schema = {
  title: 'Badge de Produto',
  type: 'object',
  properties: {
    text: {
      type: 'string',
      title: 'Texto da Badge',
      description: 'Texto exibido na badge (ex: -32%, NOVO, OFERTA)',
      default: ''
    },
    position: {
      type: 'string',
      title: 'Posição',
      description: 'Posição da badge em relação à imagem',
      enum: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      enumNames: ['Superior Esquerdo', 'Superior Direito', 'Inferior Esquerdo', 'Inferior Direito'],
      default: 'top-left'
    },
    textColor: {
      type: 'string',
      title: 'Cor do Texto',
      description: 'Cor do texto da badge (ex: #ffffff, rgb(255,255,255))',
      default: '#ffffff',
      widget: {
        'ui:widget': 'color'
      }
    },
    backgroundColor: {
      type: 'string',
      title: 'Cor de Fundo',
      description: 'Cor de fundo da badge (ex: #00B67A, rgb(0,182,122))',
      default: '#00B67A',
      widget: {
        'ui:widget': 'color'
      }
    },
    borderColor: {
      type: 'string',
      title: 'Cor da Borda',
      description: 'Cor da borda da badge (ex: #000000, transparent)',
      default: 'transparent',
      widget: {
        'ui:widget': 'color'
      }
    },
    borderWidth: {
      type: 'string',
      title: 'Largura da Borda',
      description: 'Largura da borda (ex: 0px, 1px, 2px)',
      default: '0px',
      enum: ['0px', '1px', '2px', '3px', '4px']
    },
    borderRadius: {
      type: 'string',
      title: 'Raio da Borda',
      description: 'Arredondamento dos cantos (ex: 4px, 8px, 50%)',
      default: '4px',
      enum: ['0px', '4px', '8px', '12px', '16px', '50%']
    },
    fontSize: {
      type: 'string',
      title: 'Tamanho da Fonte',
      description: 'Tamanho do texto (ex: 12px, 14px, 16px)',
      default: '14px',
      enum: ['10px', '12px', '14px', '16px', '18px', '20px']
    },
    fontWeight: {
      type: 'string',
      title: 'Peso da Fonte',
      description: 'Peso do texto',
      default: '700',
      enum: ['400', '500', '600', '700', '800', '900'],
      enumNames: ['Normal (400)', 'Médio (500)', 'Semi-Bold (600)', 'Bold (700)', 'Extra-Bold (800)', 'Black (900)']
    },
    padding: {
      type: 'string',
      title: 'Espaçamento Interno',
      description: 'Padding interno da badge (ex: 6px 12px)',
      default: '6px 12px'
    }
  }
}

export default ProductBadge
