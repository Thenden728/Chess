import './Board.css'
import { useAppContext } from '../../contexts/Context'

import Ranks from './bits/Ranks'
import Files from './bits/Files'
import Pieces from '../Pieces/Pieces'
import PromotionBox from '../Popup/PromotionBox/PromotionBox'
import Popup from '../Popup/Popup'
import GameEnds from '../Popup/GameEnds/GameEnds'

import arbiter from '../../arbiter/arbiter'
import { getKingPosition } from '../../arbiter/getMoves'

const Board = () => {
    // Defines the ranks and files arrays to represent the chessboard grid
    const ranks = Array(8).fill().map((x, i) => 8 - i)
    const files = Array(8).fill().map((x, i) => i + 1)

    // Uses the useAppContext hook to access the app state from the app context
    const { appState } = useAppContext();
    const position = appState.position[appState.position.length - 1]

    // Determines the tile position where the king is in check, if any
    const checkTile = (() => {
        const isInCheck = (arbiter.isPlayerInCheck({
            positionAfterMove: position,
            player: appState.turn
        }))

        if (isInCheck)
            return getKingPosition(position, appState.turn)

        return null
    })()

    // Determines the CSS class name for a given tile based on its position and game state
    const getClassName = (i, j) => {
        let c = 'tile'
        c += (i + j) % 2 === 0 ? ' tile--dark ' : ' tile--light '
        if (appState.candidateMoves?.find(m => m[0] === i && m[1] === j)) {
            if (position[i][j])
                c += ' attacking'
            else
                c += ' highlight'
        }

        if (checkTile && checkTile[0] === i && checkTile[1] === j) {
            c += ' checked'
        }

        return c
    }

    // Renders the Board component with its child components
    return <div className='board'>

        <Ranks ranks={ranks} />

        <div className='tiles'>
            {ranks.map((rank, i) =>
                files.map((file, j) =>
                    <div
                        key={file + '' + rank}
                        i={i}
                        j={j}
                        className={`${getClassName(7 - i, j)}`}>
                    </div>
                ))}
        </div>

        <Pieces />

        <Popup>
            <PromotionBox />
            <GameEnds />
        </Popup>

        <Files files={files} />

    </div>

}

export default Board