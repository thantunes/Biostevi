import React, {
  createContext,
  useContext,
  FC,
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react'
import { ResponsiveValuesTypes } from 'vtex.responsive-values'
import type { Swiper as SwiperType } from 'swiper'

import { useSliderGroupState } from '../SliderLayoutGroup'

export interface SliderLayoutSiteEditorProps {
  infinite?: boolean
  showNavigationArrows?: 'mobileOnly' | 'desktopOnly' | 'always' | 'never'
  showPaginationDots?: 'mobileOnly' | 'desktopOnly' | 'always' | 'never'
  usePagination?: boolean
  fullWidth?: boolean
  arrowSize?: ResponsiveValuesTypes.ResponsiveValue<number>
  sameHeight?: boolean
}

export interface SliderLayoutProps {
  totalItems?: number
  label?: string
  slideTransition?: {
    speed: number
    delay: number
    timing: string
  }
  autoplay?: {
    timeout: number
    stopOnHover?: boolean
  }
  navigationStep?: number | 'page'
  itemsPerPage?: ResponsiveValuesTypes.ResponsiveValue<number>
  centerMode?: ResponsiveValuesTypes.ResponsiveValue<
    'center' | 'to-the-left' | 'disabled'
  >
  centerModeSlidesGap?: number
}

interface State extends Partial<SliderLayoutProps> {
  slideWidth: number
  slidesPerPage: number
  currentSlide: number
  transform: number
  totalItems: number
  loopCloneCount: number
  virtualSlide: number
  virtualTotalItems: number
  navigationStep: number
  isPageNavigationStep: boolean
  isOnTouchMove: boolean
  useSlidingTransitionEffect: boolean
  transformMap: Record<number, number>
  slideTransition: Exclude<SliderLayoutProps['slideTransition'], undefined>
  infinite: boolean
  isLoopingAdjustment: boolean
}

interface SliderContextProps extends SliderLayoutProps {
  totalItems: number
  itemsPerPage: number
  infinite: SliderLayoutSiteEditorProps['infinite']
}

const SliderStateContext = createContext<State | undefined>(undefined)
const SliderDispatchContext = createContext<((action: any) => void) | undefined>(
  undefined
)
const SwiperInstanceContext = createContext<
  React.MutableRefObject<SwiperType | null> | undefined
>(undefined)

const SliderContextProvider: FC<SliderContextProps> = ({
  autoplay,
  children,
  totalItems,
  label = 'slider',
  navigationStep = 'page',
  itemsPerPage,
  centerMode,
  slideTransition = {
    speed: 400,
    delay: 0,
    timing: '',
  },
  centerModeSlidesGap,
  infinite = false,
}) => {
  const sliderGroupState = useSliderGroupState()
  const swiperRef = useRef<SwiperType | null>(null)
  const isInitializedRef = useRef(false)
  const isUpdatingRef = useRef(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [virtualSlide, setVirtualSlide] = useState(0)
  const [isOnTouchMove, setIsOnTouchMove] = useState(false)
  const [useSlidingTransitionEffect, setUseSlidingTransitionEffect] =
    useState(false)

  const [prevProps, setPrevProps] = useState<{
    itemsPerPage: SliderContextProps['itemsPerPage'] | null
    totalItems: SliderContextProps['totalItems'] | null
    infinite: SliderContextProps['infinite'] | null
  }>({
    itemsPerPage: null,
    totalItems: null,
    infinite: null,
  })

  const resolvedSlidesPerPage: number =
    totalItems <= Math.floor(itemsPerPage) ? totalItems : itemsPerPage

  const resolvedNavigationStep: number =
    navigationStep === 'page'
      ? Math.floor(resolvedSlidesPerPage)
      : navigationStep

  const loopCloneCount = (() => {
    if (!infinite) {
      return 0
    }

    const visibleSlidesCeil = Math.max(1, Math.ceil(resolvedSlidesPerPage))

    if (totalItems <= visibleSlidesCeil) {
      return 0
    }

    return Math.min(totalItems, visibleSlidesCeil)
  })()

  const virtualTotalItems =
    totalItems + (loopCloneCount > 0 ? loopCloneCount * 2 : 0)

  const slideWidth = useMemo(() => {
    const baseSlideWidth = 100 / itemsPerPage

    let resultingSlideWidth = baseSlideWidth

    if (centerMode !== 'disabled') {
      resultingSlideWidth = (itemsPerPage / (itemsPerPage + 1)) * baseSlideWidth

      if (centerMode === 'to-the-left' && centerModeSlidesGap) {
        resultingSlideWidth =
          (baseSlideWidth * itemsPerPage) / (itemsPerPage + 1 / 2)
      }
    }

    return resultingSlideWidth
  }, [itemsPerPage, centerMode, centerModeSlidesGap])

  const transformMap = useMemo(() => {
    const currentMap: Record<number, number> = {}
    const stepSize = virtualTotalItems > 0 ? 100 / virtualTotalItems : 0

    for (let i = 0; i < virtualTotalItems; i++) {
      currentMap[i] = -(i * stepSize)
    }

    return currentMap
  }, [virtualTotalItems])

  const initialSlide = useMemo(
    () => sliderGroupState?.currentSlide ?? 0,
    [sliderGroupState]
  )

  const initialVirtualSlide = loopCloneCount + initialSlide

  const handleSlideChange = useCallback(() => {
    if (!swiperRef.current || isUpdatingRef.current) return

    const swiper = swiperRef.current
    const realIndex = swiper.realIndex ?? swiper.activeIndex
    const activeIndex = swiper.activeIndex

    isUpdatingRef.current = true
    setCurrentSlide(realIndex)
    setVirtualSlide(activeIndex)
    setUseSlidingTransitionEffect(true)
    setTimeout(() => {
      isUpdatingRef.current = false
    }, 0)
  }, [])

  const handleTouchStart = useCallback(() => {
    setIsOnTouchMove(true)
  }, [])

  const handleTouchEnd = useCallback(() => {
    setIsOnTouchMove(false)
  }, [])

  const handleTransitionStart = useCallback(() => {
    setUseSlidingTransitionEffect(true)
  }, [])

  const handleTransitionEnd = useCallback(() => {
    setUseSlidingTransitionEffect(false)
  }, [])


  useEffect(() => {
    if (!swiperRef.current || isInitializedRef.current) return

    const swiper = swiperRef.current
    isInitializedRef.current = true

    swiper.on('slideChange', handleSlideChange)
    swiper.on('touchStart', handleTouchStart)
    swiper.on('touchEnd', handleTouchEnd)
    swiper.on('transitionStart', handleTransitionStart)
    swiper.on('transitionEnd', handleTransitionEnd)

    return () => {
      isInitializedRef.current = false
      swiper.off('slideChange', handleSlideChange)
      swiper.off('touchStart', handleTouchStart)
      swiper.off('touchEnd', handleTouchEnd)
      swiper.off('transitionStart', handleTransitionStart)
      swiper.off('transitionEnd', handleTransitionEnd)
    }
  }, [handleSlideChange, handleTouchStart, handleTouchEnd, handleTransitionStart, handleTransitionEnd])

  useEffect(() => {
    if (isInitializedRef.current) return
    setCurrentSlide(initialSlide)
    setVirtualSlide(initialVirtualSlide)
  }, [initialSlide, initialVirtualSlide])

  useEffect(() => {
    if (
      itemsPerPage === prevProps.itemsPerPage &&
      totalItems === prevProps.totalItems &&
      infinite === prevProps.infinite
    ) {
      return
    }

    if (isUpdatingRef.current) return

    const maxSlide = Math.max(0, Math.ceil(totalItems - resolvedSlidesPerPage))
    const nextCurrentSlide = Math.min(currentSlide, maxSlide)
    const nextVirtualSlide = loopCloneCount + nextCurrentSlide

    isUpdatingRef.current = true
    setCurrentSlide(nextCurrentSlide)
    setVirtualSlide(nextVirtualSlide)
    setPrevProps({ itemsPerPage, totalItems, infinite })

    if (swiperRef.current) {
      swiperRef.current.slideTo(nextVirtualSlide, 0)
    }

    setTimeout(() => {
      isUpdatingRef.current = false
    }, 100)
  }, [itemsPerPage, totalItems, infinite, resolvedSlidesPerPage, loopCloneCount])

  useEffect(() => {
    if (!sliderGroupState || isUpdatingRef.current) return

    const groupSlide = sliderGroupState.currentSlide
    if (groupSlide === currentSlide) return

    const newVirtualSlide = loopCloneCount + groupSlide

    isUpdatingRef.current = true
    setCurrentSlide(groupSlide)
    setVirtualSlide(newVirtualSlide)

    if (swiperRef.current) {
      swiperRef.current.slideTo(newVirtualSlide)
    }

    setTimeout(() => {
      isUpdatingRef.current = false
    }, 100)
  }, [sliderGroupState?.currentSlide, loopCloneCount])

  const dispatch = (action: any) => {
    if (!swiperRef.current) return

    const swiper = swiperRef.current

    switch (action.type) {
      case 'SLIDE':
        const { virtualSlide: targetVirtualSlide } = action.payload
        if (targetVirtualSlide !== undefined) {
          swiper.slideTo(targetVirtualSlide)
        }
        break

      case 'ADJUST_CURRENT_SLIDE':
        const {
          currentSlide: adjustCurrentSlide,
          virtualSlide: adjustVirtualSlide,
        } = action.payload
        setCurrentSlide(adjustCurrentSlide)
        setVirtualSlide(adjustVirtualSlide)
        if (adjustVirtualSlide !== undefined) {
          swiper.slideTo(adjustVirtualSlide, 0)
        }
        break

      case 'TOUCH':
        setIsOnTouchMove(action.payload.isOnTouchMove)
        break

      case 'DISABLE_TRANSITION':
        setUseSlidingTransitionEffect(false)
        break

      case 'START_LOOP_NORMALIZATION':
      case 'END_LOOP_NORMALIZATION':

        break

      case 'ADJUST_ON_RESIZE':
        swiper.update()
        break

      default:
        break
    }
  }

  const state: State = {
    slideWidth,
    slidesPerPage: resolvedSlidesPerPage,
    currentSlide,
    virtualSlide,
    transform: transformMap[virtualSlide] || 0,
    transformMap,
    navigationStep: resolvedNavigationStep,
    slideTransition,
    itemsPerPage,
    label,
    autoplay,
    totalItems,
    loopCloneCount,
    virtualTotalItems,
    isPageNavigationStep: navigationStep === 'page',
    isOnTouchMove,
    useSlidingTransitionEffect,
    infinite: loopCloneCount > 0,
    isLoopingAdjustment: false,
  }

  return (
    <SliderStateContext.Provider value={state}>
      <SliderDispatchContext.Provider value={dispatch}>
        <SwiperInstanceContext.Provider value={swiperRef}>
          {children}
        </SwiperInstanceContext.Provider>
      </SliderDispatchContext.Provider>
    </SliderStateContext.Provider>
  )
}

function useSliderState() {
  const context = useContext(SliderStateContext)

  if (context === undefined) {
    throw new Error(
      'useSliderState must be used within a SliderContextProvider'
    )
  }

  return context
}

function useSliderDispatch() {
  const context = useContext(SliderDispatchContext)

  if (context === undefined) {
    throw new Error(
      'useSliderDispatch must be used within a SliderContextProvider'
    )
  }

  return context
}

function useSwiperInstance() {
  const context = useContext(SwiperInstanceContext)

  if (context === undefined) {
    throw new Error(
      'useSwiperInstance must be used within a SliderContextProvider'
    )
  }

  return context
}

export { SliderContextProvider, useSliderDispatch, useSliderState, useSwiperInstance }
