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
      const stickyElement = document.querySelector('.vtex-sticky-layout-0-x-wrapper--stuck')
      const newStickyState = !!stickyElement
      
      if (newStickyState !== isSticky) {
        setIsSticky(newStickyState)
        
        if (!newStickyState && isSearchVisible) {
          setIsSearchVisible(false)
          hideSearchBar()
        }
        
        if (!newStickyState) {
          const searchBarContainer = document.querySelector('.vtex-store-components-3-x-searchBarContainer')
          if (searchBarContainer) {
            searchBarContainer.classList.remove('search-active')
            searchBarContainer.style.display = ''
          }
        }
        
        checkExternalSearchVisibility()
      }
    }

    const checkExternalSearchVisibility = () => {
      const stickyWrapper = document.querySelector('.vtex-sticky-layout-0-x-wrapper')
      
      if (!stickyWrapper) {
        setIsExternalSearchVisible(true)
        return
      }

      const isStuck = stickyWrapper.classList.contains('vtex-sticky-layout-0-x-wrapper--stuck')
      
      if (!isStuck) {
        setIsExternalSearchVisible(true)
        return
      }

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
      
      for (const selector of possibleSelectors) {
        const searchBars = document.querySelectorAll(selector)
        externalSearchBar = Array.from(searchBars).find(bar => !stickyWrapper.contains(bar))
        if (externalSearchBar) break
      }
      
      if (!externalSearchBar) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const headerHeight = stickyRect.height || 100 
        
        const anySearchElement = document.querySelector('input[type="search"], input[placeholder*="buscar" i], input[placeholder*="search" i]')
        let estimatedSearchPosition = 0
        
        if (anySearchElement) {
          const searchRect = anySearchElement.getBoundingClientRect()
          estimatedSearchPosition = searchRect.top + scrollTop
        }
        
        const searchHeight = 50 
        const isCompletelyBehindHeader = scrollTop > (estimatedSearchPosition + searchHeight) || scrollTop > headerHeight
        
        setIsExternalSearchVisible(!isCompletelyBehindHeader)
        return
      }

      
      try {
        const stickyRect = stickyWrapper.getBoundingClientRect()
        const externalSearchRect = externalSearchBar.getBoundingClientRect()
        
        if (externalSearchRect.width === 0 && externalSearchRect.height === 0) {
          setIsExternalSearchVisible(false)
          return
        }
        
        const headerHeight = stickyRect.height
        const searchTopPosition = externalSearchRect.top
        const searchBottomPosition = externalSearchRect.bottom
        
        const isCompletelyBehindHeader = searchTopPosition < 0 || searchBottomPosition < headerHeight
        
        setIsExternalSearchVisible(!isCompletelyBehindHeader)
        
      } catch (error) {
        console.warn('Erro ao verificar sobreposição da search-bar:', error)
        setIsExternalSearchVisible(false) 
      }
    }

    const handleDocumentInteraction = (e) => {
      if (!isSearchVisible) return

      if (e.type === 'keydown' && e.key === 'Escape') {
        setIsSearchVisible(false)
        hideSearchBar()
        return
      }

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

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          checkStickyState()
        }
      })
    })

    const stickyLayout = document.querySelector('.vtex-sticky-layout-0-x-wrapper')
    if (stickyLayout) {
      observer.observe(stickyLayout, {
        attributes: true,
        attributeFilter: ['class']
      })
    }

    if (isSearchVisible) {
      document.addEventListener('click', handleDocumentInteraction)
      document.addEventListener('keydown', handleDocumentInteraction)
    }

    checkStickyState()

    let lastCheckTime = 0
    const throttleDelay = 150 
    
    const throttledCheckExternalSearchVisibility = () => {
      const now = Date.now()
      if (now - lastCheckTime >= throttleDelay) {
        lastCheckTime = now
        checkExternalSearchVisibility()
      }
    }

    
    let isScrolling = false
    let lastScrollY = window.pageYOffset || document.documentElement.scrollTop
    const scrollThreshold = 10 
    
    const handleScroll = () => {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop
      const scrollDelta = Math.abs(currentScrollY - lastScrollY)
      
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

    
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('click', handleDocumentInteraction)
      document.removeEventListener('keydown', handleDocumentInteraction)
    }
  }, [isSticky, isSearchVisible])

  const showSearchBar = () => {
    
    if (!isExternalSearchVisible && isSticky) {
      const searchBarContainer = document.querySelector('.vtex-sticky-layout-0-x-wrapper--stuck .vtex-store-components-3-x-searchBarContainer')
      if (searchBarContainer) {
        
        searchBarContainer.classList.add('search-active')
        
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
      searchBarContainer.classList.remove('search-active')
      searchBarContainer.style.display = ''
    }
  }

  const handleSearchToggle = () => {
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
