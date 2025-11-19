import React, { memo, FC } from 'react'

import { useContextCssHandles } from '../modules/cssHandles'
import { useSliderState, useSliderDispatch } from './SliderContext'
import { useSliderControls } from '../hooks/useSliderControls'

const DOTS_DEFAULT_SIZE = 0.625

interface Props {
  controls: string
  totalItems: number
  infinite: boolean
}

export const CSS_HANDLES = ['paginationDotsContainer', 'paginationDot'] as const

const getSelectedDot = (
  passVisibleSlides: boolean,
  currentSlide: number,
  slidesToShow: number,
  totalItems?: number
): number => {
  if (!passVisibleSlides) {
    return currentSlide
  }

  if (totalItems === undefined) {
    const slidesToShowInt = Math.floor(slidesToShow)
    const realCurrentSlide = currentSlide + (slidesToShowInt - 1)
    return Math.floor(realCurrentSlide / slidesToShowInt)
  }

  const totalDots = Math.ceil(totalItems / slidesToShow)
  // Para valores decimais, calcular maxSlide de forma mais precisa
  // Considera que o último slide visível deve mostrar pelo menos parte do último item
  const maxSlide = Math.max(0, Math.ceil(totalItems - slidesToShow))

  // Verifica se estamos no último conjunto de slides
  // Para valores decimais, precisamos considerar um threshold mais preciso
  const threshold = slidesToShow % 1 !== 0 
    ? Math.ceil(maxSlide) - 0.5 
    : Math.floor(maxSlide)

  if (currentSlide >= threshold) {
    return Math.max(0, totalDots - 1)
  }

  // Para valores decimais, usar cálculo mais preciso baseado em proporção
  const calculatedDot = slidesToShow % 1 !== 0
    ? Math.floor(currentSlide / slidesToShow)
    : Math.round(currentSlide / slidesToShow)
    
  return Math.max(0, Math.min(calculatedDot, totalDots - 1))
}

const getSlideIndices = (
  slidesToShow: number,
  passVisibleSlides: boolean,
  totalItems: number
): number[] =>
  slidesToShow
    ? [
        ...Array(
          passVisibleSlides ? Math.ceil(totalItems / slidesToShow) : totalItems
        ).keys(),
      ]
    : []

const PaginationDots: FC<Props> = ({ controls, totalItems, infinite }) => {
  const {
    slidesPerPage,
    currentSlide,
    navigationStep,
    isPageNavigationStep,
    virtualSlide,
    loopCloneCount,
    transformMap,
  } = useSliderState()
  const { goBack, goForward } = useSliderControls(infinite)
  const dispatch = useSliderDispatch()
  const { handles, withModifiers } = useContextCssHandles()
  const passVisibleSlides =
    isPageNavigationStep || navigationStep === Math.floor(slidesPerPage)

  const slideIndexes = getSlideIndices(
    slidesPerPage,
    passVisibleSlides,
    totalItems
  )

  const normalizedCurrentSlide = React.useMemo(() => {
    if (!infinite || loopCloneCount === 0) {
      return currentSlide
    }

    const firstRealIndex = loopCloneCount
    const lastRealIndex = loopCloneCount + totalItems - 1

    if (virtualSlide >= firstRealIndex && virtualSlide <= lastRealIndex) {
      return Math.max(0, Math.min(virtualSlide - loopCloneCount, totalItems - 1))
    }

    const relativeIndex = virtualSlide - loopCloneCount
    const normalized =
      ((relativeIndex % totalItems) + totalItems) % totalItems

    return Math.max(0, Math.min(normalized, totalItems - 1))
  }, [infinite, loopCloneCount, currentSlide, virtualSlide, totalItems])

  const handleDotClick = (
    event: React.KeyboardEvent | React.MouseEvent,
    dotIndex: number
  ) => {
    if (event) {
      event.stopPropagation()
      event.preventDefault()
    }

    if (!infinite || loopCloneCount === 0) {
      let targetSlideIndex: number

      if (passVisibleSlides) {
        const totalDots = Math.ceil(totalItems / slidesPerPage)
        const lastDotIndex = totalDots - 1

        if (dotIndex === lastDotIndex) {
          // Para valores decimais, calcular o último slide de forma mais precisa
          // O último slide deve permitir que o último item seja visível
          const maxSlide = Math.max(0, Math.ceil(totalItems - slidesPerPage))
          targetSlideIndex = Math.floor(maxSlide)

          dispatch({
            type: 'SLIDE',
            payload: {
              currentSlide: targetSlideIndex,
              virtualSlide: targetSlideIndex,
              transform: transformMap[targetSlideIndex] ?? 0,
            },
          })
          return
        } else {
          // Para valores decimais, usar cálculo proporcional mais preciso
          targetSlideIndex = slidesPerPage % 1 !== 0
            ? Math.floor(dotIndex * slidesPerPage)
            : Math.round(dotIndex * slidesPerPage)
          
          const maxSlide = Math.max(0, Math.ceil(totalItems - slidesPerPage))
          targetSlideIndex = Math.min(targetSlideIndex, Math.floor(maxSlide))
        }
      } else {
        targetSlideIndex = Math.min(dotIndex, totalItems - 1)
      }

      const pageDelta = targetSlideIndex - normalizedCurrentSlide
      const slidesToPass = Math.abs(pageDelta)

      pageDelta > 0 ? goForward(slidesToPass) : goBack(slidesToPass)
      return
    }

    let targetSlideIndex: number

    if (passVisibleSlides) {
      // Para valores decimais, usar cálculo proporcional mais preciso
      targetSlideIndex = slidesPerPage % 1 !== 0
        ? Math.floor(dotIndex * slidesPerPage)
        : dotIndex * Math.floor(slidesPerPage)
      
      const maxSlide = Math.max(0, Math.ceil(totalItems - slidesPerPage))
      targetSlideIndex = Math.min(targetSlideIndex, Math.floor(maxSlide))
    } else {
      targetSlideIndex = Math.min(dotIndex, totalItems - 1)
    }

    if (dotIndex === 0) {
      targetSlideIndex = 0
    }

    const firstRealIndex = loopCloneCount
    const lastRealIndex = loopCloneCount + totalItems - 1
    const isInClones =
      virtualSlide < firstRealIndex || virtualSlide > lastRealIndex

    if (isInClones || dotIndex === 0) {
      const targetVirtualSlide = loopCloneCount + targetSlideIndex
      const targetTransform = transformMap[targetVirtualSlide] ?? 0

      dispatch({
        type: 'ADJUST_CURRENT_SLIDE',
        payload: {
          currentSlide: targetSlideIndex,
          virtualSlide: targetVirtualSlide,
          transform: targetTransform,
        },
      })
    } else {
      const currentDotIndex = getSelectedDot(
        passVisibleSlides,
        normalizedCurrentSlide,
        slidesPerPage,
        totalItems
      )
      const pageDelta = dotIndex - currentDotIndex
      // Para valores decimais, calcular slidesToPass de forma mais precisa
      const slidesToPass = passVisibleSlides
        ? Math.ceil(Math.abs(pageDelta) * slidesPerPage)
        : Math.abs(pageDelta)
      pageDelta > 0 ? goForward(slidesToPass) : goBack(slidesToPass)
    }
  }

  return (
    <div
      className={`${handles.paginationDotsContainer} flex absolute justify-center pa0 ma0 bottom-0 left-0 right-0`}
      role="group"
      aria-label="Slider pagination dots"
    >
      {slideIndexes.map(index => {
        const selectedDotIndex = getSelectedDot(
          passVisibleSlides,
          normalizedCurrentSlide,
          slidesPerPage,
          totalItems
        )
        const isActive = index === selectedDotIndex

        return (
          <div
            className={`${withModifiers(
              'paginationDot',
              isActive ? 'isActive' : ''
            )} ${
              isActive ? 'bg-emphasis' : 'bg-muted-3'
            } grow dib br-100 pa2 mr2 ml2 bw0 pointer outline-0`}
            style={{
              height: `${DOTS_DEFAULT_SIZE}rem`,
              width: `${DOTS_DEFAULT_SIZE}rem`,
            }}
            key={index}
            tabIndex={isActive ? 0 : -1}
            onKeyDown={event => handleDotClick(event, index)}
            onClick={event => handleDotClick(event, index)}
            role="button"
            aria-controls={controls}
            aria-label={`Dot ${index + 1} of ${slideIndexes.length}`}
            data-testid="paginationDot"
          />
        )
      })}
    </div>
  )
}

export default memo(PaginationDots)
