import React, { useState, useEffect, useRef } from 'react'
import { IconSearch } from 'vtex.store-icons'
import './index.global.css'

const SearchButton = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const [isExternalSearchVisible, setIsExternalSearchVisible] = useState(true)
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
        
        // Só verifica a search externa quando o estado sticky muda
        checkExternalSearchVisibility()
      }
    }

    const checkExternalSearchVisibility = () => {
      const stickyWrapper = document.querySelector('.vtex-sticky-layout-0-x-wrapper')
      
      if (!stickyWrapper) {
        // Se não encontrar o sticky wrapper, assume que a search externa está visível (desktop)
        setIsExternalSearchVisible(true)
        return
      }

      const isStuck = stickyWrapper.classList.contains('vtex-sticky-layout-0-x-wrapper--stuck')
      
      if (!isStuck) {
        // Se não está stuck, a search externa está visível
        setIsExternalSearchVisible(true)
        return
      }

      // Se está stuck, procura pela search-bar externa (fora do sticky)
      // Tenta diferentes seletores para encontrar a search-bar externa
      const possibleSelectors = [
        '.vtex-store-components-3-x-searchBarContainer',
        '.vtex-search-2-x-searchBarContainer',
        '.vtex-search-1-x-searchBarContainer',
        '[data-testid="search-bar"]',
        '.search-bar',
        'input[placeholder*="buscar" i]',
        'input[placeholder*="search" i]'
      ]
      
      let externalSearchBar = null
      
      // Procura por todas as search-bars disponíveis
      for (const selector of possibleSelectors) {
        const searchBars = document.querySelectorAll(selector)
        externalSearchBar = Array.from(searchBars).find(bar => !stickyWrapper.contains(bar))
        if (externalSearchBar) break
      }
      
      if (!externalSearchBar) {
        // Se não encontrar a search externa, usa lógica de fallback baseada no scroll e altura do header
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const headerHeight = stickyRect.height || 100 // altura do header sticky
        
        // Procura por qualquer elemento de search na página para estimar posição
        const anySearchElement = document.querySelector('input[type="search"], input[placeholder*="buscar" i], input[placeholder*="search" i]')
        let estimatedSearchPosition = 0
        
        if (anySearchElement) {
          const searchRect = anySearchElement.getBoundingClientRect()
          estimatedSearchPosition = searchRect.top + scrollTop
        }
        
        // A search está TOTALMENTE atrás se:
        // 1. O scroll passou completamente da posição estimada da search
        // 2. OU o scroll é maior que a altura do header + margem de segurança
        const searchHeight = 50 // altura estimada da search-bar
        const isCompletelyBehindHeader = scrollTop > (estimatedSearchPosition + searchHeight) || scrollTop > headerHeight
        
        setIsExternalSearchVisible(!isCompletelyBehindHeader)
        return
      }

      // Verifica se a search externa está realmente atrás do header
      try {
        const stickyRect = stickyWrapper.getBoundingClientRect()
        const externalSearchRect = externalSearchBar.getBoundingClientRect()
        
        // Verifica se o elemento tem dimensões válidas
        if (externalSearchRect.width === 0 && externalSearchRect.height === 0) {
          setIsExternalSearchVisible(false)
          return
        }
        
        // Lógica baseada na altura do header e posição da search-bar
        const headerHeight = stickyRect.height
        const searchTopPosition = externalSearchRect.top
        const searchBottomPosition = externalSearchRect.bottom
        
        // A search está TOTALMENTE atrás do header se:
        // 1. O topo da search está acima do topo da tela (scrollou para baixo)
        // 2. OU a search está completamente oculta pelo header (bottom da search < top do header)
        const isCompletelyBehindHeader = searchTopPosition < 0 || searchBottomPosition < headerHeight
        
        setIsExternalSearchVisible(!isCompletelyBehindHeader)
        
      } catch (error) {
        // Em caso de erro, usa a lógica anterior como fallback
        console.warn('Erro ao verificar sobreposição da search-bar:', error)
        setIsExternalSearchVisible(false) // Assume que está atrás quando stuck
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

    // Verifica estado inicial apenas uma vez
    checkStickyState()

    // Throttle para evitar verificações excessivas durante o scroll
    let lastCheckTime = 0
    const throttleDelay = 150 // ms
    
    const throttledCheckExternalSearchVisibility = () => {
      const now = Date.now()
      if (now - lastCheckTime >= throttleDelay) {
        lastCheckTime = now
        checkExternalSearchVisibility()
      }
    }

    // Listener de scroll com throttling e threshold - só executa quando há scroll significativo
    let isScrolling = false
    let lastScrollY = window.pageYOffset || document.documentElement.scrollTop
    const scrollThreshold = 10 // pixels - só verifica se scrollou pelo menos 10px
    
    const handleScroll = () => {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop
      const scrollDelta = Math.abs(currentScrollY - lastScrollY)
      
      // Só executa se o scroll for significativo
      if (scrollDelta >= scrollThreshold) {
        lastScrollY = currentScrollY
        
        if (!isScrolling) {
          isScrolling = true
          requestAnimationFrame(() => {
            throttledCheckExternalSearchVisibility()
            isScrolling = false
          })
        }
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Cleanup
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('click', handleDocumentInteraction)
      document.removeEventListener('keydown', handleDocumentInteraction)
    }
  }, [isSticky, isSearchVisible])

  const showSearchBar = () => {
    // Só mostra a search-bar no sticky se a search-bar externa estiver atrás do header
    if (!isExternalSearchVisible && isSticky) {
      const searchBarContainer = document.querySelector('.vtex-sticky-layout-0-x-wrapper--stuck .vtex-store-components-3-x-searchBarContainer')
      if (searchBarContainer) {
        // Adiciona a classe para mostrar no sticky
        searchBarContainer.classList.add('search-active')
        
        // Foca no input do search-bar
        const searchInput = searchBarContainer.querySelector('input')
        if (searchInput) {
          setTimeout(() => {
            searchInput.focus()
          }, 100)
        }
      }
    }
  }

  const hideSearchBar = () => {
    const searchBarContainer = document.querySelector('.vtex-sticky-layout-0-x-wrapper--stuck .vtex-store-components-3-x-searchBarContainer')
    if (searchBarContainer) {
      // Remove a classe e limpa qualquer style.display que possa ter sido aplicado
      searchBarContainer.classList.remove('search-active')
      searchBarContainer.style.display = ''
    }
  }

  const handleSearchToggle = () => {
    // Só permite toggle se estivermos no sticky e a search-bar externa estiver atrás do header
    if (isSticky && !isExternalSearchVisible) {
      if (isSearchVisible) {
        setIsSearchVisible(false)
        hideSearchBar()
      } else {
        setIsSearchVisible(true)
        showSearchBar()
      }
    }
  }

  return (
    <div className={`search-button-wrapper ${isSticky && !isExternalSearchVisible ? 'search-button-wrapper--sticky' : ''} ${isSearchVisible ? 'search-button-wrapper--active' : ''}`} 
      style={{
        opacity: isSticky && !isExternalSearchVisible ? 1 : 0
      }}>
      <button
        ref={searchButtonRef}
        className={`search-button ${isSearchVisible ? 'search-button--active' : ''}`}
        onClick={handleSearchToggle}
        aria-label={isSearchVisible ? 'Fechar busca' : 'Abrir busca'}
        tabIndex="0"
        disabled={!isSticky || isExternalSearchVisible}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleSearchToggle()
          }
        }}
      >
        
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" fill="none">
       <path d="M15.707 13.293L13 10.586C13.63 9.536 14 8.311 14 7C14 3.14 10.859 0 7 0C3.141 0 0 3.14 0 7C0 10.86 3.141 14 7 14C8.312 14 9.536 13.631 10.586 13L13.293 15.707C13.488 15.902 13.744 16 14 16C14.256 16 14.512 15.902 14.707 15.707L15.707 14.707C16.098 14.316 16.098 13.684 15.707 13.293ZM7 12C4.239 12 2 9.761 2 7C2 4.239 4.239 2 7 2C9.761 2 12 4.239 12 7C12 9.761 9.761 12 7 12Z" fill="white"/>
      </svg>

      </button>
    </div>
  )
}

export default SearchButton
