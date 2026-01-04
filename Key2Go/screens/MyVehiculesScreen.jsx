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

export default function MyVehiculesScreen({ navigation }) {
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
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mes véhicules</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007C7C" />
        </View>
      </SafeAreaView>
    );
  }

  // Error
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mes véhicules</Text>
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
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mes véhicules</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="car-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>
            Vous n'avez pas encore de véhicules
          </Text>
          <TouchableOpacity
            style={styles.addButtonLarge}
            onPress={handleAddVehicle}
          >
            <Text style={styles.addButtonTextLarge}>Ajouter un véhicule</Text>
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
      <View style={styles.card}>
        <View style={styles.cardContent}>
          {/* Image du véhicule */}
          <Image
            source={require("../assets/images/car-placeholder.png")}
            style={styles.vehicleImage}
            resizeMode="cover"
          />

          {/* Informations du véhicule */}
          <View style={styles.vehicleInfo}>
            <Text style={styles.model}>{item.model}</Text>
            {offer ? (
              <>
                <Text style={styles.availability}>Disponible en location</Text>
                {offer.adress && (
                  <View style={styles.locationRow}>
                    <Ionicons name="location-outline" size={14} color="#666" />
                    <Text style={styles.location}>{offer.adress}</Text>
                  </View>
                )}
                {offer.price && (
                  <Text style={styles.price}>{offer.price} €/h</Text>
                )}
              </>
            ) : (
              <Text style={styles.noOffer}>Aucune offre active</Text>
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes véhicules</Text>
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
            colors={["#007C7C"]}
          />
        }
        ListFooterComponent={
          <TouchableOpacity style={styles.addButton} onPress={handleAddVehicle}>
            <Text style={styles.addButtonText}>Ajouter un véhicule</Text>
          </TouchableOpacity>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#007C7C",
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
    color: "#fff",
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
    color: "#666",
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
    backgroundColor: "#fff",
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
    backgroundColor: "#E0E0E0",
  },
  vehicleInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  model: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  availability: {
    fontSize: 12,
    color: "#007C7C",
    marginBottom: 4,
  },
  noOffer: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  location: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
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
    backgroundColor: "#fff",
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
    backgroundColor: "#fff",
  },
  deleteButtonText: {
    fontSize: 12,
    color: "#FF6B6B",
    marginLeft: 4,
    fontWeight: "500",
  },
  addButton: {
    backgroundColor: "#007C7C",
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
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  addButtonLarge: {
    backgroundColor: "#007C7C",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    marginTop: 24,
  },
  addButtonTextLarge: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
