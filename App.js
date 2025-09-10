import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

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

  const API_URL_CURRENT = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPEN_WEATHER_API_KEY}`;

  function SearchCurrentWeather() {
    fetch(API_URL_CURRENT)
      .then((response) => response.json())
      .then((data) => {
        setCurrentWeather(data);
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <View style={styles.container}>
      <Text>Today's Weather</Text>
      <TextInput
        placeholder="Enter city"
        value={city}
        onChangeText={(text) => setCity(text)}
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          width: 200,
          marginTop: 20,
          paddingHorizontal: 10,
        }}
      />
      <TouchableOpacity
        onPress={() => SearchCurrentWeather()}
        style={{
          backgroundColor: "blue",
          padding: 10,
          marginTop: 10,
          borderRadius: 5,
          width: 200,
          alignItems: "center",
          justifyContent: "center",
          height: 40,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          Get Weather
        </Text>
      </TouchableOpacity>
      {currentWeather && (
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {currentWeather.name}
          </Text>
          <Text style={{ fontSize: 16 }}>
            {currentWeather.weather[0].description}
          </Text>
          <Text style={{ fontSize: 16 }}>
            Temperature: {currentWeather.main.temp} °C
          </Text>
          <Text style={{ fontSize: 16 }}>
            Humidity: {currentWeather.main.humidity} %
          </Text>
          <Text style={{ fontSize: 16 }}>
            Wind Speed: {currentWeather.wind.speed} m/s
          </Text>
        </View>
      )}
    </View>
  );
}
function ForecastScreen() {
  const [city, setCity] = useState("");
  const [forecast, setForecast] = useState(null);
  const [firstFive, setFirstFive] = useState([]);

  const API_URL_FORECAST = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${OPEN_WEATHER_API_KEY}`;

  function SearchForecast() {
    fetch(API_URL_FORECAST)
      .then((response) => response.json())
      .then((data) => {
        data = data.list;
        setForecast(data.slice(0, 5));
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  return (
    <View style={styles.container}>
      <Text>Forecast Weather</Text>
      <TextInput
        placeholder="Enter city"
        value={city}
        onChangeText={(text) => setCity(text)}
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          width: 200,
          marginTop: 20,
          paddingHorizontal: 10,
        }}
      />
      <TouchableOpacity
        onPress={() => SearchForecast()}
        style={{
          backgroundColor: "blue",
          padding: 10,
          marginTop: 10,
          borderRadius: 5,
          width: 200,
          alignItems: "center",
          justifyContent: "center",
          height: 40,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          Get Weather
        </Text>
      </TouchableOpacity>
      <FlatList
        style={{ width: "100%" }}
        data={forecast}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
            }}
          >
            <View style={{ flex: 1, flexDirection: "row", padding: 2 }}>
              <Ionicons name="calendar" size={24} color="black" />
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {item.dt_txt}
              </Text>
            </View>
            <View style={{ flex: 1, flexDirection: "row", padding: 2 }}>
              <Ionicons name="cloudy" size={24} color="black" />
              <Text style={{ fontSize: 16 }}>
                {item.weather[0].description}
              </Text>
            </View>
            <View style={{ flex: 1, flexDirection: "row", padding: 2 }}>
              <Ionicons name="thermometer" size={24} color="black" />
              <Text style={{ fontSize: 16 }}>Temp: {item.main.temp} °C</Text>
            </View>
            <View style={{ flex: 1, flexDirection: "row", padding: 2 }}>
              <Ionicons name="water" size={24} color="black" />
              <Text style={{ fontSize: 16 }}>
                Humidity: {item.main.humidity} %
              </Text>
            </View>
            <View style={{ flex: 1, flexDirection: "row", padding: 2 }}>
              <Ionicons name="speedometer" size={24} color="black" />
              <Text style={{ fontSize: 16 }}>Wind: {item.wind.speed} m/s</Text>
            </View>
          </View>
        )}
      />
    </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
