// import { useState } from 'react';
import { Route, Routes} from 'react-router-dom';
import Home from './pages/Home.jsx';
import User from './pages/User.jsx';
import Bidder from './pages/Bidder.jsx';
import Contact from './pages/Contact.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';

function App() {
  return (
    <div className="App">
      <>
        <Header className=''/>
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/ips' element={<User />} />
            <Route path='/bidders' element={<Bidder />} />
            <Route path='/contact' element={<Contact />} />
        </Routes>
        <Footer/>
      </>
    </div>
  )
}

export default App
