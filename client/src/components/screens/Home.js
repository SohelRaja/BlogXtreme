import React,{useState, useEffect, useContext, useRef} from 'react';
import M from 'materialize-css';
import ReactTooltip from "react-tooltip";

import {UserContext} from './../../App';

const Home = () => {
    const deletePostModal = useRef(null);

    const [data, setData] = useState([]);
    const [deletePostInfo,setDeletePostInfo] = useState([]);
    const {state, dispatch} = useContext(UserContext);
    useEffect(()=>{
        M.Modal.init(deletePostModal.current);
        fetch('/allpost',{
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then((result)=>{
            setData(result.posts);
            // console.log(result)
        }).catch(err=>{
            console.log(err);
        });
    },[]);

    const deletePost = (postId)=>{
        fetch(`/deletepost/${postId}`,{
            method: "delete",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt") 
            }
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            const newData = data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData);
            M.toast({html: "Successfully deleted", classes: "#607d8b blue-grey"});
        })
    }
    return (
        <div className="home">
            <div className="container intro-home">
                <h6>Name: <b>Sohel Raja Molla</b></h6>
                <h6>University Roll No.: <b>10900117037</b></h6>
                <h6>University Reg. No.: <b>171090110091</b></h6>
                <h6>Class Roll No.: <b>22</b>, Section: <b>A</b>, Year: <b>4<sup>th</sup></b>.</h6>
                <h6>Subject: <b>Designing Lab Project.</b></h6>
                <h6>College: <b>Netaji Subhash Engi. Clg.</b></h6>
            </div>
            {
                data.map(item=>{
                    return(
                        <div className="card home-card #90a4ae blue-grey lighten-2" key={item._id}>
                            <div className="home-card-heading">
                                <div>
                                    <img src={item.postedBy.pic} alt="profile-pic"/>
                                </div>
                                <div>
                                    <h5 className="home-card-title">
                                        &nbsp;{item.postedBy.name}
                                        {item.postedBy._id === state._id &&
                                            <i className="material-icons delete-icon modal-trigger"
                                                data-target="delete-post-modal"
                                                onClick={()=>setDeletePostInfo(item)}
                                            >delete</i>
                                        }
                                    </h5>
                                    
                                </div>
                            </div>
                            <div className="card-image">
                                <img src={item.photo} alt="pic" />
                            </div>
                            <div className="card-content">
                                <h6 className="truncate" style={{color: "#ffffff"}}><b>{item.title}</b></h6>
                                <p className="truncate" style={{color: "#ffffff"}}>{item.body}</p><br/>
                            </div>
                        </div>
                    );
                })
            }
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
        </div>
    );
}

export default Home;