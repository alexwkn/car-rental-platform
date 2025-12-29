import React, { useEffect, useMemo, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';


const INITIAL_REGION = {
  latitude: 50.464069,
  longitude: 4.86043,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function App() {
  const [region, setRegion] = useState(INITIAL_REGION);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted' || cancelled) return;
      setHasLocationPermission(true);

      const { coords } = await Location.getCurrentPositionAsync({});
      if (cancelled) return;

      setRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const markers = useMemo(() => ([
    { latitude: 50.464069, longitude: 4.86043, title: 'Example', description: 'Point of interest' },
  ]), []);

  return (
    <View style={styles.container}>
      <MapView
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
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
