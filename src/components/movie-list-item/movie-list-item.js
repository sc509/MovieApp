import "./movie-list-item.scss"
import {Component} from "react";
import { format, parseISO } from 'date-fns';

export default class movieListItem extends Component {
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
    render() {
        const { title, name, release_date, first_air_date, genre_ids, overview, id, poster_path } = this.props;
        const validDate = release_date || first_air_date;
        const formattedDate = validDate
            ? format(parseISO(validDate), "MMMM d, y")
            : "Unknown";

        return (
            <div className="movie-list__item" key={id}>
                <div className='movie-list__item-image'>
                    <img src={`https://image.tmdb.org/t/p/w500${poster_path}`} alt="Постер фильма"
                    onError={this.handleImageError}
                    />
                </div>
                <div className='movie-list__item-content'>
                    <h1 className='movie-list__item-title'>{title || name }</h1>
                    <p className='movie-list__item-date'>{formattedDate}</p>
                    <div className="movie-list__item-genres">
                        <button className="movie-list__item-button">{genre_ids}</button>
                        <button className="movie-list__item-button">32</button>
                    </div>
                    <p className="movie-list__item-description">{this.truncateString(overview, 200)}</p>
                </div>
            </div>

        )
    }
}
