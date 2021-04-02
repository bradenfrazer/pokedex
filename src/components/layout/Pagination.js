import React from 'react';

export default function Pagination ({prevUrl, nextUrl, setCurrentUrl}) {

    function gotoNextPage() {
        setCurrentUrl(nextUrl);
      }
    
      function gotoPrevPage() {
        setCurrentUrl(prevUrl);
      }

    return (
        <div className="flex justify-center w-full py-4">
            <button 
                className={ prevUrl ? "nes-btn is-error" : "nes-btn is-disabled" }
                onClick={gotoPrevPage}
                >
                Previous
            </button>
            <button 
                className={ nextUrl ? "nes-btn is-error" : "nes-btn is-disabled" } 
                onClick={gotoNextPage}
                >
                Next
            </button>
        </div>  
    )

}
