import React from 'react'
import styles from './style.module.css'

const AppBanner = props => {
  return (
    <div className={styles.wrapperBannerApp}>
      <div className={styles.wrapperLogoText}>
        <div className={styles.wrapperLogoImg}>
          <img
            src="https://stevia.vteximg.com.br/arquivos/biostevi-title-logo.svg"
            alt=""
            width={39}
            height={24}
            loading="eager"
          />
        </div>
        <div className={styles.wrapperTextContent}>
          <h4>Biostévi Pharma</h4>
          <p>Baixe o app Biostévi Pharma</p>
        </div>
      </div>
      <div className={styles.wrapperBtnApp}>
        <a href="/app">BAIXAR</a>
      </div>
    </div>
  )
}

export default AppBanner
