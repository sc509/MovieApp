export default class MdbapiService {
    url = 'https://api.themoviedb.org/3/trending/all/day?language=en-US';
    options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNGViNzdmNTAwY2ZlMGM3YjNjOTZiOTc1NjliNjYyOSIsInN1YiI6IjY0YTY3OTFjY2FlNjMyMDBjODdkOWRhMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mn79LJYRe_MiBuwRyQQftEw3D-hnE1ELZQ_7MVX3BnQ'
        }
    };

    async getResource() {
        const res = await fetch(this.url, this.options);
        if (!res.ok) {
            throw new Error(`Could not fetch ${this.url}, received ${res.status}`);
        }
        return await res.json();
    }

    async getResults() {
        const res = await this.getResource();
        return res.results;
    }
}


