import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/cts/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const createGame = async (hostId: string, playerCount: number, phaseDuration: number) => {
    const response = await api.post('/game/create', { hostId, playerCount, phaseDuration });
    return response.data;
};

export const joinGame = async (roomCode: string, userId: string) => {
    const response = await api.post('/game/join', { roomCode, userId });
    return response.data;
};

export const getActiveGames = async () => {
    const response = await api.get('/game/active');
    return response.data;
};

export const getGame = async (gameId: string) => {
    const response = await api.get(`/game/${gameId}`);
    return response.data;
};

export const startGame = async (gameId: string) => {
    const response = await api.post(`/game/${gameId}/start`);
    return response.data;
};

export const performAction = async (gameId: string, playerId: string, actionType: string, targetId?: string, resourceCost?: unknown) => {
    const response = await api.post('/player/action', { gameId, playerId, actionType, targetId, resourceCost });
    return response.data;
};

export const getPlayer = async (playerId: string) => {
    const response = await api.get(`/player/${playerId}`);
    return response.data;
};

export default api;
