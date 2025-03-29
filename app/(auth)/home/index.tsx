"use client"

import { useState, useEffect } from "react"
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert } from "react-native"
import { Button } from "@rneui/themed"
import { playerApi } from "@/lib/api"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router"

type Player = {
    _id: string
    name: string
    level: number
    createdAt: string
}

export default function PlayerSelectionScreen() {
    const [players, setPlayers] = useState<Player[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        fetchPlayers()
    }, [])

    async function fetchPlayers() {
        try {
            setLoading(true)
            const data = await playerApi.getPlayers("one")
            setPlayers(data)
        } catch (error: any) {
            Alert.alert("Error", error.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleLogout() {
        try {
            await AsyncStorage.removeItem("session_token");
            await AsyncStorage.removeItem("user");
            console.log("Logged out successfully");
            router.replace("/");
        } catch (error: any) {
            Alert.alert("Logout Error", error.message || "Failed to logout.");
        }
    }

    function renderPlayerCard({ item }: { item: Player }) {
        return (
            <TouchableOpacity
                style={styles.playerCard}
                onPress={() => console.log("Go to game")}
            >
                <View style={styles.playerInfo}>
                    <Text style={styles.playerName}>{item.name}</Text>
                    <Text style={styles.playerLevel}>Level {item.level}</Text>
                </View>
                <Text style={styles.playerDate}>Created: {new Date(item.createdAt).toLocaleDateString()}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Your Characters</Text>
                <Button
                    title="Logout"
                    onPress={handleLogout}
                    buttonStyle={styles.logoutButton}
                    titleStyle={styles.logoutButtonText}
                />
            </View>

            {loading ? (
                <Text style={styles.loadingText}>Loading players...</Text>
            ) : players.length > 0 ? (
                <FlatList
                    data={players}
                    renderItem={renderPlayerCard}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContainer}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>You don't have any characters yet</Text>
                </View>
            )}

            <Button
                title="Create New Character"
                onPress={() => console.log("Go to create player")}
                buttonStyle={styles.createButton}
                titleStyle={styles.createButtonText}
                icon={{
                    name: "plus",
                    type: "font-awesome-5",
                    color: "#FFF",
                    size: 15,
                }}
                iconRight
                iconContainerStyle={{ marginLeft: 10 }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#1F2937",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 50,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#F3F4F6",
    },
    logoutButton: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "#F59E0B",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 8,
    },
    logoutButtonText: {
        color: "#F59E0B",
        fontSize: 14,
    },
    listContainer: {
        paddingBottom: 20,
    },
    playerCard: {
        backgroundColor: "#374151",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    playerInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    playerName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#F3F4F6",
    },
    playerLevel: {
        fontSize: 16,
        color: "#F59E0B",
        fontWeight: "600",
    },
    playerDate: {
        fontSize: 12,
        color: "#9CA3AF",
    },
    loadingText: {
        textAlign: "center",
        marginTop: 20,
        color: "#D1D5DB",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        fontSize: 16,
        color: "#9CA3AF",
        textAlign: "center",
    },
    createButton: {
        backgroundColor: "#F59E0B",
        borderRadius: 8,
        paddingVertical: 12,
        marginTop: "auto",
        marginBottom: 20,
    },
    createButtonText: {
        fontSize: 16,
        fontWeight: "600",
    },
})

