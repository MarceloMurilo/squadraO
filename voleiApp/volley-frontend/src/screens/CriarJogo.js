import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

const CriarJogo = ({ navigation }) => {
  const [nomeJogo, setNomeJogo] = useState('');
  const [dataJogo, setDataJogo] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFim, setHoraFim] = useState('');

  const criarJogo = async () => {
    if (!nomeJogo || !dataJogo || !horaInicio || !horaFim) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Erro', 'Usuário não autenticado. Faça login novamente.');
        return;
      }

      const { id } = jwtDecode(token);

      const response = await axios.post('http://10.0.2.2:3000/jogos/criar', {
        nome_jogo: nomeJogo,
        data_jogo: dataJogo,
        horario_inicio: horaInicio,
        horario_fim: horaFim,
        id_usuario_criador: id,
      });

      Alert.alert('Sucesso', 'Jogo criado com sucesso!');
      navigation.navigate('ConvidarAmigos', { jogoId: response.data.id_jogo });
    } catch (error) {
      console.error('Erro ao criar jogo:', error.response?.data || error.message);
      Alert.alert('Erro', 'Não foi possível criar o jogo. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Criar Jogo</Text>
      <TextInput
        placeholder="Nome do Jogo"
        value={nomeJogo}
        onChangeText={setNomeJogo}
        style={styles.input}
      />
      <TextInput
        placeholder="Data do Jogo (AAAA-MM-DD)"
        value={dataJogo}
        onChangeText={setDataJogo}
        style={styles.input}
      />
      <TextInput
        placeholder="Hora de Início (HH:MM)"
        value={horaInicio}
        onChangeText={setHoraInicio}
        style={styles.input}
      />
      <TextInput
        placeholder="Hora de Fim (HH:MM)"
        value={horaFim}
        onChangeText={setHoraFim}
        style={styles.input}
      />
      <Button title="Criar Jogo" onPress={criarJogo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default CriarJogo;
