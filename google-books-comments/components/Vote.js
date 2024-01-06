import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";

// GraphQL mutation to upvote a book review
const UPVOTE_MUTATION = gql`
mutation ($bookId: String) {
    upVote(id: $bookId) {
        id
        upVotes
        downVotes
    }
}
`
// GraphQL mutation to downvote a book review
const DOWNVOTE_MUTATION = gql`
mutation ($bookId: String) {
    downVote(id: $bookId) {
        id
        upVotes
        downVotes
    }
}
`
// GraphQL query to fetch votes (upvotes and downvotes) for a book review
const VOTES_QUERY = gql`
query ($bookId: String) {
    bookReview(id: $bookId) {
        id
        upVotes
        downVotes
    }
}
`

// Vote component for handling book upvotes and downvotes
const Vote = ({ bookId }) => {
    // Fetch votes data using the VOTES_QUERY
    const { data } = useQuery(VOTES_QUERY, { variables: { bookId } });
    // Use upVote mutation and refetch votes data
    const [upVote] = useMutation(UPVOTE_MUTATION, { variables: { bookId }, refetchQueries: [VOTES_QUERY] });
    // Use downVote mutation and refetch votes data
    const [downVote] = useMutation(DOWNVOTE_MUTATION, { variables: { bookId }, refetchQueries: [VOTES_QUERY] });

    return (
        <><button style={{ fontSize: 20 }} onClick={() => upVote()}>&#x1F44D;{`${data?.bookReview?.upVotes || 0}`}</button > <button style={{ fontSize: 20 }} onClick={() => downVote()}>&#x1F44E;{`${data?.bookReview?.downVotes || 0}`}</button></>
    )
}

export default Vote;