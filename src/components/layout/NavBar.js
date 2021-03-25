import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';

export default class NavBar extends Component {
    render() {
        return (
            <div>
                <nav className="mb-4 p-4">
                    <div className="container mx-auto">
                    <Link to="/"><span className="nes-text is-error text-lg">Pokedex</span></Link>
                    </div>
                </nav>
            </div>
        )
    }
}
