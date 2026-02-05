import React, { useEffect, useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useProduct } from 'vtex.product-context'
import { useOrderItems } from 'vtex.order-items/OrderItems'
import './index.global.css'

const CSS_HANDLES = [
  'BuyTogether__Title',
  'BuyTogether__Box',
  'BuyTogether__Container',
  'BuyTogether__Product__Image',
  'BuyTogether__Product__Name',
  'BuyTogether__Product__Price',
]

const BuyTogether = () => {
  const ProductRef = useProduct()
  const { addItems } = useOrderItems()
  const handles = useCssHandles(CSS_HANDLES)
  const [prodData, setProdData] = useState(null)
  const [prodsToUse, setProdsToUse] = useState([])

  useEffect(() => {
    if (!ProductRef || !ProductRef.product) return

    const productId = ProductRef.product.productId

    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/catalog_system/pub/products/crossselling/showtogether/${productId}`
        )
        const data = await response.json()
        setProdData(data)
      } catch (error) {
        console.error('Error fetching product data:', error)
      }
    }

    fetchData()
  }, [ProductRef])

  useEffect(() => {
    if (ProductRef && prodData && prodData.length > 0) {
      setProdsToUse([ProductRef?.product, ...prodData || []])
    }
  }, [ProductRef, prodData])

  const saveData = async (prodSelected) => {
    try {
      const productId = ProductRef.product.productId
      const response = await fetch(
        `/api/catalog_system/pub/products/search?fq=productId:${productId}`
      )
      const data = await response.json()
      populateCart(data, prodSelected)
      window.location.hash = '#top'
    } catch (error) {
      console.error('Error fetching product data for cart:', error)
    }
  }

  const populateCart = (dataF, dataS) => {
    console.warn(dataF, dataS)
    const cart = [
      {
        additionalInfo: {
          brandName: dataF[0].brand,
          __typename: 'ItemAdditionalInfo',
        },
        availability: dataF[0].items[0].sellers[0].commertialOffer.IsAvailable,
        id: dataF[0].items[0].itemId,
        imageUrls: {
          at1x: dataF[0].items[0].images[0].imageUrl,
          __typename: 'ImageUrls',
        },
        listPrice: dataF[0].items[0].sellers[0].commertialOffer.ListPrice,
        measurementUnit: dataF[0].items[0].measurementUnit,
        name: dataF[0].productName,
        price: dataF[0].items[0].sellers[0].commertialOffer.Price,
        productId: dataF[0].productId,
        quantity: 1,
        seller: dataF[0].items[0].sellers[0].sellerId,
        sellingPrice: dataF[0].items[0].sellers[0].commertialOffer.Price,
        skuName: dataF[0].items[0].nameComplete,
        unitMultiplier: dataF[0].items[0].unitMultiplier,
        uniqueId: dataF[0].items[0].itemId,
        isGift: false,
        __typename: 'Item',
      },
      {
        additionalInfo: {
          brandName: dataS[0].brand,
          __typename: 'ItemAdditionalInfo',
        },
        availability: dataS[0].items[0].sellers[0].commertialOffer.IsAvailable,
        id: dataS[0].items[0].itemId,
        imageUrls: {
          at1x: dataS[0].items[0].images[0].imageUrl,
          __typename: 'ImageUrls',
        },
        listPrice: dataS[0].items[0].sellers[0].commertialOffer.ListPrice,
        measurementUnit: dataS[0].items[0].measurementUnit,
        name: dataS[0].productName,
        price: dataS[0].items[0].sellers[0].commertialOffer.Price,
        productId: dataS[0].productId,
        quantity: 1,
        seller: dataS[0].items[0].sellers[0].sellerId,
        sellingPrice: dataS[0].items[0].sellers[0].commertialOffer.Price,
        skuName: dataS[0].items[0].nameComplete,
        unitMultiplier: dataS[0].items[0].unitMultiplier,
        uniqueId: dataS[0].items[0].itemId,
        isGift: false,
        __typename: 'Item',
      },
    ]
    
    addItems(cart)

    const modal = document.createElement('div')
    modal.style.position = 'fixed'
    modal.style.bottom = '20px'
    modal.style.left = '10vw'
    modal.style.maxWidth = '300px'
    modal.style.borderRadius = '5px'
    modal.style.backgroundColor = '#2D6100'
    modal.style.color = 'white'
    modal.style.zIndex = '90000'
    modal.style.padding = '20px'
    modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'
    modal.innerText = 'Produtos Adicionados ao Carrinho'

    document.body.appendChild(modal)

    setTimeout(() => {
      document.body.removeChild(modal)
    }, 4500)
  }

  const formatPrice = value => {
    return value?.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      style: 'currency',
      currency: 'BRL',
    })
  }

  return (
    prodsToUse.length >= 2 && prodsToUse.every(product => product && product.items && product.items[0]) && (
      <div className={`BuyTogether__Box`} id="buy-together-box">
        <h2>Compre Junto</h2>
        {prodsToUse.map((product, index) =>
          index > 0 ? (
            <div key={index} className="BuyTogether__Container__Row">
              <div className="BuyTogether__Container__Row__Container">
                <div className="BuyTogether__Container__Row__Prod">
                  <div className={`BuyTogether__Container`}>
                    <div className={`BuyTogether__Product__Image`}>
                      <img
                        style={{ aspectRatio: '1/1', width: '100%', height: 'auto', objectFit: 'contain' }}
                        src={prodsToUse[0].items[0].images[0].imageUrl}
                        alt={prodsToUse[0].items[0].images[0].imageText}
                        loading="lazy"
                      />
                    </div>
                    <div className={`BuyTogether__Product__Name`}>
                      <h3>{prodsToUse[0].productName}</h3>
                    </div>
                    <div className={`BuyTogether__Product__Price`}>
                      {formatPrice(
                        prodsToUse[0].items[0].sellers[0].commertialOffer.Price
                      )}
                    </div>
                  </div>
                  <div className={`BuyTogether__Container`}>
                    <div className={`BuyTogether__Product__Image`}>
                      <img
                        style={{ aspectRatio: '1/1', width: '100%', height: 'auto', objectFit: 'contain' }}
                        src={product.items[0].images[0].imageUrl}
                        alt={product.items[0].images[0].imageText}
                        loading="lazy"
                      />
                    </div>
                    <div className={`BuyTogether__Product__Name`}>
                      <h3>{product.productName}</h3>
                    </div>
                    <div className={`BuyTogether__Product__Price`}>
                      {formatPrice(product.items[0].sellers[0].commertialOffer.Price)}
                    </div>
                  </div>
                </div>
                <div
                  className="BuyTogether__Container__Row__Buy"
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <p style={{ margin: '0px 25px', fontSize: '38px' }}>=</p>
                  <div
                    className="BuyTogether__Container__Row__Desc"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <p style={{ margin: '0px', fontFamily: 'Signika' }}>Comprando dois Produtos por</p>
                    <p className="BuyTogether__Product__Price" style={{ fontWeight: 'bolder', fontSize: '22px' }}>
                      {formatPrice(
                        prodsToUse[0].items[0].sellers[0].commertialOffer.Price +
                        product.items[0].sellers[0]
                          .commertialOffer.Price
                      )}
                    </p>
                    <button
                      className="BuyTogether__Container__BuyButton"
                      onClick={() =>
                        saveData(
                          [product]
                        )
                      }
                    >
                      Adicionar ao Carrinho
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null
        )}
      </div>
    )
  )
}

export default BuyTogether
