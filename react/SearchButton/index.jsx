import React, { useState, useEffect, useRef } from 'react'
import { IconSearch } from 'vtex.store-icons'
import './index.global.css'

const SearchButton = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const searchButtonRef = useRef(null)

  useEffect(() => {
    const checkStickyState = () => {
      // Verifica se existe um elemento com a classe stuck
      const stickyElement = document.querySelector('.vtex-sticky-layout-0-x-wrapper--stuck')
      const newStickyState = !!stickyElement
      
      if (newStickyState !== isSticky) {
        setIsSticky(newStickyState)
        
        // Se não estiver mais sticky, esconde o search e limpa qualquer estado
        if (!newStickyState && isSearchVisible) {
          setIsSearchVisible(false)
          hideSearchBar()
        }
        
        // Se não estiver sticky, garante que o search-bar não tenha modificações de estilo
        if (!newStickyState) {
          const searchBarContainer = document.querySelector('.vtex-store-components-3-x-searchBarContainer')
          if (searchBarContainer) {
            searchBarContainer.classList.remove('search-active')
            searchBarContainer.style.display = ''
          }
        }
      }
    }

    // Handler para fechar com ESC ou clique fora
    const handleDocumentInteraction = (e) => {
      if (!isSearchVisible) return

      // Fecha com ESC
      if (e.type === 'keydown' && e.key === 'Escape') {
        setIsSearchVisible(false)
        hideSearchBar()
        return
      }

      // Fecha clicando fora
      if (e.type === 'click') {
        const searchBar = document.querySelector('.vtex-store-components-3-x-searchBarContainer.search-active')
        const searchButton = searchButtonRef.current
        
        if (searchBar && searchButton && 
            !searchBar.contains(e.target) && 
            !searchButton.contains(e.target)) {
          setIsSearchVisible(false)
          hideSearchBar()
        }
      }
    }

    // Observador para mudanças na classe sticky
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          checkStickyState()
        }
      })
    })

    // Observa o elemento sticky layout
    const stickyLayout = document.querySelector('.vtex-sticky-layout-0-x-wrapper')
    if (stickyLayout) {
      observer.observe(stickyLayout, {
        attributes: true,
        attributeFilter: ['class']
      })
    }

    // Adiciona listeners para fechar o search
    if (isSearchVisible) {
      document.addEventListener('click', handleDocumentInteraction)
      document.addEventListener('keydown', handleDocumentInteraction)
    }

    // Verifica estado inicial
    checkStickyState()

    // Cleanup
    return () => {
      observer.disconnect()
      document.removeEventListener('click', handleDocumentInteraction)
      document.removeEventListener('keydown', handleDocumentInteraction)
    }
  }, [isSticky, isSearchVisible])

  const showSearchBar = () => {
    const searchBarContainer = document.querySelector('.vtex-store-components-3-x-searchBarContainer')
    if (searchBarContainer) {
      // Apenas adiciona a classe para mostrar, sem manipular style.display
      searchBarContainer.classList.add('search-active')
      
      // Foca no input do search-bar original
      const searchInput = searchBarContainer.querySelector('input')
      if (searchInput) {
        setTimeout(() => {
          searchInput.focus()
        }, 100)
      }
    }
  }

  const hideSearchBar = () => {
    const searchBarContainer = document.querySelector('.vtex-store-components-3-x-searchBarContainer')
    if (searchBarContainer) {
      // Remove a classe e limpa qualquer style.display que possa ter sido aplicado
      searchBarContainer.classList.remove('search-active')
      searchBarContainer.style.display = ''
    }
  }

  const handleSearchToggle = () => {
    if (isSearchVisible) {
      setIsSearchVisible(false)
      hideSearchBar()
    } else {
      setIsSearchVisible(true)
      showSearchBar()
    }
  }

  // Só renderiza o botão no mobile quando estiver sticky
  if (!isSticky) {
    return null
  }

  return (
    <button
      ref={searchButtonRef}
      className={`search-button ${isSearchVisible ? 'search-button--active' : ''}`}
      onClick={handleSearchToggle}
      aria-label={isSearchVisible ? 'Fechar busca' : 'Abrir busca'}
      tabIndex="0"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleSearchToggle()
        }
      }}
    >
      <svg width="28" height="28" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_42827_5106)">
            <path d="M12.8109 23.0957C17.9532 23.0957 22.1218 18.9271 22.1218 13.7848C22.1218 8.64251 17.9532 4.47388 12.8109 4.47388C7.66864 4.47388 3.5 8.64251 3.5 13.7848C3.5 18.9271 7.66864 23.0957 12.8109 23.0957Z" stroke="white" stroke-width="1.59616" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M20.3948 20.668L26.8461 27.1193" stroke="white" strokeWidth="1.59616" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        <defs>
            <clipPath id="clip0_42827_5106">
                <rect width="28" height="28" fill="white" transform="translate(0 0.888916)"/>
            </clipPath>
        </defs>
    </svg>

    </button>
  )
}

export default SearchButton
