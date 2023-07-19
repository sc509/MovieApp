import "./movie-list-item.scss"
import {Component} from "react";
import { format, parseISO } from 'date-fns';
import {Rate} from "antd";
import {GenresConsumer} from "../genres-context/genres-context";

export default class MovieListItem extends Component {
    truncateString(str, num) {
        if (str.length <= num) {
            return str;
        }
        let subString = str.substr(0, num);
        let lastSpaceIndex = subString.lastIndexOf(' ');

        if (lastSpaceIndex > 0) {
            return subString.substr(0, lastSpaceIndex) + '...';
        } else {
            return subString + '...';
        }
    }
    handleImageError = (event) => {
        event.target.onerror = null;
        event.target.src = 'https://skomarket.ru/upload/iblock/349/fzk93483k2g5hmxa3mho61h94vlpxklq.jpg';
    };

    handleRateChange = (value) => {
        const { id, onRateChange } = this.props;
        onRateChange(id, value);
    };


    render() {
        const { title, name, release_date, first_air_date, genre_ids, overview, id, poster_path, userRatings, rating  } = this.props;
        const validDate = release_date || first_air_date;
        const formattedDate = validDate
            ? format(parseISO(validDate), "MMMM d, y")
            : "Unknown";
        let ratingClass;
        if (rating > 7) {
            ratingClass = 'rating-high';
        }else if(rating >= 5){
            ratingClass = 'rating-medium';
        }
        else if (rating >= 3) {
            ratingClass = 'rating-low';
        } else {
            ratingClass = 'rating-very-low';
        }

        return (
            <GenresConsumer>
                {({genres}) => {
                    return (
                        <div className="movie-list__item" key={id}>
                            <div className='movie-list__item-image'>
                                <img src={`https://image.tmdb.org/t/p/w500${poster_path}`} alt="Постер фильма"
                                     onError={this.handleImageError}
                                />
                            </div>
                            <div className='movie-list__item-content'>
                                <h1 className='movie-list__item-title'>{title || name }</h1>
                                <div className={`movie-list__item-rate ${ratingClass}`}>{Math.round(rating)}</div>
                                <p className='movie-list__item-date'>{formattedDate}</p>
                                <div className="movie-list__item-genres">
                                    {genre_ids.map(id => (
                                        <button key={id} className="movie-list__item-button">
                                            {genres && genres[id] ? genres[id] : 'Unknown'}
                                        </button>
                                    ))}
                                </div>
                                <p className="movie-list__item-description">{this.truncateString(overview, 170)}</p>
                                <div className='movie-list__item-user-rate'>
                                    <Rate value={userRatings} onChange={this.handleRateChange} />
                                </div>
                            </div>
                        </div>
                    );
                }}
            </GenresConsumer>
        )
    }
}