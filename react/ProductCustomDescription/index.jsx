import React from 'react'
import { useProduct } from 'vtex.product-context'

// import { Container } from './styles';

function ProductCustomDescription () {
  const productContextValue = useProduct()

  return (
    <div>
      <div class="Descricao--Inline">
        <p
          dangerouslySetInnerHTML={{
            __html: productContextValue.product.metaTagDescription,
          }}
        ></p>
      </div>
    </div>
  )
}

export { ProductCustomDescription  }
