import { Component } from 'react';
import './movie-search.scss';
import PropTypes from 'prop-types';

export default class MovieSearch extends Component {
  handleInputChange = (event) => {
    const searchText = event.target.value;
    const { onSearch } = this.props;
    onSearch(searchText, 1);
  };

  handleSubmit = (event) => {
    event.preventDefault();
  };

  render() {
    return (
      <section className="movie-search">
        <form className="movie-search__form" onSubmit={this.handleSubmit}>
          <label htmlFor="inputText">
            <input
              className="movie-search__form-input"
              type="text"
              id="inputText"
              name="inputText"
              placeholder="Type to search..."
              required
              onChange={this.handleInputChange}
            />
          </label>
        </form>
      </section>
    );
  }
}

MovieSearch.propTypes = {
  onSearch: PropTypes.func,
};

MovieSearch.defaultProps = {
  onSearch: () => {},
};
