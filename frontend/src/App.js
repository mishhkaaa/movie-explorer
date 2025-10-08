import React from 'react';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import Favourites from './pages/Favourites';
import Login from './pages/Login';
import Register from './pages/Register';

function App(){
    return(
        <Router>
            <header style={{padding: 12, borderBottom: '1px solid #ccc'}}>
                <nav style={{display: 'flex', gap:12}}>
                    <Link to="/">Home</Link>
                    <Link to="/search">Search</Link>
                    <Link to="/favourites">Favourites</Link>
                    <Link to="/login">Login</Link>
                </nav>
            </header>
            <main style={{padding: 16}}>
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/search" element={<Search/>} />
                    <Route path="/favourites" element={<Favourites/>} />
                    <Route path="/login" element={<Login/>} />
                    <Route path="/register" element={<Register/>} />
                </Routes>
            </main>
        </Router>
    )
}

export default App;