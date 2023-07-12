import React, { Component } from 'react';
import MovieList from '../movie-list/movie-list';
import './app.css';
import MovieSearch from '../movie-search/movie-search';
import Footer from "../footer/footer";
import MdbapiService from "../services/service-api";
import debounce from 'lodash/debounce';
import { Spin } from "antd";

export default class App extends Component {
    mdbapiService = new MdbapiService();

    state = {
        movies: [],
        loading: true,
        error: false,
        isOnline: window.navigator.onLine,
        currentPage: 1,
        totalResults: 0,
        searchQuery: ''
    };

    componentDidMount() {
        this.handleSearch('', this.state.currentPage);
        window.addEventListener('online', this.updateOnlineStatus);
        window.addEventListener('offline', this.updateOnlineStatus);
    }

    componentWillUnmount() {
        window.removeEventListener('online', this.updateOnlineStatus);
        window.removeEventListener('offline', this.updateOnlineStatus);
    }

    updateOnlineStatus = () => {
        this.setState({ isOnline: window.navigator.onLine });
    };

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

    javascript

    handlePageChange = (page) => {
        this.setState({ currentPage: page });
        this.handleSearch(this.state.searchQuery, page);
    };
    render() {
        const { isOnline, movies, loading, error } = this.state;
        const spinElement = loading ? (
            <div className="spinner-container">
                <Spin size={"large"} />
            </div>
        ) : null;
        const noResultsMessage =
            !loading && !error && movies.length === 0 ? (
                <div className="no-results-message">Ничего не найдено</div>
            ) : null;
        return (
            <div>
                {isOnline ? (
                    <section className="movieapp">
                        <section className="main">
                            <MovieSearch onSearch={this.handleSearch} />
                            {spinElement}
                            {noResultsMessage}
                            <MovieList movies={movies} loading={loading} error={error} />
                        </section>
                        <Footer currentPage={this.state.currentPage} handlePageChange={this.handlePageChange} totalResults={this.state.totalResults} />
                    </section>
                ) : (
                    <div>
                        <h1 className="error-message">
                            Сайт доступен только обладателям интернета
                        </h1>
                    </div>
                )}
            </div>
        );
    }
}