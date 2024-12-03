import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const JogoScreen = ({ route, navigation }) => {
  const [organizadorId, setOrganizadorId] = useState(0); // Inicializa com 0
  const amigosSelecionados = route?.params?.amigosSelecionados || [];
  const [habilidadesModal, setHabilidadesModal] = useState(null);
  const [jogadores, setJogadores] = useState(
    amigosSelecionados.map((amigo, index) => ({
      id: amigo?.id != null ? amigo.id : index,
      nome: amigo?.nome ?? `Jogador ${index + 1}`,
      passe: 0,
      ataque: 0,
      levantamento: 0,
    }))
  );

  useEffect(() => {
    const fetchOrganizadorId = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.error('Token não encontrado no AsyncStorage.');
          Alert.alert('Erro', 'Token de autenticação não encontrado.');
          return;
        }
  
        const response = await axios.get('http://10.0.2.2:3000/api/auth/protected', {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        console.log('Resposta do backend:', response.data);
        setOrganizadorId(response.data.userId || response.data.id); // Use "userId" ou "id", dependendo do backend
      } catch (error) {
        console.error('Erro ao buscar organizadorId:', error);
      }
    };
  
    fetchOrganizadorId();
  }, []);
  
  useEffect(() => {
    const fetchAvaliacoes = async () => {
      if (!organizadorId || organizadorId <= 0) {
        console.warn('organizadorId inválido ou indefinido.');
        return;
      }
  
      try {
        const response = await axios.get(
          `http://10.0.2.2:3000/avaliacoes/${organizadorId}`
        );
  
        const avaliacoes = response.data;
  
        setJogadores((prevJogadores) =>
          prevJogadores.map((jogador) => {
            const avaliacao = avaliacoes.find((av) => av.usuario_id === jogador.id);
            return avaliacao ? { ...jogador, ...avaliacao } : jogador;
          })
        );
  
        console.log('Avaliações recebidas:', avaliacoes);
      } catch (error) {
        console.error('Erro ao buscar avaliações:', error);
      }
    };
  
    fetchAvaliacoes();
  }, [organizadorId]);
  

  const abrirModalHabilidades = (jogador) => {
    if (jogador) {
      setHabilidadesModal({ ...jogador });
    }
  };

  const salvarHabilidades = async () => {
    if (!habilidadesModal || !organizadorId) {
      console.error('Erro: organizadorId indefinido.');
      Alert.alert('Erro', 'Organizador não identificado.');
      return;
    }
  
    console.log('Dados sendo enviados:', {
      organizador_id: organizadorId,
      usuario_id: habilidadesModal.id,
      passe: habilidadesModal.passe,
      ataque: habilidadesModal.ataque,
      levantamento: habilidadesModal.levantamento,
    });
  
    try {
      await axios.post('http://10.0.2.2:3000/avaliacoes/salvar', {
        organizador_id: organizadorId,
        usuario_id: habilidadesModal.id,
        passe: habilidadesModal.passe,
        ataque: habilidadesModal.ataque,
        levantamento: habilidadesModal.levantamento,
      });
  
      setJogadores((prevJogadores) =>
        prevJogadores.map((jogador) =>
          jogador.id === habilidadesModal.id ? habilidadesModal : jogador
        )
      );
      setHabilidadesModal(null);
      Alert.alert('Habilidades atualizadas!', 'As habilidades foram salvas com sucesso.');
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error);
      Alert.alert('Erro', 'Não foi possível salvar as habilidades.');
    }
  };

  const equilibrarTimes = () => {
    if (jogadores.length < 2) {
      Alert.alert('Atenção', 'É necessário pelo menos dois jogadores para equilibrar os times.');
      return;
    }

    const jogadoresValidos = jogadores.filter((jogador) => jogador && jogador.id != null);

    if (jogadoresValidos.length < 2) {
      Alert.alert('Erro', 'Jogadores insuficientes para equilibrar os times.');
      return;
    }

    const times = [[], []];

    jogadoresValidos.sort((a, b) => {
      const totalA = (a.passe || 0) + (a.ataque || 0) + (a.levantamento || 0);
      const totalB = (b.passe || 0) + (b.ataque || 0) + (b.levantamento || 0);
      return totalB - totalA;
    });

    jogadoresValidos.forEach((jogador, index) => {
      if (index % 2 === 0) {
        times[0].push(jogador);
      } else {
        times[1].push(jogador);
      }
    });

    navigation.navigate('TimesBalanceados', { times });
  };

  const renderJogador = ({ item }) => {
    if (!item) {
      return null;
    }
    return (
      <View style={styles.jogadorItem}>
        <Text>{item.nome || 'Nome não disponível'}</Text>
        <Button title="Ver Habilidades" onPress={() => abrirModalHabilidades(item)} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jogadores no Jogo</Text>
      <FlatList
        data={jogadores}
        keyExtractor={(item, index) => (item?.id != null ? `${item.id}` : `key-${index}`)}
        renderItem={renderJogador}
      />
      <Button title="Equilibrar Times" onPress={equilibrarTimes} />

      <Modal visible={!!habilidadesModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Habilidades</Text>
            {habilidadesModal && (
              <>
                <Text>{habilidadesModal.nome || 'Nome não disponível'}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Passe"
                  keyboardType="numeric"
                  value={habilidadesModal.passe?.toString() ?? '0'}
                  onChangeText={(value) =>
                    setHabilidadesModal((prev) => ({
                      ...prev,
                      passe: parseInt(value, 10) || 0,
                    }))
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Ataque"
                  keyboardType="numeric"
                  value={habilidadesModal.ataque?.toString() ?? '0'}
                  onChangeText={(value) =>
                    setHabilidadesModal((prev) => ({
                      ...prev,
                      ataque: parseInt(value, 10) || 0,
                    }))
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Levantamento"
                  keyboardType="numeric"
                  value={habilidadesModal.levantamento?.toString() ?? '0'}
                  onChangeText={(value) =>
                    setHabilidadesModal((prev) => ({
                      ...prev,
                      levantamento: parseInt(value, 10) || 0,
                    }))
                  }
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => setHabilidadesModal(null)}
                  >
                    <Text>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={salvarHabilidades}>
                    <Text>Salvar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    textAlign: 'center',
    marginBottom: 20,
  },
  jogadorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default JogoScreen;
