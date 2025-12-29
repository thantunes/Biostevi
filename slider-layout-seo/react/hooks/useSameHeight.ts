import { useEffect, useRef } from 'react'

interface UseSameHeightOptions {
  enabled: boolean
  selector?: string
}

/**
 * Hook para aplicar a mesma altura a todos os slides visíveis
 * @param enabled - Se true, aplica mesma altura aos slides
 * @param selector - Seletor CSS opcional para os elementos (padrão: '.swiper-slide')
 */
export const useSameHeight = ({ enabled, selector = '.swiper-slide' }: UseSameHeightOptions) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!enabled) {
      const slides = document.querySelectorAll(selector)
      slides.forEach((slide) => {
        const element = slide as HTMLElement
        element.style.height = 'auto'
      })
      return
    }

    const applySameHeight = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }

      rafRef.current = requestAnimationFrame(() => {
        timeoutRef.current = setTimeout(() => {
          const sliderContainer = document.querySelector('.swiper') ||
                                  document.querySelector('[data-testid="slider-track"]')?.closest('section') ||
                                  document.querySelector(`.${selector.replace('.', '')}`)?.closest('section')

          const slides = sliderContainer
            ? sliderContainer.querySelectorAll(selector)
            : document.querySelectorAll(selector)

          if (slides.length === 0) {
            return
          }

          let maxHeight = 0

          slides.forEach((slide) => {
            const element = slide as HTMLElement
            element.style.height = 'auto'
          })

          slides.forEach((slide) => {
            const element = slide as HTMLElement
            const height = element.getBoundingClientRect().height
            if (height > maxHeight) {
              maxHeight = height
            }
          })

          if (maxHeight > 0) {
            slides.forEach((slide) => {
              const element = slide as HTMLElement
              element.style.height = `${maxHeight}px`
            })
          }
        }, 150)
      })
    }

    const initialTimeout = setTimeout(() => {
      applySameHeight()
    }, 300)

    const observer = new MutationObserver(() => {
      applySameHeight()
    })

    const handleResize = () => {
      applySameHeight()
    }

    window.addEventListener('resize', handleResize)

    const handleSlideChange = () => {
      applySameHeight()
    }

    const sliderContainer = document.querySelector('.swiper') ||
                            document.querySelector('[data-testid="slider-track"]')?.closest('section')

    if (sliderContainer) {
      observer.observe(sliderContainer, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'],
      })

      if (sliderContainer.classList.contains('swiper')) {
        sliderContainer.addEventListener('slideChange', handleSlideChange)
        sliderContainer.addEventListener('transitionEnd', handleSlideChange)
      }
    }

    const firstSlide = document.querySelector(selector)
    if (firstSlide && firstSlide.parentElement) {
      observer.observe(firstSlide.parentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'],
      })
    }

    return () => {
      clearTimeout(initialTimeout)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      window.removeEventListener('resize', handleResize)
      if (sliderContainer) {
        sliderContainer.removeEventListener('slideChange', handleSlideChange)
        sliderContainer.removeEventListener('transitionEnd', handleSlideChange)
      }
      observer.disconnect()

      const slides = document.querySelectorAll(selector)
      slides.forEach((slide) => {
        const element = slide as HTMLElement
        element.style.height = 'auto'
      })
    }
  }, [enabled, selector])
}
