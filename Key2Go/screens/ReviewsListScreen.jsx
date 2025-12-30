import { View, Text, ScrollView, StyleSheet, Pressable, Alert, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TopHeader from "../components/TopHeader";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiRequest } from "../utils/api";
import useSWR from "swr";

const fetcher = async (url) => {
    const response = await apiRequest('GET', url);
    return response;
};

const REVIEW_ROUTE = process.env.EXPO_PUBLIC_REVIEW_ROUTE || '/reviews';

export default function ReviewsListScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const userInfo = useSelector(state => state.user.userInfo);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userInfo?.id) return;
        
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const response = await apiRequest('GET', `${REVIEW_ROUTE}/user/${userInfo.id}`);
                const data = response?.data ?? [];
                setReviews(data);
            } catch (error) {
                console.error('[ReviewsListScreen] Error:', error);
                Alert.alert("Erreur", "Impossible de charger vos avis");
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [userInfo?.id]);

    const renderReviewCard = ({ item }) => (
        <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
                <Text style={styles.reviewTitle}>{"Mon avis"}</Text>
                <View style={styles.ratingContainer}>
                    {[...Array(5)].map((_, i) => (
                        <Ionicons
                            key={i}
                            name={i < item.rating ? "star" : "star-outline"}
                            size={16}
                            color="#FFD700"
                        />
                    ))}
                </View>
            </View>
            {item.comment && (
                <Text style={styles.reviewComment}>{item.comment}</Text>
            )}
        </View>
    );

    return (
        <View style={styles.screen}>
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <Pressable 
                    onPress={() => navigation.goBack()}
                    hitSlop={10}
                >
                    <Ionicons name="chevron-back" size={28} color="#fff" />
                </Pressable>
                <TopHeader title="Mes avis" />
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <Text style={styles.loadingText}>Chargement...</Text>
                </View>
            ) : reviews.length === 0 ? (
                <View style={styles.centerContainer}>
                    <Ionicons name="star-outline" size={64} color="#ccc" />
                    <Text style={styles.emptyText}>Aucun avis pour le moment</Text>
                    <Text style={styles.emptySubtext}>Vos avis apparaîtront ici</Text>
                </View>
            ) : (
                <FlatList
                    data={reviews}
                    renderItem={renderReviewCard}
                    keyExtractor={(item) => item.review_id?.toString() || Math.random().toString()}
                    contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 20 }]}
                    showsVerticalScrollIndicator={false}
                />
            )}
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
        gap: 12,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        marginTop: 8,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    reviewCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    reviewTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        flex: 1,
        marginRight: 12,
    },
    ratingContainer: {
        flexDirection: 'row',
        gap: 4,
    },
    reviewComment: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 12,
    },
    reviewDate: {
        fontSize: 12,
        color: '#999',
    },
});
