import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);

// Enable CORS for all routes
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"]
}));

// In-memory storage for games (in production, use a database)
const games = new Map();

// Setup Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: "*", // In production, specify your frontend URL
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Game management functions
function createGame(setup) {
  // Generate a unique 4-character game code
  let gameCode;
  do {
    gameCode = Math.random().toString(36).substring(2, 6).toUpperCase();
  } while (games.has(gameCode));
  
  const gameData = {
    gameCode,
    setup,
    players: {},
    gameState: {
      isPlaying: false,
      currentTeam: null,
      teams: {
        A: {
          id: 'A',
          name: 'Team A',
          letter: setup.letterA || 'ક',
          score: 0,
          words: [],
        },
        B: {
          id: 'B',
          name: 'Team B',
          letter: setup.letterB || 'ખ',
          score: 0,
          words: [],
        },
      },
      winner: null,
      isListening: false,
      speakingTeam: null,
    },
    maxPlayers: 2, // For 2 teams
    createdAt: Date.now(),
  };
  
  games.set(gameCode, gameData);
  return gameData;
}

function joinGame(gameCode, playerName, playerId) {
  const game = games.get(gameCode);
  if (!game) {
    return { success: false, error: 'Game not found' };
  }
  
  if (Object.keys(game.players).length >= game.maxPlayers) {
    return { success: false, error: 'Game is full' };
  }
  
  // Assign team based on existing players
  let team = 'A';
  if (game.players[playerId]) {
    // Player is rejoining
    team = game.players[playerId].team;
  } else {
    // Assign team based on availability
    const playerCount = Object.keys(game.players).length;
    team = playerCount === 0 ? 'A' : 'B';
    
    game.players[playerId] = {
      id: playerId,
      name: playerName,
      team: team,
      isReady: false,
    };
  }
  
  return { success: true, gameData: game };
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Create a new game
  socket.on('create-game', (setup, callback) => {
    try {
      const gameData = createGame(setup);
      
      socket.join(gameData.gameCode);
      
      // Update game state for all in room
      io.to(gameData.gameCode).emit('game-created', gameData.gameCode);
      
      callback({ gameCode: gameData.gameCode });
    } catch (error) {
      console.error('Error creating game:', error);
      callback({ error: 'Failed to create game' });
    }
  });
  
  // Join an existing game
  socket.on('join-game', ({ gameCode, playerName }, callback) => {
    try {
      const result = joinGame(gameCode, playerName, socket.id);
      
      if (result.success) {
        socket.join(gameCode);
        const game = games.get(gameCode);
        
        // Notify other players
        socket.to(gameCode).emit('player-joined', {
          id: socket.id,
          name: playerName,
          team: result.gameData.players[socket.id].team
        });
        
        // Send current game state to new player
        socket.emit('game-state', game.gameState);
        
        callback({ success: true });
      } else {
        callback({ success: false, error: result.error });
      }
    } catch (error) {
      console.error('Error joining game:', error);
      callback({ success: false, error: 'Failed to join game' });
    }
  });
  
  // Start the game
  socket.on('start-game', ({ gameCode }, callback) => {
    try {
      const game = games.get(gameCode);
      if (!game) {
        callback({ success: false, error: 'Game not found' });
        return;
      }
      
      // Update game state
      game.gameState.isPlaying = true;
      game.gameState.currentTeam = 'A'; // Start with team A
      
      // Notify all players
      io.to(gameCode).emit('game-started', game.gameState);
      
      callback({ success: true });
    } catch (error) {
      console.error('Error starting game:', error);
      callback({ success: false, error: 'Failed to start game' });
    }
  });
  
  // Submit a word
  socket.on('submit-word', ({ gameCode, word, team }, callback) => {
    try {
      const game = games.get(gameCode);
      if (!game) {
        callback({ success: false, error: 'Game not found' });
        return;
      }
      
      // In a real implementation, you would validate the word here
      // For now, we'll just accept the word and add it to the team's words
      const newWord = {
        id: `${Date.now()}-${Math.random()}`,
        text: word,
        team: team,
        isValid: true, // In real implementation, validate the word
        isDuplicate: false, // In real implementation, check for duplicates
        timestamp: Date.now(),
      };
      
      // Add word to team's list
      game.gameState.teams[team].words.push(newWord);
      if (newWord.isValid) {
        game.gameState.teams[team].score += 1;
      }
      
      // Switch to next team
      game.gameState.currentTeam = team === 'A' ? 'B' : 'A';
      
      // Notify all players
      io.to(gameCode).emit('word-submitted', {
        word: word,
        team: team,
        isValid: newWord.isValid,
        isDuplicate: newWord.isDuplicate,
        newScore: game.gameState.teams[team].score,
      });
      
      // Update game state for all players
      io.to(gameCode).emit('game-state-updated', game.gameState);
      
      callback({ success: true });
    } catch (error) {
      console.error('Error submitting word:', error);
      callback({ success: false, error: 'Failed to submit word' });
    }
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    
    // Find the game this user was part of and notify others
    for (const [gameCode, game] of games) {
      if (game.players[socket.id]) {
        // Remove player from game
        delete game.players[socket.id];
        
        // Notify other players
        socket.to(gameCode).emit('player-left', { playerId: socket.id });
        
        // If game is empty, remove it
        if (Object.keys(game.players).length === 0) {
          games.delete(gameCode);
        }
        
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});