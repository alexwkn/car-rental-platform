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
import { useTheme } from "../context/ThemeContext";


export default function AddVehicleScreen({ navigation }) {
  const { theme } = useTheme();
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
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.card, borderBottomColor: theme.colors.rowBorder}]}>
      {/* Header */}
      <View style={[styles.header, { color: theme.colors.text, backgroundColor: theme.colors.primary}]}>
        <TouchableOpacity
          style={[styles.backButton]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: "white"}]}>
          {isEditMode ? "Modifier l'offre" : "Ajouter un véhicule"}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
          {/* Modèle */}
          <TextInput
            style={[styles.input, {backgroundColor: theme.colors.card, borderColor: theme.colors.rowBorder, color: theme.colors.text}, isEditMode && styles.inputDisabled]}
            placeholder="Modèle du véhicule (ex: Peugeot 208)"
            value={modele}
            onChangeText={setModele}
            placeholderTextColor={theme.colors.mutedText}
            editable={!isEditMode}
          />

          {/* Plaque d'immatriculation */}
          <TextInput
            style={[styles.input, {backgroundColor: theme.colors.card, borderColor: theme.colors.rowBorder, color: theme.colors.text} ,isEditMode && styles.inputDisabled]}
            placeholder="Plaque d'immatriculation"
            value={plaque}
            onChangeText={setPlaque}
            autoCapitalize="characters"
            placeholderTextColor={theme.colors.mutedText}
            editable={!isEditMode}
          />

          {/* Description */}
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              {backgroundColor: theme.colors.card, borderColor: theme.colors.rowBorder, color: theme.colors.text},
              isEditMode && styles.inputDisabled,
            ]}
            placeholder="Description du véhicule (optionnel)"
            value={description}
            onChangeText={setDescription}
            placeholderTextColor={theme.colors.mutedText}
            multiline
            numberOfLines={3}
            editable={!isEditMode}
          />

          {/* Niveau de carburant */}
          <View style={styles.sliderContainer}>
            <Text style={[styles.label, {color: theme.colors.text}]}>Le niveau de carburant de la voiture</Text>
            <View style={styles.sliderRow}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={fuelLevel}
                onValueChange={setFuelLevel}
                minimumTrackTintColor={theme.colors.primary}
                maximumTrackTintColor={theme.colors.rawBorder}
                thumbTintColor={theme.colors.primary}
              />
              <Text style={[styles.sliderValue, {color: theme.colors.primary}]}>{fuelLevel} %</Text>
            </View>
          </View>

          {/* Date de retour */}
          <View style={styles.dateContainer}>
            <Text style={[styles.label, {color: theme.colors.text}]}>Date de retour</Text>
            <TouchableOpacity
              style={[styles.dateButton, {backgroundColor: theme.colors.card, borderColor: theme.colors.rowBorder}]}
              onPress={showDatePickerModal}
            >
              <Text style={[styles.dateText, {color: theme.colors.text}]}>
                {dateRetour.toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
              <Ionicons name="chevron-down" size={20} color={theme.colors.icon} />
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
            style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.rowBorder, backgroundColor: theme.colors.card}]}
            placeholder="Adresse de location"
            value={adresse}
            onChangeText={setAdresse}
            placeholderTextColor={theme.colors.mutedText}
          />

          {/* Tarif */}
          <View style={styles.tarifContainer}>
            <Text style={[styles.label, {color: theme.colors.text}]}>Tarif :</Text>
            <View style={styles.tarifRow}>
              <TextInput
                style={[styles.tarifInput, {color: theme.colors.text, borderColor: theme.colors.rowBorder, backgroundColor: theme.colors.card}]}
                placeholder="Nombre"
                value={tarif}
                onChangeText={setTarif}
                keyboardType="decimal-pad"
                placeholderTextColor={theme.colors.mutedText}
              />
              <Text style={[styles.tarifUnit, {color: theme.colors.subText}]}>€ / heure(s)</Text>
            </View>
          </View>

          {/* Bouton Confirmer */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              {backgroundColor: theme.colors.primary},
              loading
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={[styles.submitButtonText, {color: theme.colors.onPrimary}]}>
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
  },
  header: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
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
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  input: {
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
    paddingTop: 14,
  },
  inputDisabled: {
  },
  pickerContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  pickerWrapper: {
    borderRadius: 25,
    borderWidth: 1,
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
    marginLeft: 12,
    minWidth: 50,
  },
  dateContainer: {
    marginBottom: 16,
  },
  dateButton: {
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
  },
  tarifContainer: {
    marginBottom: 24,
  },
  tarifRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  tarifInput: {
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    flex: 1,
    marginRight: 12,
  },
  tarifUnit: {
    fontSize: 16,
  },
  submitButton: {
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
  submitButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
