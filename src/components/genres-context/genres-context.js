import React, { Component } from 'react';

const GenresContext = React.createContext();

export class GenresProvider extends Component {
    state = {
        genres: {},
    };

    componentDidMount() {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNGViNzdmNTAwY2ZlMGM3YjNjOTZiOTc1NjliNjYyOSIsInN1YiI6IjY0YTY3OTFjY2FlNjMyMDBjODdkOWRhMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mn79LJYRe_MiBuwRyQQftEw3D-hnE1ELZQ_7MVX3BnQ'
            }
        };

        fetch('https://api.themoviedb.org/3/genre/movie/list', options)
            .then(response => response.json())
            .then(response => {
                const genres = {};
                response.genres.forEach(genre => {
                    genres[genre.id] = genre.name;
                });
                console.log('Fetched genres:', genres);
                this.setState({ genres });
            })
            .catch(err => console.error(err));
    }

    render() {
        return (
            <GenresContext.Provider value={this.state}>
                {this.props.children}
            </GenresContext.Provider>
        );
    }
}

export const GenresConsumer = GenresContext.Consumer;