import { View, Text, ScrollView, StyleSheet, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TopHeader from "../components/TopHeader";

export default function OfferDetailScreen({ route, navigation }) {
    const insets = useSafeAreaInsets();
    const { offer } = route.params;

    const handleReserve = () => {
        Alert.alert("Réservation", "Fonctionnalité en développement");
    };

    const calculateDays = () => {
        if (!offer.start_date || !offer.end_date) return 0;
        const start = new Date(offer.start_date);
        const end = new Date(offer.end_date);
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    };

    const price = offer.price ? parseFloat(offer.price) : 0;

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
                
                 <TopHeader title="Détails de l'offre" />
            </View>

            <ScrollView 
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.mainCard}>
                    <Text style={styles.description}>{offer.description || "Offre sans titre"}</Text>
                    
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Informations de localisation</Text>
                        <View style={styles.infoRow}>
                            <Ionicons name="location-outline" size={20} color="#007C7C" />
                            <Text style={styles.infoText}>{offer.adress || "Non spécifiée"}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Dates de location</Text>
                        <View style={styles.datesContainer}>
                            <View style={styles.dateBox}>
                                <Text style={styles.dateLabel}>Début</Text>
                                <Text style={styles.dateValue}>{offer.start_date}</Text>
                            </View>
                            <View style={styles.arrowContainer}>
                                <Ionicons name="arrow-forward" size={24} color="#007C7C" />
                            </View>
                            <View style={styles.dateBox}>
                                <Text style={styles.dateLabel}>Fin</Text>
                                <Text style={styles.dateValue}>{offer.end_date}</Text>
                            </View>
                        </View>
                        <Text style={styles.durationText}>Durée: {days} jour{days > 1 ? 's' : ''}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>État du véhicule</Text>
                        <View style={styles.fuelContainer}>
                            <Text style={styles.fuelLabel}>Niveau de carburant</Text>
                            <View style={styles.fuelBar}>
                                <View 
                                    style={[
                                        styles.fuelLevel,
                                        { width: `${offer.fuel_level}%` }
                                    ]}
                                />
                            </View>
                            <Text style={styles.fuelText}>{offer.fuel_level}%</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.pricingContainer}>
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Nombre de jours</Text>
                            <Text style={styles.priceValue}>{days}</Text>
                        </View>
                        <View style={[styles.priceRow, styles.totalRow]}>
                            <Text style={styles.totalLabel}>Prix total</Text>
                            <Text style={styles.totalValue}>{price}€</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
                <Pressable 
                    style={({pressed}) => [
                        styles.reserveButton,
                        pressed && styles.reserveButtonPressed
                    ]}
                    onPress={handleReserve}
                >
                    <Text style={styles.reserveButtonText}>Réserver maintenant</Text>
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
    description: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 20,
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
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 12,
        flex: 1,
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 16,
    },
    datesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
        marginTop: 12,
        fontStyle: 'italic',
    },
    fuelContainer: {
        paddingVertical: 8,
    },
    fuelLabel: {
        fontSize: 13,
        color: '#333',
        marginBottom: 8,
    },
    fuelBar: {
        height: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    fuelLevel: {
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: 4,
    },
    fuelText: {
        fontSize: 12,
        color: '#666',
    },
    pricingContainer: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 12,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    priceLabel: {
        fontSize: 13,
        color: '#666',
    },
    priceValue: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333',
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingTop: 12,
        marginTop: 8,
    },
    totalLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    totalValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#007C7C',
    },
    footer: {
        paddingHorizontal: 16,
        paddingTop: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    reserveButton: {
        backgroundColor: '#007C7C',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    reserveButtonPressed: {
        opacity: 0.8,
    },
    reserveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
