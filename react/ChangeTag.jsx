import {useEffect} from 'react'
import $ from 'jquery'
export default function ChangeTag () {
    useEffect(() => {
        $('body').append('<h1 id="titleRemove" style="display:none !important">Biostévi</h1>')
        setInterval(() => {

            $('.vtex-search-result-3-x-galleryTitle--layout.t-heading-1').each(function() {
    
                $(this).replaceWith($('<h2 class="vtex-search-result-3-x-galleryTitle--layout t-heading-1">' + this.innerHTML + '</h2>'));
               
              });        
        }, 1000);
    }, [])
    
    return null
}