import { View, Text, ScrollView, StyleSheet, Pressable, Alert, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { useSelector } from "react-redux";
import TopHeader from "../components/TopHeader";
import { apiRequest } from "../utils/api";

export default function CloseReservationScreen({ route, navigation }) {
    const insets = useSafeAreaInsets();
    const { order } = route.params;
    const customerId = useSelector((state) => state.user.userInfo?.id);
    const [fuelLevel, setFuelLevel] = useState('');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!fuelLevel) {
            Alert.alert("Erreur", "Veuillez remplir le niveau de carburant");
            return;
        }

        if (rating === 0) {
            Alert.alert("Erreur", "Veuillez donner une note");
            return;
        }

        setIsSubmitting(true);
        try {
            // Mettre à jour la commande comme complétée
            const updateOrderResponse = await apiRequest(
                'PATCH',
                `${process.env.EXPO_PUBLIC_ORDER_ROUTE}/${order.order_id}/complete`,
                {
                    fuel_level_return: parseFloat(fuelLevel),
                    date_of_return: new Date().toISOString().split('T')[0],
                }
            );

            if (updateOrderResponse.status === 200) {
                // Si une note est fournie, créer une review
                if (rating > 0) {
                    await apiRequest(
                        'POST',
                        process.env.EXPO_PUBLIC_REVIEW_ROUTE,
                        {
                            customer_id: customerId,
                            renter_id: order.offer?.vehicule?.owner_id || 1,
                            order_id: order.order_id,
                            rating,
                            comment
                        }
                    );
                }

                Alert.alert(
                    "Succès",
                    "Réservation clôturée avec succès",
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                // Revenir à la liste des réservations
                                navigation.pop(2);
                            }
                        }
                    ]
                );
            }
        } catch (error) {
            console.error("Erreur lors de la clôture:", error);
            Alert.alert("Erreur", "Impossible de clôturer la réservation");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.screen}>
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <Pressable 
                    onPress={() => navigation.goBack()}
                    hitSlop={10}
                >
                    <Ionicons name="chevron-back" size={28} color="#fff" />
                </Pressable>
                <TopHeader title="Clôturer la réservation" />
            </View>

            <ScrollView 
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.mainCard}>
                    <Text style={styles.description}>Commande #{order.order_id}</Text>

                    <View style={styles.divider} />

                    {/* Fuel Level */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>⛽ Niveau de carburant au retour</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Entrez le pourcentage (0-100)"
                                placeholderTextColor="#999"
                                keyboardType="decimal-pad"
                                value={fuelLevel}
                                onChangeText={setFuelLevel}
                            />
                            <Text style={styles.inputSuffix}>%</Text>
                        </View>
                        <Text style={styles.inputHint}>Ex: 85 pour 85%</Text>
                    </View>

                    <View style={styles.divider} />

                    {/* Rating */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>⭐ Évaluation du véhicule</Text>
                        <View style={styles.ratingContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Pressable
                                    key={star}
                                    onPress={() => setRating(star)}
                                    style={styles.starButton}
                                >
                                    <Ionicons
                                        name={star <= rating ? "star" : "star-outline"}
                                        size={40}
                                        color={star <= rating ? "#FFB800" : "#ddd"}
                                    />
                                </Pressable>
                            ))}
                        </View>
                        <Text style={styles.ratingText}>
                            {rating > 0 ? `Vous avez donné ${rating} étoile${rating > 1 ? 's' : ''}` : 'Sélectionnez une note'}
                        </Text>
                    </View>

                    <View style={styles.divider} />

                    {/* Comment */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>💬 Commentaire (optionnel)</Text>
                        <TextInput
                            style={[styles.input, styles.commentInput]}
                            placeholder="Partagez votre expérience..."
                            placeholderTextColor="#999"
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            value={comment}
                            onChangeText={setComment}
                        />
                    </View>
                </View>
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
                <Pressable 
                    style={({pressed}) => [
                        styles.submitButton,
                        pressed && styles.buttonPressed,
                        isSubmitting && styles.buttonDisabled
                    ]}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                >
                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                    <Text style={styles.submitButtonText}>
                        {isSubmitting ? "Clôture en cours..." : "Clôturer la réservation"}
                    </Text>
                </Pressable>

                <Pressable 
                    style={({pressed}) => [
                        styles.cancelButton,
                        pressed && styles.buttonPressed
                    ]}
                    onPress={() => navigation.goBack()}
                    disabled={isSubmitting}
                >
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
    description: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 16,
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
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 14,
        color: '#333',
        backgroundColor: '#f9f9f9',
    },
    inputSuffix: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '600',
        color: '#007C7C',
    },
    inputHint: {
        fontSize: 12,
        color: '#999',
        marginTop: 6,
    },
    commentInput: {
        minHeight: 80,
        flex: 1,
    },
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: 16,
    },
    starButton: {
        padding: 8,
    },
    ratingText: {
        textAlign: 'center',
        fontSize: 13,
        color: '#666',
        marginTop: 8,
    },
    footer: {
        paddingHorizontal: 16,
        paddingTop: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        gap: 12,
    },
    submitButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    cancelButton: {
        backgroundColor: '#f0f0f0',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 14,
        fontWeight: '600',
    },
    buttonPressed: {
        opacity: 0.8,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
});
