const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator')

const Profile = require('../../models/Profiles')
const User = require('../../models/User')

// @route GET   api/profile/me
// @description Get current users profile
// @access      Private (based on users auth token)

// whatever routes you wwant to protect with auth, you just add as a parameter to the route.
// and import the middleware of course. 
router.get('/me', auth, async (req, res) => {
    try {

        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar'])   // req.user.id pertains to the Profile model user field with id

        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' })
        }
        res.json(profile)
    } catch (errr) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route POST   api/profile
// @description  create or update user profile
// @access      Private (based on users auth token)

router.post('/', [auth, [
    check('status', 'status is required')
        .not()
        .isEmpty(),
    check('skills', 'Skills is required')
        .not()
        .isEmpty()
]
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const {
        company,
        location,
        website,
        bio,
        skills,
        status,
        githubusername,
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook
    } = req.body

    // Build profile object
    const profileFields = {}
    profileFields.user = req.user.id

    if (company) profileFields.company = company
    if (website) profileFields.website = website
    if (location) profileFields.location = location
    if (bio) profileFields.bio = bio
    if (status) profileFields.status = status
    if (githubusername) profileFields.githubusername = githubusername
    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim()) // .split turns string into an array. The ',' is a delimiter
    }

    //Build Social object
    profileFields.social = {}

    if (youtube) profileFields.youtube = youtube
    if (twitter) profileFields.twitter = twitter
    if (facebook) profileFields.facebook = facebook
    if (linkedin) profileFields.linkedin = linkedin
    if (instagram) profileFields.instagram = instagram

    //find profile
    try {
        let profile = await Profile.findOne({ user: req.user.id })

        if (profile) {
            // update profile
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            )

            return res.json(profile)
        }

        // create profile if not found
        profile = new Profile(profileFields)

        await profile.save()
        res.json(profile)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route GET   api/profile
// @description  Get all user profiles
// @access      Public

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])
        res.json(profiles)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route GET   api/profile/user/:user_id
// @description  Get profile by user id
// @access      Public

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar'])
        if (!profile) return res.status(400).json({ msg: 'Profile not found' })

        res.json(profile)
    } catch (err) {
        console.error(err.message)
        if (err.kind == 'ObjectId'){
            return res.status(400).json({ msg: 'Profile not found' })
        }
        res.status(500).send('Server Error')
    }
})

module.exports = router