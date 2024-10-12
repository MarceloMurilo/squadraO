import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/auth/protected', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.userId);
    };
    fetchUserData();
  }, []);

  return (
    <View>
      <Text>Bem-vindo, usuário: {user}</Text>
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