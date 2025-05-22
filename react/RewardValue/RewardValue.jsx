import { useProduct } from 'vtex.product-context'

function RewardValue() {
  const productContext = useProduct()

  if (!productContext.product) return null

  const product = productContext.product
  const selectedItem = productContext.selectedItem
  if (!selectedItem.sellers[0]?.commertialOffer?.RewardValue) return null
  // console.log('Informações do produto: ')
  // console.log(product)
  // console.log(productContext)
  // console.log(selectedItem)

  return (
    <div>
      <p><strong>Ganhe R${selectedItem.sellers[0]?.commertialOffer?.RewardValue?.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} de cashback</strong></p>
    </div>
  )
}

export default RewardValue