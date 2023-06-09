import { areSameColorTiles, findPieceCoords } from '../helper';
import { getKnightMoves, getRookMoves, getBishopMoves, getQueenMoves, getKingMoves, getPawnMoves, getPawnCaptures, getCastlingMoves, getPieces, getKingPosition } from './getMoves'
import { movePiece, movePawn } from './move';

const arbiter = {

    /**
 * Returns the valid regular moves for a given piece on the chessboard.
 *
 * @param {Object} params - Object containing the following properties:
 *   - position (Array): The current position array representing the chessboard.
 *   - piece (String): The piece for which to determine the valid moves.
 *   - rank (Number): The rank (row) of the piece's current position.
 *   - file (Number): The file (column) of the piece's current position.
 * @returns {Array} - An array of valid moves for the given piece.
 */
    getRegularMoves: function ({ position, piece, rank, file }) {
        if (piece.endsWith('n'))
            return getKnightMoves({ position, rank, file });
        if (piece.endsWith('b'))
            return getBishopMoves({ position, piece, rank, file });
        if (piece.endsWith('r'))
            return getRookMoves({ position, piece, rank, file });
        if (piece.endsWith('q'))
            return getQueenMoves({ position, piece, rank, file });
        if (piece.endsWith('k'))
            return getKingMoves({ position, piece, rank, file });
        if (piece.endsWith('p'))
            return getPawnMoves({ position, piece, rank, file })
    },

    /**
     * Returns the valid moves for a given piece on the chessboard, excluding moves that would result in the player being in check.
     *
     * @param {Object} params - Object containing the following properties:
     *   - position (Array): The current position array representing the chessboard.
     *   - castleDirection (Object): The castle direction settings for white and black players.
     *   - prevPosition (Array): The position array representing the previous state of the chessboard.
     *   - piece (String): The piece for which to determine the valid moves.
     *   - rank (Number): The rank (row) of the piece's current position.
     *   - file (Number): The file (column) of the piece's current position.
     * @returns {Array} - An array of valid moves for the given piece, excluding moves resulting in the player being in check.
     */
    getValidMoves: function ({ position, castleDirection, prevPosition, piece, rank, file }) {
        let moves = this.getRegularMoves({ position, piece, rank, file })
        const notInCheckMoves = []

        if (piece.endsWith('p')) {
            moves = [
                ...moves,
                ...getPawnCaptures({ position, prevPosition, piece, rank, file })
            ]
        }
        if (piece.endsWith('k'))
            moves = [
                ...moves,
                ...getCastlingMoves({ position, castleDirection, piece, rank, file })
            ]

        moves.forEach(([x, y]) => {
            const positionAfterMove =
                this.performMove({ position, piece, rank, file, x, y })

            if (!this.isPlayerInCheck({ positionAfterMove, position, player: piece[0] })) {
                notInCheckMoves.push([x, y])
            }
        })
        return notInCheckMoves
    },

    /**
     * Checks if the player is in check after a given move.
     *
     * @param {Object} params - Object containing the following properties:
     *   - positionAfterMove (Array): The position array representing the chessboard after the move.
     *   - position (Array): The current position array representing the chessboard.
     *   - player (String): The player for whom to check if they are in check.
     * @returns {Boolean} - A boolean value indicating whether the player is in check after the move.
     */
    isPlayerInCheck: function ({ positionAfterMove, position, player }) {
        const enemy = player.startsWith('w') ? 'b' : 'w'
        let kingPos = getKingPosition(positionAfterMove, player)
        const enemyPieces = getPieces(positionAfterMove, enemy)

        const enemyMoves = enemyPieces.reduce((acc, p) => acc = [
            ...acc,
            ...(p.piece.endsWith('p')
                ? getPawnCaptures({
                    position: positionAfterMove,
                    prevPosition: position,
                    ...p
                })
                : this.getRegularMoves({
                    position: positionAfterMove,
                    ...p
                })
            )
        ], [])

        if (enemyMoves.some(([x, y]) => kingPos[0] === x && kingPos[1] === y))
            return true

        else
            return false
    },

    /**
     * Performs a move on the chessboard based on the given parameters.
     *
     * @param {Object} params - Object containing the following properties:
     *   - position (Array): The current position array representing the chessboard.
     *   - piece (String): The piece to be moved.
     *   - rank (Number): The rank (row) of the current position of the piece.
     *   - file (Number): The file (column) of the current position of the piece.
     *   - x (Number): The rank (row) of the destination position.
     *   - y (Number): The file (column) of the destination position.
     * @returns {Array} - The new position array after performing the move.
     */
    performMove: function ({ position, piece, rank, file, x, y }) {
        if (piece.endsWith('p'))
            return movePawn({ position, piece, rank, file, x, y })
        else
            return movePiece({ position, piece, rank, file, x, y })
    },

    /**
     * Determines if the game is in a stalemate position for the given player.
     *
     * @param {Array} position - The current position array representing the chessboard.
     * @param {String} player - The player for whom to check the stalemate.
     * @param {Object} castleDirection - Object representing the castle directions for each player.
     * @returns {Boolean} - A boolean value indicating whether the game is in a stalemate position.
     */
    isStalemate: function (position, player, castleDirection) {
        const isInCheck = this.isPlayerInCheck({ positionAfterMove: position, player })

        if (isInCheck)
            return false

        const pieces = getPieces(position, player)
        const moves = pieces.reduce((acc, p) => acc = [
            ...acc,
            ...(this.getValidMoves({
                position,
                castleDirection,
                ...p
            })
            )
        ], [])

        return (!isInCheck && moves.length === 0)
    },


    /**
     * Determines if the current position has insufficient material for a checkmate.
     *  responsible for determining if the current position has insufficient material for a checkmate.
     *  It takes one parameter: the current position array (position).
     *
     * @param {Array} position - The current position array representing the chessboard.
     * @returns {Boolean} - A boolean value indicating if the position has insufficient material.
     */
    insufficientMaterial: function (position) {

        const pieces =
            position.reduce((acc, rank) =>
                acc = [
                    ...acc,
                    ...rank.filter(spot => spot)
                ], [])

        // King vs. king
        if (pieces.length === 2)
            return true

        // King and bishop vs. king
        // King and knight vs. king
        if (pieces.length === 3 && pieces.some(p => p.endsWith('b') || p.endsWith('n')))
            return true

        // King and bishop vs. king and bishop of the same color as the opponent's bishop
        if (pieces.length === 4 &&
            pieces.every(p => p.endsWith('b') || p.endsWith('k')) &&
            new Set(pieces).size === 4 &&
            areSameColorTiles(
                findPieceCoords(position, 'wb')[0],
                findPieceCoords(position, 'bb')[0]
            )
        )
            return true

        return false
    },

    /**
     * Determines if the current position is a checkmate for the given player.
     *
     * @param {Array} position - The current position array representing the chessboard.
     * @param {String} player - The player to check for checkmate ('w' for white, 'b' for black).
     * @param {Object} castleDirection - The castle direction configuration object.
     * @returns {Boolean} - A boolean value indicating if the position is a checkmate.
     */
    isCheckMate: function (position, player, castleDirection) {
        const isInCheck = this.isPlayerInCheck({ positionAfterMove: position, player })

        if (!isInCheck)
            return false

        const pieces = getPieces(position, player)
        const moves = pieces.reduce((acc, p) => acc = [
            ...acc,
            ...(this.getValidMoves({
                position,
                castleDirection,
                ...p
            })
            )
        ], [])

        return (isInCheck && moves.length === 0)
    },
}


export default arbiter