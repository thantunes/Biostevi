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

  const { shouldRenderItem, isItemVisible } = useSliderVisibility({
    currentSlide,
    slidesPerPage,
    totalItems,
    centerMode,
  })

  const baseSlides = children ?? []
  const baseSlidesCount = baseSlides.length
  const shouldUseVirtualSlides =
    Boolean(infinite) && loopCloneCount > 0 && baseSlidesCount > 0

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

  const headClones = shouldUseVirtualSlides
    ? baseSlides
        .slice(baseSlidesCount - loopCloneCount)
        .map((child, index) =>
          cloneNode(
            child,
            baseSlidesCount - loopCloneCount + index,
            'head',
            index
          )
        )
    : []

  const tailClones = shouldUseVirtualSlides
    ? baseSlides
        .slice(0, loopCloneCount)
        .map((child, index) => cloneNode(child, index, 'tail', index))
    : []

  const slides = shouldUseVirtualSlides
    ? ([] as Array<Exclude<ReactNode, boolean | null | undefined>>)
        .concat(headClones)
        .concat(baseSlides)
        .concat(tailClones)
    : baseSlides

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
        dispatch({ type: 'DISABLE_TRANSITION' })

        if (
          shouldUseVirtualSlides &&
          baseSlidesCount > 0 &&
          totalItems > 0 &&
          !isOnTouchMove &&
          useSlidingTransitionEffect
        ) {
          const firstRealIndex = loopCloneCount
          const lastRealIndex = loopCloneCount + totalItems - 1

          const isInHeadClones = virtualSlide < firstRealIndex
          const isInTailClones = virtualSlide > lastRealIndex

          if (isInHeadClones || isInTailClones) {
            const normalizedRealIndex = getRealIndexFromVirtual(virtualSlide)
            const normalizedVirtualSlide =
              loopCloneCount + normalizedRealIndex

            if (normalizedVirtualSlide !== virtualSlide) {
              const hasDecimalSlides = slidesPerPage % 1 !== 0
              const delay = hasDecimalSlides ? 100 : 0

              setTimeout(() => {
                dispatch({
                  type: 'ADJUST_CURRENT_SLIDE',
                  payload: {
                    currentSlide: normalizedRealIndex,
                    virtualSlide: normalizedVirtualSlide,
                    transform: transformMap[normalizedVirtualSlide] || 0,
                  },
                })
              }, delay)
            }
          }
        }
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
              {!usePagination || shouldRenderItem(realIndex)
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
