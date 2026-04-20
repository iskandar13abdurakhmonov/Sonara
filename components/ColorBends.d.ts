declare module "@/components/ColorBends" {
  import type { CSSProperties } from "react"

  type ColorBendsProps = {
    className?: string
    style?: CSSProperties
    rotation?: number
    speed?: number
    colors?: string[]
    transparent?: boolean
    autoRotate?: number
    scale?: number
    frequency?: number
    warpStrength?: number
    mouseInfluence?: number
    parallax?: number
    noise?: number
    iterations?: number
    intensity?: number
    bandWidth?: number
    color?: string
  }

  export default function ColorBends(props: ColorBendsProps): JSX.Element
}
