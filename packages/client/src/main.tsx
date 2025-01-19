// import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";

import HomePage from './pages/Home/index.tsx';
import HotelPage from './pages/Hotel/index.tsx';
import CityPage from './pages/City/index.tsx';
import CountryPage from './pages/Country/index.tsx';

import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/hotels/:id" element={<HotelPage />} />
        <Route path="/cities/:id" element={<CityPage />} />
        <Route path="/countries/:id" element={<CountryPage />} />
      </Routes>
    </BrowserRouter>
  // </React.StrictMode>
)
