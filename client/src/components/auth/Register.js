import React, { Fragment, useState } from 'react'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { setAlert } from '../../actions/alert'
import { register } from '../../actions/auth'
import PropTypes from 'prop-types'

const Register = ({ setAlert, register, isAuthenticated }) => {  // props is destructured here with curly braces and the action is passed straight in.

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
            setAlert('Passwords do not match', 'danger') // checking that sign up passwords match. Takes the setAlert action.
        } else {
            register({ name, email, password })

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

        if (isAuthenticated) {
            return <Redirect to='/dashboard' />
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
                    />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={email}
                        onChange={e => onChange(e)}
                    />
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
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="password2"
                        value={password2}
                        onChange={e => onChange(e)}
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

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

// --- whenever you bring in an action to a component you need to pass it as a parameter to connect in the form of an object
// which will take all the objects you are passing in. This allows us to access the action with props.<actionName> 
// props is enterd into the parameters of the component (at top) ---
// you also need to pass it any state that you want to map. in this case state is null

export default connect(
    mapStateToProps,
    { setAlert, register }
)(Register)