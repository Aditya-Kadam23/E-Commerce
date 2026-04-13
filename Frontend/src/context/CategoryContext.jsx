import {createContext, useState} from 'react';

//context is used to share data across multiple components without prop drilling

export const CategoryContext = createContext(); //we created a context object using createContext function

export const CategoryProvider = ({children}) => {
    const [selectedCategory, setSelectedCategory] = useState(""); // state to hold the selected category
    const [searchItems, setSearchItems] = useState(""); // state to hold the search query

    return (
        <CategoryContext.Provider value={{selectedCategory, setSelectedCategory,searchItems,setSearchItems}}>
            {children} {/* this will render the child components that are wrapped by this provider */}
        </CategoryContext.Provider>
    );

};