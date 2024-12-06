import React, { useEffect, useState, useMemo } from 'react'
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

    const category =
      ProductRef.product.categories[ProductRef.product.categories.length - 1]
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
      setProdsToUse([ProductRef.product, prodData[0]])
    }
  }, [ProductRef, prodData])

  const saveData = async () => {
    try {
      const productId = ProductRef.product.productId
      const response = await fetch(
        `/api/catalog_system/pub/products/search?fq=productId:${productId}`
      )
      const data = await response.json()
      populateCart(data, prodData)
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
    // O addItems ele espera receber um array de objeto com informações úteis do produto para adicionar ao carrinho.
    addItems(cart)
  }

  useEffect(() => {
    setProdsToUse([ProductRef?.product, prodData?.[0]])
  }, [prodData])

  const formatPrice = value => {
    return value?.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      style: 'currency',
      currency: 'BRL',
    })
  }

  return (
    prodsToUse.length > 1 && (
    <div className={`BuyTogether__Box`} id="buy-together-box">
      <h2>Compre Junto</h2>
      <div className="BuyTogether__Container__Row">
        <div className="BuyTogether__Container__Row__Container">
          <div className="BuyTogether__Container__Row__Prod">
            {prodsToUse.map((product, index) => (
              <div key={index} className={`BuyTogether__Container`}>
                <div className={`BuyTogether__Product__Image`}>
                  <img
                    style={{ aspectRatio: '1/1', width: '100%', height: 'auto', objectFit: 'contain' }}
                    src={product?.items[0].images[0].imageUrl}
                    alt={product?.items[0].images[0].imageText}
                    loading="lazy"
                  />
                </div>
                <div className={`BuyTogether__Product__Name`}>
                  <h2>{product?.productName}</h2>
                </div>
                <div className={`BuyTogether__Product__Price`}>
                  <p>
                    {formatPrice(
                      product?.items[0].sellers[0].commertialOffer.Price
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div
            className="BuyTogether__Container__Row__Buy"
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <p style={{ margin: '0px 25px', fontSize: '52px' }}>=</p>
            <div
              className="BuyTogether__Container__Row__Desc"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <h3 style={{ margin: '0px' }}>Comprando dois Produtos por</h3>
              <p style={{ fontWeight: 'bolder', fontSize: '22px' }}>
                {formatPrice(
                  prodsToUse?.[0]?.items[0].sellers[0].commertialOffer.Price +
                    prodsToUse?.[1]?.items[0].sellers[0].commertialOffer.Price
                )}
              </p>
              <button
                className="BuyTogether__Container__BuyButton"
                onClick={saveData}
              >
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
  )
}

export default BuyTogether
