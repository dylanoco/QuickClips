import React, { createContext, useState } from 'react'

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [slug, setSlug] = useState("")
    const [clips, setClips] = useState([]);
    return(
        <DataContext.Provider value={{clips, setClips, slug, setSlug }}>
            {children}
        </DataContext.Provider>
    )
}