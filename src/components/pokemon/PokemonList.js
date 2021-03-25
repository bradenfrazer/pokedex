import React, { useState, useEffect, Component } from "react";
import axios from 'axios';

import PokemonCard from "./PokemonCard";

export default function PokemonList () {

    const [pokemon, setPokemon] = useState([]);
    const [currentPageUrl, setCurrentPageUrl] = useState(
      "https://pokeapi.co/api/v2/pokemon"
    );
    const [nextPageUrl, setNextPageUrl] = useState();
    const [prevPageUrl, setPrevPageUrl] = useState();
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      setLoading(true);
      let cancel;
      axios
        .get(currentPageUrl, {
          cancelToken: new axios.CancelToken(c => (cancel = c))
        })
        .then(res => {
          setLoading(false);
          setNextPageUrl(res.data.next);
          setPrevPageUrl(res.data.previous);
          setPokemon(res.data.['results']);
        });
  
      return () => cancel();
    }, [currentPageUrl]);
  
    function gotoNextPage() {
      setCurrentPageUrl(nextPageUrl);
    }
  
    function gotoPrevPage() {
      setCurrentPageUrl(prevPageUrl);
    }
  
    if (loading) return (
        <div className="nes-container bg-white">
            <h3>Loading Pokemon...</h3> 
        </div>
    )
    return (
            <React.Fragment>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    { pokemon.map(pokemon => (
                        <PokemonCard
                            key={pokemon.name}
                            name={pokemon.name} 
                            url={pokemon.url}
                        />
                    ))}
                </div>
                <div className="flex justify-center w-full py-4">
                    <button 
                        className={ prevPageUrl ? "nes-btn is-error" : "nes-btn is-disabled" }
                        onClick={gotoPrevPage}
                        >
                        Previous
                    </button>
                    <button 
                        className={ nextPageUrl ? "nes-btn is-error" : "nes-btn is-disabled" } 
                        onClick={gotoNextPage}
                        >
                        Next
                    </button>
            </div>
        </React.Fragment>
     );
}

