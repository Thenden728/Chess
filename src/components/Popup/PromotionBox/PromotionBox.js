import { useAppContext }from '../../../contexts/Context'
import { copyPosition, getNewMoveNotation,  } from '../../../helper';
import { makeNewMove , clearCandidates } from '../../../reducer/actions/move';
import './PromotionBox.css'

const PromotionBox = ({onClosePopup}) => {

    const { appState , dispatch } = useAppContext();
    const {promotionSquare} = appState;

    // Checks if there is no promotionSquare in the appState; if true, returns null, effectively hiding the component
    if (!promotionSquare)
        return null

    // Determines the color based on the promotionSquare's x-coordinate
    const color = promotionSquare.x === 7 ? 'w' : 'b'
    // Defines the promotion options as an array of piece types
    const options = ['q','r','b','n']

    // Defines the position style of the promotion box based on the promotionSquare's coordinates
    const getPromotionBoxPosition = () => {
        let style = {}

        if (promotionSquare.x === 7) {
            style.top = '-12.5%'
        }
        else{
            style.top = '97.5%'
        }

        if (promotionSquare.y <= 1){
            style.left = '0%'
        }
        else if (promotionSquare.y >= 5){
            style.right = '0%'
        }
        else {
            style.left = `${12.5*promotionSquare.y - 20}%`
        }

        return style
    }

    // Handles the onClick event for each promotion option
    const onClick = option => {
        onClosePopup()
        const newPosition = copyPosition (appState.position[appState.position.length - 1])
        
        newPosition[promotionSquare.rank][promotionSquare.file] = ''
        newPosition[promotionSquare.x][promotionSquare.y] = color+option
        const newMove = getNewMoveNotation({
            ...appState.selectedPiece,
            x : promotionSquare.rank,
            y : promotionSquare.file,
            position:appState.position[appState.position.length - 1],
            promotesTo : option
        })
        dispatch(clearCandidates())

        dispatch(makeNewMove({newPosition,newMove}))

    }

    // Renders the component with the promotion options as clickable pieces
    return <div className="popup--inner promotion-choices" style={getPromotionBoxPosition()}>
        {options.map (option => 
            <div key={option}
                onClick = {() => onClick(option)} 
                className={`piece ${color}${option}`}
            />
        )}
    </div>

}

export default PromotionBox