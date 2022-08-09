import { Link } from "react-router-dom";

export default function AppHeader(props) {
  const { active } = props
  return (
    <div className="intro-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
      <h1 className="display-4">Cosmos Validators ⚛</h1>
      <p className="lead">Highlighting validator performance and contributions across the Cosmos</p>
      <ul className="nav nav-pills justify-content-center">
        <li className="nav-item">
          <Link to="/" className={`nav-link ${active === 'validators' ? 'active' : ''}`}>Validators</Link>
        </li>
        <li className="nav-item">
          <Link to="/chains" className={`nav-link ${active === 'chains' ? 'active' : ''}`}>Chains</Link>
        </li>
      </ul>
    </div>
  )
}