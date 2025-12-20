import { useSliderState, useSwiperInstance } from '../components/SliderContext'
import { useSliderGroupDispatch } from '../SliderLayoutGroup'

export const useSliderControls = (infinite: boolean) => {
  const {
    currentSlide,
    slidesPerPage,
    totalItems,
    navigationStep,
    loopCloneCount,
  } = useSliderState()

  const swiperRef = useSwiperInstance()
  const groupDispatch = useSliderGroupDispatch()

  if (totalItems === 0) {
    const noop = () => {}

    return {
      goForward: noop,
      goBack: noop,
    }
  }

  const looping = infinite && loopCloneCount > 0

  const getMaxSlide = () => {
    return Math.max(0, Math.ceil(totalItems - slidesPerPage))
  }

  const goBack = (step?: number) => {
    if (!swiperRef.current) return

    const swiper = swiperRef.current
    const activeNavigationStep = step ?? navigationStep

    if (!looping) {
      const currentRealIndex = swiper.realIndex ?? currentSlide
      const nextSlide = Math.max(0, currentRealIndex - activeNavigationStep)
      swiper.slideTo(nextSlide)

      if (groupDispatch) {
        groupDispatch({
          type: 'SLIDE',
          payload: {
            currentSlide: nextSlide,
            transform: 0,
          },
        })
      }
    } else {
      swiper.slidePrev()
    }
  }

  const goForward = (step?: number) => {
    if (!swiperRef.current) return

    const swiper = swiperRef.current
    const activeNavigationStep = step ?? navigationStep

    if (!looping) {
      const maxSlide = getMaxSlide()
      const currentRealIndex = swiper.realIndex ?? currentSlide
      const nextSlide = Math.min(maxSlide, currentRealIndex + activeNavigationStep)
      swiper.slideTo(nextSlide)

      if (groupDispatch) {
        groupDispatch({
          type: 'SLIDE',
          payload: {
            currentSlide: nextSlide,
            transform: 0,
          },
        })
      }
    } else {
      swiper.slideNext()
    }
  }

  return { goForward, goBack }
}
