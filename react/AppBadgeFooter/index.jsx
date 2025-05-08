import style from './index.module.css'

function AppBadgeFooter() {
  return (
    <div className={style.wrapperAppBadge}>
      <div className={style.titleWrapper}>
        <p className={style.titleText}>Baixe o aplicativo</p>
      </div>
      <div className={style.imgWrapper}>
        <a
          href="https://play.google.com/store/apps/details?id=com.kobe.biostevi&hl=pt_BR"
          target="_blank"
          aria-label="Link para o Google Play"
        >
          <img
            src="https://stevia.vtexassets.com/assets/vtex.file-manager-graphql/images/0eb17bd5-3a9d-4430-947e-96c1cec22847___c59325400914d43829ef7706e3879c7c.png"
            alt="Link para o Google Play"
            loading="lazy"
            fetchpriority="low"
            width={150}
          />
        </a>
        <a
          href="https://apps.apple.com/mx/app/biost%C3%A9vi-pharma/id6740829799?uo=2"
          target="_blank"
          aria-label="Link para o App Store"
        >
          <img
            src="https://stevia.vtexassets.com/assets/vtex.file-manager-graphql/images/092c46b3-3e86-49be-b818-949f73431b3b___6f3de548284750ff4a46cb3ac51b8842.png"
            alt="Link para o App Store"
            loading="lazy"
            fetchpriority="low"
            width={165}
          />
        </a>
      </div>
    </div>
  )
}

export default AppBadgeFooter
