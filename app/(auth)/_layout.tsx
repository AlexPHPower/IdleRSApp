import { Slot, useRouter } from "expo-router"
import { useAuth } from "@/hooks/useAuth"
import { useEffect } from "react"
import { View, ActivityIndicator } from "react-native"

export default function ProtectedLayout() {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/")
        }
    }, [user, loading])

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#F59E0B" />
            </View>
        )
    }

    return <Slot />
}
