import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { isOpenNow, formatHoursToday } from '../lib/hours';

type Props = NativeStackScreenProps<RootStackParamList, 'CafeDetail'>;

export default function CafeDetailScreen({ route }: Props) {
  const { cafe } = route.params;
  const open = isOpenNow(cafe.hours);

  const openDirections = () => {
    const query = encodeURIComponent(cafe.address);
    Linking.openURL(`https://maps.apple.com/?daddr=${query}`).catch(() =>
      Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${query}`)
    );
  };

  const callCafe = () => {
    if (cafe.phone) Linking.openURL(`tel:${cafe.phone}`);
  };

  const openWebsite = () => {
    if (cafe.website) Linking.openURL(cafe.website);
  };

  return (
    <ScrollView style={styles.container}>
      {cafe.photo_url && <Image source={{ uri: cafe.photo_url }} style={styles.photo} />}

      <View style={styles.content}>
        <Text style={styles.name}>{cafe.name}</Text>
        <Text style={styles.address}>
          {cafe.address}, {cafe.suburb} {cafe.state} {cafe.postcode}
        </Text>

        {open !== null && (
          <Text style={[styles.status, open ? styles.openText : styles.closedText]}>
            {open ? 'Open now' : 'Closed now'} · {formatHoursToday(cafe.hours)}
          </Text>
        )}

        {cafe.allpress_verified && <Text style={styles.verified}>Verified Allpress stockist</Text>}

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={openDirections}>
            <Text style={styles.actionLabel}>Directions</Text>
          </TouchableOpacity>
          {cafe.phone && (
            <TouchableOpacity style={styles.actionButton} onPress={callCafe}>
              <Text style={styles.actionLabel}>Call</Text>
            </TouchableOpacity>
          )}
          {cafe.website && (
            <TouchableOpacity style={styles.actionButton} onPress={openWebsite}>
              <Text style={styles.actionLabel}>Website</Text>
            </TouchableOpacity>
          )}
        </View>

        {cafe.notes && <Text style={styles.notes}>{cafe.notes}</Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  photo: { width: '100%', height: 200 },
  content: { padding: 16 },
  name: { fontSize: 22, fontWeight: '700' },
  address: { fontSize: 14, color: '#555', marginTop: 4 },
  status: { fontSize: 14, marginTop: 10, fontWeight: '600' },
  openText: { color: '#1a7a3c' },
  closedText: { color: '#a3231f' },
  verified: { marginTop: 8, fontSize: 13, color: '#2E2A26', fontWeight: '600' },
  actions: { flexDirection: 'row', marginTop: 16, gap: 10 },
  actionButton: {
    backgroundColor: '#2E2A26',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionLabel: { color: 'white', fontWeight: '600' },
  notes: { marginTop: 16, fontSize: 13, color: '#777' },
});
