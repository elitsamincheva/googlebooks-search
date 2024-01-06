import React, { useState } from 'react';
import Results from './Results';
import { gql, useLazyQuery } from '@apollo/client';

// GraphQL query to search for books based on search terms, offset, and limit
const BOOKS_SEARCH = gql`
query ($searchTerms: String, $offset: Int, $limit: Int) {
    booksSearch(searchTerms: $searchTerms, offset: $offset, limit: $limit) {
            id,
            title,
            authors,
            thumbnail
    }
}
`

// Constant representing the number of books to display per page
const PAGE_SIZE = 10;

// Search component for searching and displaying books
const Search = () => {
    // State variables for search input, current page, and search results
    const [searchInput, setSearchInput] = useState('');
    const [page, setPage] = useState(0);
    const [searchBooks, { loading, error, data }] = useLazyQuery(BOOKS_SEARCH);

    // Function to change the current page
    const changePage = (increment) => {
        setPage(prev => prev + increment);
        searchBooks({ variables: { searchTerms: searchInput, limit: PAGE_SIZE, offset: page * PAGE_SIZE } });
    }

    // Function to perform a search with the current input and page
    const performSearch = () => {
        const vars = { searchTerms: searchInput, limit: PAGE_SIZE, offset: page * PAGE_SIZE };
        console.log('performSearch', vars)
        searchBooks({ variables: vars });
    }

    // Function to handle changes in the search input
    const searchChanged = (event) => {
        setSearchInput(event.target.value);
        setPage(0);
    }

    // Render loading state while fetching data
    if (loading) return "Loading...";
    // Render error message if there is an error
    if (error) return `Error! ${error.message}`;

    return (
        <>
            <div>
                <input
                    type="search"
                    placeholder="Search here"
                    onChange={searchChanged}
                    value={searchInput} />
                <button style={{ fontSize: 20 }} onClick={performSearch}>&#x1F50D;</button>
            </div>
            <Results books={data?.booksSearch} />
            <div>
                <button disabled={!page} onClick={() => changePage(-1)}>&laquo; Previous</button>
                <button onClick={() => changePage(1)}>Next &raquo;</button>
            </div>
        </>
    )
};

export default Search;