export { default } from './DescriptionContructor/index'


$('.product-item').children('td.quantity__default').children().children('.selectorqty__svg').click(function () {
    const sku = $(this).parent().parent().parent().attr('data-sku')
    const Selected = $(this)
    setTimeout(function() {
        orderForm.items.map(function (e) {
            if (e.id == sku) {
                if (e.price == (e.priceDefinition.total / e.priceDefinition.sellingPrices[0].quantity)) {
                    Selected.parent().parent().parent().children('.product-price').children('.list-price').addClass('hide')
                    Selected.parent().parent().parent().children('.product-price').children('.best-price').children('.new-product-price-label').addClass('hide')
                    Selected.parent().parent().parent().children('.product-price').children('.best-price').children('.new-product-price').text(e.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}))
                    Selected.parent().parent().parent().children('.product-price').children('br').addClass('hide')
                } else {
                    Selected.parent().parent().parent().children('.product-price').children('.list-price').removeClass('hide')
                    Selected.parent().parent().parent().children('.product-price').children('.best-price').children('.new-product-price-label').removeClass('hide')
                    Selected.parent().parent().parent().children('.product-price').children('br').removeClass('hide')
                    Selected.parent().parent().parent().children('.product-price').children('.best-price').children('.new-product-price').text(((e.priceDefinition.total / e.priceDefinition.sellingPrices[0].quantity) / 100).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}))
                    Selected.parent().parent().parent().children('.product-price').children('.list-price').children('.old-product-price').text((e.price / 100).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}))
                }
            }
        })
    }, 3000);
})