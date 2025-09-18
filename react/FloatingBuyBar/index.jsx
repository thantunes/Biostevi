import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useProduct } from 'vtex.product-context'
import './index.global.css'

const FloatingBuyBar = ({ children }) => {
    const productContext = useProduct()

    const [isVisible, setIsVisible] = useState(false)
    const [quantity, setQuantity] = useState(1)
    const [headerHeight, setHeaderHeight] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)

    const floatingBarRef = useRef(null)

    const product = productContext?.product
    const selectedItem = product?.items?.[0]
    const seller = selectedItem?.sellers?.[0]
    const commercialOffer = seller?.commertialOffer

    const updateHeaderHeight = useCallback(() => {
        const header = document.querySelector('.vtex-store-header-2-x-container') ||
            document.querySelector('.vtex-sticky-layout-0-x-wrapper--sticky-header') ||
            document.querySelector('header') ||
            document.querySelector('[data-testid="store-header"]')
        if (header) {
            setHeaderHeight(header.offsetHeight)
        }
    }, [])

    const checkBuyButtonVisibility = useCallback(() => {
        const buyButton = document.querySelector('.vtex-flex-layout-0-x-flexRowChild--pdp-botao-add-carrinho') ||
            document.querySelector('[data-testid="add-to-cart-button"]') ||
            document.querySelector('.vtex-add-to-cart-button-0-x-buttonDataContainer')

        if (!buyButton) return

        const rect = buyButton.getBoundingClientRect()
        const isButtonVisible = rect.top >= 0 && rect.bottom <= window.innerHeight

        if (!isButtonVisible && !isVisible) {
            setIsAnimating(true)
            setTimeout(() => {
                setIsVisible(true)
                setIsAnimating(false)
            }, 100)
        } else if (isButtonVisible && isVisible) {
            setIsAnimating(true)
            setIsVisible(false)
            setTimeout(() => {
                setIsAnimating(false)
            }, 300)
        }
    }, [isVisible])

    useEffect(() => {
        updateHeaderHeight()

        const handleScroll = () => {
            updateHeaderHeight()
            checkBuyButtonVisibility()
        }

        const handleResize = () => {
            updateHeaderHeight()
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        window.addEventListener('resize', handleResize)

        setTimeout(checkBuyButtonVisibility, 1000)

        return () => {
            window.removeEventListener('scroll', handleScroll)
            window.removeEventListener('resize', handleResize)
        }
    }, [checkBuyButtonVisibility, updateHeaderHeight])

    const handleQuantityChange = useCallback((newQuantity) => {
        if (newQuantity >= 1) {
            setQuantity(newQuantity)
        }
    }, [])


    const formatPrice = useCallback((price) => {
        return price?.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            style: 'currency',
            currency: 'BRL',
        })
    }, [])

    const calculateInstallments = useCallback(() => {
        if (!commercialOffer?.Installments?.length) return null

        const installment = commercialOffer.Installments.find(inst => inst.NumberOfInstallments > 1) ||
            commercialOffer.Installments[0]

        return installment
    }, [commercialOffer])

    if (typeof window !== 'undefined' && window.innerWidth < 768) return null
    if (!product || !selectedItem || !commercialOffer) return null

    const installment = calculateInstallments()
    const hasDiscount = commercialOffer.ListPrice > commercialOffer.Price

    return (
        <div
            ref={floatingBarRef}
            className={`FloatingBuyBar ${isVisible ? 'visible' : ''} ${isAnimating ? 'animating' : ''}`}
            style={{ top: `${headerHeight}px` }}
        >
            <div className="FloatingBuyBar__Container">
                <div className="FloatingBuyBar__ProductImage">
                    <img
                        src={selectedItem.images?.[0]?.imageUrl}
                        alt={selectedItem.images?.[0]?.imageText || product.productName}
                        loading="lazy"
                    />
                </div>

                <div className="FloatingBuyBar__ProductInfo">
                    <div className="FloatingBuyBar__ProductTitle">
                        <span>{product.productName}</span>
                    </div>
                    <div className="FloatingBuyBar__QuantitySelector">
                        <button
                            className="FloatingBuyBar__QuantityButton FloatingBuyBar__QuantityButton--minus"
                            onClick={() => handleQuantityChange(quantity - 1)}
                            disabled={quantity <= 1}
                            aria-label="Diminuir quantidade"
                        >
                            -
                        </button>
                        <input
                            type="number"
                            className="FloatingBuyBar__QuantityInput"
                            value={quantity}
                            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                            min="1"
                            aria-label="Quantidade"
                        />
                        <button
                            className="FloatingBuyBar__QuantityButton FloatingBuyBar__QuantityButton--plus"
                            onClick={() => handleQuantityChange(quantity + 1)}
                            aria-label="Aumentar quantidade"
                        >
                            +
                        </button>
                    </div>
                </div>

                <div className="FloatingBuyBar__PriceSection">
                    {hasDiscount && (
                        <div className="FloatingBuyBar__Discount">
                            <div className="FloatingBuyBar__OriginalPrice">
                                {formatPrice(commercialOffer.ListPrice)}
                            </div>
                            <div className="FloatingBuyBar__Savings">
                                Economize {formatPrice(commercialOffer.ListPrice - commercialOffer.Price)}
                            </div>
                        </div>
                    )}
                    {installment && installment.NumberOfInstallments > 1 && (
                        <div className="FloatingBuyBar__Installments">
                            Em até {installment.NumberOfInstallments}x <span className="FloatingBuyBar__InstallmentValue">{formatPrice(installment.Value)}</span> sem juros
                        </div>
                    )}
                    <div className="FloatingBuyBar__FinalPrice">
                        {formatPrice(commercialOffer.Price)}
                    </div>
                </div>

                <div className="FloatingBuyBar__Actions">
                    {children}
                </div>
            </div>
        </div>
    )
}

FloatingBuyBar.schema = {
    name: 'floating-buy-bar',
    title: 'Barra de Compra Flutuante',
    description: 'Barra de compra que aparece quando o botão principal não está visível',
    type: 'object',
    properties: {}
}

export default FloatingBuyBar
