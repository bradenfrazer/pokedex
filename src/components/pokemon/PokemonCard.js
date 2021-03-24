import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import styled from "styled-components";
import spinner from "../pokemon/spinner.gif";

const Sprite = styled.img`
    width: 5em;
    display: none;
`;

const Card = styled.div`
    box-shadow: 0 1px 3px rgba(25,25,25,0.125), 0 1px 2px rgba(25,25,25,0.25);
    transition: all 0.3s cubic-bezier(0.25, 0.8, .25, 1);
    &:hover {
        box-shadow: 0 15px 30px rgba(25,25,25,0.25), 0 10px 10px rgba(25,25,25,0.5);
    }
    -moz-user-select: none;
    -website-user-select: none;
    user-select: none;
    -o-user-select: none;
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    color: black;
    &:focus,
    &:hover,
    &:visited,
    &:link,
    &:active {
        text-decoration: none;
    }
`;

export default class PokemonCard extends Component {
    state = {
        name: '',
        imageURL: '',
        pokemonIndex: '',
        imageLoading: true,
        tooManyRequests: false

    };

    componentDidMount() {
        const {name, url} = this.props;
        const pokemonIndex = url.split("/")[url.split('/').length - 2];
        const imageURL = `https://github.com/PokeAPI/sprites/blob/master/sprites/pokemon/${pokemonIndex}.png?raw=true`;
        this.setState({
            name,
            imageURL,
            pokemonIndex
        });
    }


    render() {
        return (
            <div className="col-md-3 col-sm-6 mb-5">
                <StyledLink to={`pokemon/${this.state.pokemonIndex}`}>
                    <Card className="card text-white bg-dark">
                        <div className="card-header">
                            <p>#{this.state.pokemonIndex}</p>
                        </div>
                        { this.state.imageLoading ? (
                            <img src={spinner} style={{width: '5em', height: '5em'}} className="card-img-top rounded mx-auto d-block mt-2"></img>
                        ) : null }
                        <Sprite 
                            className="card-img-top rounded mx-auto mt-2"
                            src={this.state.imageURL}
                            style={
                                this.state.tooManyRequests ? {display: "none"} :
                                this.state.imageLoading ? null : {display: "block"}

                        }
                            onLoad={() => this.setState({imageLoading: false})}
                            onError={() => this.setState({tooManyRequests: true})}
                        />
                        { this.state.tooManyRequests ? (
                        <h6 className="mx-auto">
                            <span className="badge badge-danger mt-2">Too many requests</span>
                        </h6>) : null }
                        <div className="card-body mx-auto">
                            <h5 className="card-title">
                                { this.state.name
                                .toLowerCase()
                                .split(" ")
                                .map(
                                    letter => letter.charAt(0).toUpperCase() + letter.substring(1)
                                    )
                                    .join(' ')
                                } 
                            </h5>
                        </div>
                    </Card>
                </StyledLink>
            </div>
        );
    }
}
