import React, { ReactNode, FC } from 'react'

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
  usePagination: boolean
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
  usePagination,
  centerMode,
  centerModeSlidesGap,
  totalItems,
  children,
}) => {
  const {
    slideWidth,
    slidesPerPage,
    currentSlide,
    isOnTouchMove,
    useSlidingTransitionEffect,
    slideTransition: { speed, timing, delay },
    transformMap,
    transform,
  } = useSliderState()

  const dispatch = useSliderDispatch()
  const { handles, withModifiers } = useContextCssHandles()

  const { shouldRenderItem, isItemVisible } = useSliderVisibility({
    currentSlide,
    slidesPerPage,
    totalItems,
    centerMode,
  })

  // Simplified - no slide cloning for infinite mode
  const slides = children ?? []

  const trackWidth =
    slidesPerPage <= totalItems
      ? `${(slides.length * 100) / slidesPerPage}%`
      : '100%'

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
          isOnTouchMove ? transform : transformMap[currentSlide] || 0
        }%, 0, 0)`,
        width: trackWidth,
      }}
      onTransitionEnd={() => {
        // Simplified - just disable transition, no loop adjustment needed
        dispatch({ type: 'DISABLE_TRANSITION' })
      }}
      aria-atomic="false"
      aria-live="polite"
    >
      {slides.map((child, index) => {
        // Simplified - no cloned slides adjustment needed
        const adjustedIndex = index
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
            key={adjustedIndex}
            {...resolveAriaAttributes(
              isItemVisible(adjustedIndex),
              adjustedIndex,
              totalItems
            )}
            className={`${withModifiers('slide', [
              getFirstOrLastVisible(slidesPerPage, adjustedIndex),
              isItemVisible(adjustedIndex) ? 'visible' : 'hidden',
            ])} flex relative`}
            data-index={
              adjustedIndex >= 0 && adjustedIndex < totalItems
                ? adjustedIndex + 1
                : undefined
            }
            style={slideContainerStyles}
          >
            <div
              className={`${handles.slideChildrenContainer} flex justify-center items-center w-100`}
            >
              {!usePagination || shouldRenderItem(adjustedIndex)
                ? child
                : child}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default SliderTrack
