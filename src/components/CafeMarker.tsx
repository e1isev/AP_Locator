import React from 'react';
import { Marker } from 'react-native-maps';
import { Cafe } from '../types/cafe';

interface Props {
  cafe: Cafe;
  onPress: () => void;
}

export default function CafeMarker({ cafe, onPress }: Props) {
  return (
    <Marker
      coordinate={{ latitude: cafe.lat, longitude: cafe.lng }}
      title={cafe.name}
      description={cafe.suburb}
      onPress={onPress}
      pinColor={cafe.allpress_verified ? '#2E2A26' : '#A89F91'}
    />
  );
}
