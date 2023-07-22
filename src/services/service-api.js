export default class MdbapiService {
  apiKey = 'c4eb77f500cfe0c7b3c96b97569b6629';

  apiUrl = new URL('https://api.themoviedb.org/3');

  options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNGViNzdmNTAwY2ZlMGM3YjNjOTZiOTc1NjliNjYyOSIsInN1YiI6IjY0YTY3OTFjY2FlNjMyMDBjODdkOWRhMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mn79LJYRe_MiBuwRyQQftEw3D-hnE1ELZQ_7MVX3BnQ',
    },
  };

  async createGuestSession() {
    const existingSessionId = localStorage.getItem('sessionId');
    if (existingSessionId) {
      return existingSessionId;
    }

    const url = new URL(`${this.apiUrl}/authentication/guest_session/new`);
    url.search = new URLSearchParams({
      api_key: this.apiKey,
    }).toString();

    try {
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Could not create guest session: ${response.status}`);
      }

      const data = await response.json();
      const sessionId = data.guest_session_id;
      localStorage.setItem('sessionId', sessionId);
      return sessionId;
    } catch (error) {
      throw new Error(`Error creating guest session: ${error.message}`);
    }
  }

  async getResource(url) {
    try {
      const res = await fetch(url, this.options);
      if (!res.ok) {
        throw new Error(`Could not fetch ${url}, received ${res.status}`);
      }
      return await res.json();
    } catch (error) {
      throw new Error(`Error fetching ${url}: ${error.message}`);
    }
  }

  async getTrendingMovies(page = 1) {
    const url = new URL(`${this.apiUrl}/trending/all/day`);
    url.search = new URLSearchParams({
      language: 'en-US',
      page,
    }).toString();

    try {
      const result = await this.getResource(url.toString());
      return result;
    } catch (error) {
      throw new Error(`Error getting trending movies: ${error.message}`);
    }
  }

  async getRatedMovies() {
    const url = new URL(`${this.apiUrl}/guest_session/2002/rated/movies`);
    try {
      const res = await this.getResource(url.toString());
      return res;
    } catch (error) {
      throw new Error(`Error getting rated movies: ${error.message}`);
    }
  }

  async getGenres() {
    const url = new URL(`${this.apiUrl}/genre/movie/list`);
    url.search = new URLSearchParams({
      api_key: this.apiKey,
    }).toString();

    try {
      const result = await this.getResource(url.toString());
      return result.genres;
    } catch (error) {
      throw new Error(`Error getting genres: ${error.message}`);
    }
  }

  async getMoviesBySearch(query, page = 1) {
    if (!query) {
      return this.getTrendingMovies(page);
    }
    const url = new URL(`${this.apiUrl}/search/movie`);
    url.search = new URLSearchParams({
      language: 'en-US',
      query,
      page,
    }).toString();

    try {
      const res = await this.getResource(url.toString());
      return res;
    } catch (error) {
      throw new Error(`Error searching movies: ${error.message}`);
    }
  }

  async rateMovie(movieId, rating, sessionId) {
    const url = new URL(`${this.apiUrl}/movie/${movieId}/rating`);
    url.search = new URLSearchParams({
      guest_session_id: sessionId,
    }).toString();

    try {
      const res = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          ...this.options.headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: rating }),
      });
      if (!res.ok) {
        throw new Error(`Could not post rating for movie ${movieId}, received ${res.status}`);
      }
      return await res.json();
    } catch (error) {
      throw new Error(`Error posting rating for movie ${movieId}: ${error.message}`);
    }
  }

  async deleteRating(movieId, sessionId) {
    const url = new URL(`${this.apiUrl}/movie/${movieId}/rating`);
    url.search = new URLSearchParams({
      guest_session_id: sessionId,
    }).toString();

    try {
      const res = await fetch(url.toString(), {
        method: 'DELETE',
        headers: this.options.headers,
      });
      if (!res.ok) {
        throw new Error(`Could not delete rating for movie ${movieId}, received ${res.status}`);
      }
      return await res.json();
    } catch (error) {
      throw new Error(`Error deleting rating for movie ${movieId}: ${error.message}`);
    }
  }
}
