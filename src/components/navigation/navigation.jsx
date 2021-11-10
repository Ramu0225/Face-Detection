import React from "react";
import Logo from "../logo/logo";
import './navigation.styles.css';

const Navigation =({onRouteChange, isSignedIn})=>{
    
        if(isSignedIn){
            return(
                    <nav style={{display: 'flex', justifyContent:'flex-end'}}>
                        <p onClick= {() => onRouteChange('signout')} className= 'f3 link dim black underline pa3 pointer'>Sign Out</p>
                    </nav>
            );
        }else{
            return(
                <div className="navbar"> 
                <Logo />
                <nav style={{display: 'flex', justifyContent:'flex-end'}}>
                
                    <p onClick= {() => onRouteChange('signin')} className= 'f3 link dim black underline pa3 pointer'>Sign in</p>
                    <p onClick= {() => onRouteChange('register')} className= 'f3 link dim black underline pa3 pointer'>Register</p>
                </nav>
                </div>
               
                );
            }
        
    
}

export default Navigation;