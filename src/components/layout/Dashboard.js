import React from 'react'
import PokemonList from '../pokemon/PokemonList'

export default function Dashboard ({pokemonData}) {
    return (
        <PokemonList pokemonData={pokemonData} />
    )
}
