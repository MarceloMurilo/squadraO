import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

const ConvidarAmigos = ({ navigation }) => {
  const [amigos, setAmigos] = useState([]);
  const [selecionados, setSelecionados] = useState([]);

  useEffect(() => {
    const fetchAmigos = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const { id } = jwtDecode(token);

        const response = await axios.get(`http://10.0.2.2:3000/organizador/listar/${id}`);
        console.log('Dados recebidos da API de amigos:', response.data);

        if (Array.isArray(response.data)) {
          setAmigos(response.data);
        } else {
          console.warn('Dados recebidos não são um array:', response.data);
          setAmigos([]);
        }
      } catch (error) {
        console.error('Erro ao buscar amigos:', error);
      }
    };

    fetchAmigos();
  }, []);

  const irParaTelaDeJogo = () => {
    if (selecionados.length === 0) {
      Alert.alert('Atenção', 'Selecione pelo menos um amigo para criar o jogo.');
      return;
    }
  
    // Filtrar os amigos completos com base nos selecionados
    const jogadoresSelecionados = amigos.filter((amigo) =>
      selecionados.includes(amigo.id)
    );
  
    navigation.navigate('Jogo', { amigosSelecionados: jogadoresSelecionados });
  };

  const toggleSelecionado = (id) => {
    if (id == null) {
      console.warn('ID nulo ou indefinido passado para toggleSelecionado:', id);
      return;
    }

    setSelecionados((prevSelecionados) => {
      if (prevSelecionados.includes(id)) {
        return prevSelecionados.filter((itemId) => itemId !== id);
      } else {
        return [...prevSelecionados, id];
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecione os amigos para criar um jogo:</Text>
      <FlatList
        data={amigos}
        keyExtractor={(item, index) => (item?.id ? item.id.toString() : index.toString())}
        extraData={selecionados}
        renderItem={({ item }) => {
          if (!item || item.id == null) {
            console.warn('Item inválido no renderItem:', item);
            return null;
          }

          const isSelected = selecionados.includes(item.id);

          return (
            <View style={styles.friendItem}>
              <Text>{item.nome} - {item.email}</Text>
              <Button
                title={isSelected ? 'Remover' : 'Adicionar'}
                onPress={() => toggleSelecionado(item.id)}
              />
            </View>
          );
        }}
      />
      <Button title="Ir para tela de Jogo" onPress={irParaTelaDeJogo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  friendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

export default ConvidarAmigos;
