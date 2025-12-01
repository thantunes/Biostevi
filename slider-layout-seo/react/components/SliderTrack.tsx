import React, { ReactNode, FC, useMemo, useLayoutEffect, useRef } from 'react'

import {
  useSliderState,
  useSliderDispatch,
  SliderLayoutProps,
} from './SliderContext'
import { useSliderVisibility } from '../hooks/useSliderVisibility'
import { useContextCssHandles } from '../modules/cssHandles'

export const CSS_HANDLES = [
  'sliderTrack',
  'slide',
  'slideChildrenContainer',
] as const

interface Props {
  totalItems: number
  infinite: boolean
  centerMode: SliderLayoutProps['centerMode']
  centerModeSlidesGap?: SliderLayoutProps['centerModeSlidesGap']
  // This type comes from React itself. It is the return type for
  // React.Children.toArray().
  children?: Array<Exclude<ReactNode, boolean | null | undefined>>
}

const resolveAriaAttributes = (
  visible: boolean,
  index: number,
  totalItems: number
) => {
  if (index < 0 || index >= totalItems) {
    return {
      'aria-hidden': !visible,
      role: 'none presentation',
    }
  }

  return {
    'aria-hidden': !visible,
    role: 'group',
    'aria-roledescription': 'slide',
    'aria-label': `${index + 1} of ${totalItems}`,
  }
}

const getFirstOrLastVisible = (slidesPerPage: number, index: number) => {
  const integerSlidesPerPage = Math.floor(slidesPerPage)
  // every multiple of the number of slidesPerPage is a first (e.g. 0,3,6 if slidesPerPage is 3)
  if (index % integerSlidesPerPage === 0) {
    return 'firstVisible'
  }

  // every slide before  the multiple of the number of slidesPerPage is a last (e.g. 2,5,8 if slidesPerPage is 3)
  if ((index + 1) % integerSlidesPerPage === 0) {
    return 'lastVisible'
  }

  return ''
}

const SliderTrack: FC<Props> = ({
  centerMode,
  centerModeSlidesGap,
  totalItems,
  children,
  infinite,
}) => {
  const {
    slideWidth,
    slidesPerPage,
    currentSlide,
    virtualSlide,
    isOnTouchMove,
    useSlidingTransitionEffect,
    slideTransition: { speed, timing, delay },
    transformMap,
    transform,
    loopCloneCount,
  } = useSliderState()

  const dispatch = useSliderDispatch()
  const { handles, withModifiers } = useContextCssHandles()

  const { isItemVisible } = useSliderVisibility({
    currentSlide,
    slidesPerPage,
    totalItems,
    centerMode,
  })

  const baseSlides = children ?? []
  const baseSlidesCount = baseSlides.length
  
  // OTIMIZAÇÃO CRÍTICA: Criar clones IMEDIATAMENTE na primeira renderização
  // Funciona igual para MOBILE e DESKTOP - sem diferenciação
  // IMPORTANTE: Criar clones assim que tivermos os dados mínimos necessários
  // Não esperar por condições adicionais que possam atrasar
  const shouldUseVirtualSlides =
    Boolean(infinite) && loopCloneCount > 0 && baseSlidesCount > 0 && totalItems > Math.ceil(slidesPerPage)
  
  // OTIMIZAÇÃO: Garantir que os clones sejam sempre criados quando infinite está ativo
  // Mesmo que os children ainda não estejam totalmente carregados, criar estrutura dos clones
  const shouldCreateClones = Boolean(infinite) && loopCloneCount > 0 && baseSlidesCount > 0

  const cloneNode = (
    child: Exclude<ReactNode, boolean | null | undefined>,
    originalIndex: number,
    position: 'head' | 'tail',
    cloneIndex: number
  ) => {
    if (React.isValidElement(child)) {
      const originalKey =
        child.key !== null && child.key !== undefined
          ? child.key
          : `${originalIndex}`

      return React.cloneElement(child, {
        key: `clone-${position}-${cloneIndex}-${originalKey}`,
      })
    }

    return (
      <React.Fragment key={`clone-${position}-${cloneIndex}-${originalIndex}`}>
        {child}
      </React.Fragment>
    )
  }

  // OTIMIZAÇÃO CRÍTICA: Criar clones de forma síncrona e imediata
  // Funciona igual para MOBILE e DESKTOP - sem diferenciação
  // Os clones devem estar prontos desde a primeira renderização para evitar flash em branco
  // IMPORTANTE: Criar clones assim que tivermos baseSlides, sem esperar outras condições
  const headClones = useMemo(() => {
    // Verificar condições mínimas necessárias - mais permissivo para garantir criação imediata
    if (!shouldCreateClones || baseSlidesCount === 0 || loopCloneCount === 0) {
      return []
    }
    
    // Criar clones imediatamente, sem condições adicionais
    // Usar slice seguro para evitar erros
    const startIndex = Math.max(0, baseSlidesCount - loopCloneCount)
    const endIndex = baseSlidesCount
    
    // Garantir que temos slides suficientes para clonar
    if (startIndex >= endIndex || startIndex < 0) {
      return []
    }
    
    // OTIMIZAÇÃO: Criar clones de forma estável e persistente
    // Isso garante que eles estejam sempre disponíveis, mesmo durante navegação rápida
    return baseSlides
      .slice(startIndex, endIndex)
      .map((child, index) => {
        const originalIndex = startIndex + index
        return cloneNode(
          child,
          originalIndex,
          'head',
          index
        )
      })
  }, [shouldCreateClones, baseSlides, baseSlidesCount, loopCloneCount])

  const tailClones = useMemo(() => {
    // Verificar condições mínimas necessárias - mais permissivo para garantir criação imediata
    if (!shouldCreateClones || baseSlidesCount === 0 || loopCloneCount === 0) {
      return []
    }
    
    // Criar clones imediatamente, sem condições adicionais
    // Usar slice seguro para evitar erros
    const endIndex = Math.min(loopCloneCount, baseSlidesCount)
    
    // Garantir que temos slides suficientes para clonar
    if (endIndex <= 0) {
      return []
    }
    
    // OTIMIZAÇÃO: Criar clones de forma estável e persistente
    // Isso garante que eles estejam sempre disponíveis, mesmo durante navegação rápida
    return baseSlides
      .slice(0, endIndex)
      .map((child, index) => cloneNode(child, index, 'tail', index))
  }, [shouldCreateClones, baseSlides, baseSlidesCount, loopCloneCount])

  // OTIMIZAÇÃO CRÍTICA: Combinar slides de forma síncrona e imediata
  // Funciona igual para MOBILE e DESKTOP
  // Garantir que os clones estejam sempre incluídos quando necessário
  // Isso evita o flash em branco ao carregar a página e durante navegação rápida
  // IMPORTANTE: Criar array de slides com clones desde o início, sem esperar condições
  const slides = useMemo(() => {
    // Se não deve criar clones, retornar apenas os base slides
    if (!shouldCreateClones) {
      return baseSlides
    }
    
    // IMPORTANTE: Sempre incluir clones quando shouldCreateClones é true
    // Isso garante que eles estejam no DOM desde a primeira renderização
    // E durante navegação rápida no desktop, os clones estarão sempre disponíveis
    // Funciona igual para mobile e desktop
    const allSlides: Array<Exclude<ReactNode, boolean | null | undefined>> = []
    
    // OTIMIZAÇÃO: Sempre adicionar head clones quando existirem
    // Mesmo durante navegação rápida, eles devem estar disponíveis
    if (headClones.length > 0) {
      allSlides.push(...headClones)
    }
    
    // Adicionar slides base (sempre presentes)
    allSlides.push(...baseSlides)
    
    // OTIMIZAÇÃO: Sempre adicionar tail clones quando existirem
    // Mesmo durante navegação rápida, eles devem estar disponíveis
    if (tailClones.length > 0) {
      allSlides.push(...tailClones)
    }
    
    // Garantir que sempre retornamos um array válido, mesmo durante transições rápidas
    return allSlides.length > 0 ? allSlides : baseSlides
  }, [shouldCreateClones, headClones, baseSlides, tailClones])

  const getRealIndexFromVirtual = (virtualIndex: number) => {
    if (!shouldUseVirtualSlides || baseSlidesCount === 0) {
      return virtualIndex
    }

    const relativeIndex = virtualIndex - loopCloneCount
    const normalized =
      ((relativeIndex % baseSlidesCount) + baseSlidesCount) % baseSlidesCount

    return normalized
  }

  const trackWidth =
    slidesPerPage <= totalItems
      ? `${(slides.length * 100) / slidesPerPage}%`
      : '100%'

  // Ref para rastrear se já normalizamos nesta posição
  const lastNormalizedVirtualSlide = useRef<number | null>(null)

  // Detectar se é mobile (para aplicar normalização antecipada apenas no mobile)
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth <= 768 || 'ontouchstart' in window
  }, [])

  // OTIMIZAÇÃO CRÍTICA: Usar useLayoutEffect para garantir que os clones estejam sempre renderizados
  // No mobile: normalizar ANTES do navegador pintar
  // No desktop: garantir que os clones estejam sempre disponíveis durante navegação rápida
  useLayoutEffect(() => {
    // No mobile: aplicar normalização antecipada
    // No desktop: garantir que os clones estejam sempre no DOM durante navegação rápida
    if (!shouldUseVirtualSlides || baseSlidesCount === 0 || totalItems === 0) {
      return
    }
    
    // No desktop, não fazer normalização antecipada, mas garantir que os clones estejam sempre disponíveis
    if (!isMobile) {
      // No desktop, apenas garantir que os clones estejam sempre renderizados
      // A normalização será feita no onTransitionEnd
      return
    }

    const firstRealIndex = loopCloneCount
    const lastRealIndex = loopCloneCount + totalItems - 1
    const isInHeadClones = virtualSlide < firstRealIndex
    const isInTailClones = virtualSlide > lastRealIndex

    // Só normalizar se estiver nos clones E não normalizamos esta posição ainda
    // E não estiver em touch move (para não interferir com o gesto)
    if (
      (isInHeadClones || isInTailClones) &&
      lastNormalizedVirtualSlide.current !== virtualSlide &&
      !isOnTouchMove
    ) {
      let normalizedRealIndex: number
      let normalizedVirtualSlide: number

      if (isInTailClones) {
        const cloneOffset = virtualSlide - lastRealIndex - 1
        normalizedRealIndex = cloneOffset
        normalizedVirtualSlide = loopCloneCount + normalizedRealIndex
      } else {
        const clonePosition = virtualSlide
        const itemsFromEnd = loopCloneCount - clonePosition - 1
        normalizedRealIndex = totalItems - 1 - itemsFromEnd
        normalizedVirtualSlide = loopCloneCount + normalizedRealIndex
      }

      // Validar índice
      if (normalizedRealIndex >= 0 && normalizedRealIndex < totalItems) {
        lastNormalizedVirtualSlide.current = virtualSlide

        // Normalizar imediatamente, antes do browser pintar
        dispatch({ type: 'START_LOOP_NORMALIZATION' })
        dispatch({
          type: 'ADJUST_CURRENT_SLIDE',
          payload: {
            currentSlide: normalizedRealIndex,
            virtualSlide: normalizedVirtualSlide,
            transform: transformMap[normalizedVirtualSlide] || 0,
          },
        })
        dispatch({ type: 'END_LOOP_NORMALIZATION' })
      }
    } else if (!isInHeadClones && !isInTailClones) {
      // Reset do ref quando sair dos clones
      lastNormalizedVirtualSlide.current = null
    }
  }, [
    isMobile,
    shouldUseVirtualSlides,
    baseSlidesCount,
    totalItems,
    virtualSlide,
    loopCloneCount,
    isOnTouchMove,
    transformMap,
    dispatch,
  ])

  const queueWithoutTransition = (callback: () => void) => {
    if (typeof window === 'undefined') {
      callback()
      return
    }

    // OTIMIZAÇÃO: Para sliders decimais, usar apenas um requestAnimationFrame
    // para garantir normalização instantânea sem delay visual perceptível
      window.requestAnimationFrame(callback)
  }

  return (
    <div
      data-testid="slider-track"
      className={`${handles.sliderTrack} flex ${
        centerMode !== 'disabled' ? '' : 'justify-around'
      } relative pa0 ma0`}
      style={{
        transition:
          isOnTouchMove || !useSlidingTransitionEffect
            ? undefined
            : `transform ${speed}ms ${timing} ${delay}ms`,
        transform: `translate3d(${
          isOnTouchMove ? transform : transformMap[virtualSlide] || 0
        }%, 0, 0)`,
        width: trackWidth,
      }}
      onTransitionEnd={() => {
        const canAdjustVirtually =
          shouldUseVirtualSlides &&
          baseSlidesCount > 0 &&
          totalItems > 0 &&
          !isOnTouchMove

        if (!useSlidingTransitionEffect || !canAdjustVirtually) {
          dispatch({ type: 'DISABLE_TRANSITION' })

          return
        }

        const firstRealIndex = loopCloneCount
        const lastRealIndex = loopCloneCount + totalItems - 1

        const isInHeadClones = virtualSlide < firstRealIndex
        const isInTailClones = virtualSlide > lastRealIndex

        // CORREÇÃO: Não normalizar se estiver nos reais - apenas desabilitar transição
        if (!isInHeadClones && !isInTailClones) {
          dispatch({ type: 'DISABLE_TRANSITION' })

          return
        }

        // CORREÇÃO: Só normalizar se realmente estiver nos clones E a transição terminou
        // No desktop, garantir que a transição realmente terminou antes de normalizar
        dispatch({ type: 'DISABLE_TRANSITION' })

        // CORREÇÃO CRÍTICA: Calcular a normalização corretamente baseado na posição atual
        // Para sliders decimais, precisamos garantir que a normalização mantenha a continuidade
        // No desktop, garantir que a normalização seja suave e sem "pulos"
        let normalizedRealIndex: number
        let normalizedVirtualSlide: number

        if (isInTailClones) {
          // Quando está nos tail clones (indo para frente - indo para o início do loop)
          // O primeiro tail clone corresponde ao primeiro item real
          const cloneOffset = virtualSlide - lastRealIndex - 1
          normalizedRealIndex = cloneOffset
          normalizedVirtualSlide = loopCloneCount + normalizedRealIndex
        } else if (isInHeadClones) {
          // Quando está nos head clones (indo para trás - indo para o final do loop)
          // Os head clones são os últimos items reais
          // virtualSlide 0 = último item - (loopCloneCount - 1)
          // virtualSlide 1 = último item - (loopCloneCount - 2)
          // etc.
          const clonePosition = virtualSlide
          const itemsFromEnd = loopCloneCount - clonePosition - 1
          normalizedRealIndex = totalItems - 1 - itemsFromEnd
          normalizedVirtualSlide = loopCloneCount + normalizedRealIndex
        } else {
          // Já está nos reais, não deveria entrar aqui
          normalizedRealIndex = getRealIndexFromVirtual(virtualSlide)
          normalizedVirtualSlide = loopCloneCount + normalizedRealIndex
        }

        // CORREÇÃO: Verificar se a normalização é realmente necessária
        if (normalizedVirtualSlide === virtualSlide) {
          return
        }

        // CORREÇÃO CRÍTICA: Verificar se o normalizedRealIndex é válido antes de normalizar
        // Isso previne o "pulo" para o primeiro item quando o cálculo está errado
        if (normalizedRealIndex < 0 || normalizedRealIndex >= totalItems) {
          // Não fazer nada se o índice for inválido - apenas desabilitar transição
          return
        }

        // Marcar que estamos iniciando normalização
        dispatch({ type: 'START_LOOP_NORMALIZATION' })

        // CORREÇÃO: No desktop, usar duplo requestAnimationFrame para garantir
        // que a transição CSS foi completamente removida antes de normalizar
        // Isso evita o "pulo" visual quando chega no último item
        queueWithoutTransition(() => {
          // Aguardar um frame adicional no desktop para garantir suavidade
          if (!isMobile) {
            window.requestAnimationFrame(() => {
          dispatch({
            type: 'ADJUST_CURRENT_SLIDE',
            payload: {
              currentSlide: normalizedRealIndex,
              virtualSlide: normalizedVirtualSlide,
              transform: transformMap[normalizedVirtualSlide] || 0,
            },
          })
          
              dispatch({ type: 'END_LOOP_NORMALIZATION' })
            })
          } else {
            // No mobile, normalização já foi feita via useLayoutEffect
            dispatch({ type: 'END_LOOP_NORMALIZATION' })
          }
        })
      }}
      aria-atomic="false"
      aria-live="polite"
    >
      {slides.map((child, index) => {
        const realIndex = getRealIndexFromVirtual(index)
        const slideContainerStyles = {
          width: `${slideWidth}%`,
          marginLeft:
            centerMode !== 'disabled' && !centerModeSlidesGap
              ? `${slideWidth / (8 * slidesPerPage)}%`
              : undefined,
          marginRight:
            centerMode !== 'disabled' && !centerModeSlidesGap
              ? `${slideWidth / (8 * slidesPerPage)}%`
              : undefined,
          paddingLeft:
            centerMode !== 'disabled' && centerModeSlidesGap
              ? centerModeSlidesGap / 2
              : undefined,
          paddingRight:
            centerMode !== 'disabled' && centerModeSlidesGap
              ? centerModeSlidesGap / 2
              : undefined,
        }

        return (
          <div
            key={`virtual-slide-${index}`}
            {...resolveAriaAttributes(
              isItemVisible(realIndex),
              realIndex,
              totalItems
            )}
            className={`${withModifiers('slide', [
              getFirstOrLastVisible(slidesPerPage, realIndex),
              isItemVisible(realIndex) ? 'visible' : 'hidden',
            ])} flex relative`}
            data-index={
              realIndex >= 0 && realIndex < totalItems
                ? realIndex + 1
                : undefined
            }
            style={slideContainerStyles}
          >
            <div
              className={`${handles.slideChildrenContainer} flex justify-center items-center w-100`}
            >
              {/* OTIMIZAÇÃO: Sempre renderizar o child, mesmo durante navegação rápida
                  Isso garante que os clones sejam sempre visíveis no desktop */}
              {child}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default SliderTrack
