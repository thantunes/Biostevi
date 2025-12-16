import React, {
  useMemo,
  Children,
  cloneElement,
  isValidElement,
  useRef,
} from 'react';
import { Link } from 'vtex.render-runtime';
import { ListContextProvider } from 'vtex.list-context';
import './index.global.css';

const InfoCard = React.memo(
  ({
    image,
    title,
    description,
    ctaText = 'Saiba mais',
    href,
    enableCta = false,
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
  }
);

const InfoCardEuQuero = React.memo(
  ({
    backgroundImage,
    icon,
    title,
    description,
    anchor,
    href,
    target = '_self',
  }) => {
    const overlayHoverRef = useRef(null);

    const handleMouseEnter = () => {
      if (overlayHoverRef.current) {
        overlayHoverRef.current.style.opacity = '1';
      }
    };

    const handleMouseLeave = () => {
      if (overlayHoverRef.current) {
        overlayHoverRef.current.style.opacity = '0';
      }
    };

    const CardContent = () => (
      <>
        {icon && (
          <div className="info-card-euquero-icon">
            <img
              src={icon}
              alt=""
              className="info-card-euquero-icon-img"
              loading="lazy"
            />
          </div>
        )}
        
        <div 
          className="info-card-euquero-background"
          style={{
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          }}
        >
          <div 
            className="info-card-euquero-overlay info-card-euquero-overlay-base" 
          />
          <div 
            ref={overlayHoverRef}
            className="info-card-euquero-overlay info-card-euquero-overlay-hover"
          />
        </div>
        
        <div className="info-card-euquero-content">
          {title && (
            <h3 className="info-card-euquero-title">
              {title}
            </h3>
          )}
          
          {description && (
            <p className="info-card-euquero-description">
              {description}
            </p>
          )}
          
          {anchor && href && (
            <div className="info-card-euquero-anchor">
              <span className="info-card-euquero-anchor-text">
                {anchor}
              </span>
              <svg 
                className="info-card-euquero-anchor-arrow"
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
            </div>
          )}
        </div>
      </>
    );

    const isExternal = href && (href.startsWith('http://') || href.startsWith('https://'));
    const linkTarget = target === '_blank' ? '_blank' : '_self';
    const linkRel = linkTarget === '_blank' ? 'noopener noreferrer' : undefined;

    if (href) {
      if (isExternal) {
        return (
          <div 
            className="info-card-euquero"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <a
              href={href}
              target={linkTarget}
              rel={linkRel}
              className="info-card-euquero-container"
              aria-label={`${anchor || 'Ver mais'} - ${title}`}
            >
              <CardContent />
            </a>
          </div>
        );
      }

      return (
        <div 
          className="info-card-euquero"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            to={href}
            target={linkTarget}
            className="info-card-euquero-container"
            aria-label={`${anchor || 'Ver mais'} - ${title}`}
          >
            <CardContent />
          </Link>
        </div>
      );
    }

    return (
      <div 
        className="info-card-euquero"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="info-card-euquero-container">
          <CardContent />
        </div>
      </div>
    );
  }
);

const InfoCardList = React.memo(props => {
  const { cards = [], children, layoutType = 'influenciadores' } = props;

  const cardElements = useMemo(() => {
    if (!cards || cards.length === 0) {
      return [];
    }

    if (layoutType === 'euquero') {
      return cards.map((card, index) => (
        <InfoCardEuQuero
          key={`${card.title}-${card.href}-${index}`}
          backgroundImage={card.backgroundImage}
          icon={card.icon}
          title={card.title}
          description={card.description}
          anchor={card.anchor}
          href={card.href}
          target={card.target}
        />
      ));
    }

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
  }, [cards, layoutType]);

  const enhancedChildren = useMemo(() => {
    if (!children || cardElements.length === 0) {
      return children || null;
    }

    return Children.map(children, child => {
      if (!isValidElement(child)) {
        return child;
      }

      return cloneElement(child, child.props, cardElements);
    });
  }, [children, cardElements]);

  const containerClass = layoutType === 'euquero' 
    ? 'info-card-list-container info-card-list-container-euquero' 
    : 'info-card-list-container';
  
  const wrapperClass = layoutType === 'euquero'
    ? 'info-card-list-wrapper info-card-list-wrapper-euquero'
    : 'info-card-list-wrapper';

  if (children && cardElements.length > 0) {
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
});

const SingleInfoCard = React.memo(
  ({
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
        <div className="info-card-slide">
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
  }
);

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
