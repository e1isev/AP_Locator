import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, TextInput, Text } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import ClusteredMapView from 'react-native-map-clustering';
import * as Location from 'expo-location';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Cafe } from '../types/cafe';
import { fetchCafesInBounds, searchCafes } from '../lib/cafes';
import { RootStackParamList } from '../navigation/types';
import CafeMarker from '../components/CafeMarker';
import SearchResultsList from '../components/SearchResultsList';

const AUSTRALIA_REGION: Region = {
  latitude: -25.2744,
  longitude: 133.7751,
  latitudeDelta: 25,
  longitudeDelta: 25,
};

type Props = NativeStackScreenProps<RootStackParamList, 'Map'>;

export default function MapScreen({ navigation }: Props) {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Cafe[] | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mapRef = useRef<MapView | null>(null);

  const loadCafesForRegion = useCallback(async (region: Region) => {
    setLoading(true);
    try {
      const data = await fetchCafesInBounds({
        minLat: region.latitude - region.latitudeDelta / 2,
        maxLat: region.latitude + region.latitudeDelta / 2,
        minLng: region.longitude - region.longitudeDelta / 2,
        maxLng: region.longitude + region.longitudeDelta / 2,
      });
      setCafes(data);
      setError(null);
    } catch (e) {
      console.warn('Failed to load cafes', e);
      setError('Could not load cafes. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const onRegionChangeComplete = useCallback(
    (region: Region) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => loadCafesForRegion(region), 400);
    },
    [loadCafesForRegion]
  );

  const centerOnUser = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;
    const location = await Location.getCurrentPositionAsync({});
    mapRef.current?.animateToRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    });
  }, []);

  React.useEffect(() => {
    centerOnUser();
    loadCafesForRegion(AUSTRALIA_REGION);
  }, []);

  const onChangeQuery = useCallback((text: string) => {
    setQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!text.trim()) {
      setSearchResults(null);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await searchCafes(text.trim());
        setSearchResults(results);
      } catch (e) {
        console.warn('Search failed', e);
      }
    }, 300);
  }, []);

  const onSelectCafe = useCallback(
    (cafe: Cafe) => {
      navigation.navigate('CafeDetail', { cafe });
    },
    [navigation]
  );

  return (
    <View style={styles.container}>
      {/* react-native-map-clustering's mapRef prop type is mistyped upstream; spread as a plain object to bypass it */}
      <ClusteredMapView
        {...({
          mapRef: (ref: MapView | null) => {
            mapRef.current = ref;
          },
        } as object)}
        style={styles.map}
        initialRegion={AUSTRALIA_REGION}
        onRegionChangeComplete={onRegionChangeComplete}
        showsUserLocation
      >
        {cafes.map((cafe) => (
          <CafeMarker key={cafe.id} cafe={cafe} onPress={() => onSelectCafe(cafe)} />
        ))}
      </ClusteredMapView>

      <View style={styles.searchBar}>
        <TextInput
          placeholder="Search by cafe or suburb"
          value={query}
          onChangeText={onChangeQuery}
          style={styles.searchInput}
        />
      </View>

      {searchResults !== null && (
        <SearchResultsList results={searchResults} onSelect={onSelectCafe} />
      )}

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator />
        </View>
      )}

      {error && !loading && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  searchBar: {
    position: 'absolute',
    top: 56,
    left: 16,
    right: 16,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  loadingOverlay: {
    position: 'absolute',
    top: 110,
    alignSelf: 'center',
  },
  errorBanner: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: '#a3231f',
    borderRadius: 8,
    padding: 12,
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
  },
});
