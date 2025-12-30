import { View, Text, ScrollView, StyleSheet, Pressable, Alert, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TopHeader from "../components/TopHeader";
import { useState } from "react";
import { useSelector } from "react-redux";
import { apiRequest } from "../utils/api";

export default function OfferDetailScreen({ route, navigation }) {
    const insets = useSafeAreaInsets();
    const { offer } = route.params;
    const [isFavorite, setIsFavorite] = useState(false);
    const userInfo = useSelector(state => state.user.userInfo);

    const handleReserve = async () => {
        if (!userInfo?.id) {
            Alert.alert("Erreur", "Utilisateur non authentifié");
            return;
        }

        try {
            const orderData = {
                offer_id: offer.offer_id,
                customer_id: userInfo.id,
                date_of_return: offer.end_date,
                fuel_level_return: 0,
                payment_status: 'pending'
            };

            const response = await apiRequest('POST', process.env.EXPO_PUBLIC_ORDER_ROUTE, orderData);
            
            Alert.alert("Succès", "Réservation créée avec succès!", [
                {
                    text: "OK",
                    onPress: () => {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'RéservationsStack' }],
                        });
                    }
                }
            ]);
        } catch (error) {
            console.error('[handleReserve] Error:', error);
            Alert.alert("Erreur", error.response?.data?.message || "Erreur lors de la réservation");
        }
    };

    const handleToggleFavorite = () => {
        setIsFavorite(!isFavorite);
        Alert.alert(
            isFavorite ? "Retiré des favoris" : "Ajouté aux favoris",
            isFavorite ? "Véhicule retiré de vos favoris" : "Véhicule ajouté à vos favoris"
        );
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
                    
                    {offer.vehicule && (
                        <>
                            <View style={styles.divider} />
                            
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>🚗 Véhicule</Text>
                                    <Pressable
                                        onPress={handleToggleFavorite}
                                        style={({pressed}) => [
                                            styles.favoriteButton,
                                            pressed && styles.favoriteButtonPressed
                                        ]}
                                        hitSlop={10}
                                    >
                                        <Ionicons 
                                            name={isFavorite ? "heart" : "heart-outline"} 
                                            size={28} 
                                            color={isFavorite ? "#ff4757" : "#007C7C"} 
                                        />
                                    </Pressable>
                                </View>
                                
                                <View style={styles.vehiculeInfo}>
                                    <Text style={styles.vehiculeModel}>{offer.vehicule.model}</Text>
                                    <Text style={styles.vehiculePlate}>{offer.vehicule.licence_plate}</Text>
                                    {offer.vehicule.description && (
                                        <Text style={styles.vehiculeDescription}>{offer.vehicule.description}</Text>
                                    )}
                                </View>

                                {offer.vehicule.profile && (
                                    <>
                                        <View style={styles.ownerDivider} />
                                        <View style={styles.ownerContainer}>
                                            <Text style={styles.ownerTitle}>Propriétaire</Text>
                                            <View style={styles.ownerInfo}>
                                                {offer.vehicule.profile.profile_picture ? (
                                                    <Image 
                                                        source={{ uri: `${process.env.EXPO_PUBLIC_BASE_API_ROUTE}/upload/profiles/${offer.vehicule.profile.profile_picture}` }}
                                                        style={styles.ownerPhoto}
                                                    />
                                                ) : (
                                                    <View style={styles.ownerPhotoPlaceholder}>
                                                        <Ionicons name="person" size={32} color="#007C7C" />
                                                    </View>
                                                )}
                                                <View style={styles.ownerDetails}>
                                                    <Text style={styles.ownerName}>{offer.vehicule.profile.name}</Text>
                                                    <Text style={styles.ownerEmail}>{offer.vehicule.profile.email}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </>
                                )}
                            </View>
                        </>
                    )}
                    
                    <View style={styles.divider} />

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
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    favoriteButton: {
        padding: 4,
    },
    favoriteButtonPressed: {
        opacity: 0.6,
    },
    vehiculeInfo: {
        marginBottom: 8,
    },
    vehiculeModel: {
        fontSize: 18,
        fontWeight: '700',
        color: '#007C7C',
        marginBottom: 4,
    },
    vehiculePlate: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
        marginBottom: 6,
    },
    vehiculeDescription: {
        fontSize: 13,
        color: '#333',
        lineHeight: 20,
    },
    ownerDivider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginVertical: 12,
    },
    ownerContainer: {
        marginTop: 8,
    },
    ownerTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#999',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    ownerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ownerPhoto: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginRight: 12,
        borderWidth: 2,
        borderColor: '#007C7C',
    },
    ownerPhotoPlaceholder: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginRight: 12,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#007C7C',
    },
    ownerDetails: {
        flex: 1,
    },
    ownerName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    ownerEmail: {
        fontSize: 13,
        color: '#666',
    },
});