import { useEffect } from 'react'
import { useRuntime } from 'vtex.render-runtime'

const CryptoScript = () => {
  const runtime = useRuntime()

  console.log({runtime})

  useEffect(() => {
    const script = document.createElement('script')
    script.src =
      'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js'
    document.head.appendChild(script)

    if(runtime.page !== "store.product") {
      document.body.style.overflowY = 'hidden'
  
      const style = document.createElement('style');
      style.innerHTML = 'html { overflow: auto; }';
      document.head.appendChild(style);
    }

  }, [])

  return null
}

export default CryptoScript
