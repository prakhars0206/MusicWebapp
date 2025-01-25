'use client'

import { useState } from "react";
import ShowAlbums from "./searchAlbums";
import NavBar from "./navbar";
import RenderNew from "./newAlbums";


export default function Home() {
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);


  const handleSearchResults = (results) => {
    setSearchResults(results);
    setShowSearchResults(true);
  };

  const resetToPopular = () => {
    setShowSearchResults(false); // Switch back to popular albums
  };


  return (
    <main >
      
      <div>
      <NavBar onSearch={handleSearchResults} resetToPopular={resetToPopular} />

        
      </div>
      <div className="bg-sky-200">
        {showSearchResults ? (
          <ShowAlbums results={searchResults} />
        ) : (
          <RenderNew />
        )}
        

      </div>

    </main>
  );
}
