import React, {useContext} from 'react';
import {Link} from 'react-router-dom';

import {UserContext} from '../../App';

const NotFoundPage = ()=>{
    const {state, dispatch} = useContext(UserContext);
    return(
        <div className="box-layout">
            <div className="box-layout-box">
                <h1 className="box-layout-title">404!</h1>
                <h4>Page Not Found.</h4><br/>
                <Link to={state ? "/":"/signin"}>
                    <button className="btn waves-effect waves-light #5e35b1 deep-purple darken-1">
                        <i className="material-icons" aria-hidden="true">keyboard_backspace</i>&nbsp;&nbsp;Back to Track
                    </button>
                </Link>
            </div>
        </div>
    )
};

export default NotFoundPage;