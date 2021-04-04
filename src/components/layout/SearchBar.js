import React from 'react';
import searchIcon from './px-search.png';

const SearchBar = ( {keyword, setKeyword} ) => {
    return (
        <div style={{backgroundColor: '#212529'}} className="nes-field flex items-center py-4 sm:p-4">
            <label for="dark_field" style={{color: '#fff', marginRight: '15px', marginBottom: '0'}}><img src={searchIcon} style={{width: '32px'}}></img></label>
            <input 
                type="text" 
                id="dark_field" 
                className="nes-input is-dark" 
                placeholder={"Name of Pokemon..."}
                value={keyword}
                onChange={(e) => setKeyword(
                    e.target.value
                    )}
            />
        </div>
    )
}

export default SearchBar;
