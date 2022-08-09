import React, { Suspense, useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'

import RegistryValidatorListing from "./components/RegistryValidatorListing";

import CosmosDirectory from "./CosmosDirectory";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './scss/style.scss'

import RegistryValidator from "./models/RegistryValidator";
import Chain from "./models/Chain";
import ChainListing from "./components/ChainListing";
import ChainShow from "./components/ChainShow";
import RegistryValidatorShow from "./components/RegistryValidatorShow";

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
    if(chains && !validators){
      directory.getValidators().then(data => {
        setValidators(data.validators.map(el => RegistryValidator(el, chains)).filter(el => el.validators.length > 0))
      })
    }
  }, [chains, validators]);

  useEffect(() => {
    if(!chains){
      directory.getChains().then(data => {
        setChains(data.chains.reduce((a, v) => ({ ...a, [v.path]: Chain(v) }), {}))
      })
    }
  }, [chains]);

  return (
    <div className="container">
      <BrowserRouter>
        <Suspense fallback={loading}>
          <Routes>
            <Route path="*" element={<RegistryValidatorListing validators={validators} chains={chains} />} />
            <Route path="/:registryValidator" element={<RegistryValidatorShow validators={validators} chains={chains} directory={directory} />} />
            <Route path="/:registryValidator/:chainValidator" element={<RegistryValidatorShow validators={validators} chains={chains} directory={directory} />} />
            <Route path="/chains" element={<ChainListing validators={validators} chains={chains} />} />
            <Route path="/chains/:chain" element={<ChainShow validators={validators} chains={chains} directory={directory} />} />
            <Route path="/chains/:chain/:chainValidator" element={<ChainShow validators={validators} chains={chains} directory={directory} />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App