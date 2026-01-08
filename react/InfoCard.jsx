import React from 'react';
import { Link } from 'vtex.render-runtime';
import './InfoCardList/index.global.css';

const InfoCard = ({
  image,
  title,
  description,
  ctaText = 'Saiba mais',
  href
}) => {
  const CardContent = () => (
    <>
      <div className="info-card-image-wrapper">
        <img
          src={image}
          alt={title || 'Info Card'}
          className="info-card-image"
          loading="lazy"
        />
      </div>
      
      <div className="info-card-content">
        {title && (
          <h3 className="info-card-title">
            {title}
          </h3>
        )}
        
        {description && (
          <p className="info-card-description">
            {description}
          </p>
        )}
        
        {ctaText && href && (
          <Link
            className="info-card-button"
            to={href}
            aria-label={ctaText}
          >
            <span className="info-card-button-text">
              {ctaText}
            </span>
          </Link>
        )}
      </div>
    </>
  );

  if (href) {
    return (
      <div className="info-card">
        <Link
          to={href}
          className="info-card-container"
          aria-label={`Ver mais sobre ${title}`}
        >
          <CardContent />
        </Link>
      </div>
    );
  }

  return (
    <div className="info-card">
      <div className="info-card-container">
        <CardContent />
      </div>
    </div>
  );
};

InfoCard.schema = {
  title: 'Info Card',
  description: 'Card individual com imagem, título, descrição e botão CTA',
  type: 'object',
  properties: {
    image: {
      title: 'Imagem',
      description: 'URL da imagem do card',
      type: 'string'
    },
    title: {
      title: 'Título',
      description: 'Título do card',
      type: 'string'
    },
    description: {
      title: 'Descrição',
      description: 'Descrição/subtítulo do card',
      type: 'string'
    },
    ctaText: {
      title: 'Texto do CTA',
      description: 'Texto do botão call-to-action',
      type: 'string',
      default: 'Saiba mais'
    },
    href: {
      title: 'Link',
      description: 'URL para o link',
      type: 'string'
    }
  },
  required: ['image', 'title']
};

export default InfoCard;