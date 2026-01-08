import React, { FC, useRef, Fragment, ReactNode } from 'react'
import { useDevice } from 'vtex.device-detector'

import { useScreenResize } from '../hooks/useScreenResize'
import { useAutoplay } from '../hooks/useAutoplay'
import {
  SliderLayoutProps,
  SliderLayoutSiteEditorProps,
  useSliderState,
} from './SliderContext'
import SliderTrack, {
  CSS_HANDLES as SliderTrackCssHandles,
} from './SliderTrack'
import Arrow, { CSS_HANDLES as ArrowCssHandles } from './Arrow'
import { useContextCssHandles } from '../modules/cssHandles'
import { useSameHeight } from '../hooks/useSameHeight'

interface Props extends SliderLayoutSiteEditorProps {
  arrowSize: number
  totalItems: number
  itemsPerPage: number
  centerMode: SliderLayoutProps['centerMode']
  centerModeSlidesGap?: SliderLayoutProps['centerModeSlidesGap']
  children?: Array<Exclude<ReactNode, boolean | null | undefined>>
}

export const CSS_HANDLES = [
  'sliderLayoutContainer',
  'sliderTrackContainer',
  ...SliderTrackCssHandles,
  ...ArrowCssHandles,
] as const

const Slider: FC<Props> = ({
  children,
  totalItems,
  infinite = false,
  showNavigationArrows,
  showPaginationDots,
  usePagination: shouldUsePagination = true,
  arrowSize,
  fullWidth,
  itemsPerPage,
  centerMode,
  centerModeSlidesGap,
  sameHeight = false,
}) => {
  const { handles, withModifiers } = useContextCssHandles()
  const { isMobile } = useDevice()
  const { label = 'slider', slidesPerPage } = useSliderState()
  const shouldBeStaticList = slidesPerPage >= totalItems

  const isLooping = infinite && !shouldBeStaticList

  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  const controls = `${label
    .toLowerCase()
    .trim()
    .replace(/ /g, '-')}-items-${Math.random()
    .toString(36)
    .substring(2, 9)}`

  useAutoplay(isLooping, containerRef)
  useScreenResize(isLooping, itemsPerPage)

  useSameHeight({
    enabled: sameHeight && !shouldUsePagination && !shouldBeStaticList,
    selector: `.${handles.slide}`
  })

  const shouldShowArrows = Boolean(
    (showNavigationArrows === 'always' ||
      (showNavigationArrows === 'mobileOnly' && isMobile) ||
      (showNavigationArrows === 'desktopOnly' && !isMobile)) &&
      !shouldBeStaticList
  )

  const shouldShowPaginationDots = Boolean(
    (showPaginationDots === 'always' ||
      (showPaginationDots === 'mobileOnly' && isMobile) ||
      (showPaginationDots === 'desktopOnly' && !isMobile)) &&
      !shouldBeStaticList
  )

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!shouldUsePagination && !shouldBeStaticList) {
      const container = e.currentTarget
      const maxScrollLeft = container.scrollWidth - container.clientWidth

      if (container.scrollLeft < 0) {
        container.scrollLeft = 0
      } else if (container.scrollLeft > maxScrollLeft) {
        container.scrollLeft = maxScrollLeft
      }
    }
  }

  if (!shouldUsePagination && !shouldBeStaticList) {
    return (
      <section
        ref={sectionRef}
        aria-label={label}
        id={controls}
        style={{
          WebkitOverflowScrolling: 'touch',
          paddingLeft: fullWidth ? undefined : arrowSize * 2,
          paddingRight: fullWidth ? undefined : arrowSize * 2,
          touchAction: 'pan-y',
        }}
        className={`w-100 flex items-center relative ${handles.sliderLayoutContainer}`}
      >
        <div
          className={`w-100 ${handles.sliderTrackContainer} overflow-x-scroll`}
          ref={containerRef}
          onScroll={handleScroll}
        >
          <div
            className={`${handles.sliderTrack} flex ${
              centerMode !== 'disabled' ? '' : 'justify-around'
            } relative pa0 ma0`}
            style={{
              width: `${(totalItems * 100) / itemsPerPage}%`,
            }}
          >
            {React.Children.map(children, (child, index) => (
              <div
                key={index}
                className={`${handles.slide} flex relative`}
                style={{
                  width: `${100 / itemsPerPage}%`,
                }}
              >
                <div
                  className={`${withModifiers('slideChildrenContainer', sameHeight ? 'sameHeight' : '')} flex justify-center items-center w-100`}
                  style={sameHeight ? { height: '100%' } : undefined}
                >
                  {child}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      aria-label={label}
      id={controls}
      style={{
        paddingLeft: fullWidth ? undefined : arrowSize * 2,
        paddingRight: fullWidth ? undefined : arrowSize * 2,
        touchAction: 'pan-y',
      }}
      className={`w-100 flex items-center relative ${handles.sliderLayoutContainer}`}
    >
      <div
        className={`w-100 ${handles.sliderTrackContainer} overflow-hidden`}
        ref={containerRef}
      >
        <SliderTrack
          centerMode={centerMode}
          centerModeSlidesGap={centerModeSlidesGap}
          infinite={isLooping}
          totalItems={totalItems}
          sameHeight={sameHeight}
          showPagination={shouldShowPaginationDots}
        >
          {children}
        </SliderTrack>
      </div>
      {shouldShowArrows && shouldUsePagination && (
        <Fragment>
          <Arrow
            totalItems={totalItems}
            orientation="left"
            controls={controls}
            infinite={isLooping}
            arrowSize={arrowSize}
          />
          <Arrow
            totalItems={totalItems}
            orientation="right"
            controls={controls}
            infinite={isLooping}
            arrowSize={arrowSize}
          />
        </Fragment>
      )}
    </section>
  )
}

export default Slider
