import arbiter from "./arbiter"

/**
 * Calculates the valid moves for a rook piece on the chessboard.
 *
 * @param {Object} params - The parameters object.
 * @param {Array} params.position - The current position array representing the chessboard.
 * @param {String} params.piece - The piece identifier ('wr' for white rook, 'br' for black rook).
 * @param {Number} params.rank - The rank (row) index of the rook on the chessboard.
 * @param {Number} params.file - The file (column) index of the rook on the chessboard.
 * @returns {Array} - An array of valid moves for the rook.
 */
export const getRookMoves = ({ position, piece, rank, file }) => {
    const moves = []
    const us = piece[0]
    const enemy = us === 'w' ? 'b' : 'w'

    const direction = [
        [-1, 0], // UP
        [1, 0], // DOWN
        [0, -1], // LEFT
        [0, 1], // RIGHT
    ]

    direction.forEach(dir => {
        for (let i = 1; i <= 8; i++) {
            const x = rank + (i * dir[0])
            const y = file + (i * dir[1])

            // Check if position is out of bounds
            if (position?.[x]?.[y] === undefined)
                break

            if (position[x][y].startsWith(enemy)) {
                moves.push([x, y])
                break;
            }

            if (position[x][y].startsWith(us)) {
                break
            }
            moves.push([x, y])
        }
    })

    return moves
}

/**
 * Calculates the valid moves for a knight piece on the chessboard.
 * @param {Object} options - The options object.
 * @param {Array} options.position - The current position of the chessboard represented as a 2D array.
 * @param {number} options.rank - The rank (row) of the knight on the chessboard.
 * @param {number} options.file - The file (column) of the knight on the chessboard.
 * @returns {Array} An array of valid moves for the knight.
 */
export const getKnightMoves = ({ position, rank, file }) => {
    const moves = []
    const enemy = position[rank][file].startsWith('w') ? 'b' : 'w'

    const candidates = [
        [-2, -1],
        [-2, 1],
        [-1, -2],
        [-1, 2],
        [1, -2],
        [1, 2],
        [2, -1],
        [2, 1],
    ]
    candidates.forEach(c => {
        const cell = position?.[rank + c[0]]?.[file + c[1]]
        if (cell !== undefined && (cell.startsWith(enemy) || cell === '')) {
            moves.push([rank + c[0], file + c[1]])
        }
    })
    return moves
}

/**
 * Calculates the valid moves for a bishop piece on the chessboard.
 * @param {Object} options - The options object.
 * @param {Array} options.position - The current position of the chessboard represented as a 2D array.
 * @param {string} options.piece - The piece identifier (e.g., 'wb' for white bishop).
 * @param {number} options.rank - The rank (row) of the bishop on the chessboard.
 * @param {number} options.file - The file (column) of the bishop on the chessboard.
 * @returns {Array} An array of valid moves for the bishop.
 */
export const getBishopMoves = ({ position, piece, rank, file }) => {
    const moves = []
    const us = piece[0]
    const enemy = us === 'w' ? 'b' : 'w'

    const direction = [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
    ]

    direction.forEach(dir => {
        for (let i = 1; i <= 8; i++) {
            const x = rank + (i * dir[0])
            const y = file + (i * dir[1])
            if (position?.[x]?.[y] === undefined)
                break
            if (position[x][y].startsWith(enemy)) {
                moves.push([x, y])
                break;
            }
            if (position[x][y].startsWith(us)) {
                break
            }
            moves.push([x, y])
        }
    })
    return moves
}

/**
 * Calculates the valid moves for a queen piece on the chessboard.
 * @param {Object} options - The options object.
 * @param {Array} options.position - The current position of the chessboard represented as a 2D array.
 * @param {string} options.piece - The piece identifier (e.g., 'wq' for white queen).
 * @param {number} options.rank - The rank (row) of the queen on the chessboard.
 * @param {number} options.file - The file (column) of the queen on the chessboard.
 * @returns {Array} An array of valid moves for the queen.
 */
export const getQueenMoves = ({ position, piece, rank, file }) => {
    const moves = [
        ...getBishopMoves({ position, piece, rank, file }),
        ...getRookMoves({ position, piece, rank, file })
    ]

    return moves
}

/**
 * Calculates the valid moves for a king piece on the chessboard.
 * @param {Object} options - The options object.
 * @param {Array} options.position - The current position of the chessboard represented as a 2D array.
 * @param {string} options.piece - The piece identifier (e.g., 'wk' for white king).
 * @param {number} options.rank - The rank (row) of the king on the chessboard.
 * @param {number} options.file - The file (column) of the king on the chessboard.
 * @returns {Array} An array of valid moves for the king.
 */
export const getKingMoves = ({ position, piece, rank, file }) => {
    let moves = []
    const us = piece[0]
    const direction = [
        [1, -1], [1, 0], [1, 1],
        [0, -1], [0, 1],
        [-1, -1], [-1, 0], [-1, 1],
    ]

    direction.forEach(dir => {
        const x = rank + dir[0]
        const y = file + dir[1]
        if (position?.[x]?.[y] !== undefined && !position[x][y].startsWith(us))
            moves.push([x, y])
    })
    return moves
}

/**
 * Calculates the valid moves for a pawn piece on the chessboard.
 * @param {Object} options - The options object.
 * @param {Array} options.position - The current position of the chessboard represented as a 2D array.
 * @param {string} options.piece - The piece identifier (e.g., 'wp' for white pawn).
 * @param {number} options.rank - The rank (row) of the pawn on the chessboard.
 * @param {number} options.file - The file (column) of the pawn on the chessboard.
 * @returns {Array} An array of valid moves for the pawn.
 */
export const getPawnMoves = ({ position, piece, rank, file }) => {

    const moves = []
    const dir = piece === 'wp' ? 1 : -1

    // Move two tiles on first move
    if (rank % 5 === 1) {
        if (position?.[rank + dir]?.[file] === '' && position?.[rank + dir + dir]?.[file] === '') {
            moves.push([rank + dir + dir, file])
        }
    }

    // Move one tile
    if (!position?.[rank + dir]?.[file]) {
        moves.push([rank + dir, file])
    }

    return moves
}

/**
 * Calculates the valid capture moves for a pawn piece on the chessboard.
 * @param {Object} options - The options object.
 * @param {Array} options.position - The current position of the chessboard represented as a 2D array.
 * @param {Array} options.prevPosition - The previous position of the chessboard represented as a 2D array.
 * @param {string} options.piece - The piece identifier (e.g., 'wp' for white pawn).
 * @param {number} options.rank - The rank (row) of the pawn on the chessboard.
 * @param {number} options.file - The file (column) of the pawn on the chessboard.
 * @returns {Array} An array of valid capture moves for the pawn.
 */
export const getPawnCaptures = ({ position, prevPosition, piece, rank, file }) => {

    const moves = []
    const dir = piece === 'wp' ? 1 : -1
    const enemy = piece[0] === 'w' ? 'b' : 'w'

    // Capture enemy to left
    if (position?.[rank + dir]?.[file - 1] && position[rank + dir][file - 1].startsWith(enemy)) {
        moves.push([rank + dir, file - 1])
    }

    // Capture enemy to right
    if (position?.[rank + dir]?.[file + 1] && position[rank + dir][file + 1].startsWith(enemy)) {
        moves.push([rank + dir, file + 1])
    }

    // EnPassant
    // Check if enemy moved twice in last round
    const enemyPawn = dir === 1 ? 'bp' : 'wp'
    const adjacentFiles = [file - 1, file + 1]
    if (prevPosition) {
        if ((dir === 1 && rank === 4) || (dir === -1 && rank === 3)) {
            adjacentFiles.forEach(f => {
                if (position?.[rank]?.[f] === enemyPawn &&
                    position?.[rank + dir + dir]?.[f] === '' &&
                    prevPosition?.[rank]?.[f] === '' &&
                    prevPosition?.[rank + dir + dir]?.[f] === enemyPawn) {
                    moves.push([rank + dir, f])
                }
            })
        }
    }


    return moves
}

/**
 * Calculates the valid castling moves for a king piece on the chessboard.
 * @param {Object} options - The options object.
 * @param {Array} options.position - The current position of the chessboard represented as a 2D array.
 * @param {string} options.castleDirection - The allowed castle direction ('left', 'right', 'both', or 'none').
 * @param {string} options.piece - The piece identifier (e.g., 'wk' for white king).
 * @param {number} options.rank - The rank (row) of the king on the chessboard.
 * @param {number} options.file - The file (column) of the king on the chessboard.
 * @returns {Array} An array of valid castling moves for the king.
 */
export const getCastlingMoves = ({ position, castleDirection, piece, rank, file }) => {
    const moves = []

    // Check if the king is not in the appropriate position for castling
    if (file !== 4 || rank % 7 !== 0 || castleDirection === 'none') {
        return moves
    }

    // Check for white king castling
    if (piece.startsWith('w')) {

        // Check if the white palyer is in check
        if (arbiter.isPlayerInCheck({
            positionAfterMove: position,
            player: 'w'
        })) {
            return moves
        }

        // Left castling
        if (['left', 'both'].includes(castleDirection) &&
            !position[0][3] &&
            !position[0][2] &&
            !position[0][1] &&
            position[0][0] === 'wr' &&
            !arbiter.isPlayerInCheck({
                positionAfterMove: arbiter.performMove({ position, piece, rank, file, x: 0, y: 3 }),
                player: 'w'
            }) &&
            !arbiter.isPlayerInCheck({
                positionAfterMove: arbiter.performMove({ position, piece, rank, file, x: 0, y: 2 }),
                player: 'w'
            })) {
            moves.push([0, 2])
        }
        if (['right', 'both'].includes(castleDirection) &&
            !position[0][5] &&
            !position[0][6] &&
            position[0][7] === 'wr' &&
            !arbiter.isPlayerInCheck({
                positionAfterMove: arbiter.performMove({ position, piece, rank, file, x: 0, y: 5 }),
                player: 'w'
            }) &&
            !arbiter.isPlayerInCheck({
                positionAfterMove: arbiter.performMove({ position, piece, rank, file, x: 0, y: 6 }),
                player: 'w'
            })) {
            moves.push([0, 6])
        }
    }
    else {
        if (arbiter.isPlayerInCheck({
            positionAfterMove: position,
            player: 'b'
        }))
            return moves


        if (['left', 'both'].includes(castleDirection) &&
            !position[7][3] &&
            !position[7][2] &&
            !position[7][1] &&
            position[7][0] === 'br' &&
            !arbiter.isPlayerInCheck({
                positionAfterMove: arbiter.performMove({ position, piece, rank, file, x: 7, y: 3 }),
                position: position,
                player: 'b'
            }) &&
            !arbiter.isPlayerInCheck({
                positionAfterMove: arbiter.performMove({ position, piece, rank, file, x: 7, y: 2 }),
                position: position,
                player: 'b'
            })) {
            moves.push([7, 2])
        }
        if (['right', 'both'].includes(castleDirection) &&
            !position[7][5] &&
            !position[7][6] &&
            position[7][7] === 'br' &&
            !arbiter.isPlayerInCheck({
                positionAfterMove: arbiter.performMove({ position, piece, rank, file, x: 7, y: 5 }),
                position: position,
                player: 'b'
            }) &&
            !arbiter.isPlayerInCheck({
                positionAfterMove: arbiter.performMove({ position, piece, rank, file, x: 7, y: 6 }),
                position: position,
                player: 'b'
            })) {
            moves.push([7, 6])
        }
    }

    return moves

}

/**
 * Determines the valid castling directions for a given piece on the chessboard.
 * @param {Object} options - The options object.
 * @param {string} options.castleDirection - The allowed castle direction ('left', 'right', 'both', or 'none').
 * @param {string} options.piece - The piece identifier (e.g., 'wk' for white king).
 * @param {number} options.file - The file (column) of the piece on the chessboard.
 * @param {number} options.rank - The rank (row) of the piece on the chessboard.
 * @returns {string} The valid castling direction for the piece ('left', 'right', 'both', or 'none').
 */
export const getCastlingDirections = ({ castleDirection, piece, file, rank }) => {
    file = Number(file)
    rank = Number(rank)
    const direction = castleDirection[piece[0]]

    // If the piece is a king, castling is not allowed
    if (piece.endsWith('k'))
        return 'none'

    // Check the position of the piece and determine the valid castling direction
    if (file === 0 && rank === 0) {
        if (direction === 'both')
            return 'right'
        if (direction === 'left')
            return 'none'
    }
    if (file === 7 && rank === 0) {
        if (direction === 'both')
            return 'left'
        if (direction === 'right')
            return 'none'
    }
    if (file === 0 && rank === 7) {
        if (direction === 'both')
            return 'right'
        if (direction === 'left')
            return 'none'
    }
    if (file === 7 && rank === 7) {
        if (direction === 'both')
            return 'left'
        if (direction === 'right')
            return 'none'
    }
}

/**
 * Retrieves the pieces of the specified enemy color from the given position on the chessboard.
 * @param {Array[]} position - The current position of the chessboard represented as a 2D array.
 * @param {string} enemy - The identifier of the enemy color (e.g., 'b' for black).
 * @returns {Object[]} An array of enemy pieces, each containing the piece identifier, rank, and file.
 */
export const getPieces = (position, enemy) => {
    const enemyPieces = []

    // Iterate over each rank and file on the chessboard
    position.forEach((rank, x) => {
        rank.forEach((file, y) => {
            // Check if the piece at the current position starts with the enemy identifier

            if (position[x][y].startsWith(enemy))
                // Push the enemy piece information to the array

                enemyPieces.push({
                    piece: position[x][y],
                    rank: x,
                    file: y,
                })
        })
    })
    return enemyPieces
}

/**
 * Retrieves the position of the king belonging to the specified player from the given position on the chessboard.
 * @param {Array[]} position - The current position of the chessboard represented as a 2D array.
 * @param {string} player - The identifier of the player color (e.g., 'w' for white).
 * @returns {number[]} An array representing the position of the player's king [rank, file].
 *                     Returns undefined if the king is not found.
 */
export const getKingPosition = (position, player) => {
    let kingPos

    // Iterate over each rank and file on the chessboard
    position.forEach((rank, x) => {
        rank.forEach((file, y) => {
            // Check if the piece at the current position starts with the player identifier and ends with 'k' to identify the king
            if (position[x][y].startsWith(player) && position[x][y].endsWith('k'))
                kingPos = [x, y] // Store the position of the king
        })
    })
    return kingPos
}