export default function GridHeader(props) {
  const { onFilterTextBoxChanged, breadcrumbs } = props
  return (
    <div className="d-flex justify-content-around align-items-center mb-3">
      {breadcrumbs?.length && (
        <nav className="me-auto" aria-label="breadcrumb">
          <ol className="breadcrumb m-0">
            {breadcrumbs}
          </ol>
        </nav>
      )}
      <div className="ms-auto">
        <input
          type="text"
          className="form-control"
          id="filter-text-box"
          placeholder="Filter..."
          onInput={onFilterTextBoxChanged}
        />
      </div>
    </div>
  )
}