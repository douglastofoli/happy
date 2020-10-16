import React, { useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';
import mapMarker from '../images/map-marker.png';
import { RectButton } from 'react-native-gesture-handler';
import api from '../services/api';

interface Orphanage {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

function OrphanagesMap() {
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
  const navigation = useNavigation();
  const [userPosition, setUserPosition] = useState({
    latitude: 0,
    longitude: 0
  });

  useFocusEffect(() => {
    api.get('orphanages').then((response) => {
      setOrphanages(response.data);
    });

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

  function handleNavigateToOrphanageDetail(id: number) {
    navigation.navigate('OrphanageDetails', { id });
  }

  function handleNavigateToCreateOrphanage() {
    navigation.navigate('SelectMapPosition');
  }

  return (
    <View style={styles.container}>
      {userPosition.latitude !== 0 ? (
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: userPosition.latitude,
            longitude: userPosition.longitude,
            latitudeDelta: 0.008,
            longitudeDelta: 0.008
          }}
        >
          {orphanages.map((orphanage) => {
            return (
              <Marker
                key={orphanage.id}
                icon={mapMarker}
                calloutAnchor={{
                  x: 2.7,
                  y: 0.8
                }}
                coordinate={{
                  latitude: orphanage.latitude,
                  longitude: orphanage.longitude
                }}
              >
                <Callout
                  tooltip
                  onPress={() => handleNavigateToOrphanageDetail(orphanage.id)}
                >
                  <View style={styles.calloutContainer}>
                    <Text style={styles.calloutText}>{orphanage.name}</Text>
                  </View>
                </Callout>
              </Marker>
            );
          })}
        </MapView>
      ) : (
        <ActivityIndicator
          style={styles.loading}
          size="large"
          color="#2AB5D1"
        />
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {/* {orphanages.length} orfanatos encontrados */}
          {orphanages.length === 1
            ? `${orphanages.length} orfanato encontrado`
            : `${orphanages.length} orfanatos encontrados`}
        </Text>

        <RectButton
          style={styles.createOrphanageButton}
          onPress={handleNavigateToCreateOrphanage}
        >
          <Feather name="plus" size={20} color="#FFF" />
        </RectButton>
      </View>
    </View>
  );
}

export default OrphanagesMap;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  loading: {
    flex: 1,
    alignItems: 'center'
  },

  map: {
    width: Dimensions.get('window').width,
    height: '100%'
  },

  calloutContainer: {
    width: 160,
    height: 46,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    justifyContent: 'center'
  },

  calloutText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: '#0089a5'
  },

  footer: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 32,
    backgroundColor: '#FFF',
    borderRadius: 20,
    height: 56,
    paddingLeft: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3
  },

  footerText: {
    fontFamily: 'Nunito_700Bold',
    color: '#8fa7b3'
  },

  createOrphanageButton: {
    width: 56,
    height: 56,
    backgroundColor: '#15c3d6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
