import React, { useEffect, useRef, useState, useMemo } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, ActivityIndicator, Text, Pressable, Image } from 'react-native';
import * as Location from 'expo-location';
import TopHeader from '../components/TopHeader';
import { apiRequest } from '../utils/api';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from '../context/ThemeContext';


const INITIAL_REGION = {
  latitude: 50.464069,
  longitude: 4.86043,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};



const toRadians = (deg) => (deg * Math.PI) / 180;
const haversineKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

export default function MapScreen() {
  const { theme } = useTheme();
    
  const navigation = useNavigation();
  const user = useSelector(state => state.user.userInfo);
  const token = useSelector(state => state.user.token);

  const mapRef = useRef(null);
  const [region, setRegion] = useState(INITIAL_REGION);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [userCoords, setUserCoords] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTick, setRefreshTick] = useState(0);

  // Rafraîchir quand on revient à l'écran
  useFocusEffect(
    useCallback(() => {
      setRefreshTick((v) => v + 1);
    }, [])
  );


  // Ask permission and locate user
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted' || cancelled) return;
      setHasLocationPermission(true);
      const { coords } = await Location.getCurrentPositionAsync({});
      if (cancelled) return;
      const nextRegion = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      };
      setRegion(nextRegion);
      setUserCoords(coords);
      if (mapRef.current) {
        mapRef.current.animateToRegion(nextRegion, 400);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Load offers and geocode addresses
  useEffect(() => {
    let cancelled = false;
    const loadOffers = async () => {
      try {
        setLoading(true);
        const res = await apiRequest('GET', `${process.env.EXPO_PUBLIC_OFFER_ROUTE}/available`);
        const offers = res?.data || [];

        const geocoded = await Promise.all(
          offers.map(async (offer) => {
            const address = offer.adress;
            if (!address) return null;
            try {
              const geo = await Location.geocodeAsync(address);
              const coords = geo?.[0];
              if (!coords) return null;

              const vehicleLabel = offer.vehicule?.model || offer.vehicule?.description || 'Véhicule';
              const descLine = offer.description || 'Offre disponible';
              const priceLine = offer.price ? `${offer.price} €` : '';
              const distance = userCoords ? haversineKm(userCoords.latitude, userCoords.longitude, coords.latitude, coords.longitude) : null;

              return {
                latitude: coords.latitude,
                longitude: coords.longitude,
                title: vehicleLabel,
                description: `${descLine}${priceLine ? ' • ' + priceLine : ''}`,
                distance,
                offer,
              };
            } catch (e) {
              return null;
            }
          })
        );

        if (cancelled) return;
        const valid = geocoded.filter(Boolean);
        setMarkers(valid);
        if (!selected && valid.length > 0) {
          setSelected(valid[0]);
          if (mapRef.current) {
            mapRef.current.animateToRegion({
              latitude: valid[0].latitude,
              longitude: valid[0].longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }, 400);
          }
        }
      } catch (e) {
        if (!cancelled) setMarkers([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadOffers();
    return () => {
      cancelled = true;
    };
  }, [user?.id, token, userCoords, selected, refreshTick]);

  const selectedOffer = selected?.offer;

  const subtitle = useMemo(() => {
    if (!selected) return '';
    const distanceTxt = selected.distance != null ? `${selected.distance} km` : null;
    const priceTxt = selected.offer?.price ? `${selected.offer.price} €` : null;
    const parts = [distanceTxt, priceTxt].filter(Boolean);
    return parts.join(' • ');
  }, [selected]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background}]}>
      <TopHeader title="Carte" />
      {loading && (
        <View style={[styles.loader, { backgroundColor: theme.colors.card}]}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      )}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        showsUserLocation={hasLocationPermission}
        showsMyLocationButton={hasLocationPermission}
      >
        {markers.map((marker, index) => (
          <Marker
            key={`${marker.title}-${index}`}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            title={marker.title}
            description={marker.description}
            onPress={() => setSelected(marker)}
          />
        ))}
      </MapView>

      {selectedOffer && (
        <Pressable style={[styles.card, { backgroundColor: theme.colors.card}]} onPress={() => navigation.navigate('OfferDetailScreen', { offer: selectedOffer })}>
          <View style={styles.cardRow}>
            <View style={[styles.cardAvatar, { backgroundColor: theme.colors.bg}]}>
              <Image source={require('../assets/images/car-placeholder.png')} style={styles.cardAvatarImg} resizeMode="contain" />
            </View>
            <View style={styles.cardInfo}>
              <Text style={[styles.cardTitle, { color: theme.colors.heading}]}>{selectedOffer.vehicule?.model || 'Véhicule'}</Text>
              <Text style={[styles.cardSubtitle, {color: theme.colors.subText}]} numberOfLines={2}>
                {subtitle || selectedOffer.description || 'Offre disponible'}
              </Text>
            </View>
            <View style={[styles.cardIconWrap, { backgroundColor: theme.colors.bg}]}>
              <Text style={styles.cardIcon}>🚗</Text>
            </View>
          </View>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
  loader: {
    position: 'absolute',
    top: 70,
    right: 16,
    zIndex: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  card: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  cardAvatar: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardAvatarImg: { width: 42, height: 42 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700'},
  cardSubtitle: { fontSize: 13, marginTop: 4 },
  cardIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  cardIcon: { fontSize: 18 },
});
