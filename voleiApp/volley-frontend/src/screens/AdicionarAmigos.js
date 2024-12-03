import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode'; // Biblioteca para decodificar JWT

const AdicionarAmigos = ({ navigation }) => {
  const [amigoId, setAmigoId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddFriend = async () => {
    setLoading(true); // Indica que a requisição está em andamento
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        alert('Usuário não autenticado. Faça login novamente.');
        navigation.navigate('Login'); // Redireciona para login
        setLoading(false);
        return;
      }

      const decodedToken = jwtDecode(token);
      const organizador_id = decodedToken.id; // Extrai o ID do organizador do token
      console.log('Organizador ID:', organizador_id);

      const response = await axios.post('http://10.0.2.2:3000/organizador/adicionar', {
        organizador_id,
        amigo_id: amigoId,
      });

      if (response.status === 201) {
        alert('Amigo adicionado com sucesso!');
      } else {
        alert('Algo deu errado ao adicionar o amigo.');
      }

      setAmigoId('');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Sessão expirada. Faça login novamente.');
        navigation.navigate('Login');
      } else {
        console.error('Erro ao adicionar amigo:', error);
        alert('Erro ao adicionar amigo. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false); // Encerra o estado de carregamento
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Amigo</Text>
      <TextInput
        style={styles.input}
        placeholder="ID do Amigo"
        value={amigoId}
        onChangeText={setAmigoId}
      />
      <Button title={loading ? 'Adicionando...' : 'Adicionar'} onPress={handleAddFriend} disabled={loading} />
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    width: '80%',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default AdicionarAmigos;
