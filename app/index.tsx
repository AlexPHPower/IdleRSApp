"use client"

import {useState, useEffect} from "react"
import {StyleSheet, View, Text, ActivityIndicator} from "react-native"
import {Button} from "@rneui/themed";
import * as Google from "expo-auth-session/providers/google"
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AuthScreen() {
    const [loading, setLoading] = useState(false)
    const [userInfo, setUserInfo] = useState(null);

    const getUserInfo = async (token: string) => {
        if (!token) return;
        try {
            const response = await fetch(
                "https://www.googleapis.com/userinfo/v2/me",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const user = await response.json();
            await AsyncStorage.setItem("user", JSON.stringify(user));
            setUserInfo(user);
        } catch (error) {
            console.error(
                "Failed to fetch user data:"
            );
        }
    };

    const signInWithGoogle = async () => {
        try {
            // Attempt to retrieve user information from AsyncStorage
            const userJSON = await AsyncStorage.getItem("user");

            if (userJSON) {
                setUserInfo(JSON.parse(userJSON));
            } else if (response?.type === "success") {

                if (!response.authentication) return;
                getUserInfo(response.authentication.accessToken);
            }
        } catch (error) {
            // Handle any errors that occur during AsyncStorage retrieval or other operations
            console.error("Error retrieving user data from AsyncStorage:", error);
        }
    };

    useEffect(() => {
        signInWithGoogle().then(r => console.log(r));
    }, []);

    console.log('User info: ', JSON.stringify(userInfo))

    const config = {
        iosClientId: "521074272897-9mdpp3a3ruf19sdkoubbuhbdsa3dvcd0.apps.googleusercontent.com",
        webClientId: "521074272897-2er9bunhf7atdtqr1aj6ftjqn0cq7i7b.apps.googleusercontent.com",
    };

    const [request, response, promptAsync] = Google.useAuthRequest(config);

    return (
        <View style={styles.container}>
            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#F59E0B"/>
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
        shadowOffset: {width: 0, height: 4},
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
    appleButton: {
        height: 50,
        width: "100%",
        marginBottom: 16,
    },
    termsText: {
        fontSize: 12,
        color: "#9CA3AF",
        textAlign: "center",
        marginTop: 16,
    },
})
