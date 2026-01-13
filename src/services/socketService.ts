import { io, Socket } from 'socket.io-client';
import { GameSetup } from '@/types/game';
import API_CONFIG from '@/config/api';

class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  connect(serverUrl: string = API_CONFIG.SOCKET_URL) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected() {
    return this.socket?.connected || false;
  }

  getSocket() {
    return this.socket;
  }

  // Game room events
  createGame(setup: GameSetup, callback: (gameCode: string, error?: string) => void) {
    if (!this.socket) return;
    
    this.socket.emit('create-game', setup, (response: { gameCode?: string; error?: string }) => {
      callback(response.gameCode || '', response.error);
    });
  }

  joinGame(gameCode: string, playerName: string, callback: (success: boolean, error?: string) => void) {
    if (!this.socket) return;
    
    this.socket.emit('join-game', { gameCode, playerName }, (response: { success: boolean; error?: string }) => {
      callback(response.success, response.error);
    });
  }

  startGame(gameCode: string, callback: (success: boolean) => void) {
    if (!this.socket) return;
    
    this.socket.emit('start-game', { gameCode }, (response: { success: boolean }) => {
      callback(response.success);
    });
  }

  submitWord(gameCode: string, word: string, team: 'A' | 'B', callback: (success: boolean) => void) {
    if (!this.socket) return;
    
    this.socket.emit('submit-word', { gameCode, word, team }, (response: { success: boolean }) => {
      callback(response.success);
    });
  }

  // Event listeners
  onGameCreated(callback: (gameCode: string) => void) {
    if (!this.socket) return;
    this.socket.on('game-created', callback);
  }

  onPlayerJoined(callback: (player: { id: string; name: string; team: 'A' | 'B' }) => void) {
    if (!this.socket) return;
    this.socket.on('player-joined', callback);
  }

  onGameStarted(callback: (gameState: any) => void) {
    if (!this.socket) return;
    this.socket.on('game-started', callback);
  }

  onWordSubmitted(callback: (data: { word: string; team: 'A' | 'B'; isValid: boolean; isDuplicate: boolean }) => void) {
    if (!this.socket) return;
    this.socket.on('word-submitted', callback);
  }

  onGameEnded(callback: (winner: 'A' | 'B' | 'tie') => void) {
    if (!this.socket) return;
    this.socket.on('game-ended', callback);
  }

  onTurnChanged(callback: (currentTeam: 'A' | 'B') => void) {
    if (!this.socket) return;
    this.socket.on('turn-changed', callback);
  }

  onGameError(callback: (error: string) => void) {
    if (!this.socket) return;
    this.socket.on('game-error', callback);
  }

  // Remove listeners
  offGameCreated() {
    if (!this.socket) return;
    this.socket.off('game-created');
  }

  offPlayerJoined() {
    if (!this.socket) return;
    this.socket.off('player-joined');
  }

  offGameStarted() {
    if (!this.socket) return;
    this.socket.off('game-started');
  }

  offWordSubmitted() {
    if (!this.socket) return;
    this.socket.off('word-submitted');
  }

  offGameEnded() {
    if (!this.socket) return;
    this.socket.off('game-ended');
  }

  offTurnChanged() {
    if (!this.socket) return;
    this.socket.off('turn-changed');
  }

  offGameError() {
    if (!this.socket) return;
    this.socket.off('game-error');
  }
}

export default SocketService.getInstance();