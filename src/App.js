import React, { Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import RegistryValidatorListing from "./components/RegistryValidatorListing";

import CosmosDirectory from "./CosmosDirectory";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './scss/style.scss'

import RegistryValidator from "./models/RegistryValidator";
import Chain from "./models/Chain";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

function App() {
  const [validators, setValidators] = useState()
  const [chains, setChains] = useState()

  const directory = CosmosDirectory()

  useEffect(() => {
    if(!validators){
      directory.getValidators().then(data => {
        setValidators(data.validators.map(el => RegistryValidator(el)))
      })
    }
  }, [validators]);

  useEffect(() => {
    if(!chains){
      directory.getChains().then(data => {
        setChains(data.chains.reduce((a, v) => ({ ...a, [v.path]: Chain(v) }), {}))
      })
    }
  }, [chains]);

  return (
    <div className="container">
      <div className="intro-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
        <h1 className="display-4">Cosmos Validators ⚛</h1>
        <p className="lead">Highlighting validator performance and contributions across the Cosmos</p>
        <ul className="nav nav-pills justify-content-center">
          <li className="nav-item">
            <a className="nav-link active" aria-current="page" href="#">Validators</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Chains</a>
          </li>
        </ul>
      </div>
      <BrowserRouter>
        <Suspense fallback={loading}>
          <Routes>
            <Route path="*" element={<RegistryValidatorListing validators={validators} chains={chains} />} />
            {/* <Route path="/:validator" element={<RegistryValidator />} />
            <Route path="/chains" element={<Chains />} />
            <Route path="/chains/:chain" element={<Chain />} /> */}
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App