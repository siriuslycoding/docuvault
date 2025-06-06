import Footer from './components/footer'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Domains from './pages/Domains'
import Upload from './pages/Upload'
import Login from './pages/Login'
import Library from './pages/Library'
import Search from './components/Search'
import DocumentDetails from './pages/DocumentDetails'

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/domains' element={<Domains />} />
        <Route path='/upload' element={<Upload />} />
        <Route path='/login' element={<Login />} />
        <Route path='/library' element={<Library />} />
        <Route path='/search' element={<Search />} />
        <Route path='/document/:id' element={<DocumentDetails />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
