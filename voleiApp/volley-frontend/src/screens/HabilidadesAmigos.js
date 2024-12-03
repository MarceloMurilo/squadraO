// HabilidadesAmigos.js

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const HabilidadesAmigos = ({ route, navigation }) => {
  const { jogoId } = route.params;
  const [amigos, setAmigos] = useState([]);

  useEffect(() => {
    const fetchHabilidades = async () => {
      try {
        const response = await axios.get(`http://10.0.2.2:3000/jogos/${jogoId}/habilidades`);
        setAmigos(response.data);
      } catch (error) {
        console.error('Erro ao buscar habilidades:', error);
      }
    };

    fetchHabilidades();
  }, []);

  const handleChangeHabilidade = (id, field, value) => {
    setAmigos((prev) =>
      prev.map((amigo) =>
        amigo.id === id ? { ...amigo, [field]: value } : amigo
      )
    );
  };

  const salvarHabilidades = async () => {
    try {
      await axios.post(`http://10.0.2.2:3000/jogos/${jogoId}/habilidades`, {
        habilidades: amigos,
      });

      Alert.alert('Sucesso', 'Habilidades atualizadas!');
      navigation.navigate('EquilibrarTimes', { jogoId });
    } catch (error) {
      console.error('Erro ao salvar habilidades:', error);
      Alert.alert('Erro', 'Erro ao salvar habilidades.');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={amigos}
        keyExtractor={(item, index) => item?.id?.toString() || `key-${index}`}
        renderItem={({ item }) => (
          <View style={styles.amigoContainer}>
            <Text>{item.nome}</Text>
            <TextInput
              style={styles.input}
              placeholder="Passe"
              value={item.passe?.toString()}
              onChangeText={(value) => handleChangeHabilidade(item.id, 'passe', parseInt(value))}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Ataque"
              value={item.ataque?.toString()}
              onChangeText={(value) => handleChangeHabilidade(item.id, 'ataque', parseInt(value))}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Levantamento"
              value={item.levantamento?.toString()}
              onChangeText={(value) => handleChangeHabilidade(item.id, 'levantamento', parseInt(value))}
              keyboardType="numeric"
            />
          </View>
        )}
      />
      <Button title="Salvar e Prosseguir" onPress={salvarHabilidades} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  amigoContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
  },
});

export default HabilidadesAmigos;
