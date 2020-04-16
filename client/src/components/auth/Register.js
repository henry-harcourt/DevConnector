import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'

const Register = () => {

    //formData is an object with all the field values.
    //setFormData is the function used to update the state
    //useState is a function that sets the default state

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    })

    const { name, email, password, password2 } = formData

    // spread operator will create a copy of formData state
    //the [e.target.name] is a way of setting the onChange to update all fields in the form using the 'name' key
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

    const onSubmit = async e => {
        e.preventDefault()
        if (password !== password2) {
            console.log('Passwords do not match') // checking that sign up passwords match
        } else {
            console.log('SUCCESS')

            // below is how you would handle this through the component. However I will now change it to be handled through a redux 
            // action instead.

        //     const newUser = {
        //         name,
        //         email,
        //         password
        //     }

        //     try {
        //         const config = {
        //             headers: {
        //                 'Content-Type': 'application/json'
        //             }
        //         }

        //         const body = JSON.stringify(newUser)

        //         const res = await axios.post('/api/users', body, config)
        //         console.log(res.data)
        //     } catch (err) {
        //         console.error(err.response.data)
        // }
    }
}
return (
    <Fragment>
        <h1 className="large text-primary">Sign Up</h1>
        <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
        <form className="form" onSubmit={e => onSubmit(e)}>
            <div className="form-group">
                <input
                    type="text"
                    placeholder="Name"
                    name="name" value={name}
                    onChange={e => onChange(e)}
                    required />
            </div>
            <div className="form-group">
                <input
                    type="email"
                    placeholder="Email Address"
                    name="email"
                    value={email}
                    onChange={e => onChange(e)}
                    required />
                <small className="form-text"
                >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small
                >
            </div>
            <div className="form-group">
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={e => onChange(e)}
                    required
                    minLength="6"
                />
            </div>
            <div className="form-group">
                <input
                    type="password"
                    placeholder="Confirm Password"
                    name="password2"
                    value={password2}
                    onChange={e => onChange(e)}
                    required
                    minLength="6"
                />
            </div>
            <input type="submit" className="btn btn-primary" value="Register" />
        </form>
        <p className="my-1">
            Already have an account? <Link to='login.html'>Sign In</Link>
        </p>
    </Fragment>
)
}

export default Register