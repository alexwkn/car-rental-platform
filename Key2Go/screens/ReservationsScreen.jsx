import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import TopHeader from "../components/TopHeader";
import useSWR from "swr";
import { fetcher } from "../utils/api";
import { Ionicons } from "@expo/vector-icons";

export default function ReservationsScreen() {
    const { data, error } = useSWR(`${process.env.EXPO_PUBLIC_ORDER_ROUTE}/current`, fetcher);

    if (error) {
        return (
            <View style={styles.container}>
                <TopHeader title="Mes réservations" />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Erreur de chargement des réservations.</Text>
                </View>
            </View>
        );
    }

    if (!data || data.length === 0) {
        return (
            <View style={styles.container}>
                <TopHeader title="Mes réservations" />
                <View style={styles.emptyContainer}>
                    <Ionicons name="calendar-outline" size={60} color="#ccc" />
                    <Text style={styles.emptyText}>Aucune réservation</Text>
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
            case 'confirmed': return '#4CAF50';
            case 'cancelled': return '#F44336';
            default: return '#999';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return 'En attente';
            case 'confirmed': return 'Confirmée';
            case 'cancelled': return 'Annulée';
            default: return status;
        }
    };

    const renderItem = ({ item }) => (
        <Pressable style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.orderId}>Commande #{item.order_id}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.payment_status) }]}>
                    <Text style={styles.statusText}>{getStatusText(item.payment_status)}</Text>
                </View>
            </View>

            <View style={styles.cardContent}>
                <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={16} color="#666" />
                    <Text style={styles.infoLabel}>Date de commande:</Text>
                    <Text style={styles.infoValue}>{formatDate(item.order_date)}</Text>
                </View>

                {item.date_of_return && (
                    <View style={styles.infoRow}>
                        <Ionicons name="return-down-back-outline" size={16} color="#666" />
                        <Text style={styles.infoLabel}>Date de retour:</Text>
                        <Text style={styles.infoValue}>{formatDate(item.date_of_return)}</Text>
                    </View>
                )}

                {item.fuel_level_return && (
                    <View style={styles.infoRow}>
                        <Ionicons name="speedometer-outline" size={16} color="#666" />
                        <Text style={styles.infoLabel}>Carburant retour:</Text>
                        <Text style={styles.infoValue}>{item.fuel_level_return}%</Text>
                    </View>
                )}

                <View style={styles.infoRow}>
                    <Ionicons name="pricetag-outline" size={16} color="#666" />
                    <Text style={styles.infoLabel}>Offre ID:</Text>
                    <Text style={styles.infoValue}>#{item.offer_id}</Text>
                </View>
            </View>
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <TopHeader title="Mes réservations" />
            <FlatList
                data={data ? [].concat(...data) : []}
                renderItem={renderItem}
                keyExtractor={(item) => item.order_id?.toString()}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#666',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        marginTop: 16,
    },
    listContainer: {
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
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
        borderBottomColor: '#f0f0f0',
    },
    orderId: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
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
        color: '#666',
        marginLeft: 8,
        flex: 1,
    },
    infoValue: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333',
    },
});
