import React from "react";

import PokemonCard from "./PokemonCard";

export default function PokemonList ({pokemonData}) {

    return (
            <React.Fragment>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    { pokemonData.map(pokemon => (
                        <PokemonCard
                            key={pokemon.name}
                            name={pokemon.name} 
                            url={pokemon.url}
                        />
                    ))}
                </div>
        </React.Fragment>
     );
}

