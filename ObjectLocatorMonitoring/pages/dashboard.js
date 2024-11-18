import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Object Locator Dashboard</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Objects Online</Text>
          <Text style={styles.statValue}>15</Text> {/* Total objects being tracked */}
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Last Location</Text>
          <Text style={styles.statValue}>Montfleury, Tunis </Text> {/* Last known location of an object */}
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Signal Strength</Text>
          <Text style={styles.statValue}>Strong</Text> {/* Status of the object’s signal */}
        </View>
      </View>

      <View style={styles.navigationContainer}>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>View Tracked Objects</Text> {/* Navigate to object list */}
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>View Map</Text> {/* Navigate to a map showing object locations */}
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>Settings</Text> {/* Settings for configuring object tracking */}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    width: '30%',
    alignItems: 'center',
  },
  statTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  navigationContainer: {
    marginTop: 20,
  },
  navButton: {
    backgroundColor: '#1C3F83',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginBottom: 12,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
