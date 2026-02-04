import React from 'react'

const AppBanner = ({
  mainTitle,
  subtitle,
  buttonText,
  buttonLink,
  backgroundColor = '#000',
  mainTitleColor = '#fff',
  subtitleColor = '#fff',
  buttonBackgroundColor = '#009fc2',
  buttonTextColor = '#fff',
}) => {
  return (
    <div
      className="vtex-AppBanner--wrapper"
      style={{ backgroundColor }}
    >
      <div className="vtex-AppBanner--logo-text">
        <div className="vtex-AppBanner--logo-img">
          <img
            src="https://stevia.vteximg.com.br/arquivos/biostevi-title-logo.svg"
            alt="Biostévi"
            width="39"
            height="24"
            loading="eager"
            fetchpriority="high"
          />
        </div>
        <div className="vtex-AppBanner--text-content">
          <span style={{ color: mainTitleColor }}>{mainTitle}</span>
          <p style={{ color: subtitleColor }}>{subtitle}</p>
        </div>
      </div>
      <div className="vtex-AppBanner--btn">
        <a
          href={buttonLink}
          aria-label="Baixar aplicativo Biostévi Pharma"
          tabIndex="0"
          style={{
            backgroundColor: buttonBackgroundColor,
            color: buttonTextColor
          }}
        >
          {buttonText}
        </a>
      </div>
    </div>
  )
}

AppBanner.schema = {
  title: "App Banner",
  type: "object",
  properties: {
    mainTitle: {
      type: "string",
      title: "Título Principal",
      description: "Título principal",
      default: "Biostévi Pharma"
    },
    subtitle: {
      type: "string",
      title: "Subtítulo",
      description: "Subtítulo",
      default: "Ganhe 15% Off na sua 1ª compra pelo APP"
    },
    buttonText: {
      type: "string",
      title: "Texto do Botão",
      description: "Texto do botão",
      default: "BAIXAR"
    },
    buttonLink: {
      type: "string",
      title: "Link do Botão",
      description: "Link do botão",
      default: "/app"
    },
    backgroundColor: {
      type: "string",
      title: "Cor de Fundo",
      description: "Cor de fundo do banner (ex: #000, #ffffff, rgb(0,0,0))",
      default: "#000"
    },
    mainTitleColor: {
      type: "string",
      title: "Cor do Título Principal",
      description: "Cor do texto do título principal",
      default: "#fff"
    },
    subtitleColor: {
      type: "string",
      title: "Cor do Subtítulo",
      description: "Cor do texto do subtítulo",
      default: "#fff"
    },
    buttonBackgroundColor: {
      type: "string",
      title: "Cor de Fundo do Botão",
      description: "Cor de fundo do botão",
      default: "#009fc2"
    },
    buttonTextColor: {
      type: "string",
      title: "Cor do Texto do Botão",
      description: "Cor do texto do botão",
      default: "#fff"
    }
  }
}

export default AppBanner
