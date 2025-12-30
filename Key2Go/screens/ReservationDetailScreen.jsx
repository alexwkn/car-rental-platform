import { View, Text, ScrollView, StyleSheet, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TopHeader from "../components/TopHeader";
import { apiRequest } from "../utils/api";

export default function ReservationDetailScreen({ route, navigation }) {
    const insets = useSafeAreaInsets();
    const { order } = route.params;

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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

    const handleCloseReservation = () => {
        Alert.alert(
            "Clôturer la réservation",
            "Veuillez remplir les informations de retour du véhicule",
            [
                { text: "Annuler", onPress: () => {}, style: "cancel" },
                {
                    text: "Continuer",
                    onPress: () => {
                        navigation.navigate('CloseReservationScreen', { 
                            order
                        });
                    },
                    style: "default"
                }
            ]
        );
    };

    const handleCancelReservation = () => {
        Alert.alert(
            "Annuler la réservation",
            "Êtes-vous sûr de vouloir annuler cette réservation ?",
            [
                { text: "Non", onPress: () => {}, style: "cancel" },
                {
                    text: "Oui, annuler",
                    onPress: async () => {
                        try {
                            await apiRequest(
                                'DELETE',
                                `${process.env.EXPO_PUBLIC_ORDER_ROUTE}/${order.order_id}`
                            );
                            Alert.alert("Succès", "Réservation annulée", [
                                {
                                    text: "OK",
                                    onPress: () => {
                                        navigation.reset({
                                            index: 0,
                                            routes: [{ name: 'AccueilStack' }],
                                        });
                                    }
                                }
                            ]);
                        } catch (error) {
                            console.error("Erreur annulation:", error);
                            Alert.alert("Erreur", "Impossible d'annuler la réservation");
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };
                    

    const calculateDays = () => {
        if (!order.order_date || !order.date_of_return) return 0;
        const start = new Date(order.order_date);
        const end = new Date(order.date_of_return);
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    };

    const days = calculateDays();

    return (
        <View style={styles.screen}>
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <Pressable 
                    onPress={() => navigation.goBack()}
                    hitSlop={10}
                >
                    <Ionicons name="chevron-back" size={28} color="#fff" />
                </Pressable>
                <TopHeader title="Détails de la réservation" />
            </View>

            <ScrollView 
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.mainCard}>
                    <View style={styles.headerSection}>
                        <View>
                            <Text style={styles.orderId}>Commande #{order.order_id}</Text>
                            <Text style={styles.orderDate}>{formatDate(order.order_date)}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.payment_status) }]}>
                            <Text style={styles.statusText}>{getStatusText(order.payment_status)}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {order.offer && (
                        <>
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>📍 Offre</Text>
                                <Text style={styles.offerDescription}>{order.offer.description || "Offre sans titre"}</Text>
                                <View style={styles.infoRow}>
                                    <Ionicons name="location-outline" size={18} color="#007C7C" />
                                    <Text style={styles.infoText}>{order.offer.adress || "Non spécifiée"}</Text>
                                </View>
                            </View>

                            <View style={styles.divider} />
                        </>
                    )}

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📅 Dates</Text>
                        <View style={styles.datesContainer}>
                            <View style={styles.dateBox}>
                                <Text style={styles.dateLabel}>Début</Text>
                                <Text style={styles.dateValue}>{formatDate(order.order_date)}</Text>
                            </View>
                            <View style={styles.arrowContainer}>
                                <Ionicons name="arrow-forward" size={24} color="#007C7C" />
                            </View>
                            <View style={styles.dateBox}>
                                <Text style={styles.dateLabel}>Fin</Text>
                                <Text style={styles.dateValue}>{formatDate(order.date_of_return)}</Text>
                            </View>
                        </View>
                        <Text style={styles.durationText}>Durée: {days} jour{days > 1 ? 's' : ''}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>ℹ️ Informations</Text>
                        <View style={styles.infoRow}>
                            <Ionicons name="information-circle-outline" size={18} color="#007C7C" />
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={styles.infoLabel}>Offre ID:</Text>
                                <Text style={styles.infoValue}>#{order.offer_id}</Text>
                            </View>
                        </View>
                        {order.fuel_level_return && (
                            <View style={styles.infoRow}>
                                <Ionicons name="speedometer-outline" size={18} color="#007C7C" />
                                <View style={{ flex: 1, marginLeft: 12 }}>
                                    <Text style={styles.infoLabel}>Carburant retour:</Text>
                                    <Text style={styles.infoValue}>{order.fuel_level_return}%</Text>
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
                <Pressable 
                    style={({pressed}) => [
                        styles.closeButton,
                        pressed && styles.buttonPressed
                    ]}
                    onPress={handleCloseReservation}
                >
                    <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                    <Text style={styles.closeButtonText}>Clôturer</Text>
                </Pressable>

                <Pressable 
                    style={({pressed}) => [
                        styles.cancelButton,
                        pressed && styles.buttonPressed
                    ]}
                    onPress={handleCancelReservation}
                >
                    <Ionicons name="close-circle-outline" size={20} color="#fff" />
                    <Text style={styles.cancelButtonText}>Annuler</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#007C7C',
        paddingHorizontal: 16,
        paddingBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    mainCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    headerSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    orderId: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    orderDate: {
        fontSize: 13,
        color: '#666',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 16,
    },
    section: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    offerDescription: {
        fontSize: 16,
        fontWeight: '600',
        color: '#007C7C',
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 12,
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    datesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    dateBox: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    dateLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
    },
    dateValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#007C7C',
    },
    arrowContainer: {
        marginHorizontal: 12,
    },
    durationText: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
    },
    footer: {
        paddingHorizontal: 16,
        paddingTop: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        flexDirection: 'row',
        gap: 12,
    },
    closeButton: {
        flex: 1,
        backgroundColor: '#4CAF50',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#F44336',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    buttonPressed: {
        opacity: 0.8,
    },
});
