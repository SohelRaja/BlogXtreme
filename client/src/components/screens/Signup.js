import React from 'react';
import {Link} from 'react-router-dom';

const Signup = () => {
    return (
        <div className='mycard'>
            <div className="card auth-card input-field">
                <h2>Sign Up</h2>
                <input 
                    type='text'
                    placeholder='Name'
                />
                <input 
                    type='text'
                    placeholder='Email'
                />
                <input 
                    type='text'
                    placeholder='Password'
                />
                <button class="btn waves-effect waves-light #5e35b1 deep-purple darken-1">
                    Signup
                </button>
                <h6 className='sign-link'><Link to='/signin'>Already have an account ?</Link></h6>
            </div>
        </div>
    );
}

export default Signup;