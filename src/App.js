import React from 'react';

import {
  BrowserRouter, Route, Routes
} from "react-router-dom";

import SearchPage from './pages/search/SearchPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/countryCode=AU" element={<SearchPage />} />
        <Route path="/countryCode=CA" element={<SearchPage />} />
        <Route path="/countryCode=NZ" element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
