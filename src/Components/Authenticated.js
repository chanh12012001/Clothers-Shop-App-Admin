import React, {useState} from 'react'
import { firebaseAuth } from '../firebase';
import { Redirect } from 'react-router-dom';

const Authenticated = (props) => {
    const [LoggedIn, setLoggedIn] = useState(null);

    firebaseAuth.onAuthStateChanged((user)=>{
        if(user){
            setLoggedIn(true)
        }else{
            setLoggedIn(false)
        }
    })

    if(props.nonAuthenticated){
        if(LoggedIn == null){
            return "Đang tải trang..."
        }else if(!LoggedIn){
            return props.children
        }else if(LoggedIn){
            return <Redirect to ="/" />;
        }
    }else{
        if(LoggedIn == null){
            return "Đang tải trang..."
        }else if(LoggedIn){
            return props.children
        }else if(!LoggedIn){
            return <Redirect to ="/login" />;
        }
    }
};

export default Authenticated
