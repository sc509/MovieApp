import PropTypes from 'prop-types';

import ErrorIndicator from '../error-indication/error-indicator';
import MovieListItem from '../movie-list-item/movie-list-item';

import './movie-list.scss';

function MovieList({ movies, error, userRatings, onRateChange }) {
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

MovieList.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
    })
  ),
  error: PropTypes.bool,
  userRatings: PropTypes.objectOf(PropTypes.number),
  onRateChange: PropTypes.func,
};

MovieList.defaultProps = {
  movies: [],
  error: false,
  userRatings: {},
  onRateChange: () => {},
};

export default MovieList;
