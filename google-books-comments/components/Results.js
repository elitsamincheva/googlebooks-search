import Image from 'next/image'
import React, { useEffect } from 'react';
import Vote from './Vote';
import Comments from './Comments';


// Results component displays a list of books with their details
const Results = ({ books }) => {
    return (
        <section id="results">
            <h2>Search Results</h2>
            {!books?.length ? 'No books found!' :
                // Map through each book and create a box with its details
                books.map((book) => (
                    <div className="box" key={book.id}>
                        <Image alt={book.title} src={book.thumbnail ?? 'https://placehold.co/100x160/png?text=No+Image'} width={100} height={160} style={{ marginRight: 50 }} />
                        <article>
                            <h3>{book.title}</h3>
                            <p>Authors: {book.authors}</p>
                            <p><Vote bookId={book.id} /></p>
                            <Comments bookId={book.id} />
                        </article>
                    </div>
                ))
            }
        </section>
    );
}

export default Results;