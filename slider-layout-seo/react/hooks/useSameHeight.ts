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
      // Resetar alturas ao desabilitar
      const slides = document.querySelectorAll(selector)
      slides.forEach((slide) => {
        const element = slide as HTMLElement
        element.style.height = 'auto'
      })
      return
    }

    const applySameHeight = () => {
      // Limpar timeout e RAF anteriores se existirem
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }

      // Usar requestAnimationFrame para garantir que o DOM esteja atualizado
      rafRef.current = requestAnimationFrame(() => {
        timeoutRef.current = setTimeout(() => {
          // Tentar encontrar o container do slider (Swiper ou modo scroll nativo)
          const sliderContainer = document.querySelector('.swiper') ||
                                  document.querySelector('[data-testid="slider-track"]')?.closest('section') ||
                                  document.querySelector(`.${selector.replace('.', '')}`)?.closest('section')

          // Se não encontrar container específico, buscar slides diretamente
          const slides = sliderContainer
            ? sliderContainer.querySelectorAll(selector)
            : document.querySelectorAll(selector)

          if (slides.length === 0) {
            return
          }

          let maxHeight = 0

          // Resetar altura de todos os slides para calcular corretamente
          slides.forEach((slide) => {
            const element = slide as HTMLElement
            element.style.height = 'auto'
          })

          // Calcular altura máxima (usar getBoundingClientRect para maior precisão)
          slides.forEach((slide) => {
            const element = slide as HTMLElement
            const height = element.getBoundingClientRect().height
            if (height > maxHeight) {
              maxHeight = height
            }
          })

          // Aplicar altura máxima a todos os slides
          if (maxHeight > 0) {
            slides.forEach((slide) => {
              const element = slide as HTMLElement
              element.style.height = `${maxHeight}px`
            })
          }
        }, 150)
      })
    }

    // Aplicar altura inicial após um pequeno delay para garantir que o Swiper esteja inicializado
    const initialTimeout = setTimeout(() => {
      applySameHeight()
    }, 300)

    // Observar mudanças no DOM (slides podem ser adicionados/removidos)
    const observer = new MutationObserver(() => {
      applySameHeight()
    })

    // Observar mudanças de tamanho da janela
    const handleResize = () => {
      applySameHeight()
    }

    window.addEventListener('resize', handleResize)

    // Observar eventos do Swiper
    const handleSlideChange = () => {
      applySameHeight()
    }

    // Observar mudanças no container do slider
    const sliderContainer = document.querySelector('.swiper') ||
                            document.querySelector('[data-testid="slider-track"]')?.closest('section')

    if (sliderContainer) {
      observer.observe(sliderContainer, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'],
      })

      // Adicionar listener para eventos do Swiper (apenas se for Swiper)
      if (sliderContainer.classList.contains('swiper')) {
        sliderContainer.addEventListener('slideChange', handleSlideChange)
        sliderContainer.addEventListener('transitionEnd', handleSlideChange)
      }
    }

    // Também observar mudanças nos slides diretamente
    const firstSlide = document.querySelector(selector)
    if (firstSlide && firstSlide.parentElement) {
      observer.observe(firstSlide.parentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'],
      })
    }

    // Limpar ao desmontar
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

      // Resetar alturas ao desabilitar
      const slides = document.querySelectorAll(selector)
      slides.forEach((slide) => {
        const element = slide as HTMLElement
        element.style.height = 'auto'
      })
    }
  }, [enabled, selector])
}
