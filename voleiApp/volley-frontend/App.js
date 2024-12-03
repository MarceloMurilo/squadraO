// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './src/contexts/AuthContext';
import Steps from './src/screens/Steps';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import AdicionarAmigos from './src/screens/AdicionarAmigos';
import ListarAmigos from './src/screens/ListarAmigos';
import EquilibrarTimesScreen from './src/screens/EquilibrarTimesScreen';
import CriarJogo from './src/screens/CriarJogo';
import ConvidarAmigos from './src/screens/ConvidarAmigos';
import HabilidadesAmigos from './src/screens/HabilidadesAmigos';
import TimesBalanceados from './src/screens/TimesBalanceados';
import JogoScreen from './src/screens/JogoScreen';
const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Steps">
          <Stack.Screen name="Steps" component={Steps} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="EquilibrarTimes" component={EquilibrarTimesScreen} />
          <Stack.Screen name="AdicionarAmigos" component={AdicionarAmigos} />
          <Stack.Screen name="ListarAmigos" component={ListarAmigos} />
          <Stack.Screen name="CriarJogo" component={CriarJogo} />
          <Stack.Screen name="ConvidarAmigos" component={ConvidarAmigos} />
          <Stack.Screen name="HabilidadesAmigos" component={HabilidadesAmigos} />
          <Stack.Screen name="TimesBalanceados" component={TimesBalanceados} />
          <Stack.Screen name="Jogo" component={JogoScreen} />

        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
