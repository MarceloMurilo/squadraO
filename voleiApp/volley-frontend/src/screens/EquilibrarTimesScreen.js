// EquilibrarTimesScreen.js

import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

const EquilibrarTimesScreen = ({ navigation, route }) => {
  const jogoId = route?.params?.jogoId || null; // Recebe o jogoId passado na navegação
  const [loading, setLoading] = useState(false);

  const equilibrarTimesComAmigos = () => {
    navigation.navigate('ConvidarAmigos');
  };

  const equilibrarTimesDeJogo = async () => {
    if (!jogoId) {
      Alert.alert('Erro', 'Nenhum jogo selecionado para equilibrar times.');
      return;
    }

    setLoading(true);
    try {
      console.log('=== Iniciando equilíbrio de times para o jogo ===');
      const response = await axios.get(`http://10.0.2.2:3000/jogos/${jogoId}/equilibrar-times`);
      console.log('Dados recebidos da API:', response.data);

      // Navega para a tela de times balanceados, passando os times recebidos
      navigation.navigate('TimesBalanceados', { times: response.data.times });
    } catch (error) {
      console.error('Erro ao equilibrar times do jogo:', error);
      Alert.alert('Erro', 'Erro ao equilibrar times do jogo. Verifique sua conexão ou tente novamente.');
    } finally {
      console.log('=== Requisição finalizada ===');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escolha uma opção para equilibrar os times:</Text>
      <Button
        title="Equilibrar times entre amigos (sem jogo)"
        onPress={equilibrarTimesComAmigos}
        disabled={loading}
      />
      <Button
        title="Equilibrar times de um jogo específico"
        onPress={equilibrarTimesDeJogo}
        disabled={loading}
      />
      {loading && <Text>Carregando...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default EquilibrarTimesScreen;
