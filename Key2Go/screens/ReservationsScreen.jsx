import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import TopHeader from "../components/TopHeader";
import useSWR from "swr";
import { fetcher } from "../utils/api";
import { Ionicons } from "@expo/vector-icons";
import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";


export default function ReservationsScreen({ navigation }) {
    const { theme } = useTheme();
    const { data, error, mutate } = useSWR(`${process.env.EXPO_PUBLIC_ORDER_ROUTE}/current`, fetcher);

    // Rafraîchir quand on revient à l'écran
    useFocusEffect(
        useCallback(() => {
            mutate();
        }, [mutate])
    );

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
            <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
                <TopHeader title="Mes réservations" />
                <View style={styles.emptyContainer}>
                    <Ionicons name="calendar-outline" size={60} color={theme.colors.subheading} />
                    <Text style={[styles.emptyText, { color: theme.colors.heading}]}>Aucune réservation</Text>
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
            default: return theme.colors.placeholder;
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
        <Pressable 
            style={({pressed}) => [
                styles.card,
                { backgroundColor: theme.colors.card },
                pressed && styles.cardPressed
            ]}
            onPress={() => navigation.navigate('ReservationDetailScreen', { order: item })}
        >
            <View style={[styles.cardHeader, {borderBottomColor: theme.colors.rowBorder}]}>
                <Text style={[styles.orderId, { color: theme.colors.heading}]}>Commande #{item.order_id}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.payment_status) }]}>
                    <Text style={[styles.statusText, { color: theme.colors.bg}]}>{getStatusText(item.payment_status)}</Text>
                </View>
            </View>

            <View style={styles.cardContent}>
                <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={16} color={theme.colors.placeholder} />
                    <Text style={[styles.infoLabel, {color: theme.colors.subText}]}>Date de commande:</Text>
                    <Text style={[styles.infoValue, {color: theme.colors.text}]}>{formatDate(item.order_date)}</Text>
                </View>

                {item.date_of_return && (
                    <View style={styles.infoRow}>
                        <Ionicons name="return-down-back-outline" size={16} color={theme.colors.placeholder} />
                        <Text style={[styles.infoLabel, {color: theme.colors.subText}]}>Date de retour:</Text>
                        <Text style={[styles.infoValue, {color: theme.colors.text}]}>{formatDate(item.date_of_return)}</Text>
                    </View>
                )}

                {item.fuel_level_return && (
                    <View style={styles.infoRow}>
                        <Ionicons name="speedometer-outline" size={16} color={theme.colors.placeholder} />
                        <Text style={[styles.infoLabel, {color: theme.colors.subText}]}>Carburant retour:</Text>
                        <Text style={[styles.infoValue, {color: theme.colors.text}]}>{item.fuel_level_return}%</Text>
                    </View>
                )}

                <View style={styles.infoRow}>
                    <Ionicons name="pricetag-outline" size={16} color={theme.colors.placeholder} />
                    <Text style={[styles.infoLabel, {color: theme.colors.subText}]}>Offre ID:</Text>
                    <Text style={[styles.infoValue, {color: theme.colors.text}]}>#{item.offer_id}</Text>
                </View>

                {item.offer?.vehicule && (
                    <View style={styles.infoRow}>
                        <Ionicons name="car-outline" size={16} color={theme.colors.placeholder} />
                        <Text style={[styles.infoLabel, {color: theme.colors.subText}]}>Véhicule:</Text>
                        <Text style={[styles.infoValue, {color: theme.colors.text}]}>
                            {item.offer.vehicule.model || 'Modèle inconnu'}
                            {item.offer.vehicule.licence_plate ? ` • ${item.offer.vehicule.licence_plate}` : ''}
                        </Text>
                    </View>
                )}

                {item.offer?.adress && (
                    <View style={styles.infoRow}>
                        <Ionicons name="location-outline" size={16} color={theme.colors.placeholder} />
                        <Text style={[styles.infoLabel, {color: theme.colors.subText}]}>Adresse:</Text>
                        <Text style={[styles.infoValue, {color: theme.colors.text}]}>{item.offer.adress}</Text>
                    </View>
                )}
            </View>
        </Pressable>
    );

    return (
        <View style={[styles.container, , { backgroundColor: theme.colors.background }]}>
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
    cardPressed: {
        opacity: 0.7,
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
});
