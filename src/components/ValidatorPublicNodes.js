import _ from 'lodash'

export default function ValidatorPublicNodes(props) {
  const { public_nodes } = props.data || {}
  const types = _.compact(Object.entries(public_nodes || {}).map(([type, apis]) => {
    const api = apis[0]
    if(api){
      return <a key={[type, api.address].join('-')} href={api.address} target="_blank" className="text-reset text-decoration-underline">{type.toUpperCase()}</a>
    }
  }))
  return (
    types.length > 0 ? types.reduce((prev, curr) => [prev, ' | ', curr]) : null
  )
}