import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import TopHeader from "../components/TopHeader";
import useSWR from "swr";
import { fetcher } from "../utils/api";
import { Ionicons } from "@expo/vector-icons";
import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";


export default function HistoryScreen() {
    const { theme } = useTheme();
    const { data, error, mutate } = useSWR(`${process.env.EXPO_PUBLIC_ORDER_ROUTE}/history`, fetcher);

    // Rafraîchir quand on revient à l'écran
    useFocusEffect(
        useCallback(() => {
            mutate();
        }, [mutate])
    );

    if (error) {
        return (
            <View style={styles.container}>
                <TopHeader title="Historique" />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Erreur de chargement de l'historique.</Text>
                </View>
            </View>
        );
    }

    if (!data || data.length === 0) {
        return (
            <View style={styles.container}>
                <TopHeader title="Historique" />
                <View style={styles.emptyContainer}>
                    <Ionicons name="file-tray-outline" size={60} color="#ccc" />
                    <Text style={styles.emptyText}>Aucun historique</Text>
                </View>
            </View>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#FFA500';
            case 'completed': return '#4CAF50';
            case 'failed': return '#F44336';
            default: return '#999';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return 'En attente';
            case 'completed': return 'Terminée';
            case 'failed': return 'Échouée';
            default: return status;
        }
    };

    const renderItem = ({ item }) => (
        <Pressable style={[styles.card, { backgroundColor: theme.colors.card}]}>
            <View style={[styles.cardHeader, { borderBottomColor: theme.colors.rowBorder}]}>
                <Text style={[styles.orderId, { color: theme.colors.text}]}>Commande #{item.order_id}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.payment_status) }]}>
                    <Text style={styles.statusText}>{getStatusText(item.payment_status)}</Text>
                </View>
            </View>

            <View style={styles.cardContent}>
                <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={16} color={theme.colors.icon} />
                    <Text style={[styles.infoLabel, { color: theme.colors.mutedText}]}>Date de commande:</Text>
                    <Text style={[styles.infoValue, { color: theme.colors.text}]}>{formatDate(item.order_date)}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons name="checkmark-circle-outline" size={16} color={theme.colors.icon} />
                    <Text style={[styles.infoLabel, { color: theme.colors.mutedText}]}>Date de retour:</Text>
                    <Text style={[styles.infoValue, { color: theme.colors.text}]}>{formatDate(item.date_of_return)}</Text>
                </View>

                {item.fuel_level_return && (
                    <View style={styles.infoRow}>
                        <Ionicons name="speedometer-outline" size={16} color={theme.colors.icon} />
                        <Text style={[styles.infoLabel, { color: theme.colors.mutedText}]}>Carburant retour:</Text>
                        <Text style={[styles.infoValue, { color: theme.colors.text}]}>{item.fuel_level_return}%</Text>
                    </View>
                )}

                {item.offer && (
                    <View style={[styles.offerSection, { borderColor: theme.colors.rowBOrder}]}>
                        <Text style={[styles.offerLabel,{ color: theme.colors.mutedText}]}>Offre:</Text>
                        <Text style={[styles.offerText, { color: theme.colors.text}]}>{item.offer.description || "Offre #" + item.offer_id}</Text>
                        {item.offer.price && (
                            <Text style={[styles.offerPrice, { color: theme.colors.primary}]}>Prix: {parseFloat(item.offer.price).toFixed(2)}€</Text>
                        )}
                    </View>
                )}
            </View>
        </Pressable>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <TopHeader title="Historique" />
            <FlatList
                data={data ? [].concat(...data) : []}
                renderItem={renderItem}
                keyExtractor={(item) => item.order_id?.toString() || Math.random().toString()}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        marginTop: 16,
    },
    listContainer: {
        padding: 16,
    },
    card: {
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
    },
    orderId: {
        fontSize: 16,
        fontWeight: '600',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    cardContent: {
        padding: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoLabel: {
        fontSize: 13,
        marginLeft: 8,
        flex: 1,
    },
    infoValue: {
        fontSize: 13,
        fontWeight: '600',
    },
    offerSection: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
    },
    offerLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
    },
    offerText: {
        fontSize: 13,
        marginBottom: 4,
    },
    offerPrice: {
        fontSize: 12,
        fontWeight: '600',
    },
});
