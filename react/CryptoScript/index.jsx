import { useEffect } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { OrderForm } from 'vtex.order-manager'
import axios from 'axios'

const CryptoScript = () => {
  const runtime = useRuntime()
  const { useOrderForm } = OrderForm
  const orderFormContext = useOrderForm()
  const isLoggedIn = orderFormContext.orderForm.loggedIn

  useEffect(() => {
    const script = document.createElement('script')
    script.src =
      'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js'
    document.head.appendChild(script)

    if (runtime.page !== 'store.product') {
      document.body.style.overflowY = 'hidden'

      const style = document.createElement('style')
      style.innerHTML = 'html { overflow: auto; }'
      document.head.appendChild(style)
    }
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      const mobileMenuGreeting = document.querySelector(
        '.vtex-flex-layout-0-x-flexCol--mobile-menu-message'
      )

      if (mobileMenuGreeting) {
        mobileMenuGreeting.style.display = 'none'
      }
    }
  }, [isLoggedIn])

  return null
}

export default CryptoScript
