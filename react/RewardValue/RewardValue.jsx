import { useState, useEffect } from 'react'
import { useProduct } from 'vtex.product-context'

const RewardValue = () => {
  const { product, selectedItem } = useProduct()
  const [apiData, setApiData] = useState(null)
  const [apiLoading, setApiLoading] = useState(true)
  const [apiError, setApiError] = useState(null)

  // Buscar dados atualizados da API da VTEX
  useEffect(() => {
    if (!product?.linkText) {
      console.log('⚠️ Não é possível buscar API: product.linkText não existe')
      setApiLoading(false)
      return
    }

    let isMounted = true
    const abortController = new AbortController()

    const fetchApiData = async () => {
      setApiLoading(true)
      setApiError(null)

      try {
        const apiUrl = `/api/catalog_system/pub/products/search/${product.linkText}/p?sc=1`
        console.log('🌐 Buscando API:', apiUrl)

        const response = await fetch(apiUrl, {
          signal: abortController.signal
        })

        console.log('📡 Response status:', response.status, response.ok)

        if (!response.ok) {
          throw new Error(`API retornou status ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        console.log('✅ API retornou:', Array.isArray(data) ? `Array com ${data.length} itens` : typeof data)

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('API não retornou dados válidos')
        }

        if (!isMounted) return

        // Estrutura da API: data[0].items[0].sellers[0].commertialOffer
        const apiProduct = data[0]
        const apiItem = apiProduct?.items?.[0]

        console.log('📦 Estrutura da API:')
        console.log('  • apiProduct:', !!apiProduct)
        console.log('  • apiItem:', !!apiItem)
        console.log('  • Quantidade de sellers:', apiItem?.sellers?.length)

        if (!apiProduct || !apiItem) {
          throw new Error('Estrutura de dados inválida na resposta da API')
        }

        // Verificar TODOS os sellers para encontrar o maior RewardValue
        let apiSeller = null
        let apiCommercialOffer = null
        let maxRewardValue = 0

        if (apiItem?.sellers && apiItem.sellers.length > 0) {
          console.log('🔍 Verificando todos os sellers:')
          apiItem.sellers.forEach((seller, index) => {
            const offer = seller?.commertialOffer
            const rewardValue = offer?.RewardValue || 0
            console.log(`  • Seller ${index + 1} (${seller?.sellerName || seller?.sellerId}):`)
            console.log(`    - RewardValue: ${rewardValue}`)
            console.log(`    - Price: ${offer?.Price}`)
            console.log(`    - spotPrice: ${offer?.spotPrice}`)

            // Pegar o seller com maior RewardValue (promoção mais vantajosa)
            if (rewardValue > maxRewardValue) {
              maxRewardValue = rewardValue
              apiSeller = seller
              apiCommercialOffer = offer
            }
          })
        } else {
          // Fallback: pegar o primeiro seller
          apiSeller = apiItem?.sellers?.[0]
          apiCommercialOffer = apiSeller?.commertialOffer
        }

        console.log('✅ Seller selecionado:', apiSeller?.sellerName || apiSeller?.sellerId)
        console.log('💰 commertialOffer completo:', apiCommercialOffer)
        console.log('💰 RewardValue FINAL:', apiCommercialOffer?.RewardValue)
        console.log('💰 Price:', apiCommercialOffer?.Price)
        console.log('💰 spotPrice:', apiCommercialOffer?.spotPrice)
        console.log('💰 ListPrice:', apiCommercialOffer?.ListPrice)
        console.log('💰 DiscountHighLight:', apiCommercialOffer?.DiscountHighLight)
        console.log('💰 Teasers:', apiCommercialOffer?.Teasers)
        console.log('💰 PromotionTeasers:', apiCommercialOffer?.PromotionTeasers)

        if (!apiSeller || !apiCommercialOffer) {
          throw new Error('Seller ou CommercialOffer não encontrado na resposta da API')
        }

        const apiResult = {
          rewardValue: apiCommercialOffer?.RewardValue,
          skuRewardValue: apiItem?.RewardValue ?? apiItem?.rewardValue,
          price: apiCommercialOffer?.spotPrice ?? apiCommercialOffer?.Price,
          fullData: data,
          product: apiProduct,
          item: apiItem,
          seller: apiSeller,
          commercialOffer: apiCommercialOffer
        }

        console.log('✅ API processada:', {
          rewardValue: apiResult.rewardValue,
          skuRewardValue: apiResult.skuRewardValue,
          price: apiResult.price,
          rewardValueType: typeof apiResult.rewardValue,
          rewardValueIsNumber: Number.isFinite(apiResult.rewardValue)
        })

        setApiData(apiResult)
        setApiLoading(false)

      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('⏱️ Requisição cancelada')
          return
        }

        console.error('❌ Erro na API:', error.message)

        if (isMounted) {
          setApiError(error.message)
          setApiLoading(false)
        }
      }
    }

    fetchApiData()

    return () => {
      isMounted = false
      abortController.abort()
    }
  }, [product?.linkText])

  // Render simples apenas para testar a API
  if (apiLoading) {
    return <div>Carregando API...</div>
  }

  if (apiError) {
    return (
      <div style={{ border: '2px solid red', padding: '10px', margin: '10px' }}>
        <p style={{ color: 'red', fontWeight: 'bold' }}>Erro na API:</p>
        <p>{apiError}</p>
        <p>URL: /api/catalog_system/pub/products/search/{product?.linkText}/p?sc=1</p>
      </div>
    )
  }

  if (apiData) {
    // IMPORTANTE: Todos os valores são NOMINAIS em Reais
    // Sempre calcular percentual: (valorNominal / preço) * 100
    const rewardValue = apiData.rewardValue // Valor nominal em reais (promoção)
    const skuRewardValue = apiData.skuRewardValue // Valor nominal em reais (SKU)
    const price = apiData.price // Preço do produto

    let cashbackValue = null // Valor nominal em reais
    let cashbackPercentage = null
    let isValid = false

    // Prioridade: RewardValue da promoção > RewardValue do SKU
    if (rewardValue && Number.isFinite(rewardValue) && rewardValue > 0) {
      // Promoção: usar RewardValue (nominal em reais)
      cashbackValue = rewardValue
    } else if (skuRewardValue && Number.isFinite(skuRewardValue) && skuRewardValue > 0) {
      // SKU: usar RewardValue do SKU (nominal em reais)
      cashbackValue = skuRewardValue
    }

    // Calcular percentual se temos valor nominal e preço válidos
    if (cashbackValue && price && Number.isFinite(price) && price > 0) {
      cashbackPercentage = (cashbackValue / price) * 100
      isValid = true
    }

    return (
      <>
        {/* Debug */}
        <div style={{ border: '2px solid green', padding: '10px', margin: '10px' }}>
          <div>
            <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
              <pre style={{ fontSize: '10px', overflow: 'auto', maxHeight: '200px' }}>URL: /api/catalog_system/pub/products/search/{product?.linkText}/p?sc=1</pre>
              <strong>Valores da API (NOMINAIS em Reais):</strong>
            </p>
            <p style={{ fontSize: '14px', color: apiData.rewardValue && apiData.rewardValue > 0 ? 'green' : 'gray' }}>
              <strong>RewardValue (commertialOffer):</strong> {apiData.rewardValue !== undefined ? `R$ ${apiData.rewardValue.toFixed(2)}` : 'undefined'}
            </p>
            <p style={{ fontSize: '14px', color: apiData.skuRewardValue && apiData.skuRewardValue > 0 ? 'green' : 'gray' }}>
              <strong>SKU RewardValue:</strong> {apiData.skuRewardValue !== undefined ? `R$ ${apiData.skuRewardValue.toFixed(2)}` : 'undefined'}
            </p>
            <p style={{ fontSize: '14px' }}>
              <strong>Price:</strong> {apiData.price ? `R$ ${apiData.price.toFixed(2)}` : 'undefined'}
            </p>
            <p style={{ fontSize: '14px' }}>
              <strong>Seller:</strong> {apiData.seller?.sellerName || apiData.seller?.sellerId || 'N/A'}
            </p>
            
            <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
              <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
                <strong>Valores Calculados:</strong>
              </p>
              <p style={{ fontSize: '14px', color: cashbackValue ? 'green' : 'red' }}>
                <strong>Cashback Valor Nominal:</strong> {cashbackValue ? `R$ ${cashbackValue.toFixed(2)}` : 'N/A'}
              </p>
              <p style={{ fontSize: '14px', color: cashbackPercentage ? 'green' : 'red' }}>
                <strong>Cashback Percentual:</strong> {cashbackPercentage ? `${cashbackPercentage.toFixed(2)}%` : 'N/A'}
              </p>
              <p style={{ fontSize: '14px', color: isValid ? 'green' : 'red' }}>
                <strong>Status:</strong> {isValid ? '✅ Válido' : '❌ Inválido'}
              </p>
            </div>
          </div>
          <details style={{ marginTop: '10px' }}>
            <summary>commertialOffer completo</summary>
            <pre style={{ fontSize: '10px', overflow: 'auto', maxHeight: '200px' }}>
              {JSON.stringify(apiData.commercialOffer, null, 2)}
            </pre>
          </details>
          <details style={{ marginTop: '10px' }}>
            <summary>Dados completos da API</summary>
            <pre style={{ fontSize: '10px', overflow: 'auto', maxHeight: '300px' }}>
              {JSON.stringify(apiData.fullData, null, 2)}
            </pre>
          </details>
        </div>

        {/* Mensagem de cashback */}
        {isValid && cashbackPercentage && (
          <p style={{ color: '#009fc2' }}>
            <strong data-nominal-value={`(R$ ${cashbackValue.toFixed(2)})`}>
                Ganhe {cashbackPercentage.toFixed(2)}% de cashback
            </strong>
          </p>
        )}
      </>
    )
  }

  return <div style={{ display: 'none' }}>Aguardando dados...</div>
}

export default RewardValue
