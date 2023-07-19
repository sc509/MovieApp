import "./movie-list.scss";
import { Component } from "react";
import ErrorIndicator from "../error-indication/error-indicator";
import MovieListItem from "../movie-list-item/movie-list-item";

export default class movieList extends Component {
    render() {
        const { movies, error, userRatings, onRateChange } = this.props;

        const errorMessage = error ? <ErrorIndicator /> : null;

        return (
            <div>
                {errorMessage}
                <div className="movie-list">
                    {movies.map((movie) => (
                        <MovieListItem
                            key={movie.id}
                            title={movie.title}
                            name={movie.name}
                            release_date={movie.release_date}
                            first_air_date={movie.first_air_date}
                            genre_ids={movie.genre_ids}
                            overview={movie.overview}
                            id={movie.id}
                            poster_path={movie.poster_path}
                            onRateChange={onRateChange}
                            userRatings={userRatings[movie.id]}
                            rating={movie.vote_average}
                        />
                    ))}
                </div>
            </div>
        );
    }
}