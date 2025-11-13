import { useSliderDispatch, useSliderState } from '../components/SliderContext'
import { useSliderGroupDispatch } from '../SliderLayoutGroup'

export const useSliderControls = (infinite: boolean) => {
  const {
    currentSlide,
    slidesPerPage,
    totalItems,
    navigationStep,
    transformMap,
    loopCloneCount,
    virtualSlide,
    virtualTotalItems,
    infinite: isLoopingEnabled,
  } = useSliderState()

  const dispatch = useSliderDispatch()
  const groupDispatch = useSliderGroupDispatch()

  if (totalItems === 0) {
    const noop = () => {}

    return {
      goForward: noop,
      goBack: noop,
    }
  }

  const looping = infinite && isLoopingEnabled && loopCloneCount > 0

  const getMaxSlide = () =>
    Math.max(0, totalItems - Math.floor(slidesPerPage))

  const getRealIndexFromVirtual = (targetVirtualSlide: number) => {
    if (!looping || totalItems === 0) {
      return Math.max(
        0,
        Math.min(targetVirtualSlide, Math.max(0, totalItems - 1))
      )
    }

    const relativeIndex = targetVirtualSlide - loopCloneCount
    const normalized =
      ((relativeIndex % totalItems) + totalItems) % totalItems

    return normalized
  }

  const goBack = (step?: number) => {
    let nextSlide = 0
    const activeNavigationStep = step ?? navigationStep

    let nextVirtualSlide = virtualSlide - activeNavigationStep

    if (!looping) {
      // Clamp within bounds for non-looping slider
      const maxSlide = getMaxSlide()
      nextSlide = Math.min(
        Math.max(currentSlide - activeNavigationStep, 0),
        maxSlide
      )
      nextVirtualSlide = nextSlide
    } else {
      // Ensure virtual index stays within the virtual track range
      if (nextVirtualSlide < 0) {
        nextVirtualSlide =
          (nextVirtualSlide % virtualTotalItems) + virtualTotalItems
      }
      nextVirtualSlide = Math.max(0, nextVirtualSlide)
      nextSlide = getRealIndexFromVirtual(nextVirtualSlide)
    }

    const nextTransformValue = transformMap[nextVirtualSlide] || 0

    if (groupDispatch) {
      groupDispatch({
        type: 'SLIDE',
        payload: {
          currentSlide: nextSlide,
          transform: nextTransformValue,
        },
      })
    }

    dispatch({
      type: 'SLIDE',
      payload: {
        transform: nextTransformValue,
        currentSlide: nextSlide,
        virtualSlide: nextVirtualSlide,
      },
    })
  }

  const goForward = (step?: number) => {
    let nextSlide = 0
    const activeNavigationStep = step ?? navigationStep

    let nextVirtualSlide = virtualSlide + activeNavigationStep

    if (!looping) {
      // Clamp within bounds for non-looping slider
      const maxSlide = getMaxSlide()
      nextSlide = Math.min(nextVirtualSlide, maxSlide)
      nextSlide = Math.max(0, nextSlide)
      nextVirtualSlide = nextSlide
    } else {
      if (nextVirtualSlide >= virtualTotalItems) {
        nextVirtualSlide = nextVirtualSlide % virtualTotalItems
      }
      nextSlide = getRealIndexFromVirtual(nextVirtualSlide)
    }

    const nextTransformValue = transformMap[nextVirtualSlide] || 0

    if (groupDispatch) {
      groupDispatch({
        type: 'SLIDE',
        payload: {
          currentSlide: nextSlide,
          transform: nextTransformValue,
        },
      })
    }

    dispatch({
      type: 'SLIDE',
      payload: {
        transform: nextTransformValue,
        currentSlide: nextSlide,
        virtualSlide: nextVirtualSlide,
      },
    })
  }

  return { goForward, goBack }
}
