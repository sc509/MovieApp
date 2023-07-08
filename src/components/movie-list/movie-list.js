import MovieCard from "../movie-card/movie-list-item";
import "./movie-list.css"
import {Component} from "react";
import MdbapiService from "../services/service-api";
export default class movieList extends Component{
    mdbapiService = new MdbapiService();
    state = {
        movies: [],
    }

    componentDidMount() {
        this.updateData();
    }

    updateData() {
        this.mdbapiService.getResults().then((data) => {
            this.setState({
                movies: data,
            });
        });
    }
    render() {
        const { movies } = this.state;

        return (
            <div>
                <div className="movie-list">
                {movies.map((movies) => (
                        <MovieCard
                            title={movies.title}
                            name={movies.name}
                            release_date={movies.release_date}
                            first_air_date={movies.first_air_date}
                            genre_ids={movies.genre_ids}
                            overview={movies.overview}
                            id={movies.id}
                            poster_path={movies.poster_path}
                        />

                ))}
                </div>
            </div>
        );
    }
}