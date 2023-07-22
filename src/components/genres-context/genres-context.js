import React, { Component } from 'react';

import MdbapiService from '../../services/service-api';

const GenresContext = React.createContext();

export class GenresProvider extends Component {
  mdbapiService = new MdbapiService();

  state = {
    genres: {},
    error: null,
    value: null,
  };

  componentDidMount() {
    this.fetchGenres();
  }

  componentDidUpdate(prevProps, prevState) {
    const { genres, error } = this.state;

    if (genres !== prevState.genres || error !== prevState.error) {
      this.setState({
        value: {
          genres,
          error,
        },
      });
    }
  }

  fetchGenres = () => {
    this.mdbapiService
      .getGenres()
      .then((genres) => {
        const genresMap = {};
        genres.forEach((genre) => {
          genresMap[genre.id] = genre.name;
        });
        this.setState({
          genres: genresMap,
          error: null,
        });
      })
      .catch((error) => {
        this.setState({ error: error.message });
      });
  };

  render() {
    const { children } = this.props;
    const { error, value } = this.state;
    return (
      <GenresContext.Provider value={value}>
        {children}
        {error && <div>{`Ошибка: ${error}`}</div>}
      </GenresContext.Provider>
    );
  }
}

export const GenresConsumer = GenresContext.Consumer;
