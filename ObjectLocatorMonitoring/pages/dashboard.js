import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ledOn, setLedOn] = useState(false); // LED state
  const [buzzerOn, setBuzzerOn] = useState(false); // Buzzer state

  useEffect(() => {
    const fetchGpsData = async () => {
      try {
        const response = await fetch('http://192.168.43.228:3000/api/gps'); // Adjust URL as needed
        const data = await response.json();

        if (data.latitude && data.longitude) {
          setCoordinates({
            latitude: data.latitude,
            longitude: data.longitude,
          });

          setLastUpdateTime(new Date().toLocaleTimeString());
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching GPS data:', error);
        setLoading(false);
      }
    };

    const interval = setInterval(fetchGpsData, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleCommand = async (device, action) => {
    try {
      const response = await fetch(`http://192.168.43.228:3000/api/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device, action }),
      });

      if (response.ok) {
        Alert.alert(
          `${device} ${action.toUpperCase()}`,
          `The ${device} was successfully turned ${action}.`
        );
        if (device === 'LED') setLedOn(action === 'on');
        if (device === 'Buzzer') setBuzzerOn(action === 'on');
      } else {
        Alert.alert('Error', `Failed to turn ${device} ${action}.`);
      }
    } catch (error) {
      console.error('Error sending command:', error);
    }
  };

  const toggleDevice = (device) => {
    const action = device === 'LED' ? (ledOn ? 'off' : 'on') : buzzerOn ? 'off' : 'on';
    handleCommand(device, action);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1C3F83" />
        <Text style={styles.loadingText}>Fetching location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Object Locator Dashboard</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="location-outline" size={40} color="#1C3F83" />
          <Text style={styles.statTitle}>Last Location</Text>
          <Text style={styles.statValue}>
            {coordinates.latitude}, {coordinates.longitude}
          </Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="wifi-outline" size={40} color="#1C3F83" />
          <Text style={styles.statTitle}>Signal{'\n'}Strength</Text>
          <Text style={styles.statValue}>Strong</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="time" size={40} color="#1C3F83" />
          <Text style={styles.statTitle}>Last Seen</Text>
          <Text style={styles.statValue}>{lastUpdateTime}</Text>
        </View>
      </View>

      <View style={styles.controlContainer}>
        <TouchableOpacity
          style={[styles.controlButton, ledOn ? styles.buttonActive : styles.buttonInactive]}
          onPress={() => toggleDevice('LED')}
        >
          <Ionicons
            name={ledOn ? 'bulb' : 'bulb-outline'}
            size={22}
            color="#fff"
          />
          <Text style={styles.controlButtonText}>
            {ledOn ? 'Turn LED Off' : 'Turn LED On'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.controlButton, buzzerOn ? styles.buttonActive : styles.buttonInactive]}
          onPress={() => toggleDevice('Buzzer')}
        >
          <Ionicons
            name={buzzerOn ? 'notifications' : 'notifications-outline'}
            size={22}
            color="#fff"
          />
          <Text style={styles.controlButtonText}>
            {buzzerOn ? 'Turn Buzzer Off' : 'Turn Buzzer On'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f9fc',
    marginTop: 40,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#1C3F83',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    shadowColor: '#1C3F83',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
    height: 230,
  },
  statTitle: {
    fontSize: 18,
    color: '#666',
    marginVertical: 10,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  controlContainer: {
    marginTop: 20,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginBottom: 15,
    justifyContent: 'center',
    shadowColor: '#1C3F83',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  buttonActive: {
    backgroundColor: '#28a745', // Green for active state
  },
  buttonInactive: {
    backgroundColor: '#dc3545', // Red for inactive state
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});
