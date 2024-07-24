import React, { createContext, useState } from 'react'

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [slug, setSlug] = useState("")

    return(
        <DataContext.Provider value={{slug, setSlug}}>
            {children}
        </DataContext.Provider>
    )
}