"use client"

import { useEffect, useState } from "react"
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native"
import { Button } from "@rneui/themed"
import * as Google from "expo-auth-session/providers/google"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRouter } from "expo-router"

export default function AuthScreen() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: "521074272897-9mdpp3a3ruf19sdkoubbuhbdsa3dvcd0.apps.googleusercontent.com",
    })

    // Handle Google Login response
    useEffect(() => {
        const handleGoogleLogin = async () => {
            if (response?.type === "success") {
                const idToken = response.params.id_token
                if (!idToken) {
                    Alert.alert("Login Error", "No ID token received.")
                    return
                }

                try {
                    setLoading(true)
                    const res = await fetch("https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + idToken)
                    const user = await res.json()

                    await AsyncStorage.setItem("user", JSON.stringify(user))
                    console.log("User info saved:", user)

                    router.replace("/home")
                } catch (err) {
                    Alert.alert("Login Failed", "Unable to authenticate user.")
                    console.error("Google login error:", err)
                } finally {
                    setLoading(false)
                }
            }
        }

        handleGoogleLogin()
    }, [response])

    return (
        <View style={styles.container}>
            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#F59E0B" />
                </View>
            )}

            <View style={styles.logoContainer}>
                <Text style={styles.title}>IdleQuest</Text>
                <Text style={styles.subtitle}>Begin your adventure</Text>
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.loginText}>Sign in to continue</Text>

                <Button
                    title="Continue with Google"
                    onPress={() => promptAsync()}
                    loading={loading}
                    disabled={!request || loading}
                    buttonStyle={styles.googleButton}
                    titleStyle={styles.googleButtonText}
                    icon={{
                        name: "google",
                        type: "font-awesome",
                        color: "#1F2937",
                        size: 18,
                    }}
                    iconContainerStyle={{ marginRight: 10 }}
                />

                <Text style={styles.termsText}>
                    By continuing, you agree to our Terms of Service and Privacy Policy
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        backgroundColor: "#1F2937",
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#F59E0B",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#D1D5DB",
    },
    formContainer: {
        backgroundColor: "#374151",
        borderRadius: 12,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    loginText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#F3F4F6",
        marginBottom: 20,
        textAlign: "center",
    },
    googleButton: {
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        paddingVertical: 12,
        marginBottom: 16,
    },
    googleButtonText: {
        color: "#1F2937",
        fontWeight: "600",
    },
    termsText: {
        fontSize: 12,
        color: "#9CA3AF",
        textAlign: "center",
        marginTop: 16,
    },
})
