import { Status } from '../../../constants';
import { useAppContext }from '../../../contexts/Context'
import { setupNewGame } from '../../../reducer/actions/game';
import './GameEnds.css'

// Defines the GameEnds component as a functional component
const GameEnds = ({onClosePopup}) => {
    // Destructuring the appState and dispatch from the useAppContext hook
    const { appState : {status} , dispatch } = useAppContext();
    
    // Checks if the status is 'ongoing' or 'promoting'; if true, returns null, effectively hiding the component
    if (status === Status.ongoing || status === Status.promoting)
        return null

    // Defines the newGame function, which dispatches the setupNewGame action
    const newGame = () => {
        dispatch(setupNewGame())
    }

    // Checks if the status ends with 'wins'; if true, sets isWin to true, otherwise sets it to false
    const isWin = status.endsWith('wins')

    // Renders the component with the game end message and a button to start a new game
    return <div className="popup--inner popup--inner__center">
        <h1>{isWin ? status : 'Draw'}</h1>
        <p>{!isWin && status}</p>
        <div className={`${status}`}/>
        <button onClick={newGame}>New Game</button>
    </div>
   
}

export default GameEnds