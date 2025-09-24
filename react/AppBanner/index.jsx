import React from 'react'
import styles from './style.module.css'

const AppBanner = ({
  mainTitle,
  subtitle,
  buttonText,
  buttonLink,
}) => {
  return (
    <div className={styles.wrapperBannerApp}>
      <div className={styles.wrapperLogoText}>
        <div className={styles.wrapperLogoImg}>
          <img
            src="https://stevia.vteximg.com.br/arquivos/biostevi-title-logo.svg"
            alt="Biostévi"
            width="39"
            height="24"
            loading="eager"
            fetchpriority="high"
          />
        </div>
        <div className={styles.wrapperTextContent}>
          <span>{mainTitle}</span>
          <p>{subtitle}</p>
        </div>
      </div>
      <div className={styles.wrapperBtnApp}>
        <a 
          href={buttonLink}
          aria-label="Baixar aplicativo Biostévi Pharma"
          tabIndex="0"
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
    }
  }
}

export default AppBanner
