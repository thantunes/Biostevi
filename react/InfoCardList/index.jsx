import React, { Children, cloneElement, isValidElement } from 'react';
import { Link } from 'vtex.render-runtime';
import { ListContextProvider } from 'vtex.list-context';

const ArrowIcon = () => (
  <svg 
    className="vtex-InfoCardList--euquero-anchor-arrow"
    width="16" 
    height="16" 
    viewBox="0 0 16 16" 
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M6 12L10 8L6 4" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

const InfoCard = ({
  image,
  title,
  description,
  ctaText = 'Saiba mais',
  href,
  enableCta = false,
}) => {
  const CardContent = () => (
    <>
      <div className="vtex-InfoCardList--image-wrapper">
        <img
          src={image}
          alt={title || 'Info Card'}
          className="vtex-InfoCardList--card-image"
          loading="lazy"
        />
      </div>
      
      <div className="vtex-InfoCardList--content">
        {title && (
          <h3 className="vtex-InfoCardList--card-title">
            {title}
          </h3>
        )}
        
        {description && (
          <p className="vtex-InfoCardList--card-description">
            {description}
          </p>
        )}
        
        {enableCta && href && (
          <Link
            className="vtex-InfoCardList--card-button"
            to={href}
            aria-label={ctaText}
          >
            <span className="vtex-InfoCardList--card-button-text">
              {ctaText}
            </span>
          </Link>
        )}
      </div>
    </>
  );

  if (href) {
    return (
      <div className="vtex-InfoCardList--card">
        <Link
          to={href}
          className="vtex-InfoCardList--card-container"
          aria-label={`Ver mais sobre ${title}`}
        >
          <CardContent />
        </Link>
      </div>
    );
  }

  return (
    <div className="vtex-InfoCardList--card">
      <div className="vtex-InfoCardList--card-container">
        <CardContent />
      </div>
    </div>
  );
};

InfoCard.displayName = 'InfoCard';

const InfoCardEuQuero = ({
  backgroundImage,
  icon,
  title,
  description,
  anchor,
  href,
  target = '_self',
}) => {
  const backgroundStyle = {
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
  };

  const isExternal = href && (href.startsWith('http://') || href.startsWith('https://'));
  const linkTarget = target === '_blank' ? '_blank' : '_self';
  const linkRel = linkTarget === '_blank' ? 'noopener noreferrer' : undefined;
  const ariaLabel = `${anchor || 'Ver mais'} - ${title}`;

  const cardContent = (
    <>
      {icon && (
        <div className="vtex-InfoCardList--euquero-icon">
          <img
            src={icon}
            alt=""
            className="vtex-InfoCardList--euquero-icon-img"
            loading="lazy"
          />
        </div>
      )}
      
      <div 
        className="vtex-InfoCardList--euquero-background"
        style={backgroundStyle}
      >
        <div 
          className="vtex-InfoCardList--euquero-overlay vtex-InfoCardList--euquero-overlay-hover"
        />
      </div>
      
      <div className="vtex-InfoCardList--euquero-content">
        {title && (
          <h3 className="vtex-InfoCardList--euquero-title">
            {title}
          </h3>
        )}
        
        {description && (
          <p className="vtex-InfoCardList--euquero-description">
            {description}
          </p>
        )}
        
        {anchor && href && (
          <div className="vtex-InfoCardList--euquero-anchor">
            <span className="vtex-InfoCardList--euquero-anchor-text">
              {anchor}
            </span>
            <ArrowIcon />
          </div>
        )}
      </div>
    </>
  );

  if (href) {
    if (isExternal) {
      return (
        <div className="vtex-InfoCardList--euquero">
          <a
            href={href}
            target={linkTarget}
            rel={linkRel}
            className="vtex-InfoCardList--euquero-container"
            aria-label={ariaLabel}
          >
            {cardContent}
          </a>
        </div>
      );
    }

    return (
      <div className="vtex-InfoCardList--euquero">
        <Link
          to={href}
          target={linkTarget}
          className="vtex-InfoCardList--euquero-container"
          aria-label={ariaLabel}
        >
          {cardContent}
        </Link>
      </div>
    );
  }

  return (
    <div className="vtex-InfoCardList--euquero">
      <div className="vtex-InfoCardList--euquero-container">
        {cardContent}
      </div>
    </div>
  );
};

InfoCardEuQuero.displayName = 'InfoCardEuQuero';

const InfoCardList = ({ cards = [], children, layoutType = 'influenciadores' }) => {
  const containerClass = layoutType === 'euquero' 
    ? 'vtex-InfoCardList--container vtex-InfoCardList--container-euquero' 
    : 'vtex-InfoCardList--container';
  
  const wrapperClass = layoutType === 'euquero'
    ? 'vtex-InfoCardList--wrapper vtex-InfoCardList--wrapper-euquero'
    : 'vtex-InfoCardList--wrapper';

  let cardElements = [];

  if (cards && cards.length > 0) {
    if (layoutType === 'euquero') {
      cardElements = cards.map((card, index) => (
        <InfoCardEuQuero
          key={`euquero-${index}-${card.title || ''}-${card.href || ''}`}
          backgroundImage={card.backgroundImage}
          icon={card.icon}
          title={card.title}
          description={card.description}
          anchor={card.anchor}
          href={card.href}
          target={card.target}
        />
      ));
    } else {
      cardElements = cards.map((card, index) => (
        <InfoCard
          key={`influenciadores-${index}-${card.title || ''}-${card.href || ''}`}
          image={card.image}
          title={card.title}
          description={card.description}
          ctaText={card.ctaText}
          href={card.href}
          enableCta={card.enableCta}
        />
      ));
    }
  }

  if (children && cardElements.length > 0) {
    const enhancedChildren = Children.map(children, child => {
      if (!isValidElement(child)) {
        return child;
      }
      return cloneElement(child, child.props, cardElements);
    });

    return (
      <ListContextProvider list={cardElements}>
        <div className={containerClass}>
          <div className={wrapperClass}>{enhancedChildren}</div>
        </div>
      </ListContextProvider>
    );
  }

  if (cardElements.length > 0) {
    return (
      <div className={containerClass}>
        <div className={wrapperClass}>{cardElements}</div>
      </div>
    );
  }

  if (children) {
    return (
      <div className={containerClass}>
        <div className={wrapperClass}>{children}</div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <div className={wrapperClass} />
    </div>
  );
};

const SingleInfoCard = ({
  image,
  title,
  description,
  ctaText = 'Saiba mais',
  href,
  enableCta = false,
  layoutType = 'influenciadores',
  backgroundImage,
  icon,
  anchor,
  target,
}) => {
  if (layoutType === 'euquero') {
    return (
      <div className="vtex-InfoCardList--slide">
        <InfoCardEuQuero
          backgroundImage={backgroundImage}
          icon={icon}
          title={title}
          description={description}
          anchor={anchor}
          href={href}
          target={target}
        />
      </div>
    );
  }

  return (
    <div className="vtex-InfoCardList--slide">
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
};

SingleInfoCard.displayName = 'SingleInfoCard';

InfoCardList.schema = {
  title: 'Lista de Info Cards',
  description: 'Crie e gerencie facilmente uma lista de cards informativos',
  type: 'object',
  properties: {
    layoutType: {
      title: '🎨 Tipo de Layout',
      description: 'Escolha o estilo de layout dos cards',
      type: 'string',
      enum: ['influenciadores', 'euquero'],
      enumNames: ['Influenciadores', 'Eu Quero'],
      default: 'influenciadores'
    },
    cards: {
      title: '📋 Gerenciar Cards',
      description: 'Adicione, edite ou remova cards da lista',
      type: 'array',
      minItems: 1,
      maxItems: 30,
      items: {
        title: 'Card',
        type: 'object',
        properties: {
          image: {
            title: '🖼️ Imagem (Influenciadores)',
            description: 'URL da imagem do card para layout Influenciadores (recomendado: 400x400px)',
            type: 'string',
            widget: {
              'ui:widget': 'image-uploader'
            }
          },
          backgroundImage: {
            title: '🖼️ Imagem de Fundo (Eu Quero)',
            description: 'URL da imagem de fundo para layout Eu Quero',
            type: 'string',
            widget: {
              'ui:widget': 'image-uploader'
            }
          },
          icon: {
            title: '🎯 Ícone (Eu Quero)',
            description: 'URL do ícone que aparece no topo esquerdo do card (Eu Quero)',
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
            title: '🔗 Texto do Botão (Influenciadores)',
            description: 'Texto do botão de ação para layout Influenciadores (ex: "Saiba mais", "Ver produtos")',
            type: 'string',
            default: 'Saiba mais',
            maxLength: 20
          },
          anchor: {
            title: '🔗 Texto do Link (Eu Quero)',
            description: 'Texto do link/anchor para layout Eu Quero (ex: "Ver produtos")',
            type: 'string',
            maxLength: 30
          },
          href: {
            title: '🌐 Link de Destino',
            description: 'URL para onde o card deve levar (ex: /produtos, https://...)',
            type: 'string'
          },
          target: {
            title: '🎯 Target do Link (Eu Quero)',
            description: 'Como o link deve abrir',
            type: 'string',
            enum: ['_self', '_blank'],
            enumNames: ['Mesma aba (_self)', 'Nova aba (_blank)'],
            default: '_self'
          },
          enableCta: {
            title: '🔘 Habilitar Botão CTA (Influenciadores)',
            description: 'Ativa ou desativa a exibição do botão de ação no card (Influenciadores)',
            type: 'boolean',
            default: true
          }
        },
        required: ['title', 'description']
      }
    },
  }
};

export default InfoCardList;
export { SingleInfoCard };
