import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Erro', 'Usuário não autenticado. Faça login novamente.');
          navigation.navigate('Login'); // Redireciona para a tela de login
          return;
        }

        const response = await axios.get('http://10.0.2.2:3000/api/auth/protected', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data.userId); // Defina o userId conforme a resposta do backend
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        Alert.alert('Erro', 'Sessão expirada ou inválida. Faça login novamente.');
        navigation.navigate('Login'); // Redireciona para a tela de login
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      {user ? (
        <Text>Bem-vindo, jogador: {user}</Text>
      ) : (
        <Text>Carregando informações do jogador...</Text>
      )}
      <Button title="Logout" onPress={() => navigation.navigate('Login')} />
      <Button title="Reservar Quadra" onPress={() => navigation.navigate('CourtListScreen')} />

      {/* Botões para gerenciamento de amigos */}
      <Button
        title="Adicionar Amigos"
        onPress={() => navigation.navigate('AdicionarAmigos')}
      />
      <Button
        title="Listar Amigos"
        onPress={() => navigation.navigate('ListarAmigos')}
      />
      
      {/* Botão para equilibrar times */}
      <Button
        title="Equilibrar Times"
        onPress={() => navigation.navigate('EquilibrarTimes')}
      />
      <Button
        title="Criar Jogo"
        onPress={() => navigation.navigate('CriarJogo')}
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
