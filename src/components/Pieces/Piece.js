import arbiter from '../../arbiter/arbiter';
import { useAppContext } from '../../contexts/Context'
import { generateCandidates } from '../../reducer/actions/move';

/**
 * Represents a chess piece component with drag and drop functionality.
 * @param {Object} props - The properties passed to the Piece component.
 * @param {number} props.rank - The rank (row) of the piece on the chessboard.
 * @param {number} props.file - The file (column) of the piece on the chessboard.
 * @param {string} props.piece - The identifier of the piece (e.g., 'wp' for white pawn).
 * @returns {JSX.Element} The rendered Piece component.
 */
const Piece = ({
    rank,
    file,
    piece,
}) => {

    // Access the app state and dispatch function using the useAppContext hook
    const { appState, dispatch } = useAppContext();
    const { turn, castleDirection, position: currentPosition } = appState

    /**
   * Event handler for drag start event.
   * @param {DragEvent} e - The drag event object.
   */
    const onDragStart = e => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", `${piece},${rank},${file}`)
        setTimeout(() => {
            e.target.style.display = 'none'
        }, 0)

        // Generate candidate moves if it's the current player's turn
        if (turn === piece[0]) {
            const candidateMoves =
                arbiter.getValidMoves({
                    position: currentPosition[currentPosition.length - 1],
                    prevPosition: currentPosition[currentPosition.length - 2],
                    castleDirection: castleDirection[turn],
                    piece,
                    file,
                    rank
                })
            dispatch(generateCandidates({ candidateMoves }))
        }

    }
    /**
   * Event handler for drag end event.
   * @param {DragEvent} e - The drag event object.
   */

    const onDragEnd = e => {
        e.target.style.display = 'block'
    }

    return (
        <div
            className={`piece ${piece} p-${file}${rank}`}
            draggable={true}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}

        />)
}

export default Piece