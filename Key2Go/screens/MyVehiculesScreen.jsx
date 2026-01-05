import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useSWR from "swr";
import { fetcher, API } from "../utils/api";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";


export default function MyVehiculesScreen({ navigation }) {
    const { theme } = useTheme();

  const { data, error, mutate, isValidating } = useSWR(
    `${process.env.EXPO_PUBLIC_VEHICULE_ROUTE}/my`,
    fetcher
  );
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await mutate();
    setRefreshing(false);
  };

  const handleEditVehicle = (vehicule) => {
    const offer =
      vehicule.offer && vehicule.offer.length > 0 ? vehicule.offer[0] : null;
    if (!offer) {
      Alert.alert("Erreur", "Aucune offre à modifier");
      return;
    }
    // TODO: Navigation vers écran d'édition avec les données
    navigation.navigate("AddVehicle", { vehicule, offer });
  };

  const handleDeleteVehicle = async (vehicule) => {
    Alert.alert(
      "Supprimer",
      `Êtes-vous sûr de vouloir supprimer ${vehicule.model} ?\nCela supprimera également l'offre associée.`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await API.delete(
                `${process.env.EXPO_PUBLIC_VEHICULE_ROUTE}/my/${vehicule.vehicule_id}`
              );
              Alert.alert("Succès", "Véhicule supprimé avec succès");
              mutate(); // Rafraîchir la liste
            } catch (error) {
              console.error("Erreur suppression:", error);
              Alert.alert(
                "Erreur",
                error.response?.data?.message ||
                  "Impossible de supprimer le véhicule"
              );
            }
          },
        },
      ]
    );
  };

  const handleAddVehicle = () => {
    navigation.navigate("AddVehicle");
  };

  // Loading
  if (!data && !error) {
    return (
      <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <View style={[styles.header, {backgroundColor: theme.colors.primary}]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.onPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {color: theme.colors.onPrimary}]}>Mes véhicules</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  // Error
  if (error) {
    return (
      <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <View style={[styles.header, {backgroundColor: theme.colors.primary}]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.onPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {color: theme.colors.onPrimary}]}>Mes véhicules</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#FF6B6B" />
          <Text style={styles.errorText}>Erreur de chargement</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <View style={[styles.header, {backgroundColor: theme.colors.primary}]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.onPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {color: theme.colors.onPrimary} ]}>Mes véhicules</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="car-outline" size={60} color={theme.colors.subText} />
          <Text style={[styles.emptyText, {color: theme.colors.subText}]}>
            Vous n'avez pas encore de véhicules
          </Text>
          <TouchableOpacity
            style={[styles.addButtonLarge, {color: theme.colors.primary} ]}
            onPress={handleAddVehicle}
          >
            <Text style={[styles.addButtonTextLarge, {color: theme.colors.onPrimary} ]}>Ajouter un véhicule</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Render vehicle item
  const renderVehicule = ({ item }) => {
    // Récupérer la première offre (un véhicule a une seule offre)
    const offer = item.offer && item.offer.length > 0 ? item.offer[0] : null;

    return (
      <View style={[styles.card, {backgroundColor: theme.colors.card}]}>
        <View style={styles.cardContent}>
          {/* Image du véhicule */}
          <Image
            source={require("../assets/images/car-placeholder.png")}
            style={[styles.vehicleImage, {backgroundColor: theme.colors.rowBorder}]}
            resizeMode="cover"
          />

          {/* Informations du véhicule */}
          <View style={styles.vehicleInfo}>
            <Text style={[styles.model, { color: theme.colors.text}]}>{item.model}</Text>
            {offer ? (
              <>
                <Text style={[styles.availability, { color: theme.colors.primary}]}>Disponible en location</Text>
                {offer.adress && (
                  <View style={styles.locationRow}>
                    <Ionicons name="location-outline" size={14} color={theme.colors.subText} />
                    <Text style={[styles.location, {color: theme.colors.subText}]}>{offer.adress}</Text>
                  </View>
                )}
                {offer.price && (
                  <Text style={[styles.price, {color: theme.colors.text}]}>{offer.price} €/h</Text>
                )}
              </>
            ) : (
              <Text style={[styles.noOffer, {color: theme.colors.subText}]}>Aucune offre active</Text>
            )}
          </View>
        </View>

        {/* Boutons d'action - seulement si une offre existe */}
        {offer && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditVehicle(item)}
            >
              <Ionicons name="pencil-outline" size={16} color="#FF6B6B" />
              <Text style={styles.editButtonText}>Modifier la location</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteVehicle(item)}
            >
              <Ionicons name="close-outline" size={16} color="#FF6B6B" />
              <Text style={styles.deleteButtonText}>Supprimer la location</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.header, {backgroundColor: theme.colors.primary}]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: "white"}]}>Mes véhicules</Text>
        <View style={styles.headerSpacer} />
      </View>
      <FlatList
        data={data}
        renderItem={renderVehicule}
        keyExtractor={(item) => item.vehicule_id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
        ListFooterComponent={
          <TouchableOpacity style={[styles.addButton, {backgroundColor: theme.colors.primary}]} onPress={handleAddVehicle}>
            <Text style={[styles.addButtonText, {color: theme.colors.onPrimary}]}>Ajouter un véhicule</Text>
          </TouchableOpacity>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 4,
  },
  headerSpacer: {
    width: 32,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    marginTop: 16,
    marginBottom: 24,
    fontSize: 16,
    textAlign: "center",
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: "#FF6B6B",
    textAlign: "center",
  },
  listContainer: {
    padding: 16,
  },
  card: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    marginBottom: 12,
  },
  vehicleImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  vehicleInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  model: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  availability: {
    fontSize: 12,
    marginBottom: 4,
  },
  noOffer: {
    fontSize: 12,
    fontStyle: "italic",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  location: {
    fontSize: 12,
    marginLeft: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#FF6B6B",
  },
  editButtonText: {
    fontSize: 12,
    color: "#FF6B6B",
    marginLeft: 4,
    fontWeight: "500",
  },
  deleteButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#FF6B6B",
  },
  deleteButtonText: {
    fontSize: 12,
    color: "#FF6B6B",
    marginLeft: 4,
    fontWeight: "500",
  },
  addButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  addButtonLarge: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    marginTop: 24,
  },
  addButtonTextLarge: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
