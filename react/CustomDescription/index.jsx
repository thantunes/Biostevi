import React from 'react'
import { useProduct } from 'vtex.product-context'

// import { Container } from './styles';

function CustomDescription({ children }) {
  const productContextValue = useProduct()
  const hasShortDescription =
    productContextValue?.product?.properties.find(e => e.name == 'Descrição Objetiva')
      ?.values.length >= 1
  const shortDescription = productContextValue?.product?.properties.find(
    e => e.name == 'Descrição Objetiva'
  )?.values[0]

  return (
    <div>
      {hasShortDescription ? (
        <p
          style={{
            color: '#555',
            marginBottom: 10,
            fontSize: 12,
            fontFamily: 'Signika',
            fontWeight: 400,
            marginTop: 12,
            textAlign: 'left',
          }}
        >
          {shortDescription}
        </p>
      ) : (
        [children]
      )}
      {/* <div class="Descricao--Inline">
                <p  dangerouslySetInnerHTML={{ __html: productContextValue.product.metaTagDescription }}></p>
            </div> */}
    </div>
  )
}

export { CustomDescription }
