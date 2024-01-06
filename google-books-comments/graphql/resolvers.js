// Google Books API key and URL
const apiKey = 'AIzaSyCIxIIcpTwWrV5HmCj_q4AWZRAqD7y6CFI';
const apiURL = 'https://www.googleapis.com/books/v1/volumes';
// https://www.googleapis.com/books/v1/volumes?key=AIzaSyCIxIIcpTwWrV5HmCj_q4AWZRAqD7y6CFI&maxResults=40&orderBy=relevance&q=the+capital

// Importing book reviews data from a JSON file
import bookReviews from "./book-reviews.json"

// GraphQL resolvers for handling queries and mutations
const resolvers = {
    Query: {
        // Resolver for searching books using Google Books API
        booksSearch: async (_, { searchTerms, offset, limit }) => {
            try {
                 // Fetch book data from the Google Books API
                const response = await fetch(`${apiURL}?key=${apiKey}&maxResults=${limit}&startIndex=${offset}&orderBy=relevance&q=${searchTerms}`)
                const data = await response.json()

                 // Transform and return relevant book information
                return data.items?.map(book => {
                    return {
                        id: book.id,
                        title: book.volumeInfo.title,
                        authors: book.volumeInfo.authors?.join(),
                        publisher: book.volumeInfo.publisher,
                        publishedDate: book.volumeInfo.publishedDate,
                        description: book.volumeInfo.description,
                        pageCount: book.volumeInfo.pageCount,
                        language: book.volumeInfo.language,
                        thumbnail: book.volumeInfo.imageLinks?.thumbnail,
                        categories: book.volumeInfo.categories?.join(),
                        averageRating: book.volumeInfo.averageRating,
                        ratingsCount: book.volumeInfo.ratingsCount
                    }
                })
            } catch (error) {
                // Handle errors during API request
                throw new Error(`Something went wrong! Error: ${error}`)
            }
        },
        // Resolver for fetching book reviews by ID
        bookReview: (_, { id }) => {
            return bookReviews.find((review) => review.id === id) ?? null;
        }
    },
    Mutation: {
        // Resolver for adding a new comment to a book review
        addComment: (_, { id, author, text, secret }) => {
            // Create a new comment
            const comment = {
                id: 0,
                author: author,
                text: text
            }
            // Find the book review by ID
            let review = bookReviews.find((review) => review.id === id);
            if (review) {
                // If the review exists, update the comment and add it
                comment.id = review.comments.length;
                review.comments.push({ ...comment, secret: secret })
            } else {
                // If the review doesn't exist, create a new one with the comment
                review = {
                    id: id,
                    upVotes: 0,
                    downVotes: 0,
                    comments: [{ ...comment, secret: secret }]
                };
                bookReviews.push(review)
            }
            // Return the updated review
            return review;
        },
        // Resolver for updating an existing comment in a book review
        updateComment: (_, { id, commentId, text, secret }) => {
            // Find the book review by ID
            const review = bookReviews.find((review) => review.id === id);
            const comment = review?.comments.find((c) => c.id === commentId)
            if (!comment) {
                // Throw an error if the comment is not found
                throw new Error('Comment not found!')
            }
            if (comment.secret !== secret) {
                // Throw an error if the user is not authorized to update the comment
                throw new Error('Not authorized to update comment!')
            }
            // Update the comment text
            comment.text = text;
            // Return the updated review
            return review;
        },
         // Resolver for deleting a comment from a book review
        deleteComment: (_, { id, commentId, secret }) => {
              // Find the book review by ID
            const review = bookReviews.find((review) => review.id === id);
            if (!review) {
                 // Throw an error if the review is not found
                throw new Error('Something went wrong!')
            }
            const commentIdx = review.comments.findIndex((c) => c.id === commentId);
            if (commentIdx < 0) {
                // Throw an error if the comment is not found
                throw new Error('Comment not found!')
            }
            if (review.comments[commentIdx].secret !== secret) {
                // Throw an error if the user is not authorized to delete the comment
                throw new Error('Not authorized to delete comment!')
            }
            // Remove the comment from the review
            review.comments.splice(commentIdx, 1);
            // Return true to indicate successful deletion
            return true;
        },
        // Resolver for upvoting a book review
        upVote: (_, { id }) => {
            // Find the book review by ID
            let review = bookReviews.find((review) => review.id === id);
            if (review) {
                // If the review exists, increment the upvote count
                review.upVotes++;
            } else {
                // If the review doesn't exist, create a new one with an upvote
                review = {
                    id: id,
                    upVotes: 1,
                    downVotes: 0,
                    comments: []
                };
                bookReviews.push(review)
            }
            // Return the updated review
            return review;
        },
        // Resolver for downvoting a book review
        downVote: (_, { id }) => {
             // Find the book review by ID
            let review = bookReviews.find((review) => review.id === id);
            if (review) {
                // If the review exists, increment the downvote count
                review.downVotes++;
            } else {
                // If the review doesn't exist, create a new one with a downvote
                review = {
                    id: id,
                    upVotes: 0,
                    downVotes: 1,
                    comments: []
                };
                bookReviews.push(review)
            }
            // Return the updated review
            return review;
        }

    }
};

// Export the resolvers for use in GraphQL schema
export default resolvers;