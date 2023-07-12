import {Component} from "react";
import "./movie-search.scss"
export default class MovieSearch extends Component {
    handleInputChange = (event) => {
        const searchText = event.target.value;
        this.props.onSearch(searchText);
    };

    handleSubmit = (event) => {
        event.preventDefault();
    };
    render() {
        return (
            <section className="movie-search">
                <form className="movie-search__form" onSubmit={this.handleSubmit}>
                    <label htmlFor="inputText"></label>
                    <input
                        className="movie-search__form-input"
                        type="text"
                        id="inputText"
                        name="inputText"
                        placeholder="Type to search..."
                        required
                        onChange={this.handleInputChange}
                    />
                </form>
            </section>
        );
    }

}