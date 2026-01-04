import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import Slider from "@react-native-community/slider";
import DateTimePicker from "@react-native-community/datetimepicker";
import { API } from "../utils/api";

export default function AddVehicleScreen({ navigation }) {
  const route = useRoute();
  const { vehicule, offer } = route.params || {};
  const isEditMode = !!vehicule && !!offer;

  const [modele, setModele] = useState("");
  const [plaque, setPlaque] = useState("");
  const [description, setDescription] = useState("");

  const [fuelLevel, setFuelLevel] = useState(100);
  const [dateRetour, setDateRetour] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tarif, setTarif] = useState("");
  const [adresse, setAdresse] = useState("");

  const [loading, setLoading] = useState(false);

  // Charger les données en mode édition
  useEffect(() => {
    if (isEditMode) {
      setModele(vehicule.model || "");
      setPlaque(vehicule.licence_plate || "");
      setDescription(vehicule.description || "");
      setFuelLevel(parseFloat(offer.fuel_level) || 100);
      setDateRetour(offer.end_date ? new Date(offer.end_date) : new Date());
      setTarif(offer.price?.toString() || "");
      setAdresse(offer.adress || "");
    }
  }, [isEditMode, vehicule, offer]);

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (event && event.type === "set" && selectedDate) {
      setDateRetour(selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (!modele || !plaque) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (!tarif || isNaN(tarif) || parseFloat(tarif) <= 0) {
      Alert.alert("Erreur", "Veuillez entrer un tarif valide");
      return;
    }

    if (!adresse) {
      Alert.alert("Erreur", "Veuillez entrer une adresse");
      return;
    }

    setLoading(true);

    try {
      if (isEditMode) {
        // Mode édition : mettre à jour l'offre
        const offerPayload = {
          start_date: new Date(offer.start_date).toISOString().split("T")[0],
          end_date: dateRetour.toISOString().split("T")[0],
          fuel_level: fuelLevel,
          adress: adresse,
          price: parseFloat(tarif),
          description: description || null,
          vehicule_id: vehicule.vehicule_id,
        };

        await API.put(
          `${process.env.EXPO_PUBLIC_OFFER_ROUTE}/my/${offer.offer_id}`,
          offerPayload
        );

        Alert.alert("Succès", "Offre modifiée avec succès", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        // Mode création
        const payload = {
          vehicule: {
            model: modele,
            licence_plate: plaque,
            description: description || null,
          },
          offer: {
            start_date: new Date().toISOString().split("T")[0],
            end_date: dateRetour.toISOString().split("T")[0],
            fuel_level: fuelLevel,
            adress: adresse,
            price: parseFloat(tarif),
            description: description || null,
          },
        };

        await API.post(
          `${process.env.EXPO_PUBLIC_VEHICULE_ROUTE}/with-offer`,
          payload
        );

        Alert.alert("Succès", "Véhicule et offre créés avec succès", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      console.error("Erreur création:", error);
      Alert.alert(
        "Erreur",
        error.response?.data?.message || "Impossible de créer le véhicule"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#007C7C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditMode ? "Modifier l'offre" : "Ajouter un véhicule"}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
          {/* Modèle */}
          <TextInput
            style={[styles.input, isEditMode && styles.inputDisabled]}
            placeholder="Modèle du véhicule (ex: Peugeot 208)"
            value={modele}
            onChangeText={setModele}
            placeholderTextColor="#999"
            editable={!isEditMode}
          />

          {/* Plaque d'immatriculation */}
          <TextInput
            style={[styles.input, isEditMode && styles.inputDisabled]}
            placeholder="Plaque d'immatriculation"
            value={plaque}
            onChangeText={setPlaque}
            autoCapitalize="characters"
            placeholderTextColor="#999"
            editable={!isEditMode}
          />

          {/* Description */}
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              isEditMode && styles.inputDisabled,
            ]}
            placeholder="Description du véhicule (optionnel)"
            value={description}
            onChangeText={setDescription}
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
            editable={!isEditMode}
          />

          {/* Niveau de carburant */}
          <View style={styles.sliderContainer}>
            <Text style={styles.label}>Le niveau de carburant de retour</Text>
            <View style={styles.sliderRow}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={fuelLevel}
                onValueChange={setFuelLevel}
                minimumTrackTintColor="#007C7C"
                maximumTrackTintColor="#D3D3D3"
                thumbTintColor="#007C7C"
              />
              <Text style={styles.sliderValue}>{fuelLevel} %</Text>
            </View>
          </View>

          {/* Date de retour */}
          <View style={styles.dateContainer}>
            <Text style={styles.label}>Date de retour</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={showDatePickerModal}
            >
              <Text style={styles.dateText}>
                {dateRetour.toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={dateRetour}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={handleDateChange}
            />
          )}

          {/* Adresse */}
          <TextInput
            style={styles.input}
            placeholder="Adresse de location"
            value={adresse}
            onChangeText={setAdresse}
            placeholderTextColor="#999"
          />

          {/* Tarif */}
          <View style={styles.tarifContainer}>
            <Text style={styles.label}>Tarif :</Text>
            <View style={styles.tarifRow}>
              <TextInput
                style={styles.tarifInput}
                placeholder="Nombre"
                value={tarif}
                onChangeText={setTarif}
                keyboardType="decimal-pad"
                placeholderTextColor="#999"
              />
              <Text style={styles.tarifUnit}>€ / heure(s)</Text>
            </View>
          </View>

          {/* Bouton Confirmer */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading
                ? isEditMode
                  ? "Modification..."
                  : "Création..."
                : isEditMode
                ? "Modifier"
                : "Confirmer"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#fff",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
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
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
    paddingTop: 14,
  },
  inputDisabled: {
    backgroundColor: "#F0F0F0",
    color: "#999",
  },
  pickerContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  pickerWrapper: {
    backgroundColor: "#fff",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  sliderContainer: {
    marginBottom: 24,
  },
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007C7C",
    marginLeft: 12,
    minWidth: 50,
  },
  dateContainer: {
    marginBottom: 16,
  },
  dateButton: {
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  tarifContainer: {
    marginBottom: 24,
  },
  tarifRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  tarifInput: {
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    flex: 1,
    marginRight: 12,
  },
  tarifUnit: {
    fontSize: 16,
    color: "#666",
  },
  submitButton: {
    backgroundColor: "#007C7C",
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: "#999",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
