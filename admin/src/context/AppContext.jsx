import { createContext } from "react";

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const calculateAge = (dob) => {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        return age
    }
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const slotDateFormate = (dateString) => {
        if (!dateString) return "Invalid Date";
        const [day, month, year] = dateString.split('-'); // Assuming "DD-MM-YYYY" format
        return `${day} ${months[parseInt(month, 10) - 1]} ${year}`;
    };

    const value ={
        calculateAge,
        slotDateFormate
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider