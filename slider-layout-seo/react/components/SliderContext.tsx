import React, {
  createContext,
  useReducer,
  useContext,
  FC,
  useMemo,
  useState,
} from 'react'
import { ResponsiveValuesTypes } from 'vtex.responsive-values'

import { useSliderGroupState } from '../SliderLayoutGroup'

interface AdjustOnResizeAction {
  type: 'ADJUST_ON_RESIZE'
  payload: {
    shouldCorrectItemPosition: boolean
    slidesPerPage: number
    navigationStep: number
  }
}

interface SlideAction {
  type: 'SLIDE'
  payload: {
    transform?: number
    currentSlide: number
    virtualSlide: number
  }
}

interface TouchAction {
  type: 'TOUCH'
  payload: {
    transform?: number
    isOnTouchMove: boolean
  }
}

interface DisableTransitionAction {
  type: 'DISABLE_TRANSITION'
}

interface AdjustCurrentSlideAction {
  type: 'ADJUST_CURRENT_SLIDE'
  payload: {
    currentSlide: number
    virtualSlide: number
    transform?: number
  }
}

interface StartLoopNormalizationAction {
  type: 'START_LOOP_NORMALIZATION'
}

interface EndLoopNormalizationAction {
  type: 'END_LOOP_NORMALIZATION'
}

interface SyncSliderGroupAction {
  type: 'SYNC_SLIDER_GROUP'
  payload: {
    currentSlide: number
    virtualSlide: number
    transform?: number
  }
}

interface AdjustContextValuesAction {
  type: 'ADJUST_CONTEXT_VALUES'
  payload: {
    transformMap: State['transformMap']
    slideWidth: State['slideWidth']
    slidesPerPage: State['slidesPerPage']
    transform: State['transform']
    navigationStep: State['navigationStep']
    totalItems: State['totalItems']
    isPageNavigationStep: State['isPageNavigationStep']
    loopCloneCount: State['loopCloneCount']
    virtualSlide: State['virtualSlide']
    virtualTotalItems: State['virtualTotalItems']
    currentSlide: State['currentSlide']
    infinite: State['infinite']
  isLoopingAdjustment: State['isLoopingAdjustment']
  }
}

export interface SliderLayoutSiteEditorProps {
  infinite?: boolean
  showNavigationArrows?: 'mobileOnly' | 'desktopOnly' | 'always' | 'never'
  showPaginationDots?: 'mobileOnly' | 'desktopOnly' | 'always' | 'never'
  usePagination?: boolean
  fullWidth?: boolean
  arrowSize?: ResponsiveValuesTypes.ResponsiveValue<number>
}

export interface SliderLayoutProps {
  totalItems?: number
  label?: string
  slideTransition?: {
    /** Transition speed in ms */
    speed: number
    /** Transition delay in ms */
    delay: number
    timing: string
  }
  autoplay?: {
    /** Timeout duration in ms */
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
  /** Width of each slide */
  slideWidth: number
  /** Number of slides to show per page */
  slidesPerPage: number
  /** Index of the leftmost slide of the current page */
  currentSlide: number
  /** Current transform value */
  transform: number
  /** Total number of slides */
  totalItems: number
  /** Additional clones rendered at each edge for looped mode */
  loopCloneCount: number
  /** Current index within the virtual track (includes clones) */
  virtualSlide: number
  /** Virtual slides count (real slides + clones) */
  virtualTotalItems: number
  /** Number of slides to slide in navigation */
  navigationStep: number
  /** Whether or not navigationStep prop is set to 'page' */
  isPageNavigationStep: boolean
  /** Whether or not a touchmove event is happening */
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

type Action =
  | AdjustOnResizeAction
  | SlideAction
  | TouchAction
  | DisableTransitionAction
  | AdjustCurrentSlideAction
  | AdjustContextValuesAction
  | SyncSliderGroupAction
  | StartLoopNormalizationAction
  | EndLoopNormalizationAction
type Dispatch = (action: Action) => void

const SliderStateContext = createContext<State | undefined>(undefined)
const SliderDispatchContext = createContext<Dispatch | undefined>(undefined)

function sliderContextReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADJUST_ON_RESIZE':
      return {
        ...state,
        slidesPerPage: action.payload.slidesPerPage,
        navigationStep: action.payload.navigationStep,
        transform: action.payload.shouldCorrectItemPosition
          ? state.transformMap[state.virtualSlide]
          : state.transform,
      }

    case 'SLIDE':
      return {
        ...state,
        transform: action.payload.transform ?? state.transform,
        currentSlide: action.payload.currentSlide,
        virtualSlide: action.payload.virtualSlide,
        useSlidingTransitionEffect: true,
      }

    case 'TOUCH':
      return {
        ...state,
        transform: action.payload.transform ?? state.transform,
        isOnTouchMove: action.payload.isOnTouchMove,
      }

    case 'DISABLE_TRANSITION':
      return {
        ...state,
        useSlidingTransitionEffect: false,
      }

    case 'ADJUST_CURRENT_SLIDE':
      return {
        ...state,
        currentSlide: action.payload.currentSlide,
        virtualSlide: action.payload.virtualSlide,
        transform: action.payload.transform ?? state.transform,
        useSlidingTransitionEffect: false,
      }

    case 'START_LOOP_NORMALIZATION':
      return {
        ...state,
        isLoopingAdjustment: true,
      }

    case 'END_LOOP_NORMALIZATION':
      return {
        ...state,
        isLoopingAdjustment: false,
      }

    case 'SYNC_SLIDER_GROUP':
      return {
        ...state,
        currentSlide: action.payload.currentSlide,
        virtualSlide: action.payload.virtualSlide,
        transform: action.payload.transform ?? state.transform,
        useSlidingTransitionEffect: true,
      }

    case 'ADJUST_CONTEXT_VALUES':
      return {
        ...state,
        transformMap: action.payload.transformMap,
        slideWidth: action.payload.slideWidth,
        slidesPerPage: action.payload.slidesPerPage,
        transform: action.payload.transform,
        navigationStep: action.payload.navigationStep,
        totalItems: action.payload.totalItems,
        isPageNavigationStep: action.payload.isPageNavigationStep,
        loopCloneCount: action.payload.loopCloneCount,
        virtualSlide: action.payload.virtualSlide,
        virtualTotalItems: action.payload.virtualTotalItems,
        currentSlide: action.payload.currentSlide,
        infinite: action.payload.infinite,
      }

    default:
      return state
  }
}

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

  // This enables us to support dynamic slider-layouts
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

  // Removido newTotalItems pois não é mais usado no cálculo simplificado

  const slideWidth = useMemo(() => {
    // Para valores decimais, sempre usamos o itemsPerPage original para cálculos de largura
    const baseSlideWidth = 100 / itemsPerPage

    let resultingSlideWidth = baseSlideWidth

    if (centerMode !== 'disabled') {
      // Usar itemsPerPage original para manter precisão decimal
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

    // Para valores decimais, manter cálculo baseado no virtualTotalItems
    // O stepSize representa quanto % mover para passar de um slide para o próximo
    const stepSize =
      virtualTotalItems > 0 ? 100 / virtualTotalItems : 0

    for (let i = 0; i < virtualTotalItems; i++) {
      currentMap[i] = -(i * stepSize)
    }

    return currentMap
  }, [virtualTotalItems])

  const initialSlide = useMemo(() => sliderGroupState?.currentSlide ?? 0, [
    sliderGroupState,
  ])

  const initialVirtualSlide = loopCloneCount + initialSlide

  const initialTransform = useMemo(() => {
    if (sliderGroupState?.transform !== undefined && sliderGroupState !== null) {
      return sliderGroupState.transform ?? 0
    }

    return transformMap[initialVirtualSlide] || 0
  }, [transformMap, initialVirtualSlide, sliderGroupState])

  const [state, dispatch] = useReducer(sliderContextReducer, {
    slideWidth,
    slidesPerPage: resolvedSlidesPerPage,
    currentSlide: initialSlide,
    virtualSlide: initialVirtualSlide,
    transform: initialTransform,
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
    isOnTouchMove: false,
    useSlidingTransitionEffect: false,
    infinite: loopCloneCount > 0,
    isLoopingAdjustment: false,
  })

  if (
    itemsPerPage !== prevProps.itemsPerPage ||
    totalItems !== prevProps.totalItems ||
    infinite !== prevProps.infinite
  ) {
    // Para valores decimais, calcular maxSlide de forma mais precisa
    const maxSlide = Math.max(
      0,
      Math.ceil(totalItems - resolvedSlidesPerPage)
    )
    const nextCurrentSlide = Math.min(state.currentSlide, maxSlide)
    const nextVirtualSlide = loopCloneCount + nextCurrentSlide
    dispatch({
      type: 'ADJUST_CONTEXT_VALUES',
      payload: {
        transformMap,
        slideWidth,
        slidesPerPage: resolvedSlidesPerPage,
        transform: transformMap[nextVirtualSlide] || 0,
        navigationStep: resolvedNavigationStep,
        totalItems,
        isPageNavigationStep: navigationStep === 'page',
        loopCloneCount,
        virtualSlide: nextVirtualSlide,
        virtualTotalItems,
        currentSlide: nextCurrentSlide,
        infinite: loopCloneCount > 0,
        isLoopingAdjustment: state.isLoopingAdjustment,
      },
    })
    setPrevProps({ itemsPerPage, totalItems, infinite })
  }

  if (
    sliderGroupState &&
    sliderGroupState.currentSlide !== state.currentSlide
  ) {
    const newCurrentSlide = sliderGroupState?.currentSlide ?? state.currentSlide
    const newVirtualSlide = loopCloneCount + newCurrentSlide
    const newTransformValue =
      sliderGroupState?.transform ?? transformMap[newVirtualSlide]

    dispatch({
      type: 'SYNC_SLIDER_GROUP',
      payload: {
        currentSlide: newCurrentSlide,
        virtualSlide: newVirtualSlide,
        transform: newTransformValue,
      },
    })
  }

  return (
    <SliderStateContext.Provider value={state}>
      <SliderDispatchContext.Provider value={dispatch}>
        {children}
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

export { SliderContextProvider, useSliderDispatch, useSliderState }
