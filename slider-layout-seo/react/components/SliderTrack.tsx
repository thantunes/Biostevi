import React, { ReactNode, FC, useMemo, useCallback } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import { Autoplay } from 'swiper'

import {
  useSliderState,
  useSwiperInstance,
  SliderLayoutProps,
} from './SliderContext'
import { useSliderVisibility } from '../hooks/useSliderVisibility'
import { useContextCssHandles } from '../modules/cssHandles'
import { useSameHeight } from '../hooks/useSameHeight'

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
  sameHeight?: boolean
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
  if (index % integerSlidesPerPage === 0) {
    return 'firstVisible'
  }

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
  sameHeight = false,
}) => {
  const {
    slideWidth,
    slidesPerPage,
    currentSlide,
    slideTransition: { speed },
    autoplay,
  } = useSliderState()

  const swiperRef = useSwiperInstance()
  const { handles, withModifiers } = useContextCssHandles()

  const { isItemVisible } = useSliderVisibility({
    currentSlide,
    slidesPerPage,
    totalItems,
    centerMode,
  })

  // Aplicar mesma altura aos slides quando sameHeight estiver ativo
  useSameHeight({ enabled: sameHeight })

  const baseSlides = children ?? []

  const onSwiper = useCallback((swiper: SwiperType) => {
    swiperRef.current = swiper
  }, [])

  const slideContainerStyles = useMemo(
    () => ({
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
    }),
    [slideWidth, centerMode, centerModeSlidesGap, slidesPerPage]
  )

  const swiperModules = useMemo(() => {
    const modules = []
    if (autoplay) {
      modules.push(Autoplay)
    }
    return modules
  }, [autoplay])

  const autoplayConfig = useMemo(() => {
    if (!autoplay) return false

    return {
      delay: autoplay.timeout,
      disableOnInteraction: false,
      pauseOnMouseEnter: autoplay.stopOnHover || false,
    }
  }, [autoplay])

  return (
    <Swiper
      modules={swiperModules}
      onSwiper={onSwiper}
      slidesPerView={slidesPerPage}
      spaceBetween={centerModeSlidesGap || 0}
      loop={infinite && totalItems > Math.ceil(slidesPerPage)}
      centeredSlides={centerMode === 'center'}
      centeredSlidesBounds={centerMode !== 'disabled'}
      speed={speed}
      autoplay={autoplayConfig}
      style={{
        width: '100%',
      }}
      className={handles.sliderTrack}
      data-testid="slider-track"
      aria-atomic="false"
      aria-live="polite"
    >
      {baseSlides.map((child, index) => {
        const realIndex = index
        const isVisible = isItemVisible(realIndex)

        return (
          <SwiperSlide
            key={`slide-${index}`}
            style={slideContainerStyles}
            className={`${withModifiers('slide', [
              getFirstOrLastVisible(slidesPerPage, realIndex),
              isVisible ? 'visible' : 'hidden',
            ])} flex relative`}
            {...resolveAriaAttributes(isVisible, realIndex, totalItems)}
            data-index={realIndex >= 0 && realIndex < totalItems ? realIndex + 1 : undefined}
          >
            <div
              className={`${withModifiers('slideChildrenContainer', sameHeight ? 'sameHeight' : '')} flex justify-center items-center w-100`}
              style={sameHeight ? { height: '100%' } : undefined}
            >
              {child}
            </div>
          </SwiperSlide>
        )
      })}
    </Swiper>
  )
}

export default SliderTrack
