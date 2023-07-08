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
    render() {
        const { title, name, release_date, first_air_date, genre_ids, overview, id, poster_path, } = this.props;
        return (
            <div className="movie-list__item" key={id}>
                <div className='movie-list__item-image'>
                    <img src={`https://image.tmdb.org/t/p/w500${poster_path}`} alt="Постер фильма"/>
                </div>
                <div className='movie-list__item-content'>
                    <h1 className='movie-list__item-title'>{title || name }</h1>
                    <p className='movie-list__item-date'>{format(parseISO(release_date || first_air_date), 'MMMM d, y')}</p>
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
