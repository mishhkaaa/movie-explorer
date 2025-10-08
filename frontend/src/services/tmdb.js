import axios from 'axios';

const API_KEY=process.env.REACT_APP_TMDB_API_KEY;
const BASE='https://api.themoviedb.org/3';
const IMAGE_BASE='https://image.tmdb.org/t/p/w500';

export function getImageUrl(path){
    return path?`${IMAGE_BASE}${path}`:null;
}

export async function searchMovies(query, page=1){
    if(!query) return {results:[], total_results:0};
    const url=`${BASE}/search/movie`;
    const resp=await axios.get(url, {
        params: {
            api_key: API_KEY,
            query,
            page,
            include_adult: false
        }
    });
    return resp.data;
}