import { createPosition } from './helper'

// Defines a constant object called Status that represents different game statuses
export const Status = {
    'ongoing' : 'Ongoing',
    'promoting' : 'Promoting',
    'white' : 'White wins',
    'black' : 'Black wins',
    'stalemate' : 'Game draws due to stalemate',
    'insufficient' : 'Game draws due to insufficient material',
}

// Defines a constant object called initGameState representing the initial game state
export const initGameState = {
    position: [createPosition()], // Initializes the position array with a single position created by the createPosition function
    turn: 'w', // Represents the current turn, initialized as 'w' for white
    candidateMoves: [], // Represents the available candidate moves, initially empty
    movesList: [], // Represents the list of moves made in the game, initially empty

    promotionSquare: null, // Represents the promotion square, initially null
    status: Status.ongoing, // Represents the current game status, initially set to 'Ongoing'
    castleDirection: { // Represents the castle direction for white and black, initially set to 'both'
        w: 'both',
        b: 'both',
    },
};