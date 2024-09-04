import React, { createContext, useState } from 'react'

//DataContext / DataProvider used to help the two components communicate with clips.
export const DataContext = createContext();
export const DataProvider = ({ children }) => {
    const [slug, setSlug] = useState("")
    const [clips, setClips] = useState([]);
    return( //Provides the two useStates to both children 
        <DataContext.Provider value={{clips, setClips, slug, setSlug }}> 
            {children}
        </DataContext.Provider>
    )
}