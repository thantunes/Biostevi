import { useEffect } from 'react'

import { useSwiperInstance } from '../components/SliderContext'

export const useScreenResize = (_infinite: boolean, _itemsPerPage: number) => {
  const swiperRef = useSwiperInstance()

  useEffect(() => {
    let resizeTimeout: ReturnType<typeof setTimeout>

    const onResize = () => {
      // Debounce para evitar muitas atualizações
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        if (swiperRef.current) {
          swiperRef.current.update()
        }
      }, 150)
    }

    window.addEventListener('resize', onResize)

    return () => {
      clearTimeout(resizeTimeout)
      window.removeEventListener('resize', onResize)
    }
  }, [])
}
