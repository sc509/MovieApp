import React, { Component } from 'react';
import debounce from 'lodash/debounce';
import { Spin } from 'antd';

import MovieList from '../movie-list/movie-list';
import MovieSearch from '../movie-search/movie-search';
import Footer from '../footer/footer';
import MdbapiService from '../../services/service-api';
import Tabs from '../tabs/tabs';
import { GenresProvider } from '../genres-context/genres-context';
import './app.scss';

export default class App extends Component {
  mdbapiService = new MdbapiService();

  state = {
    movies: [],
    loading: true,
    error: false,
    isOnline: window.navigator.onLine,
    currentPage: 1,
    currentPageRated: 1,
    totalResults: 0,
    searchQuery: '',
    session: null,
    userRatings: {},
    ratedMovies: [],
    activeTab: 'search',
    arrayRating: [],
  };

  componentDidMount() {
    const { currentPage } = this.state;
    this.handleSearch('', currentPage);
    window.addEventListener('online', this.updateOnlineStatus);
    window.addEventListener('offline', this.updateOnlineStatus);

    this.mdbapiService.createGuestSession().then((newSession) => {
      this.setState(
        {
          session: newSession,
        },
        () => {
          this.getRatedMovies();
          this.getRatingMovies();
        }
      );
    });
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.updateOnlineStatus);
    window.removeEventListener('offline', this.updateOnlineStatus);
  }

  handleSearch = debounce(async (text) => {
    try {
      this.setState({ loading: true, searchQuery: text, currentPage: 1 });
      const response = await this.mdbapiService.getMoviesBySearch(text, 1);
      this.setState({ movies: response.results, totalResults: response.total_results, loading: false, error: false });
    } catch (error) {
      this.setState({ error: true, loading: false });
    }
  }, 800);

  getRatingMovies = async () => {
    const { session } = this.state;

    try {
      const rest = await this.mdbapiService.getRateMovies(session);
      console.log('Data from API:', rest);
      if (rest && rest.results) {
        this.setState({
          arrayRating: rest.results,
          userRatings: rest.results.reduce((accumulator, movie) => ({ ...accumulator, [movie.id]: movie.rating }), {}),
        });
      } else {
        console.error('Не получили данные от API');
      }
    } catch (error) {
      console.error('Ошибка при выполнении запроса: ', error);
    }
  };

  getRatedMovies = async () => {
    const res = await this.mdbapiService.getRatedMovies();
    this.setState({ ratedMovies: res.results });
  };

  updateOnlineStatus = () => {
    this.setState({ isOnline: window.navigator.onLine });
  };

  handlePageChange = async (page) => {
    const { searchQuery } = this.state;
    this.setState({ currentPage: page });
    try {
      this.setState({ loading: true });
      const response = await this.mdbapiService.getMoviesBySearch(searchQuery, page);
      this.setState({ movies: response.results, loading: false, error: false });
    } catch (error) {
      this.setState({ error: true, loading: false });
    }
  };

  handleRateChange = (id, value) => {
    this.setState(
      (prevState) => {
        const newUserRatings = { ...prevState.userRatings, [id]: value };

        let newArrayRating;
        if (value) {
          const ratedMovie = prevState.movies.find((movie) => movie.id === id);
          newArrayRating = [...prevState.arrayRating, ratedMovie];
        } else {
          newArrayRating = prevState.arrayRating.filter((movie) => movie.id !== id);
        }

        return { userRatings: newUserRatings, arrayRating: newArrayRating };
      },
      async () => {
        const { session } = this.state;
        if (value) {
          const answerServer = await this.mdbapiService.rateMovie(id, value, session);
          console.log(answerServer);
          await this.getRatingMovies();
        } else {
          await this.mdbapiService.deleteRating(id, session);
          await this.getRatingMovies();
        }
      }
    );
  };

  handlePageChangeRated = (page) => {
    this.setState({ currentPageRated: page });
  };

  handleTabChange = async (tab) => {
    if (tab === 'search') {
      const { searchQuery } = this.state;
      this.setState({ activeTab: tab, currentPage: 1, movies: [] });
      try {
        this.setState({ loading: true });
        const response = await this.mdbapiService.getMoviesBySearch(searchQuery, 1);
        this.setState({ movies: response.results, loading: false, error: false });
      } catch (error) {
        this.setState({ error: true, loading: false });
      }
    } else if (tab === 'rated') {
      this.setState({ activeTab: tab, currentPageRated: 1 });
    }
  };

  render() {
    const {
      isOnline,
      movies,
      loading,
      error,
      userRatings,
      ratedMovies,
      activeTab,
      currentPage,
      currentPageRated,
      totalResults,
      arrayRating,
      session,
    } = this.state;
    const startIndex = (activeTab === 'rated' ? currentPageRated - 1 : currentPage - 1) * 20;
    const endIndex = startIndex + 20;
    const displayedMovies = activeTab === 'search' ? movies : arrayRating.slice(startIndex, endIndex);
    const spinElement = loading ? (
      <div className="spinner-container">
        <Spin size="large" />
      </div>
    ) : null;
    const noResultsMessage =
      !loading && !error && movies.length === 0 ? <div className="no-results-message">Ничего не найдено</div> : null;
    console.log(session);
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
            <Footer
              currentPage={activeTab === 'search' ? currentPage : currentPageRated}
              handlePageChange={activeTab === 'search' ? this.handlePageChange : this.handlePageChangeRated}
              totalResults={activeTab === 'search' ? totalResults : arrayRating.length}
            />
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
