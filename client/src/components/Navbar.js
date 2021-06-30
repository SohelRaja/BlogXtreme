import React, {useContext} from 'react';
import {Link, useHistory} from 'react-router-dom';
import M from 'materialize-css';

import {UserContext} from '../App';

const NavBar = () => {
    const {state, dispatch} = useContext(UserContext);
    const history = useHistory();
    let sidenav = document.querySelector('.sidenav');
    M.Sidenav.init(sidenav, {});
    const user = JSON.parse(localStorage.getItem('user'));

    const renderList = () => {
        if(state){
            return [
                <li key="1"><Link to="/profile">Profile</Link></li>,
                <li key="2"><Link to="/create">Create post</Link></li>,
                <li key="3">
                    <button className="btn waves-effect waves-light #607d8b blue-grey logout-button"
                        onClick={()=>{
                            localStorage.clear();
                            dispatch({type: "CLEAR"});
                            M.toast({html: "Successfully logged out.", classes: "#607d8b blue-grey"});
                            history.push('/signin');
                        }}
                    >
                        Logout
                    </button>
                </li>
            ];
        }else{
            return [
                <li key="4"><Link to="/signin">Sign in</Link></li>,
                <li key="5"><Link to="/signup">Sign up</Link></li>
            ];
        }
    }
    return (
        <nav className="#90a4ae blue-grey lighten-2 mynavbar">
            <div className="nav-wrapper container">
            <Link to={state ? "/":"/signin"} className="brand-logo left">
                <img src="logo.png" style={{
                    height: "95px",
                    width: "230px",
                    position: "absolute",
                    top: ".01rem"
                }}/>
            </Link>
            {
                user ? 
                <Link className="sidenav-trigger right" data-target="mobile-menu" to="">
                    <i className="material-icons">menu</i>
                </Link> : ""
            }
            <ul id="nav-mobile" className="right hide-on-med-and-down">
                {renderList()}
            </ul>
            <ul className="sidenav #90a4ae blue-grey lighten-2" id="mobile-menu">
                <li>
                    <div className="user-view">
                        { user ?
                        <>
                            <div>
                            <Link to="/profile"><img className="circle" src={user.pic} alt={user.name} /></Link>
                            <Link to="/profile"><span className="sidenav-info name">{user.name}</span></Link>
                                <span className="sidenav-info email">{user.email}</span><hr/>
                            </div>
                        </>
                        :
                        <>
                            <div>
                                <span className="sidenav-info name"><b>BlogXtreme</b></span>
                                <hr/>
                            </div>
                        </>
                        }
                    </div>
                </li>
                {renderList()}
            </ul>
            </div>
        </nav>
    );
}

export default NavBar;