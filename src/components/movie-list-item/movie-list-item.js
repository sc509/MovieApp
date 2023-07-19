import { Component } from 'react';
import { format, parseISO } from 'date-fns';
import { Rate } from 'antd';
import PropTypes from 'prop-types';

import { GenresConsumer } from '../genres-context/genres-context';

import './movie-list-item.scss';

function truncateString(str, num) {
  if (str.length <= num) {
    return str;
  }
  const subString = str.substr(0, num);
  const lastSpaceIndex = subString.lastIndexOf(' ');

  if (lastSpaceIndex > 0) {
    return `${subString.substr(0, lastSpaceIndex)}...`;
  }
  return `${subString}...`;
}

/* eslint-disable class-methods-use-this */
export default class MovieListItem extends Component {
  handleImageError = (event) => {
    // eslint-disable-next-line no-param-reassign
    event.target.onerror = null;
    // eslint-disable-next-line no-param-reassign
    event.target.src = 'https://skomarket.ru/upload/iblock/349/fzk93483k2g5hmxa3mho61h94vlpxklq.jpg';
  };
  /* eslint-enable class-methods-use-this */

  /* eslint-disable class-methods-use-this */
  handleRateChange = (value) => {
    const { id, onRateChange } = this.props;
    onRateChange(id, value);
  };
  /* eslint-enable class-methods-use-this */

  render() {
    const {
      title,
      name,
      release_date: releaseDate,
      first_air_date: firstAirDate,
      genre_ids: genreIds,
      overview,
      id,
      poster_path: posterPath,
      userRatings,
      rating,
    } = this.props;

    const validDate = releaseDate || firstAirDate;
    const formattedDate = validDate ? format(parseISO(validDate), 'MMMM d, y') : 'Unknown';
    let ratingClass;
    if (rating > 7) {
      ratingClass = 'rating-high';
    } else if (rating >= 5) {
      ratingClass = 'rating-medium';
    } else if (rating >= 3) {
      ratingClass = 'rating-low';
    } else {
      ratingClass = 'rating-very-low';
    }

    return (
      <GenresConsumer>
        {({ genres }) => (
          <div className="movie-list__item" key={id}>
            <div className="movie-list__item-image">
              <img
                src={`https://image.tmdb.org/t/p/w500${posterPath}`}
                alt="Постер фильма"
                onError={this.handleImageError}
              />
            </div>
            <div className="movie-list__item-content">
              <h1 className="movie-list__item-title">{title || name}</h1>
              <div className={`movie-list__item-rate ${ratingClass}`}>{Math.round(rating)}</div>
              <p className="movie-list__item-date">{formattedDate}</p>
              <div className="movie-list__item-genres">
                {genreIds.map((genreId) => (
                  <button type="button" key={genreId} className="movie-list__item-button">
                    {genres && genres[genreId] ? genres[genreId] : 'Unknown'}
                  </button>
                ))}
              </div>
              <p className="movie-list__item-description">{truncateString(overview, 170)}</p>
              <div className="movie-list__item-user-rate">
                <Rate value={userRatings} onChange={this.handleRateChange} />
              </div>
            </div>
          </div>
        )}
      </GenresConsumer>
    );
  }
}

MovieListItem.propTypes = {
  title: PropTypes.string,
  name: PropTypes.string,
  release_date: PropTypes.string,
  first_air_date: PropTypes.string,
  genre_ids: PropTypes.arrayOf(PropTypes.number),
  overview: PropTypes.string,
  id: PropTypes.number.isRequired,
  poster_path: PropTypes.string,
  userRatings: PropTypes.number,
  rating: PropTypes.number,
  onRateChange: PropTypes.func.isRequired,
};

MovieListItem.defaultProps = {
  title: 'Unknown',
  name: 'Unknown',
  release_date: null,
  first_air_date: null,
  genre_ids: [],
  overview: '',
  poster_path: null,
  userRatings: 0,
  rating: 0,
};
