import React, { Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import RegistryValidators from "./components/RegistryValidators";

import CosmosDirectory from "./CosmosDirectory";

import './scss/style.scss'

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
      directory.getValidators().then(validators => {
        setValidators(validators)
      })
    }
  }, [validators]);

  return (
    <div className="container">
      <div className="intro-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
        <h1 className="display-4">Cosmos Validators ⚛</h1>
        <p className="lead">Highlighting validator performance and contributions across the Cosmos</p>
      </div>
      <BrowserRouter>
        <Suspense fallback={loading}>
          <Routes>
            <Route path="*" element={<RegistryValidators validators={validators} />} />
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