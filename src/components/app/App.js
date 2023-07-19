import React, { Component } from 'react';
import debounce from 'lodash/debounce';
import { Spin } from 'antd';

import MovieList from '../movie-list/movie-list';
import MovieSearch from '../movie-search/movie-search';
import Footer from '../footer/footer';
import MdbapiService from '../services/service-api';
import Tabs from '../tabs/tabs';
import { GenresProvider } from '../genres-context/genres-context';
import './app.scss';

export default class App extends Component {
  mdbapiService = new MdbapiService();
  /* eslint-disable react/no-unused-state */

  state = {
    movies: [],
    loading: true,
    error: false,
    isOnline: window.navigator.onLine,
    currentPage: 1,
    totalResults: 0,
    searchQuery: '',
    session: null,
    userRatings: {},
    ratedMovies: [],
    activeTab: 'search',
  };
  /* eslint-disable react/no-unused-state */

  componentDidMount() {
    const { currentPage } = this.state;
    this.handleSearch('', currentPage);
    window.addEventListener('online', this.updateOnlineStatus);
    window.addEventListener('offline', this.updateOnlineStatus);
    this.mdbapiService.getGuestSession().then((newSession) => {
      this.setState({ session: newSession });
    });

    const sessionUserRatings = sessionStorage.getItem('userRatings');
    if (sessionUserRatings) {
      this.setState({ userRatings: JSON.parse(sessionUserRatings) });
    }
    this.getRatedMovies();
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.updateOnlineStatus);
    window.removeEventListener('offline', this.updateOnlineStatus);
  }

  handleSearch = debounce(async (text, currentPage) => {
    try {
      this.setState({ loading: true, searchQuery: text });
      const response = await this.mdbapiService.getMoviesBySearch(text, currentPage);
      this.setState({ movies: response.results, totalResults: response.total_results, loading: false, error: false });
    } catch (error) {
      console.error('Ошибка при получении фильмов:', error);
      this.setState({ error: true, loading: false });
    }
  }, 800);

  getRatedMovies = async () => {
    const res = await this.mdbapiService.getRatedMovies();
    this.setState({ ratedMovies: res.results });
  };

  updateOnlineStatus = () => {
    this.setState({ isOnline: window.navigator.onLine });
  };

  handlePageChange = (page) => {
    const { searchQuery } = this.state;
    this.setState({ currentPage: page });
    this.handleSearch(searchQuery, page);
  };

  handleRateChange = (id, value) => {
    this.setState((prevState) => {
      const newUserRatings = { ...prevState.userRatings, [id]: value };
      sessionStorage.setItem('userRatings', JSON.stringify(newUserRatings));
      return { userRatings: newUserRatings };
    });
  };

  handleTabChange = (tab) => {
    this.setState({ activeTab: tab });
  };

  render() {
    const { isOnline, movies, loading, error, userRatings, ratedMovies, activeTab, currentPage, totalResults } =
      this.state;
    const displayedMovies =
      activeTab === 'search'
        ? movies
        : movies.filter((movie) => Object.prototype.hasOwnProperty.call(userRatings, movie.id));
    const spinElement = loading ? (
      <div className="spinner-container">
        <Spin size="large" />
      </div>
    ) : null;
    const noResultsMessage =
      !loading && !error && movies.length === 0 ? <div className="no-results-message">Ничего не найдено</div> : null;

    return (
      <div>
        {isOnline ? (
          <section className="movieapp">
            <header className="header">
              <Tabs activeTab={activeTab} onTabChange={this.handleTabChange} />
            </header>
            <section className="main">
              {activeTab === 'search' && <MovieSearch onSearch={this.handleSearch} />}
              {spinElement}
              {noResultsMessage}
              <GenresProvider>
                <MovieList
                  movies={displayedMovies}
                  loading={loading}
                  error={error}
                  onRateChange={this.handleRateChange}
                  userRatings={userRatings}
                  ratedMovies={ratedMovies}
                />
              </GenresProvider>
            </section>
            <Footer currentPage={currentPage} handlePageChange={this.handlePageChange} totalResults={totalResults} />
          </section>
        ) : (
          <div>
            <h1 className="error-message">Сайт доступен только обладателям интернета</h1>
          </div>
        )}
      </div>
    );
  }
}
