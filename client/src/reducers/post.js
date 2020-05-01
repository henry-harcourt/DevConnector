import {
    GET_POSTS,
    POST_ERROR,
    UPDATE_LIKE
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
        default:
            return state
    }
}