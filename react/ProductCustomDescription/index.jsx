import React from 'react'
import { useProduct } from 'vtex.product-context'

function ProductCustomDescription() {
  const productContextValue = useProduct()
  const shortDescription = productContextValue?.product?.properties.find(
    e => e.name == 'Descrição Objetiva'
  )

  return (
    <div>
      <div class="Descricao--Inline">
        {shortDescription ? (
          <p>{shortDescription?.values[0]}</p>
        ) : (
          <p
            dangerouslySetInnerHTML={{
              __html: productContextValue.product.metaTagDescription,
            }}
          ></p>
        )}
      </div>
    </div>
  )
}

export { ProductCustomDescription }
