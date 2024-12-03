// TimesBalanceados.js

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const TimesBalanceados = ({ route }) => {
  const { times, amigosSelecionados } = route.params;
  const [timesEquilibrados, setTimesEquilibrados] = useState(times || null);

  useEffect(() => {
    const equilibrarTimes = async () => {
      if (!timesEquilibrados && amigosSelecionados) {
        try {
          const response = await axios.post(
            'http://10.0.2.2:3000/organizador/equilibrar-amigos-selecionados',
            { amigosSelecionados }
          );
          setTimesEquilibrados(response.data.times);
        } catch (error) {
          console.error('Erro ao equilibrar times:', error);
        }
      }
    };

    equilibrarTimes();
  }, []);

  const renderItem = ({ item }) => (
    <Text>
      {item.nome} - Score: {(item.passe || 0) + (item.ataque || 0) + (item.levantamento || 0)}
    </Text>
  );

  return (
    <View style={styles.container}>
      {timesEquilibrados ? (
        <>
          <View style={styles.team}>
            <Text style={styles.teamTitle}>Time 1</Text>
            <FlatList
              data={timesEquilibrados[0]}
              keyExtractor={(item, index) => (item?.id_usuario ?? index).toString()}
              renderItem={renderItem}
            />
          </View>
          <View style={styles.team}>
            <Text style={styles.teamTitle}>Time 2</Text>
            <FlatList
              data={timesEquilibrados[1]}
              keyExtractor={(item, index) => (item?.id_usuario ?? index).toString()}
              renderItem={renderItem}
            />
          </View>
        </>
      ) : (
        <Text>Carregando...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  team: { marginBottom: 20 },
  teamTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
});

export default TimesBalanceados;
