const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const auth = require('../../middleware/auth')

const Post = require('../../models/Posts')
const Profile = require('../../models/Profiles')
const User = require('../../models/User')

// @route POST   api/posts
// @description  create a post
// @access       Private

router.post('/', [auth, [
    check('text', 'Text is requierd')
        .not()
        .isEmpty()
]
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        // we're logged in so we have an auth token and can use req.user.id to access id
        const user = await User.findById(req.user.id).select('-password')

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        })

        const post = await newPost.save()

        res.json(post)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route        GET api/posts
// @description  Get all post
// @access       Private

router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 }) // sorts by date. -1 will sort by most recent first
        res.json(posts)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})


// @route        GET api/posts/:id
// @description  Get single post by id
// @access       Private

router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id) // req.params.id will get the id from the URL

        if (!post) {
            return res.status(404).json({ msg: 'post not found' })
        }

        res.json(post)
    } catch (err) {
        console.error(err.message)

        // if the error object has a property called kind, check to see if it's equal to object ID. If it is then there is no post found.
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'post not found' })
        }

        res.status(500).send('Server Error')
    }
})

// @route        DELETE api/posts/:id
// @description  Delete post
// @access       Private

router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).json({ msg: 'post not found' })
        }
        //Check user. We can't have users who didnt make the post able to delete a post.
        // however. req.user.id is a string, post.user is not - it is an object id. So we must use toString method so that they will match.
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'user not authorized' })
        }

        await post.remove()

        res.json({ msg: 'Post removed' })
    } catch (err) {
        console.error(err.message)

        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'post not found' })
        }

        res.status(500).send('Server Error')
    }
})

// @route        PUT api/posts/like/:id
// @description  Like a post
// @access       Private

router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        //Check if post has already been liked by user. This works by checking the like array of the Post model to if the user id matches.
        // if the like array is longer than 0 then the post has alrerady been liked. 
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Post already liked' })
        }

        post.likes.unshift({ user: req.user.id }) // the user that is logged in

        await post.save()

        res.json(post.likes)
    } catch (error) {

    }
})

// @route        PUT api/posts/unlike/:id
// @description  Unlike a post
// @access       Private

router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        //Check if post has already been liked by user. This works by checking the like array of the Post model to if the user id matches.
        // if the like array is longer than 0 then the post has alrerady been liked. 
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: 'Post has not yet been liked' })
        }

        // Get the remove index
        const removeIndex = post.likes.map(like => like.user.toString().indexOf(req.user.id))

        post.likes.splice(removeIndex, 1)

        await post.save()

        res.json(post.likes)
    } catch (error) {

    }
})

module.exports = router