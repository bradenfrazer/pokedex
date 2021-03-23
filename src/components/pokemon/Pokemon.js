import React, { Component } from 'react';
import axios from 'axios';

export default class Pokemon extends Component {
    state = {
        name: '',
        pokemonIndex: '',
        imageURL: ''
    };

    async componentDidMount() {
        const { pokemonIndex } = this.props.match.params;

        // urls for pokemon info
        const pokemonURL = `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}/`;
        const pokemonSpeciesURL = `https://pokeapi.co/api/v2/pokemon-species/${pokemonIndex}/`;

        //get pokemon info
        const pokemonRes = await axios.get(pokemonURL);

        const name = pokemonRes.data.name;
        this.setState({ name });
    }

    render() {
        return (
            <div>
                <h1>{this.state.name}</h1>
            </div>
        )
    }
}
