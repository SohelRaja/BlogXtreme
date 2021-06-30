import React, {useState, useContext} from 'react';
import {Link, useHistory} from 'react-router-dom';
import M from 'materialize-css';

import {UserContext} from '../../App';

const Signin = () => {
    const {state, dispatch} = useContext(UserContext);
    const history = useHistory();
    const [password,setPassword] = useState("");
    const [email,setEmail] = useState("");

    const PostData = () => {
        fetch("/signin",{
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email.trim().toLowerCase(),
                password: password
            })
        }).then(res=>res.json())
        .then((data)=>{
            if(data.error){
                M.toast({html: data.error, classes: "#f44336 red"});
            }else{
                localStorage.setItem("jwt", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                dispatch({type:"USER", payload: data.user});

                M.toast({html: "Signed in successfully.", classes: "#607d8b blue-grey"});
                history.push('/');
            }
        }).catch(err=>{
            console.log(err);
        });
    };
    return (
        <div className='mycard'>
            <br/>
            <div className="card #90a4ae blue-grey lighten-2 input-field auth-card-signin">
                <h2>Sign In</h2>
                <input 
                    type='text'
                    placeholder='Email'
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />
                <input 
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />
                <button className="btn waves-effect waves-light #607d8b blue-grey"
                    onClick={()=>PostData()}
                >
                    Signin
                </button>
                <h6 className='sign-link'><Link to='/signup'><b>Don't have an account?</b></Link></h6>
                <h6 style={{color: "#ffffff"}}> Dev ❤️ ed by <a href="https://sohelraja.github.io" style={{color: "#ffffff"}}><b>Sohel Raja Molla</b></a></h6>
            </div>
        </div>
    );
}

export default Signin;