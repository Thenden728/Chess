import { copyPosition } from "../helper"

/**
 * Moves a chess piece on the board and returns the new position after the move.
 *
 * @param {Object} params - Object containing the following properties:
 *   - position (Array): The current position array representing the chessboard.
 *   - piece (String): The piece being moved.
 *   - rank (Number): The rank (row) of the piece's current position.
 *   - file (Number): The file (column) of the piece's current position.
 *   - x (Number): The rank (row) of the piece's destination position.
 *   - y (Number): The file (column) of the piece's destination position.
 * @returns {Array} - The new position array after moving the piece.
 */
export const movePiece = ({position,piece,rank,file,x,y}) => {
    // Create a copy of the current position array
    const newPosition = copyPosition(position)

    if(piece.endsWith('k') && Math.abs(y - file) > 1){ // Castles
        //Castling move
        if (y === 2){ // Castles Long
            newPosition[rank][0] = ''
            newPosition[rank][3] = piece.startsWith('w') ? 'wr' : 'br'
        }
        if (y === 6){ // Castles Short
            newPosition[rank][7] = ''
            newPosition[rank][5] = piece.startsWith('w') ? 'wr' : 'br'
        }
    }
    
    // UPdate the position array with the moved piece
    newPosition[rank][file] = ''
    newPosition[x][y] = piece
    return newPosition
}

/**
 * Moves a pawn on the chessboard and returns the new position after the move.
 *
 * @param {Object} params - Object containing the following properties:
 *   - position (Array): The current position array representing the chessboard.
 *   - piece (String): The pawn being moved.
 *   - rank (Number): The rank (row) of the pawn's current position.
 *   - file (Number): The file (column) of the pawn's current position.
 *   - x (Number): The rank (row) of the pawn's destination position.
 *   - y (Number): The file (column) of the pawn's destination position.
 * @returns {Array} - The new position array after moving the pawn.
 */
export const movePawn = ({position,piece,rank,file,x,y}) => {
    const newPosition = copyPosition(position)

    // EnPassant, looks like capturing an empty cell
    // Detect and delete the pawn to be removed
    if (!newPosition[x][y] && x !== rank && y !== file) 
        newPosition[rank][y] = ''

    // Update the possition array with the moved pawn
    newPosition[rank][file] = ''
    newPosition[x][y] = piece
    return newPosition
}