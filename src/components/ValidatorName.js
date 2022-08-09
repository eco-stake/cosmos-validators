export default function ValidatorName(props) {
  const { image, moniker } = props.data || {}
  return (
    <span className="d-flex align-items-center gap-2">
      <img src={image} width={props.width || 20} height={props.height || 20} className="rounded-circle" /> {moniker}
    </span>
  )
}