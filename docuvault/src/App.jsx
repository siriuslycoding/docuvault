import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Footer from './components/footer'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Domains from './pages/Domains'
// import Upload from './pages/Upload'

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/domains' element={<Domains />} />
        {/* <Route path='/upload' element={<Upload />} /> */}
      </Routes>
      <Footer />
    </>
  )
}

export default App
