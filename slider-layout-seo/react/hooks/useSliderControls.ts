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
    isLoopingAdjustment,
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

  const getMaxSlide = () => {
    // Para valores decimais, calcular maxSlide de forma mais precisa
    // O último slide deve permitir que o último item seja visível
    return Math.max(0, Math.ceil(totalItems - slidesPerPage))
  }

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

  const resolveLoopingPosition = () => {
    if (!looping) {
      return {
        baseVirtualSlide: virtualSlide,
        baseCurrentSlide: currentSlide,
      }
    }

    const firstRealIndex = loopCloneCount
    const lastRealIndex = loopCloneCount + totalItems - 1

    return {
      baseVirtualSlide: virtualSlide,
      baseCurrentSlide:
        virtualSlide >= firstRealIndex && virtualSlide <= lastRealIndex
          ? currentSlide
          : getRealIndexFromVirtual(virtualSlide),
    }
  }

  const goBack = (step?: number) => {
    if (isLoopingAdjustment) {
      return
    }

    const { baseVirtualSlide, baseCurrentSlide } = resolveLoopingPosition()
    const activeNavigationStep = step ?? navigationStep

    let nextVirtualSlide = baseVirtualSlide - activeNavigationStep
    let nextSlide = baseCurrentSlide - activeNavigationStep

    if (!looping) {
      const maxSlide = getMaxSlide()
      nextSlide = Math.min(Math.max(nextSlide, 0), maxSlide)
      nextVirtualSlide = nextSlide
    } else {
      const minVirtualIndex = 0
      const maxVirtualIndex = virtualTotalItems - 1

      nextVirtualSlide = Math.max(
        minVirtualIndex,
        Math.min(nextVirtualSlide, maxVirtualIndex)
      )
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
    if (isLoopingAdjustment) {
      return
    }

    const { baseVirtualSlide, baseCurrentSlide } = resolveLoopingPosition()
    const activeNavigationStep = step ?? navigationStep

    let nextVirtualSlide = baseVirtualSlide + activeNavigationStep
    let nextSlide = baseCurrentSlide + activeNavigationStep

    if (!looping) {
      const maxSlide = getMaxSlide()
      nextSlide = Math.min(Math.max(nextSlide, 0), maxSlide)
      nextVirtualSlide = nextSlide
    } else {
      const minVirtualIndex = 0
      const maxVirtualIndex = virtualTotalItems - 1

      nextVirtualSlide = Math.max(
        minVirtualIndex,
        Math.min(nextVirtualSlide, maxVirtualIndex)
      )
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
