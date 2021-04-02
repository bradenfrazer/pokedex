import React from 'react';

const SearchBar = ( {keyword, setKeyword} ) => {
    return (
        <div style={{backgroundColor: '#212529', padding: '1rem'}} className="nes-field is-inline">
            <label for="dark_field" style={{color: '#fff'}}>Search</label>
            <input 
                type="text" 
                id="dark_field" 
                className="nes-input is-dark" 
                placeholder={"Name of Pokemon..."}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />
        </div>
    )
}

export default SearchBar;
