import React, { useMemo } from 'react';
import { Link } from 'vtex.render-runtime';
import { ListContextProvider } from 'vtex.list-context';
import './index.global.css';

const InfoCard = React.memo(({
  image,
  title,
  description,
  ctaText = 'Saiba mais',
  href,
  enableCta = false
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
        
        {enableCta && href && (
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

  // Se tem href, renderiza como link
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

  // Se não tem href, renderiza como div
  return (
    <div className="info-card">
      <div className="info-card-container">
        <CardContent />
      </div>
    </div>
  );
});

const InfoCardList = React.memo((props) => {
  const { cards = [], children } = props;
  
  const cardElements = useMemo(() => {
    if (!cards || cards.length === 0) return [];
    
    return cards.map((card, index) => (
      <InfoCard
        key={`${card.title}-${card.href}-${index}`}
        image={card.image}
        title={card.title}
        description={card.description}
        ctaText={card.ctaText}
        href={card.href}
        enableCta={card.enableCta}
      />
    ));
  }, [cards]);
  
  if (children && cards && cards.length > 0) {

    return (
      <ListContextProvider list={cardElements}>
        <div className="info-card-list-container">
          <div className="info-card-list-wrapper">
            {children}
          </div>
        </div>
      </ListContextProvider>
    );
  }

  // Fallback: renderiza sem ListContextProvider
  return (
    <div className="info-card-list-container">
      <div className="info-card-list-wrapper">
        {children}
        {!children && cardElements}
        {!children && (!cards || cards.length === 0) && (
          <div>Sem children e sem cards</div>
        )}
      </div>
    </div>
  );
});

// Componente individual para ser usado diretamente no slider
const SingleInfoCard = React.memo(({
  image,
  title,
  description,
  ctaText = 'Saiba mais',
  href,
  enableCta = false
}) => {
  return (
    <div className="info-card-slide">
      <InfoCard
        image={image}
        title={title}
        description={description}
        ctaText={ctaText}
        href={href}
        enableCta={enableCta}
      />
    </div>
  );
});

InfoCardList.schema = {
  title: 'Lista de Info Cards',
  description: 'Crie e gerencie facilmente uma lista de cards informativos',
  type: 'object',
  properties: {
    cards: {
      title: '📋 Gerenciar Cards',
      description: 'Adicione, edite ou remova cards da lista',
      type: 'array',
      minItems: 1,
      maxItems: 10,
      items: {
        title: 'Card',
        type: 'object',
        properties: {
          image: {
            title: '🖼️ Imagem',
            description: 'URL da imagem do card (recomendado: 400x400px)',
            type: 'string',
            widget: {
              'ui:widget': 'image-uploader'
            }
          },
          title: {
            title: '📝 Título',
            description: 'Título principal do card (máx. 50 caracteres)',
            type: 'string',
            maxLength: 50
          },
          description: {
            title: '📄 Descrição',
            description: 'Descrição ou subtítulo do card (máx. 120 caracteres)',
            type: 'string',
            maxLength: 120
          },
          ctaText: {
            title: '🔗 Texto do Botão',
            description: 'Texto do botão de ação (ex: "Saiba mais", "Ver produtos")',
            type: 'string',
            default: 'Saiba mais',
            maxLength: 20
          },
          href: {
            title: '🌐 Link de Destino',
            description: 'URL para onde o card deve levar (ex: /produtos, https://...)',
            type: 'string'
          },
          enableCta: {
            title: '🔘 Habilitar Botão CTA',
            description: 'Ativa ou desativa a exibição do botão de ação no card',
            type: 'boolean',
            default: true
          }
        },
        required: ['image', 'title', 'description']
      }
    },
  }
};

export default InfoCardList;
export { SingleInfoCard };
