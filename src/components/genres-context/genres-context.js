import React, { Component } from 'react';

const GenresContext = React.createContext();

export class GenresProvider extends Component {
  /* eslint-disable react/no-unused-state */ state = {
    genres: {},
  };
  /* eslint-enable react/no-unused-state */

  componentDidMount() {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNGViNzdmNTAwY2ZlMGM3YjNjOTZiOTc1NjliNjYyOSIsInN1YiI6IjY0YTY3OTFjY2FlNjMyMDBjODdkOWRhMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mn79LJYRe_MiBuwRyQQftEw3D-hnE1ELZQ_7MVX3BnQ',
      },
    };
    /* eslint-disable react/no-unused-state */
    fetch('https://api.themoviedb.org/3/genre/movie/list', options)
      .then((response) => response.json())
      .then((response) => {
        const genres = {};
        response.genres.forEach((genre) => {
          genres[genre.id] = genre.name;
        });
        this.setState({ genres });
      })
      .catch((err) => console.error(err));
  }
  /* eslint-disable react/no-unused-state */

  render() {
    const { children } = this.props;
    return <GenresContext.Provider value={this.state}>{children}</GenresContext.Provider>;
  }
}

export const GenresConsumer = GenresContext.Consumer;
