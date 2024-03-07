import { useEffect } from 'react';
import { useProduct } from 'vtex.product-context';
export default function CustomTitle() {
    const prod = useProduct()

    useEffect(() => {
        setInterval(() => {
            var element = document.querySelector('h1[class="vtex-search-result-3-x-galleryTitle--layout t-heading-1"]')
            element.outerHTML = '<h2 class="vtex-search-result-3-x-galleryTitle--layout t-heading-1">' + element.innerHTML + '</h2>'
        }, 200);
    }, [])

    return (
        null
    )
}
