import React, { useEffect, useState } from 'react';
import { useCssHandles } from 'vtex.css-handles'
import { useProduct } from 'vtex.product-context'
import './index.global.css'
import { OrderItemsProvider, useOrderItems } from 'vtex.order-items/OrderItems'
// import { Container } from './styles';

const CSS_HANDLES = [
    "BuyTogether__Title",
    "BuyTogether__Box",
    "BuyTogether__Container",
    "BuyTogether__Product__Image",
    "BuyTogether__Product__Name",
    "BuyTogether__Product__Price"
]

export function BuyTogether() {
    const ProductRef = useProduct()
    const { addItems } = useOrderItems()
    const handles = useCssHandles(CSS_HANDLES)
    const [ProdData, setProdData] = useState()
    const [SProdData, setSProdData] = useState()
    const [ProdsTouse, setProdsTouse] = useState([])
    console.log(ProductRef?.product.categories[ProductRef?.product.categories.length - 1])
    useEffect(() => {
        const Categorie = ProductRef?.product.categories[ProductRef?.product.categories.length - 1]

        const options = { method: 'GET', headers: { accept: 'application/json' } };

        fetch(`/api/catalog_system/pub/products/search${Categorie}`, options)
            .then(response => response.json())
            .then(response => setProdData(response))
            .catch(err => console.error(err));
    }, [])
    async function SaveData() {
        console.log("Produto:", ProdData)
        console.log("ProductRef:", ProductRef)
        const options = { method: 'GET', headers: { accept: 'application/json' } };
        await fetch(`/api/catalog_system/pub/products/search?fq=productId:${ProductRef?.product.productId}`, options)
            .then(response => response.json())
            .then(response => {
                populateCart(response, ProdData)
                window.location.hash = "#top"
            })
            .catch(err => console.error(err));
        console.log("Id:", ProductRef?.product.items[0].itemId)
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
            }
        ]
        // O addItems ele espera receber um array de objeto com informações úteis do produto para adicionar ao carrinho.
        addItems(cart)
    }

    useEffect(() => {
        setProdsTouse([ProductRef?.product, ProdData?.[0]])
    }, [ProdData])

    function formatPrice(value) {
        return value?.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            style: 'currency',
            currency: 'BRL',
        })
    }
    return (
        <>
            <div className={`BuyTogether__Box`}>
                <h2>Compre Junto</h2>
                <div className='BuyTogether__Container__Row'>
                    <div className='BuyTogether__Container__Row__Container'>
                        <div className='BuyTogether__Container__Row__Prod'>
                            {
                                ProdsTouse?.map((e) => {
                                    return (
                                        <div className={`BuyTogether__Container`}>
                                            <div className={`BuyTogether__Product__Image`}>
                                                <img src={e?.items[0].images[0].imageUrl} alt={e?.items[0].images[0].imageText} />
                                            </div>
                                            <div className={`BuyTogether__Product__Name`}>
                                                <h2>{e?.productName}</h2>
                                            </div>
                                            <div className={`BuyTogether__Product__Price`}>
                                                <p>{formatPrice(e?.items[0].sellers[0].commertialOffer.Price)}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                        <div className='BuyTogether__Container__Row__Buy' style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <p style={{ margin: "0px 25px", fontSize: "52px" }}>=</p>
                            <div className='BuyTogether__Container__Row__Desc' style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <h3 style={{ margin: "0px" }}>Comprando dois Produtos por</h3>
                                <p style={{ fontWeight: "bolder", fontSize: "22px" }}>{formatPrice(ProdsTouse?.[0]?.items[0].sellers[0].commertialOffer.Price + ProdsTouse?.[1]?.items[0].sellers[0].commertialOffer.Price)}</p>
                                <button className='BuyTogether__Container__BuyButton' onClick={SaveData}>Adicionar ao Carrinho</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
