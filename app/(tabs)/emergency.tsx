import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  ScrollView,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

// Define types for hospital data
interface Hospital {
  id: string;
  name: string;
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    }
  };
  rating?: number;
  open_now?: boolean;
  distance?: number;
}

export default function EmergencyScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  // Get user location and nearby hospitals on component mount
  useEffect(() => {
    (async () => {
      try {
        // Request location permissions
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setLoading(false);
          return;
        }

        // Get current location
        let currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest
        });
        setLocation(currentLocation);

        // Search for nearby hospitals
        await searchNearbyHospitals(currentLocation);
      } catch (error) {
        console.error('Error getting location:', error);
        setErrorMsg('Could not get your location. Please try again.');
        setLoading(false);
      }
    })();
  }, []);

  // Function to search for nearby hospitals using Google Places API
  const searchNearbyHospitals = async (userLocation: Location.LocationObject) => {
    try {
      // In a real app, you would use a proper API key and make a fetch request to Google Places API
      // For demo purposes, we'll use mock data
      const mockHospitals: Hospital[] = [
        {
          id: '1',
          name: 'City General Hospital',
          vicinity: '123 Main St, City',
          geometry: {
            location: {
              lat: userLocation.coords.latitude + 0.01,
              lng: userLocation.coords.longitude + 0.01
            }
          },
          rating: 4.5,
          open_now: true,
          distance: 1.2
        },
        {
          id: '2',
          name: 'Community Medical Center',
          vicinity: '456 Oak Ave, City',
          geometry: {
            location: {
              lat: userLocation.coords.latitude - 0.01,
              lng: userLocation.coords.longitude - 0.01
            }
          },
          rating: 4.2,
          open_now: true,
          distance: 1.8
        },
        {
          id: '3',
          name: 'Emergency Care Clinic',
          vicinity: '789 Pine St, City',
          geometry: {
            location: {
              lat: userLocation.coords.latitude + 0.015,
              lng: userLocation.coords.longitude - 0.015
            }
          },
          rating: 3.9,
          open_now: true,
          distance: 2.3
        }
      ];

      setHospitals(mockHospitals);
      setLoading(false);

      // Fit map to show all markers
      if (mockHospitals.length > 0 && mapRef.current) {
        const coordinates = [
          { 
            latitude: userLocation.coords.latitude, 
            longitude: userLocation.coords.longitude 
          },
          ...mockHospitals.map(hospital => ({
            latitude: hospital.geometry.location.lat,
            longitude: hospital.geometry.location.lng
          }))
        ];

        mapRef.current.fitToCoordinates(coordinates, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true
        });
      }
    } catch (error) {
      console.error('Error searching for hospitals:', error);
      setErrorMsg('Could not find nearby hospitals. Please try again.');
      setLoading(false);
    }
  };

  // Function to get directions to a hospital
  const getDirections = (hospital: Hospital) => {
    if (!location) return;

    const scheme = Platform.select({ ios: 'maps:', android: 'geo:' });
    const latLng = `${hospital.geometry.location.lat},${hospital.geometry.location.lng}`;
    const label = hospital.name;
    const url = Platform.select({
      ios: `${scheme}q=${label}&ll=${latLng}&z=16`,
      android: `${scheme}0,0?q=${latLng}(${label})`
    });

    if (url) {
      Linking.openURL(url);
    }
  };

  // Function to call emergency services
  const callEmergency = () => {
    Alert.alert(
      'Emergency Call',
      'Are you sure you want to call emergency services?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call', 
          style: 'destructive',
          onPress: () => {
            const emergencyNumber = '911'; // Use appropriate emergency number for your region
            Linking.openURL(`tel:${emergencyNumber}`);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Emergency</Text>
        <TouchableOpacity 
          style={styles.emergencyCallButton}
          onPress={callEmergency}
        >
          <MaterialIcons name="phone" size={24} color="#FFFFFF" />
          <Text style={styles.emergencyCallText}>Emergency Call</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E74C3C" />
          <Text style={styles.loadingText}>Finding nearby hospitals...</Text>
        </View>
      ) : errorMsg ? (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error" size={48} color="#E74C3C" />
          <Text style={styles.errorText}>{errorMsg}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              setErrorMsg(null);
              // Retry getting location
              Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Highest
              }).then(location => {
                setLocation(location);
                searchNearbyHospitals(location);
              }).catch(error => {
                console.error('Error getting location:', error);
                setErrorMsg('Could not get your location. Please try again.');
                setLoading(false);
              });
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.contentContainer}>
          {/* Map View */}
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              initialRegion={location ? {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              } : undefined}
              showsUserLocation
              showsMyLocationButton
              showsCompass
              toolbarEnabled
            >
              {/* User's location marker */}
              {location && (
                <Marker
                  coordinate={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                  }}
                  pinColor="#4A90E2"
                  title="Your Location"
                  description="You are here"
                />
              )}

              {/* Hospital markers */}
              {hospitals.map(hospital => (
                <Marker
                  key={hospital.id}
                  coordinate={{
                    latitude: hospital.geometry.location.lat,
                    longitude: hospital.geometry.location.lng,
                  }}
                  pinColor="#E74C3C"
                  title={hospital.name}
                  description={hospital.vicinity}
                  onPress={() => setSelectedHospital(hospital)}
                >
                  <Callout tooltip>
                    <View style={styles.calloutContainer}>
                      <Text style={styles.calloutTitle}>{hospital.name}</Text>
                      <Text style={styles.calloutAddress}>{hospital.vicinity}</Text>
                      {hospital.rating && (
                        <View style={styles.ratingContainer}>
                          <Text style={styles.ratingText}>{hospital.rating}</Text>
                          <MaterialIcons name="star" size={16} color="#F1C40F" />
                        </View>
                      )}
                      <Text style={styles.calloutStatus}>
                        {hospital.open_now ? 'Open Now' : 'Closed'}
                      </Text>
                    </View>
                  </Callout>
                </Marker>
              ))}
            </MapView>
          </View>

          {/* Hospital List */}
          <View style={styles.hospitalsContainer}>
            <Text style={styles.hospitalsTitle}>Nearby Hospitals</Text>
            <ScrollView style={styles.hospitalsList}>
              {hospitals.map(hospital => (
                <TouchableOpacity
                  key={hospital.id}
                  style={[
                    styles.hospitalItem,
                    selectedHospital?.id === hospital.id && styles.selectedHospitalItem
                  ]}
                  onPress={() => {
                    setSelectedHospital(hospital);
                    // Center map on selected hospital
                    mapRef.current?.animateToRegion({
                      latitude: hospital.geometry.location.lat,
                      longitude: hospital.geometry.location.lng,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }, 500);
                  }}
                >
                  <View style={styles.hospitalInfo}>
                    <Text style={styles.hospitalName}>{hospital.name}</Text>
                    <Text style={styles.hospitalAddress}>{hospital.vicinity}</Text>
                    <View style={styles.hospitalDetails}>
                      {hospital.distance && (
                        <View style={styles.detailItem}>
                          <MaterialIcons name="directions" size={14} color="#0D6C7E" />
                          <Text style={styles.detailText}>{hospital.distance} km</Text>
                        </View>
                      )}
                      {hospital.rating && (
                        <View style={styles.detailItem}>
                          <MaterialIcons name="star" size={14} color="#F1C40F" />
                          <Text style={styles.detailText}>{hospital.rating}</Text>
                        </View>
                      )}
                      <View style={styles.detailItem}>
                        <MaterialIcons 
                          name="circle" 
                          size={14} 
                          color={hospital.open_now ? "#4CAF50" : "#E74C3C"} 
                        />
                        <Text style={styles.detailText}>
                          {hospital.open_now ? 'Open' : 'Closed'}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.directionsButton}
                    onPress={() => getDirections(hospital)}
                  >
                    <MaterialIcons name="directions" size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D6C7E',
  },
  emergencyCallButton: {
    backgroundColor: '#E74C3C',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  emergencyCallText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#0D6C7E',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#E74C3C',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#0D6C7E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
  },
  mapContainer: {
    height: height * 0.4,
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  calloutContainer: {
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D6C7E',
    marginBottom: 4,
  },
  calloutAddress: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#333333',
    marginRight: 4,
  },
  calloutStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  hospitalsContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  hospitalsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D6C7E',
    marginBottom: 12,
  },
  hospitalsList: {
    flex: 1,
  },
  hospitalItem: {
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedHospitalItem: {
    borderWidth: 2,
    borderColor: '#0D6C7E',
  },
  hospitalInfo: {
    flex: 1,
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D6C7E',
    marginBottom: 4,
  },
  hospitalAddress: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  hospitalDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },
  directionsButton: {
    backgroundColor: '#0D6C7E',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
}); 