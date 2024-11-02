import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://10.0.2.2:3000/api/auth/protected', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data.userId);  // Defina o userId conforme a resposta do backend
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      {user ? (
        <Text>Bem-vindo, cabaço: {user}</Text>
    
      ) : (
        <Text>Carregando informações do usuário...</Text>
      )}
      <Button title="Logout" onPress={() => navigation.navigate('Login')} />
      <Button 
        title="Reservar Quadra" 
        onPress={() => navigation.navigate('CourtListScreen')} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
