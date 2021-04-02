import React, { useState, useEffect } from 'react';
import {HashRouter as Router, Route, Switch, Link} from 'react-router-dom';
import './PressStart2P-Regular.ttf';
import "nes.css/css/nes.min.css";
import './App.css';
import SearchBar from './components/layout/SearchBar';
import Dashboard from './components/layout/Dashboard';
import Pagination from './components/layout/Pagination';
import Pokemon from './components/pokemon/Pokemon';
import backgroundImage from './pattern.png';
import axios from 'axios';

const App = () => {
  const [input, setInput] = useState('');
  const [pokemon, setPokemon] = useState([]);
  const [completePokemon, setCompletePokemon] = useState([]);
  const [currentPageUrl, setCurrentPageUrl] = useState(
      "https://pokeapi.co/api/v2/pokemon/?limit=40"
  );
  const completeListUrl = "https://pokeapi.co/api/v2/pokemon?limit=898";
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
        axios
        .get(completeListUrl, {
          cancelToken: new axios.CancelToken(c => (cancel = c))
        })
        .then(res => {
          setLoading(false);
          setCompletePokemon(res.data.['results']);
        });
  
      return () => cancel();
    }, [currentPageUrl]);
  
  function filterPokemon(pokemonData) {
      const filtered = pokemonData
      .filter((pokemon) => {
        if (pokemon.name.includes(input)) {
          return true;
        } else {
          return false;
        }
      });
      return filtered;
    }

  return (
      <Router>
        <div className="App" style={{background: `url(${backgroundImage})`}}>
          <nav className="mb-4 p-4">
            <div className="container mx-auto flex justify-between items-center">
              <Link to="/"><span className="nes-text is-error text-lg">Pokedex</span></Link>
              <SearchBar 
                keyword={input} 
                setKeyword={setInput}
              />
            </div>
          </nav>
          <div className="container mx-auto px-4">
            { loading ? 
              <div className="nes-container bg-white">
                <h3>Loading Pokemon...</h3> 
              </div>
              :
              <Switch>
                <Route 
                exact path ="/" 
                render={(props) => (
                  <>
                    <Dashboard {...props} 
                    pokemonData={
                      input ? filterPokemon(completePokemon)
                      :
                      pokemon
                      } />
                    { !input ? 
                      <Pagination {...props} 
                        prevUrl={prevPageUrl} 
                        nextUrl={nextPageUrl} 
                        setCurrentUrl={setCurrentPageUrl} 
                      />
                    : null
                    }
                  </>
                )}
                />
                <Route 
                exact path ="/pokemon/:pokemonIndex" 
                component={Pokemon} />
              </Switch>
              }
            </div>
        </div>
      </Router>
  );

}

export default App;
