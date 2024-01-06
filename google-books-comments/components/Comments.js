import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";

// Define GraphQL mutations for adding, editing, and deleting comments, and a query for fetching comments
const ADD_COMMENT_MUTATION = gql`
mutation ($bookId: String, $author: String, $text: String, $secret: String) {
    addComment (
        id: $bookId,
        author: $author,
        text: $text,
        secret: $secret
    ) {
        id
        comments {
            id
            author
            text
        }
    }
}
`;

const EDIT_COMMENT_MUTATION = gql`
mutation ($bookId: String, $commentId: Int, $text: String, $secret: String) {
    updateComment (
        id: $bookId,
        commentId: $commentId,
        text: $text,
        secret: $secret
    ){
        id
        comments {
            id
            author
            text
        }
    }
}
`

const DELETE_COMMENT_MUTATION = gql`
mutation ($bookId: String, $commentId: Int, $secret: String) {
    deleteComment (
        id: $bookId,
        commentId: $commentId,
        secret: $secret
    )
}
`

const COMMENTS_QUERY = gql`
query ($bookId: String) {
    bookReview (id: $bookId) {
        id
        comments {
            id
            author
            text
        }
    }
}
`

// Component for adding a new comment
const AddComment = ({ bookId }) => {
    const [comment, setComment] = useState({ bookId, author: '', text: '' });
    const [secret, setSecret] = useState('');
    const [addComment] = useMutation(ADD_COMMENT_MUTATION, { refetchQueries: [COMMENTS_QUERY] });

    return (
        <fieldset>
            <legend>Add comment</legend>
            <label htmlFor={`author-${bookId}-new`}>From:</label><br />
            <input type="text" id={`author-${bookId}-new`} onChange={event => setComment({ ...comment, author: event.target.value })} /><br />
            <label htmlFor={`secret-${bookId}-new`}>Secret:</label><br />
            <input type="password" id={`secret-${bookId}-new`} onChange={event => setSecret(event.target.value)} /><br /><br />
            <textarea onChange={event => setComment({ ...comment, text: event.target.value })}></textarea>
            <button onClick={() => addComment({ variables: { ...comment, secret } })}>Add</button>
        </fieldset>)
}

// Component for viewing and editing a comment
const ViewEditComment = ({ bookId, comment }) => {
    const [viewEditMode, setViewEditMode] = useState('view');
    const [editComment] = useMutation(EDIT_COMMENT_MUTATION, { refetchQueries: [COMMENTS_QUERY], onCompleted: () => setViewEditMode('view') });
    const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION, { refetchQueries: [COMMENTS_QUERY] });
    const [secret, setSecret] = useState('');
    const [thisComment, setThisComment] = useState({ bookId, commentId: comment.id, author: comment.author, text: comment.text });

    return (
        <>
            {viewEditMode === 'view' &&
                (<article>
                    <h4>From: {comment.author} &nbsp;<button title="Edit comment.." style={{ fontSize: 20 }} onClick={() => setViewEditMode('edit')}>&#x1F58A;</button>&nbsp;<button title="Delete comment..." style={{ fontSize: 20 }} onClick={() => setViewEditMode('delete')}>&#x1F5D1;</button></h4>
                    <p>{comment.text}</p>

                </article>)
            }
            {viewEditMode === 'edit' &&
                (<fieldset>
                    <legend>Edit comment</legend>
                    <label htmlFor={`author-${bookId}-${comment.id}`}>From:</label><br />
                    <input autoComplete="off" type="text" id={`author-${bookId}-${comment.id}`} value={thisComment.author} readOnly={true} /><br />
                    <label htmlFor={`secret-${bookId}-${comment.id}`}>Secret:</label><br />
                    <input autoComplete="off" type="password" id={`secret-${bookId}-${comment.id}`} onChange={event => setSecret(event.target.value)} /><br /><br />
                    <textarea onChange={event => setThisComment({ ...thisComment, text: event.target.value })} value={thisComment.text}></textarea>
                    <button onClick={() => editComment({ variables: { ...thisComment, secret } })}>Edit</button>
                </fieldset>)
            }
            {viewEditMode === 'delete' &&
                (<fieldset>
                    <legend>Delete comment</legend>
                    <label htmlFor={`secret-${bookId}-${comment.id}`}>Secret:</label><br />
                    <input autoComplete="off" type="password" id={`secret-${bookId}-${comment.id}`} onChange={event => setSecret(event.target.value)} /><br /><br />
                    <button onClick={() => deleteComment({ variables: { bookId, commentId: thisComment.commentId, secret } })}>Delete</button>
                </fieldset>)
            }
        </>
    )
}

// Component for displaying comments for a book
const Comments = ({ bookId }) => {
    const { loading, data, error } = useQuery(COMMENTS_QUERY, {
        variables: { bookId }
    })

    if (loading) return "Loading...";
    if (error) return `Error! ${error.message}`;
    return (
        <>
            <h4>Comments ({data?.bookReview?.comments?.length || 0})</h4>
            {!data?.bookReview?.comments?.length ? "No comments yet!" :
                data.bookReview.comments.map((comment) => (
                    <ViewEditComment key={comment.id} comment={comment} bookId={bookId} />
                ))}
            <AddComment bookId={bookId} />
        </>
    )
}

export default Comments;