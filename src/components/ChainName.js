export default function ChainName(params) {
  const { image, pretty_name } = params.data
  return (
    <span className="d-flex align-items-center gap-2">
      <img src={image} width={20} height={20} className="rounded-circle" /> {pretty_name}
    </span>
  )
}