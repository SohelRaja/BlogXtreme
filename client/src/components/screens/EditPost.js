import React, {useState, useEffect} from 'react';
import {useHistory, Link} from 'react-router-dom';
import {useParams} from 'react-router-dom';
import M from 'materialize-css';



const EditPost = () =>{
    const history = useHistory();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [fetchedPostId, setPostID] = useState("");
    const {postId} = useParams();
    const thisPost = JSON.parse(localStorage.getItem('post'));
    const thisPostData = thisPost.find(post=>{
        if(post._id === postId){
            return post;
        }
    })
    useEffect(()=>{
        fetch(`/editpost/${postId}`,{
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then((result)=>{
            // console.log(result)
            setTitle(result.title);
            setBody(result.body);
            setPostID(result._id);
        }).catch(err=>{
            console.log(err);
        });
    },[]);
    const updatePost = () =>{
        // Request to Backend Server
        fetch("/updatepost",{
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                title,
                body,
                postId
            })
        }).then(res=>res.json())
        .then((data)=>{
            // console.log(data);
            if(data.error){
                M.toast({html: data.error, classes: "#f44336 red"});
                if(data.error === "Something went wrong."){
                    history.push('/profile');
                }
            }else{
                M.toast({html: "Updated post successfully.", classes: "#607d8b blue-grey"});
                history.push('/profile');
            }
        }).catch(err=>{
            console.log(err);
        });
    }
    const Cancel = () => {
        history.push('/profile');
    }
    return (
        <div>
            <br/>
            <nav className="myBreadcrumb container #607d8b blue-grey">
                <div className="nav-wrapper container">
                <div className="col s12">
                    <Link to="/" className="breadcrumb">BlogXtreme</Link>
                    <Link to="/profile" className="breadcrumb">Profile</Link>
                    <Link className="breadcrumb">Edit</Link>
                </div>
                </div>
            </nav>
            <div className="card input-field post-card #90a4ae blue-grey lighten-2">
                <h2>Edit Post</h2>
                <h5>{thisPostData.title}</h5>
                <input 
                    type="text" 
                    placeholder={thisPostData.title} 
                    value={title}
                    onChange={(e)=>setTitle(e.target.value)}
                />
                <input 
                    type="text" 
                    placeholder={thisPostData.body}
                    value={body}
                    onChange={(e)=>setBody(e.target.value)} 
                />
                <div className="edit-form-buttons">
                    <button className="btn waves-effect waves-light #607d8b blue-grey"
                        onClick={()=>Cancel()}
                    >
                        Cancel
                    </button>
                    <button className="btn waves-effect waves-light #607d8b blue-grey"
                        onClick={()=>updatePost()}
                    >
                        Update Post
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditPost;