import React, {useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import M from 'materialize-css';


const Signup = () => {
    const history = useHistory();
    const [name,setName] = useState("");
    const [password,setPassword] = useState("");
    const [email,setEmail] = useState("");
    const UploadSignupData = () => {
        fetch("/signup",{
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password: password,
                pic: undefined
            })
        }).then(res=>res.json())
        .then((data)=>{
            // console.log(data);
            if(data.error){
                M.toast({html: data.error, classes: "#f44336 red"});
            }else{
                M.toast({html: data.message, classes: "#607d8b blue-grey"});
                history.push('/signin');
            }
        }).catch((err)=>{
            console.log(err);
        });
    }
    const PostData = () => {
        UploadSignupData();
    };
    return (
        <div className='mycard'>
            <br/>
            <div className="card #90a4ae blue-grey lighten-2 auth-card input-field">
                <h2>Sign Up</h2>
                <input 
                    type='text'
                    placeholder='Name'
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                />
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
                <button 
                    className="btn waves-effect waves-light #607d8b blue-grey"
                    onClick={()=>PostData()}
                >
                    Signup
                </button>
                <h6 className='sign-link'><Link to='/signin'><b>Already have an account?</b></Link></h6>
                <h6 style={{color: "#ffffff"}}> Dev ❤️ ed by <a href="https://sohelraja.github.io" style={{color: "#ffffff"}}><b>Sohel Raja Molla</b></a></h6>
            </div>
        </div>
    );
}

export default Signup;