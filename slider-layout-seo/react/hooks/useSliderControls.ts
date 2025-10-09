import { useSliderDispatch, useSliderState } from '../components/SliderContext'
import { useSliderGroupDispatch } from '../SliderLayoutGroup'

export const useSliderControls = (infinite: boolean) => {
  const {
    currentSlide,
    slidesPerPage,
    totalItems,
    navigationStep,
    transformMap,
  } = useSliderState()

  const dispatch = useSliderDispatch()
  const groupDispatch = useSliderGroupDispatch()

  const goBack = (step?: number) => {
    let nextSlide = 0
    let nextTransformValue = 0
    const activeNavigationStep = step ?? navigationStep

    // Lógica mais simples: slide anterior é currentSlide - step
    nextSlide = currentSlide - activeNavigationStep

    // Verificar limites
    if (!infinite) {
      // Para não infinito, não pode ser menor que 0
      if (nextSlide < 0) {
        nextSlide = 0
      }
      // O último slide válido é quando ainda mostra pelo menos 1 item completo
      const maxSlide = Math.max(0, totalItems - Math.floor(slidesPerPage))
      if (nextSlide > maxSlide) {
        nextSlide = maxSlide
      }
    }

    nextTransformValue = transformMap[nextSlide] || 0

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
      },
    })
  }

  const goForward = (step?: number) => {
    let nextSlide = 0
    let nextTransformValue = 0
    const activeNavigationStep = step ?? navigationStep

    // Lógica mais simples: próximo slide é currentSlide + step
    nextSlide = currentSlide + activeNavigationStep

    // Verificar limites - NUNCA pode passar do que é visível
    if (!infinite) {
      // O último slide visível é quando ainda mostra pelo menos 1 item completo
      const maxSlide = Math.max(0, totalItems - Math.floor(slidesPerPage))
      if (nextSlide > maxSlide) {
        nextSlide = maxSlide
      }
      if (nextSlide < 0) {
        nextSlide = 0
      }
    }

    nextTransformValue = transformMap[nextSlide] || 0

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
      },
    })
  }

  return { goForward, goBack }
}
