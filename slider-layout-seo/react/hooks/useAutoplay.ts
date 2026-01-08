import { useEffect } from 'react'

import { useSliderState, useSwiperInstance } from '../components/SliderContext'
import useHovering from './useHovering'

export const useAutoplay = (
  _infinite: boolean,
  containerRef: React.RefObject<HTMLDivElement>
) => {
  const { autoplay } = useSliderState()
  const { isHovering } = useHovering(containerRef)
  const swiperRef = useSwiperInstance()

  const shouldStop = autoplay?.stopOnHover && isHovering

  useEffect(() => {
    if (!autoplay || !swiperRef.current) {
      return
    }

    const swiper = swiperRef.current


    if (swiper.autoplay) {
      if (shouldStop) {
        swiper.autoplay.stop()
      } else {
        swiper.autoplay.start()
      }
    }
  }, [autoplay, shouldStop])
}
