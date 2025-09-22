import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Dimensions,
  Animated,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from 'expo-linear-gradient';
import WeatherIcon from './components/WeatherIcon';

const OPEN_WEATHER_API_KEY = "22a71351af3c0498367ebae5477e555a";

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Today") {
            iconName = focused ? "sunny" : "sunny-outline";
          } else if (route.name === "Forecast") {
            iconName = focused ? "cloud" : "cloud-outline";
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Today" component={TodayScreen} />
      <Tab.Screen name="Forecast" component={ForecastScreen} />
    </Tab.Navigator>
  );
}

function TodayScreen() {
  const [city, setCity] = useState("");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const API_URL_CURRENT = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPEN_WEATHER_API_KEY}`;


  function SearchCurrentWeather() {
    if (!city.trim()) {
      Alert.alert("Error", "Please enter a city name");
      return;
    }

    setLoading(true);
    setError(null);
    
    fetch(API_URL_CURRENT)
      .then((response) => response.json())
      .then((data) => {
        if (data.cod === 404) {
          setError("City not found. Please check the spelling.");
          setCurrentWeather(null);
        } else if (data.cod === 200) {
          setCurrentWeather(data);
          setError(null);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }).start();
        } else {
          setError(`API Error: ${data.message || 'Unknown error'}`);
          setCurrentWeather(null);
        }
      })
      .catch((err) => {
        setError("Failed to fetch weather data. Please try again.");
        setCurrentWeather(null);
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const getWeatherGradient = () => {
    if (!currentWeather) return ['#4A90E2', '#357ABD'];
    
    const temp = currentWeather.main.temp;
    if (temp < 0) return ['#1E3C72', '#2A5298']; // Cold - Blue
    if (temp < 10) return ['#4A90E2', '#357ABD']; // Cool - Light Blue
    if (temp < 25) return ['#87CEEB', '#4682B4']; // Mild - Sky Blue
    return ['#FF7F50', '#FF6347']; // Hot - Orange
  };

  
  return (
    <LinearGradient colors={getWeatherGradient()} style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Today's Weather</Text>
        <Text style={styles.subtitle}>Get current weather conditions</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            placeholder="Enter city name"
            placeholderTextColor="#999"
            value={city}
            onChangeText={(text) => setCity(text)}
            style={styles.textInput}
            onSubmitEditing={SearchCurrentWeather}
          />
        </View>
        
        <TouchableOpacity
          onPress={SearchCurrentWeather}
          style={styles.searchButton}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Ionicons name="search" size={20} color="white" />
          )}
        </TouchableOpacity>
      </View>


      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={24} color="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {currentWeather && (
        <Animated.View style={[styles.weatherContainer, { opacity: fadeAnim }]}>
          <View style={styles.weatherCard}>
            <Text style={styles.cityName}>{currentWeather.name}</Text>
            <Text style={styles.countryName}>{currentWeather.sys.country}</Text>
            
            <WeatherIcon 
              weatherCondition={currentWeather.weather[0].main} 
              size={120} 
              style={styles.weatherIcon}
            />
            
            <Text style={styles.weatherDescription}>
              {currentWeather.weather[0].description.charAt(0).toUpperCase() + 
               currentWeather.weather[0].description.slice(1)}
            </Text>
            
            <Text style={styles.temperature}>
              {Math.round(currentWeather.main.temp)}°C
            </Text>
            
            <View style={styles.weatherDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="thermometer-outline" size={20} color="white" />
                <Text style={styles.detailLabel}>Feels like</Text>
                <Text style={styles.detailValue}>{Math.round(currentWeather.main.feels_like)}°C</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Ionicons name="water-outline" size={20} color="white" />
                <Text style={styles.detailLabel}>Humidity</Text>
                <Text style={styles.detailValue}>{currentWeather.main.humidity}%</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Ionicons name="leaf-outline" size={20} color="white" />
                <Text style={styles.detailLabel}>Wind Speed</Text>
                <Text style={styles.detailValue}>{currentWeather.wind.speed} m/s</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      )}
    </LinearGradient>
  );
}
function ForecastScreen() {
  const [city, setCity] = useState("");
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL_FORECAST = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${OPEN_WEATHER_API_KEY}`;

  function SearchForecast() {
    if (!city.trim()) {
      Alert.alert("Error", "Please enter a city name");
      return;
    }

    setLoading(true);
    setError(null);
    
    fetch(API_URL_FORECAST)
      .then((response) => response.json())
      .then((data) => {
        if (data.cod === 404) {
          setError("City not found. Please check the spelling.");
          setForecast(null);
        } else if (data.cod === '200') {
          setForecast(data.list.slice(0, 5));
          setError(null);
        } else {
          setError(`API Error: ${data.message || 'Unknown error'}`);
          setForecast(null);
        }
      })
      .catch((err) => {
        setError("Failed to fetch forecast data. Please try again.");
        setForecast(null);
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit'
    });
  };

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.title}>5-Day Forecast</Text>
        <Text style={styles.subtitle}>Weather predictions for the next 5 days</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            placeholder="Enter city name"
            placeholderTextColor="#999"
            value={city}
            onChangeText={(text) => setCity(text)}
            style={styles.textInput}
            onSubmitEditing={SearchForecast}
          />
        </View>
        
        <TouchableOpacity
          onPress={SearchForecast}
          style={styles.searchButton}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Ionicons name="search" size={20} color="white" />
          )}
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={24} color="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {forecast && (
        <FlatList
          style={styles.forecastList}
          data={forecast}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View style={styles.forecastCard}>
              <View style={styles.forecastHeader}>
                <Text style={styles.forecastDate}>{formatDate(item.dt_txt)}</Text>
                <WeatherIcon 
                  weatherCondition={item.weather[0].main} 
                  size={40} 
                />
              </View>
              
              <View style={styles.forecastContent}>
                <View style={styles.forecastMain}>
                  <Text style={styles.forecastTemp}>{Math.round(item.main.temp)}°C</Text>
                  <Text style={styles.forecastDescription}>
                    {item.weather[0].description.charAt(0).toUpperCase() + 
                     item.weather[0].description.slice(1)}
                  </Text>
                </View>
                
                <View style={styles.forecastDetails}>
                  <View style={styles.forecastDetailItem}>
                    <Ionicons name="thermometer-outline" size={16} color="white" />
                    <Text style={styles.forecastDetailText}>Feels: {Math.round(item.main.feels_like)}°C</Text>
                  </View>
                  
                  <View style={styles.forecastDetailItem}>
                    <Ionicons name="water-outline" size={16} color="white" />
                    <Text style={styles.forecastDetailText}>{item.main.humidity}%</Text>
                  </View>
                  
                  <View style={styles.forecastDetailItem}>
                    <Ionicons name="leaf-outline" size={16} color="white" />
                    <Text style={styles.forecastDetailText}>{item.wind.speed} m/s</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </LinearGradient>
  );
}
function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text>About This App</Text>
    </View>
  );
}

// const OPEN_WEATHER_API_KEY = "22a71351af3c0498367ebae5477e555a";
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  // function fetchCurrentWeather() {
  //   setLoading(true);
  //   fetch(API_URL_CURRENT)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setCurrentWeather(data);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       setError(err.message);
  //       setLoading(false);
  //     });
  // }
  // function fetchForecast() {
  //   setLoading(true);
  //   fetch(API_URL_FORECAST)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setForecast(data);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       setError(err.message);
  //       setLoading(false);
  //     });
  // }
  // useEffect(() => {
  //   if (city) {
  //     fetchCurrentWeather();
  //     fetchForecast();
  //   }
  // }, [city]);
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Weather">
        <Drawer.Screen name="Weather" component={HomeTabs} />
        <Drawer.Screen name="About" component={AboutScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
    // <View style={styles.container}>
    //   <Text>Open Weather App</Text>
    //  <TextInput
    //   placeholder="Enter city"
    //   value={city}
    //   onChangeText={(text) => setCity(text)}
    //   style={{
    //     height: 40,
    //     borderColor: "gray",
    //     borderWidth: 1,
    //     width: 200,
    //     marginTop: 20,
    //     paddingHorizontal: 10,
    //   }}
    // />
    // <TouchableOpacity
    //   onPress={() => {
    //     fetchCurrentWeather();
    //     fetchForecast();
    //   }}
    //   style={{
    //     backgroundColor: "blue",
    //     padding: 10,
    //     marginTop: 10,
    //     borderRadius: 5,
    //     width: 200,
    //     alignItems: "center",
    //     justifyContent: "center",
    //     height: 40,
    //     marginBottom: 20,
    //   }}
    // >
    //   <Text
    //     style={{
    //       color: "white",
    //       fontWeight: "bold",
    //       fontSize: 16,
    //     }}
    //   >
    //     Get Weather
    //   </Text>
    // </TouchableOpacity>
    //   <StatusBar style="auto" />
    // </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginRight: 10,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  errorText: {
    color: '#FF6B6B',
    marginLeft: 10,
    fontSize: 14,
  },
  weatherContainer: {
    flex: 1,
  },
  weatherCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cityName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  countryName: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
  },
  weatherIcon: {
    marginVertical: 20,
  },
  weatherDescription: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 25,
  },
  weatherDetails: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  forecastList: {
    flex: 1,
  },
  forecastCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  forecastHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  forecastDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  forecastContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forecastMain: {
    flex: 1,
  },
  forecastTemp: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  forecastDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  forecastDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    justifyContent: 'flex-end',
  },
  forecastDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginBottom: 5,
  },
  forecastDetailText: {
    fontSize: 12,
    color: 'white',
    marginLeft: 5,
  },
});
