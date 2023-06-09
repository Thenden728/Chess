import React from 'react';
import { Status } from '../../constants';
import { useAppContext }from '../../contexts/Context'
import { closePopup } from '../../reducer/actions/popup';
// import PromotionBox from './PromotionBox/PromotionBox'
import './Popup.css'

// Defines the Popup component as a functional component
const Popup = ({children}) => {
    // Destructuring the appState and dispatch from the useAppContext hook
    const { appState : {status}, dispatch } = useAppContext();

    // Defines the onClosePopup function, which dispatches the closePopup action
    const onClosePopup = () => {
        dispatch(closePopup())
    }

    // Checks if the status is 'ongoing'; if true, returns null, effectively hiding the popup
    if (status === Status.ongoing)
        return null

    // Renders the popup with the provided children components
    return <div className="popup">
        {React.Children
            .toArray(children)
            .map (child => React.cloneElement(child, { onClosePopup }))}
    </div>
}

export default Popup