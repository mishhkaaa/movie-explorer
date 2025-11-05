import axios from 'axios';

const API=axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
});

//attach the token to each request
API.interceptors.request.use(
    config=>{
        const token=localStorage.getItem('token');
        if(token) config.headers.Authorization=`Bearer ${token}`;
        return config;
    },
    err=> Promise.reject(err)
);

API.interceptors.response.use(
    res=> res,
    err=>{
        if(err.response && err.response.status===401){
            localStorage.removeItem('token');
            //redirect to login
            window.location.href='/login';
        }
        return Promise.reject(err);
    }
);

export default API;