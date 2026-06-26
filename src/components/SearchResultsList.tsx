import React from 'react';
import { FlatList, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Cafe } from '../types/cafe';

interface Props {
  results: Cafe[];
  onSelect: (cafe: Cafe) => void;
}

export default function SearchResultsList({ results, onSelect }: Props) {
  return (
    <View style={styles.container}>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={<Text style={styles.empty}>No cafes found</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row} onPress={() => onSelect(item)}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.suburb}>{item.suburb}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 104,
    left: 16,
    right: 16,
    maxHeight: 260,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  row: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  name: { fontWeight: '600', fontSize: 15 },
  suburb: { color: '#666', fontSize: 13 },
  empty: { padding: 14, color: '#666' },
});
