export const getCharacter = file => String.fromCharCode(file + 96)
/**
 * Creates the initial chessboard position.
 * @returns {Array} The 2D array representing the chessboard position.
 */
export const createPosition = () => {

    const position = new Array(8).fill('').map(x => new Array(8).fill(''))

    // Set up the starting position for pawns
    for (let i = 0; i < 8; i++) {
        position[6][i] = 'bp'
        position[1][i] = 'wp'
    }
    

    // Set up starting position for other pieces
    position[0][0] = 'wr'
    position[0][1] = 'wn'
    position[0][2] = 'wb'
    position[0][3] = 'wq'
    position[0][4] = 'wk'
    position[0][5] = 'wb'
    position[0][6] = 'wn'
    position[0][7] = 'wr'
    
    position[7][0] = 'br'
    position[7][1] = 'bn'
    position[7][2] = 'bb'
    position[7][3] = 'bq'
    position[7][4] = 'bk'
    position[7][5] = 'bb'
    position[7][6] = 'bn'
    position[7][7] = 'br'

    

    return position
}

/**
 * Creates a copy of the given chessboard position.
 * @param {Array} position - The 2D array representing the chessboard position.
 * @returns {Array} The copied chessboard position.
 */
export const copyPosition = position => {
    const newPosition = 
        new Array(8).fill('').map(x => new Array(8).fill(''))

    for (let rank = 0; rank < position.length; rank++) {
        for (let file = 0; file < position[0].length; file++) {
            newPosition[rank][file] = position[rank][file]
        }
    }

    return newPosition
}


export const areSameColorTiles = (coords1,coords2) => 
    (coords1.x + coords1.y) % 2 === (coords2.x + coords2.y)


/**
 * Finds the coordinates of all occurrences of a specific chess piece in the given position.
 * @param {Array} position - The 2D array representing the chessboard position.
 * @param {string} type - The type of chess piece to search for.
 * @returns {Array} An array of objects containing the coordinates (x, y) of each occurrence of the specified chess piece.
 */
export const findPieceCoords = (position,type) => {
    let results = []
    position.forEach((rank,i) => {
        rank.forEach((pos,j) => {
            if (pos === type)
                results.push({x: i, y: j})
        })
    });
    return results
}

/**
 * Generates the algebraic notation for a chess move based on the given parameters.
 * @param {Object} moveInfo - Object containing information about the move.
 * @param {string} moveInfo.piece - The piece being moved.
 * @param {number} moveInfo.rank - The rank (row) of the starting position.
 * @param {number} moveInfo.file - The file (column) of the starting position.
 * @param {number} moveInfo.x - The rank (row) of the destination position.
 * @param {number} moveInfo.y - The file (column) of the destination position.
 * @param {Array} moveInfo.position - The 2D array representing the chessboard position.
 * @param {string} [moveInfo.promotesTo] - The piece the pawn promotes to (optional).
 * @returns {string} The algebraic notation for the chess move.
 */
export const getNewMoveNotation = ({piece,rank,file,x,y,position,promotesTo}) => {
    let note = ''

    rank = Number(rank)
    file = Number(file)
    if (piece[1] === 'k' && Math.abs(file-y) === 2){
        if (file < y)
            return 'O-O' // King-side castle
        else
            return 'O-O-O' // Queen-side castle
    }

    if(piece[1] !== 'p'){
        note+=piece[1].toUpperCase() // Use uppercase for non-pawn pieces 
        if(position[x][y]){
            note+='x'  // Capture notation if the destination position is occupied
        }
    }
    else if (rank !==x && file !== y ){
        note+=getCharacter(file+1)+'x' // Capture notation for pawn moves
    }

    note+=getCharacter(y+1)+(x+1) // Destination position notation

    if(promotesTo)
        note += '=' + promotesTo.toUpperCase() // Promotion notation

    return note
}