import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=> {
        const init=async()=>{
            const token=localStorage.getItem('token');
            if(!token){
                setLoading(false);
                return;
            }
            try{
                const res=await API.get('/profile');
                setUser(res.data.user);
            } catch(err){
                console.error('Auth init error', err);
                localStorage.removeItem('token');
                setUser(null);
            } finally{
                setLoading(false);
            }
        };
        init();
    }, []);

    const register= async({username, email, password}) => {
        const res=await API.post('/auth/register', {username, email, password});
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return res;
    };

    const login= async({email, password}) => {
        const res=await API.post('/auth/login', {email, password});
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return res;
    };

    const logout=()=>{
        localStorage.removeItem('token');
        setUser(null);
        window.location.href='/login';
    }

    return (
        <AuthContext.Provider value={{ user, setUser, loading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};