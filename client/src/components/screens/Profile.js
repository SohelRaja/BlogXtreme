import React, {useEffect, useState, useContext, useRef} from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';
import ReactTooltip from "react-tooltip";

import {UserContext} from '../../App';

const Profile = () => {
    const editNameModal = useRef(null);
    const changePasswordModal = useRef(null);
    const deletePostModal = useRef(null);
    const profileDropdown = useRef(null);
    const history = useHistory();

    const [myposts,setPosts] = useState([]);
    const {state, dispatch} = useContext(UserContext);
    const [url,setUrl] = useState(undefined);
    const [name,setName] = useState("");
    const [password,setPassword] = useState("");
    const [prevPassword,setPrevPassword] = useState("");
    const [deletePostInfo,setDeletePostInfo] = useState([]);
    useEffect(()=>{
        M.Modal.init(editNameModal.current);
        M.Modal.init(changePasswordModal.current);
        M.Modal.init(deletePostModal.current);
        M.Dropdown.init(profileDropdown.current,{inDuration: 300, outDuration: 225});

        fetch('/mypost',{
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then((result)=>{
            setPosts(result.myposts);
            localStorage.setItem("post", JSON.stringify(result.myposts));
        }).catch(err=>{
            console.log(err);
        });
    },[]);
    useEffect(()=>{
        if(url){
            // Update Request to Backend
            fetch('/updatepic',{
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    pic: url
                })
            }).then(res=>res.json())
            .then(result=>{
                if(result.error){
                    M.toast({html: result.error, classes: "#f44336 red"});
                }else{
                    localStorage.setItem("user", JSON.stringify({...state, pic: result.pic}));
                    dispatch({type:"UPDATEPIC", payload:{pic: result.pic}});
                    M.toast({html: "Profile pic updated!", classes: "#607d8b blue-grey"});
                }
            })
        }
    },[url]);
    const updatePhoto = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () =>{
            setUrl(reader.result);
        }
    }
    const updateName = () => {
        fetch('/updatename',{
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                name: name.trim()
            })
        }).then(res=>res.json())
        .then(result=>{
            if(result.error){
                M.toast({html: result.error, classes: "#f44336 red"});
            }else{
                localStorage.setItem("user", JSON.stringify({...state, name: result.name}));
                dispatch({type:"UPDATENAME", payload:{name: result.name}});
                M.toast({html: "Profile name updated!", classes: "#607d8b blue-grey"});
            }
        })
    }
    const changePassword = () => {
        fetch('/changepassword',{
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                prev: prevPassword,
                password
            })
        }).then(res=>res.json())
        .then(result=>{
            if(result.error){
                M.toast({html: result.error, classes: "#f44336 red"});
            }else{
                M.toast({html: result.message, classes: "#607d8b blue-grey"});
            }
        })
    }
    const makePublic = (id) => {
        fetch('/makepublic',{
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res=>res.json())
        .then((result)=>{
            // console.log(result);
            const updatedMyPosts = myposts.map(item=>{
                if(item._id === result._id){
                    return result;
                }else{
                    return item;
                }
            })
            setPosts(updatedMyPosts);
            M.toast({html: "Updated to public mode", classes: "#607d8b blue-grey"});
        }).catch(err=>{
            console.log(err);
        });
    }
    const makePrivate = (id) => {
        fetch('/makeprivate',{
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res=>res.json())
        .then((result)=>{
            // console.log(result);
            const updatedMyPosts = myposts.map(item=>{
                if(item._id === result._id){
                    return result;
                }else{
                    return item;
                }
            })
            setPosts(updatedMyPosts);
            M.toast({html: "Updated to private mode", classes: "#607d8b blue-grey"});
        }).catch(err=>{
            console.log(err);
        });
    }
    const deletePost = (postId)=>{
        fetch(`/deletepost/${postId}`,{
            method: "delete",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt") 
            }
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            const updatedMyPosts = myposts.filter(item=>{
                return item._id !== result._id
            })
            setPosts(updatedMyPosts);
            M.toast({html: "Successfully deleted", classes: "#607d8b blue-grey"});
        })
    }
    return (
        <div className="profile">
            <br/>
            <div className="profile-card" style={{borderBottom:"2px solid #ffffff"}}>
                <div className="profile-card-plate">
                    <div className="profile-pic-plate">
                        <img className="profile-pic" src={state? state.pic: "loading.."} alt="profile-pic"/>
                        <div className="file-upload file-field input-field update-pic" style={{margin: "10px"}}>
                            <div className="btn-floating #ffffff white upload-pic-button">
                                <i className="material-icons" style={{color: "#607d8b"}}>photo_camera</i>
                                <input type="file" accept='image/*' onChange={(e)=>updatePhoto(e.target.files[0])} />
                            </div>
                            <div className="file-path-wrapper">
                                <input className="file-path validate" type="text" />
                            </div>
                        </div>
                    </div>
                    <div className="profile-info">
                        <h5 className="profile-info-profilename">
                            {state? state.name : "loading..."}
                            <i  
                                ref={profileDropdown}
                                data-target='profile-dropdown'
                                className="material-icons dropdown-trigger profile-setting-tag"
                                data-tip="More" data-background-color="#607d8b"
                            >more_vert</i>
                            <ReactTooltip />
                        </h5>
                        <h6 style={{color:"#ffffff"}}>{state? state.email : "loading..."}</h6>
                        <div className="profile-sub-info">
                            <h6 style={{color: "#ffffff"}}><b style={{color: "#ffffff"}}>{myposts.length}</b> posts</h6>
                        </div>
                        <div className="add-post-plate">
                            <Link to="/create"><i className="material-icons">add</i> <span>Add Post</span></Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row profile-gallery">
                {
                    myposts ?
                    myposts.map(item=>{
                        return(
                            <div className="col s12 m6 profile-gallery-item" key={item._id}>
                                <div className="card #90a4ae blue-grey lighten-2">
                                    <div className="card-image">
                                        <img src={item.photo} alt={item.title} />
                                        <span className="card-title">
                                            {item.title.length > 10 ? item.title.substring(0,10):item.title.substring(0,item.title.length)}{item.title.length > 10?"...":""}
                                        </span>
                                        {item.privacy==="private"? 
                                        <span className="btn-floating profile-lock waves-effect waves-light #607d8b blue-grey"
                                            onClick={()=>makePublic(item._id)}
                                        ><i className="material-icons">lock</i></span>
                                        :<span className="btn-floating profile-lock waves-effect waves-light #607d8b blue-grey"
                                            onClick={()=>makePrivate(item._id)}
                                        ><i className="material-icons">lock_open</i></span>}
                                        <span className="btn-floating halfway-fab waves-effect waves-light profile-delete modal-trigger"
                                            data-target="delete-post-modal"
                                            onClick={()=>setDeletePostInfo(item)}
                                        ><i className="material-icons">delete</i></span>
                                        <Link to={`/editpost/${item._id}`}><span className="btn-floating halfway-fab waves-effect waves-light #607d8b blue-grey"><i className="material-icons">edit</i></span></Link>
                                    </div>
                                    <div className="card-content">
                                        <span style={{color:"#ffffff"}}><b>{item.privacy==="private"? "Private Mode" : "Public Mode"}</b></span>
                                        <p style={{color: "#ffffff"}}>{item.body.length > 25 ? item.body.substring(0,25):item.body.substring(0,item.body.length)}{item.body.length > 25?"...":""}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    }) : "loading..."
                }
            </div>
            <div id="edit-name-modal" className="modal" ref={editNameModal} style={{color: "#607d8b"}}>
                <div className="modal-content">
                    <h4>Update Profile Name</h4>
                    <input 
                        type='text'
                        placeholder={state? state.name : "loading..."}
                        value={name ? name : ""}
                        onChange={(e)=>setName(e.target.value)}
                    />
                </div>
                <div className="modal-footer">
                    <button className="modal-close waves-effect waves-green btn-flat" 
                        onClick={()=>{
                            setName("");
                        }}
                    >Close</button>
                   <button className="waves-effect waves-green btn-flat" 
                    onClick={()=>{
                        updateName();
                        M.Modal.getInstance(editNameModal.current).close();
                        setName("");
                    }}
                   >Update</button>
                </div>
            </div>
            <div id="change-password-modal" className="modal" ref={changePasswordModal} style={{color: "#607d8b"}}>
                <div className="modal-content">
                    <h4>Change Password</h4>
                    <input 
                        type='text'
                        placeholder="Enter your previous password"
                        value={prevPassword}
                        onChange={(e)=>setPrevPassword(e.target.value)}
                    />
                    <input 
                        type='text'
                        placeholder="Enter your new password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                </div>
                <div className="modal-footer">
                    <button className="modal-close waves-effect waves-green btn-flat" 
                        onClick={()=>{
                            setPassword("");
                            setPrevPassword("");
                        }}
                    >Close</button>
                   <button className="waves-effect waves-green btn-flat" 
                    onClick={()=>{
                        changePassword();
                        M.Modal.getInstance(changePasswordModal.current).close();
                        setPassword("");
                        setPrevPassword("");
                    }}
                   >Change Password</button>
                </div>
            </div>
            <div id="delete-post-modal" className="modal" ref={deletePostModal} style={{color: "#607d8b"}}>
                <div className="modal-content">
                    <h4>Delete Post</h4>
                    <h6 className="truncate">Do you want to delete <b>{deletePostInfo.title}</b> ?</h6>
                </div>
                <div className="modal-footer">
                    <button className="modal-close waves-effect waves-green btn-flat" 
                        onClick={()=>{
                            setDeletePostInfo([]);
                        }}
                    >Close</button>
                   <button className="waves-effect waves-green btn-flat" 
                    onClick={()=>{
                        deletePost(deletePostInfo._id);
                        setDeletePostInfo([]);
                        M.Modal.getInstance(deletePostModal.current).close();
                    }}
                   >Delete</button>
                </div>
            </div>
            <div>
                <ul id='profile-dropdown' className='dropdown-content'>
                    <li key="1">
                        <Link to="/create">Create Post</Link>
                    </li>
                    <li key="2">
                        <span 
                            data-target="edit-name-modal" 
                            className="modal-trigger"
                        >Change Profile Name</span>
                    </li>
                    <li key="4">
                        <span 
                            data-target="change-password-modal" 
                            className="modal-trigger"
                        >Change Password</span>
                    </li>
                    <li 
                        key="5"
                        onClick={()=>{
                            localStorage.clear();
                            dispatch({type: "CLEAR"});
                            M.toast({html: "Successfully logged out.", classes: "#607d8b blue-grey"});
                            history.push('/signin');
                        }}
                    >
                        <Link to='/signin'><i className="material-icons">exit_to_app</i>Log Out</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Profile;