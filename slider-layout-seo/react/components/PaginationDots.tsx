import React, { memo, FC, useEffect, useState } from 'react'

import { useContextCssHandles } from '../modules/cssHandles'
import { useSliderState, useSwiperInstance } from './SliderContext'

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
  const maxSlide = Math.max(0, Math.ceil(totalItems - slidesToShow))

  const threshold = slidesToShow % 1 !== 0
    ? Math.ceil(maxSlide) - 0.5
    : Math.floor(maxSlide)

  if (currentSlide >= threshold) {
    return Math.max(0, totalDots - 1)
  }

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
    loopCloneCount,
  } = useSliderState()
  const swiperRef = useSwiperInstance()
  const { handles, withModifiers } = useContextCssHandles()
  const [activeIndex, setActiveIndex] = useState(currentSlide)

  const passVisibleSlides =
    isPageNavigationStep || navigationStep === Math.floor(slidesPerPage)

  const slideIndexes = getSlideIndices(
    slidesPerPage,
    passVisibleSlides,
    totalItems
  )

  // Sincronizar com Swiper
  const handleSlideChange = React.useCallback(() => {
    if (!swiperRef.current) return
    const swiper = swiperRef.current
    const realIndex = swiper.realIndex ?? swiper.activeIndex
    setActiveIndex(realIndex)
  }, [])

  useEffect(() => {
    if (!swiperRef.current) return

    const swiper = swiperRef.current
    swiper.on('slideChange', handleSlideChange)

    return () => {
      swiper.off('slideChange', handleSlideChange)
    }
  }, [handleSlideChange])

  const normalizedCurrentSlide = React.useMemo(() => {
    if (!infinite || loopCloneCount === 0) {
      return activeIndex
    }

    if (swiperRef.current) {
      return swiperRef.current.realIndex ?? activeIndex
    }

    return activeIndex
  }, [infinite, loopCloneCount, activeIndex, swiperRef])

  const handleDotClick = (
    event: React.KeyboardEvent | React.MouseEvent,
    dotIndex: number
  ) => {
    if (event) {
      event.stopPropagation()
      event.preventDefault()
    }

    if (!swiperRef.current) return

    const swiper = swiperRef.current

    if (!infinite || loopCloneCount === 0) {
      let targetSlideIndex: number

      if (passVisibleSlides) {
        const totalDots = Math.ceil(totalItems / slidesPerPage)
        const lastDotIndex = totalDots - 1

        if (dotIndex === lastDotIndex) {
          const maxSlide = Math.max(0, Math.ceil(totalItems - slidesPerPage))
          targetSlideIndex = Math.floor(maxSlide)
        } else {
          targetSlideIndex = slidesPerPage % 1 !== 0
            ? Math.floor(dotIndex * slidesPerPage)
            : Math.round(dotIndex * slidesPerPage)

          const maxSlide = Math.max(0, Math.ceil(totalItems - slidesPerPage))
          targetSlideIndex = Math.min(targetSlideIndex, Math.floor(maxSlide))
        }
      } else {
        targetSlideIndex = Math.min(dotIndex, totalItems - 1)
      }

      swiper.slideTo(targetSlideIndex)
      return
    }

    let targetSlideIndex: number

    if (passVisibleSlides) {
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

    // Para loop infinito, calcular índice virtual
    const targetVirtualSlide = loopCloneCount + targetSlideIndex

    if (swiper.loopedSlides) {
      swiper.slideTo(targetVirtualSlide)
    } else {
      swiper.slideTo(targetSlideIndex)
    }
  }

  const selectedDotIndex = getSelectedDot(
    passVisibleSlides,
    normalizedCurrentSlide,
    slidesPerPage,
    totalItems
  )

  return (
    <div
      className={`${handles.paginationDotsContainer} flex absolute justify-center pa0 ma0 bottom-0 left-0 right-0`}
      role="group"
      aria-label="Slider pagination dots"
    >
      {slideIndexes.map(index => {
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
