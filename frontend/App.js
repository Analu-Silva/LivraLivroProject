import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { registerRootComponent } from "expo";

// Importações das suas telas
import StartScreen from "./screens/StartScreen";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import PreHomeScreen from "./screens/PreHomeScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileCreationScreen from "./screens/ProfileCreationScreen";
import AddressScreen from "./screens/AddressScreen";
import AddSaleScreen from "./screens/AddSaleScreen";
import BookScreen from "./screens/BookScreen";
import CartScreen from "./screens/CartScreen";
import CheckoutScreen from "./screens/CheckoutScreen";
import MySellsScreen from "./screens/MySellsScreen";
import SearchScreen from "./screens/SearchScreen";
import MenuScreen from "./screens/MenuScreen";
import SettingsScreen from "./screens/SettingsScreen";


const primaryColor = "#B431F4";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <>
      <StatusBar style="light" backgroundColor={primaryColor} />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Start"
          screenOptions={{
            headerStyle: { backgroundColor: primaryColor },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
          }}
        >
          {/* Telas principais */}
          <Stack.Screen
            name="Start"
            component={StartScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
          name="PreHome"
          component={PreHomeScreen}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ProfileCreation"
            component={ProfileCreationScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
          />
          <Stack.Screen
            name="Menu"
            component={MenuScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Sacola" 
            component={CartScreen} 
            options={{headerShown: false }} 
          />
          <Stack.Screen 
            name="Adicionar" 
            component={AddSaleScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Detalhes do Livro" 
            component={BookScreen} 
            options={{ headerShown: false  }} 
          />
          <Stack.Screen 
            name="Procurar" 
            component={SearchScreen} 
            options={{ headerShown: false  }} 
          />
          <Stack.Screen 
            name="Vendas" 
            component={MySellsScreen} 
            options={{ headerShown: false  }} 
          />
          <Stack.Screen 
            name="Endereco" 
            component={AddressScreen} 
            options={{ headerShown: false  }} 
          />
          <Stack.Screen 
            name="Compra" 
            component={CheckoutScreen} 
            options={{ headerShown: false  }} 
          />
  

        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

registerRootComponent(App);
export default App;
