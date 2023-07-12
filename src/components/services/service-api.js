export default class MdbapiService {
    apiKey = 'c4eb77f500cfe0c7b3c96b97569b6629';
    apiUrl = 'https://api.themoviedb.org/3';
    options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization:
                'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNGViNzdmNTAwY2ZlMGM3YjNjOTZiOTc1NjliNjYyOSIsInN1YiI6IjY0YTY3OTFjY2FlNjMyMDBjODdkOWRhMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mn79LJYRe_MiBuwRyQQftEw3D-hnE1ELZQ_7MVX3BnQ',
        },
    };

    async getResource(url) {
        const res = await fetch(url, this.options);
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, received ${res.status}`);
        }
        return await res.json();
    }

    async getTrendingMovies() {
        const url = `${this.apiUrl}/trending/all/day?language=en-US`;
        const res = await this.getResource(url);
        return res.results;
    }

    async getMoviesBySearch(query) {
        if (!query) {
            return this.getTrendingMovies();
        }
        const url = `${this.apiUrl}/search/movie?language=en-US&query=${encodeURIComponent(query)}`;
        const res = await this.getResource(url);
        return res.results;
    }
}