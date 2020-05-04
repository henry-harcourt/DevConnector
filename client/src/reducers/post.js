import {
    GET_POSTS,
    POST_ERROR,
    UPDATE_LIKE,
    DELETE_POST,
    ADD_POST,
    GET_POST,
    ADD_COMMENT,
    REMOVE_COMMENT
} from '../actions/types'

const initialState = {
    posts: [],
    post: null,
    loading: true,
    error: {}
}

export default function (state = initialState, action) {
    const { type, payload } = action

    switch (type) {
        case GET_POSTS:
            return {
                ...state,
                posts: payload,
                loading: false
            }
        // single post for creating discussion off post
        case GET_POST:
            return {
                ...state,
                post: payload,
                loading: false
            }
        case ADD_POST:
            return {
                ...state,
                // line below will return all posts in state plus the paylaod which holds the new post.
                posts: [payload, ...state.posts],
                loading: false
            }
        case DELETE_POST:
            return {
                ...state,
                // line below will return all posts except for the one that has the id that matches the payload (the post id)
                // because that is the deleted post
                posts: state.posts.filter(post => post._id !== payload),
                loading: false
            }
        case POST_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            }
        case UPDATE_LIKE:
            return {
                ...state,
                // line below checks it is the corrrect post that we are adding or removing a like to/from. 
                // if its a match then - return the post as is, then - return the post with ammended likes.
                // final condition: if the id doesnt match - retun the post and forget any like changes.  
                posts: state.posts.map(post => post._id === payload.id ? { ...post, likes: payload.likes } : post),
                loading: false
            }
        case ADD_COMMENT:
            return {
                ...state,
                post: { ...state.post, comments: payload},
                loading: false
            }
        case REMOVE_COMMENT:
            return {
                ...state,
                post: {
                    ...state.post,
                    comments: state.post.comments.filter(
                        comment => comment._id !== payload  // shows all comments that are not equal to the payload (because it has just been deleted)
                    )
                },
                loading: false
            }
        default:
            return state
    }
}