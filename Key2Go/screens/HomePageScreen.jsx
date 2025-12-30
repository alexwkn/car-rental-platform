import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import TopHeader from "../components/TopHeader";
import useSWR from "swr";
import { fetcher } from "../utils/api";
import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";


export default function HomePageScreen({navigation}) {

    const {data, error,mutate} = useSWR(`${process.env.EXPO_PUBLIC_OFFER_ROUTE}/available`, fetcher);

    // Rafraîchir quand on revient à l'écran
    useFocusEffect(
        useCallback(() => {
            mutate();
        }, [mutate])
    );

    if (error) {
        return (
            <View style={styles.container}>  
                <Text style={styles.errorText}>Erreur de chargement des offres.</Text>
            </View>
        );
    }

    const handleOfferPress = (offer) => {
        navigation.navigate('OfferDetailScreen', { offerId: offer.offer_id, offer });
    };

    const renderItem = ({item}) => (
        <Pressable 
            style={({pressed}) => [styles.cardPressable, pressed && styles.cardPressed]}
            onPress={() => handleOfferPress(item)}
        >
            <View style={styles.card}>
            <View style={styles.cardContent}>
                {item.vehicule && (
                    <View style={styles.vehiculeHeader}>
                        <View>
                            <Text style={styles.vehiculeModel}>🚗 {item.vehicule.model}</Text>
                            {item.vehicule.description && (
                                <Text style={styles.vehiculeDescription}>{item.vehicule.description}</Text>
                            )}
                        </View>
                        <Text style={styles.licencePlate}>{item.vehicule.licence_plate}</Text>
                    </View>
                )}
                
                <Text style={styles.description}>{item.description || "Offre sans titre"}</Text>
                
                <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                        <Text style={styles.label}>Prix</Text>
                        <Text style={styles.value}>{item.price}€</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Text style={styles.label}>Carburant</Text>
                        <Text style={styles.value}>{item.fuel_level}%</Text>
                    </View>
                </View>

                <View style={styles.datesRow}>
                    <View style={styles.dateItem}>
                        <Text style={styles.dateLabel}>Début</Text>
                        <Text style={styles.dateValue}>{item.start_date}</Text>
                    </View>
                    <View style={styles.dateItem}>
                        <Text style={styles.dateLabel}>Fin</Text>
                        <Text style={styles.dateValue}>{item.end_date}</Text>
                    </View>
                </View>

                <View style={styles.adressContainer}>
                    <Text style={styles.label}>📍 Localisation</Text>
                    <Text style={styles.adress}>{item.adress || "Non spécifiée"}</Text>
                </View>
            </View>
            </View>
        </Pressable>
    );

    return ( 

        <View style={styles.screen}>
            <TopHeader title="Les offres" />     
            <FlatList
                data={data ? [].concat(...data) : []}
                renderItem={renderItem}
                keyExtractor={(item) => item.offer_id.toString()}
                contentContainerStyle={styles.listContent}
                scrollEnabled={true}
            />
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
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    errorText: {
        fontSize: 16,
        color: '#666',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingBottom: 20,
    },
    cardPressable: {
        marginBottom: 12,
    },
    cardPressed: {
        opacity: 0.7,
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
    cardContent: {
        padding: 16,
    },
    description: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 12,
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    detailItem: {
        flex: 1,
        marginRight: 8,
    },
    label: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
        fontWeight: '500',
    },
    value: {
        fontSize: 14,
        fontWeight: '600',
        color: '#007C7C',
    },
    datesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#e0e0e0',
        marginBottom: 12,
    },
    dateItem: {
        flex: 1,
        alignItems: 'center',
    },
    dateLabel: {
        fontSize: 11,
        color: '#999',
        marginBottom: 4,
    },
    dateValue: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333',
    },
    adressContainer: {
        marginTop: 4,
    },
    adress: {
        fontSize: 13,
        color: '#666',
        marginTop: 6,
        fontStyle: 'italic',
    },
    vehiculeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    vehiculeModel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#007C7C',
    },
    licencePlate: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    vehiculeDescription: {
        fontSize: 13,
        color: '#333',
        marginTop: 4,
    },
});