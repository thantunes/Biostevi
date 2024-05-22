import { useEffect } from 'react'
import $ from 'jquery'
export default function ChangeTag() {
    useEffect(() => {


        setInterval(() => {
            $('#titleRemove').remove()
            $('body').append('<h1 id="titleRemove" style="display:none !important">Biostévi Pharma</h1>')
            window.location.pathname.split('/')?.[window.location.pathname.split('/').length - 1] == 'p' ? $('#titleRemove').remove() : null
            $('.vtex-search-result-3-x-galleryTitle--layout.t-heading-1').each(function () {
                $(this).replaceWith($('<h2 class="vtex-search-result-3-x-galleryTitle--layout t-heading-1">' + this.innerHTML + '</h2>'));

            });
        }, 1000);
    }, [])

    return null
}