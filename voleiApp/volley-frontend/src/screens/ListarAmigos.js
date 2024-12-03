import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

const ListarAmigos = ({ navigation }) => {
  const [amigos, setAmigos] = useState([]);

  useEffect(() => {
    const fetchAmigos = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Erro', 'Usuário não autenticado. Faça login novamente.');
          navigation.navigate('Login'); // Redireciona para a tela de login
          return;
        }

        const decodedToken = jwtDecode(token);
        const organizador_id = decodedToken.id;

        const response = await axios.get(`http://10.0.2.2:3000/organizador/listar/${organizador_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAmigos(response.data);
      } catch (error) {
        console.error('Erro ao buscar amigos:', error);
        Alert.alert('Erro', 'Sessão expirada ou inválida. Faça login novamente.');
        navigation.navigate('Login'); // Redireciona para a tela de login
      }
    };

    fetchAmigos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Amigos</Text>
      <FlatList
        data={amigos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text>{item.nome} - {item.email}</Text>
        )}
        ListEmptyComponent={<Text>Nenhum amigo encontrado.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default ListarAmigos;
