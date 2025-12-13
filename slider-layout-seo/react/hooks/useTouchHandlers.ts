import {
  SliderLayoutProps,
} from '../components/SliderContext'

/**
 * Swiper gerencia touch nativamente, então este hook agora retorna handlers vazios
 * Mantido para compatibilidade com código existente
 */
export const useTouchHandlers = (_props: {
  infinite: boolean
  centerMode: SliderLayoutProps['centerMode']
}) => {
  // Swiper gerencia touch events automaticamente
  // Retornar handlers vazios para compatibilidade
  const onTouchStart = () => {
    // No-op: Swiper gerencia
  }

  const onTouchMove = () => {
    // No-op: Swiper gerencia
  }

  const onTouchEnd = () => {
    // No-op: Swiper gerencia
  }

  return { onTouchEnd, onTouchStart, onTouchMove }
}
