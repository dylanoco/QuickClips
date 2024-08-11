import { useEffect, useState, useContext } from 'react'


function userDisplay(props){
    const loggedIn = props.loggedIn
    return(
        <div className='user-logged-in'>
            <img></img>
            <p></p>
        </div>
        )
}
export default userDisplay 