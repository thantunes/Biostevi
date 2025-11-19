import { useProduct } from 'vtex.product-context'

function RewardValue() {
  const productContext = useProduct()

  if (!productContext.product) return null

  const selectedItem = productContext.selectedItem
  console.log('rewardvalue selectedItem: ', selectedItem)
  const productPrice = selectedItem.sellers[0]?.commertialOffer?.Price
  console.log('rewardvalue productPrice: ', productPrice)
  const cashbackValue = selectedItem.sellers[0]?.commertialOffer?.RewardValue
  console.log('rewardvalue cashbackValue: ', cashbackValue)
  if (!cashbackValue || !productPrice || !selectedItem) return null
  
  const cashbackPercentage = (cashbackValue / productPrice) * 100
  console.log('rewardvalue cashbackPercentage: ', cashbackPercentage)

  return (
    <div>
      <p style={{ color: '#009fc2' }}>
        <strong>Ganhe {cashbackPercentage.toFixed(2)}% de cashback</strong>
      </p>
    </div>
  )
}

export default RewardValue
