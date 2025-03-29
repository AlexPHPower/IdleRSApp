import { Platform } from "react-native"
import { __DEV__ } from "./utils"
import {
    clearJwt,
    clearRefreshToken,
    getJwtFromStorage,
    getRefreshTokenFromSecureStore,
    storeJwt,
    storeRefreshToken
} from "@/lib/tokens";
import {useRouter} from "expo-router";

const API_URL = __DEV__
    ? Platform.OS === "android"
        ? "http://10.0.2.2:3000/api" // Android emulator
        : "http://localhost:3000/api" // iOS simulator
    : "https://your-production-api.com/api" // Production API

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    let jwt = await getJwtFromStorage()

    let response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: jwt ? `Bearer ${jwt}` : '',
        },
    })

    if (response.status === 401) {
        const refreshToken = await getRefreshTokenFromSecureStore()
        if (!refreshToken) {
            await logout()
            throw new Error('Session expired. Please log in again.')
        }

        const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            body: JSON.stringify({ refreshToken }),
            headers: { 'Content-Type': 'application/json' },
        })

        if (!refreshRes.ok) {
            await logout()
            throw new Error('Failed to refresh session. Please log in again.')
        }

        const { newJwt, newRefreshToken } = await refreshRes.json()
        await storeJwt(newJwt)
        await storeRefreshToken(newRefreshToken)

        response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${newJwt}`,
            },
        })
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Request failed with status ${response.status}`)
    }

    return response.json()
}

export const playerApi = {
    createPlayer: (data: any) => fetchWithAuth("/createPlayer", {
        method: "POST",
        body: JSON.stringify(data),
    }),

    getPlayers: (userId: string) => fetchWithAuth(`/getPlayers?userId=${userId}`),

    completeActivity: (playerId: string, activity: string) =>
        fetchWithAuth("/completeActivity", {
            method: "POST",
            body: JSON.stringify({ playerId, activity }),
        }),
}

export async function logout() {
    const router = useRouter()
    await clearJwt()
    await clearRefreshToken()
    router.replace("/")
}