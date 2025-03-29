import { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

export function useAuth() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadUser = async () => {
            const userJSON = await AsyncStorage.getItem("user")
            if (userJSON) setUser(JSON.parse(userJSON))
            setLoading(false)
        }
        loadUser()
    }, [])

    return { user, loading }
}
