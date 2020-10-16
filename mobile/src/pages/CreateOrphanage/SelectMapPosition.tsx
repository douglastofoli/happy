import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import MapView, { MapEvent, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import mapMarkerImg from '../../images/map-marker.png';

export default function SelectMapPosition() {
  const navigation = useNavigation();
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  const [userPosition, setUserPosition] = useState({
    latitude: 0,
    longitude: 0
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();

      if (status !== 'granted') {
        alert('Precisamos de permissão para carregar o mapa.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserPosition(location.coords);
      console.log(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  function handleNextStep() {
    navigation.navigate('OrphanageData', { position });
  }

  function handleSelectMapPosition(event: MapEvent) {
    setPosition(event.nativeEvent.coordinate);
  }

  return (
    <View style={styles.container}>
      {userPosition.latitude !== 0 ? (
        <MapView
          initialRegion={{
            latitude: userPosition.latitude,
            longitude: userPosition.longitude,
            latitudeDelta: 0.008,
            longitudeDelta: 0.008
          }}
          style={styles.mapStyle}
          onPress={handleSelectMapPosition}
        >
          {position.latitude !== 0 && (
            <Marker
              icon={mapMarkerImg}
              coordinate={{
                latitude: position.latitude,
                longitude: position.longitude
              }}
            />
          )}
        </MapView>
      ) : (
        <ActivityIndicator
          style={styles.loading}
          size="large"
          color="#2AB5D1"
        />
      )}

      {position.latitude !== 0 && (
        <RectButton style={styles.nextButton} onPress={handleNextStep}>
          <Text style={styles.nextButtonText}>Próximo</Text>
        </RectButton>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },

  mapStyle: {
    width: Dimensions.get('window').width,
    height: '100%'
  },

  nextButton: {
    backgroundColor: '#15c3d6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,

    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 40
  },

  nextButtonText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: '#FFF'
  },

  loading: {
    flex: 1,
    alignItems: 'center'
  }
});
