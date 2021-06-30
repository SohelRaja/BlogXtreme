import React, {useState, useEffect} from 'react';
import {useHistory, Link} from 'react-router-dom';
import M from 'materialize-css';

const CreatePost = () =>{
    const history = useHistory();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [privacy, setPrivacy] = useState("public");
    const [url, setUrl] = useState("");

    // It will kick start when url will be present.
    useEffect(()=>{
        if(url){
            // Request to Backend Server
            fetch("/createpost",{
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    title,
                    body,
                    pic: url,
                    privacy
                })
            }).then(res=>res.json())
            .then((data)=>{
                // console.log(data);
                if(data.error){
                    M.toast({html: data.error, classes: "#f44336 red"});
                }else{
                    M.toast({html: "Created post successfully.", classes: "#607d8b blue-grey"});
                    history.push('/');
                }
            }).catch(err=>{
                console.log(err);
            });
        }
    },[url,title,body,image,privacy,history]);

    const postDetails = () =>{
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onloadend = () =>{
            setUrl(reader.result);
        }
    }
    return (
        <div>
        <br/>
        <nav className="myBreadcrumb container #607d8b blue-grey">
            <div class="nav-wrapper container">
            <div class="col s12">
                <Link to="/" class="breadcrumb">BlogXtreme</Link>
                <Link to="/profile" class="breadcrumb">Profile</Link>
                <Link class="breadcrumb">Create</Link>
            </div>
            </div>
        </nav>
        <div className="card input-field post-card #90a4ae blue-grey lighten-2">
            <h2>Create Post</h2>
            <input 
                type="text" 
                placeholder="Title" 
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
            />
            <input 
                type="text" 
                placeholder="Description"
                value={body}
                onChange={(e)=>setBody(e.target.value)} 
            />
            <div className="file-field input-field">
                <div className="btn #607d8b blue-grey">
                    <span>Upload Image</span>
                    <input type="file" accept='image/*' onChange={(e)=>setImage(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <div className="privacy-button">
                <p>
                    <label>
                    <input className="with-gap left" name="group3" type="radio" 
                    value="public"
                    onChange={(e)=>setPrivacy(e.target.value)}
                    checked
                    />
                    <span>Public</span>
                    </label>
                </p>
                <p>
                    <label>
                    <input className="with-gap left" name="group3" type="radio" 
                    value="private"
                    onChange={(e)=>setPrivacy(e.target.value)}/>
                    <span>Private</span>
                    </label>
                </p>
            </div>
            <button className="btn waves-effect waves-light #607d8b blue-grey"
                onClick={()=>postDetails()}
            >
                Upload Post
            </button>
        </div>
        </div>
    );
}

export default CreatePost;