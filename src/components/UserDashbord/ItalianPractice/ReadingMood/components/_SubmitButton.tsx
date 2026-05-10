import type { JSX } from "react"

interface Props {
  type: string ;
}
export default function SubmitButton(props: Props): JSX.Element {
    const { type } =  props
    console.log(type)
  return (
    <div>SubmitButton</div>
  )
}