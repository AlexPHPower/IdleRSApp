import * as SecureStore from 'expo-secure-store'

// Keys
const JWT_KEY = 'jwt_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

// JWT Functions
export async function storeJwt(token: string) {
    await SecureStore.setItemAsync(JWT_KEY, token)
}

export async function getJwtFromStorage(): Promise<string | null> {
    return await SecureStore.getItemAsync(JWT_KEY)
}

export async function clearJwt() {
    await SecureStore.deleteItemAsync(JWT_KEY)
}

// Refresh Token Functions
export async function storeRefreshToken(token: string) {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token)
}

export async function getRefreshTokenFromSecureStore(): Promise<string | null> {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY)
}

export async function clearRefreshToken() {
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY)
}
