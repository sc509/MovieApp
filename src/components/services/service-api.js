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

    async getGuestSession() {
        const url = `${this.apiUrl}/authentication/guest_session/new`;
        const res = await this.getResource(url);
        return res;
    }


    async getTrendingMovies(page = 1) {
        const url = `${this.apiUrl}/trending/all/day?language=en-US&page=${page}`;
        const result = await this.getResource(url);
        return result;
    }

    async getRatedMovies() {
        const url = `${this.apiUrl}/guest_session/2002/rated/movies`;
        try {
            const res = await this.getResource(url);
            return res;
        } catch (error) {
            console.error('Error getting rated movies:', error);
            return [];
        }
    }

    async getMoviesBySearch(query, page = 1) {
        if (!query) {
            return this.getTrendingMovies(page);
        }
        const url = `${this.apiUrl}/search/movie?language=en-US&query=${encodeURIComponent(query)}&page=${page}`;
        const res = await this.getResource(url);
        return res;
    }
}