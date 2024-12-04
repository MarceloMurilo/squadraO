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
  const [organizadorId, setOrganizadorId] = useState(0);
  const [habilidadesModal, setHabilidadesModal] = useState(null);
  const [jogadores, setJogadores] = useState(
    route?.params?.amigosSelecionados.map((amigo, index) => ({
      id: amigo?.id ?? index,
      nome: amigo?.nome ?? `Jogador ${index + 1}`,
      passe: 0,
      ataque: 0,
      levantamento: 0,
    })) || []
  );
  const [tamanhoTime, setTamanhoTime] = useState(4);

  useEffect(() => {
    const fetchOrganizadorId = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('Token não encontrado no AsyncStorage.');

        const response = await axios.get('http://10.0.2.2:3000/api/auth/protected', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrganizadorId(response.data.userId || response.data.id);
      } catch (error) {
        console.error('Erro ao buscar organizadorId:', error);
        Alert.alert('Erro', 'Não foi possível recuperar o organizador.');
      }
    };

    fetchOrganizadorId();
  }, []);

  useEffect(() => {
    const fetchAvaliacoes = async () => {
      if (!organizadorId) return;

      try {
        const response = await axios.get(
          `http://10.0.2.2:3000/avaliacoes/${organizadorId}`
        );

        setJogadores((prevJogadores) =>
          prevJogadores.map((jogador) => {
            const avaliacao = response.data.find((av) => av.usuario_id === jogador.id);
            return avaliacao ? { ...jogador, ...avaliacao } : jogador;
          })
        );
      } catch (error) {
        console.error('Erro ao buscar avaliações:', error);
      }
    };

    fetchAvaliacoes();
  }, [organizadorId]);

  const abrirModalHabilidades = (jogador) => setHabilidadesModal(jogador);

  const salvarHabilidades = async () => {
    if (!habilidadesModal || !organizadorId) {
      Alert.alert('Erro', 'Dados insuficientes para salvar habilidades.');
      return;
    }

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
      Alert.alert('Sucesso', 'Habilidades salvas com sucesso.');
    } catch (error) {
      console.error('Erro ao salvar habilidades:', error);
      Alert.alert('Erro', 'Não foi possível salvar as habilidades.');
    }
  };

  const equilibrarTimes = () => {
    if (jogadores.length < tamanhoTime * 2) {
      Alert.alert('Erro', `É necessário pelo menos ${tamanhoTime * 2} jogadores.`);
      return;
    }
  
    // Embaralha os jogadores
    const jogadoresEmbaralhados = [...jogadores].sort(() => Math.random() - 0.5);
  
    // Ordena os jogadores embaralhados pelo total de habilidades (para manter o balanceamento)
    const jogadoresOrdenados = jogadoresEmbaralhados.sort(
      (a, b) =>
        b.passe + b.ataque + b.levantamento - (a.passe + a.ataque + a.levantamento)
    );
  
    // Cria os times de forma balanceada
    const times = Array.from({ length: Math.ceil(jogadores.length / tamanhoTime) }, () => ({
      jogadores: [],
      totalScore: 0,
    }));
  
    jogadoresOrdenados.forEach((jogador) => {
      // Encontra o time com menor pontuação total
      const timeMaisFraco = times.reduce((menor, timeAtual) =>
        timeAtual.totalScore < menor.totalScore ? timeAtual : menor
      );
  
      // Adiciona o jogador ao time mais fraco
      timeMaisFraco.jogadores.push(jogador);
      timeMaisFraco.totalScore += jogador.passe + jogador.ataque + jogador.levantamento;
    });
  
    // Envia os times para a próxima tela
    navigation.navigate('TimesBalanceados', { times });
  };

  const renderJogador = ({ item }) => (
    <View style={styles.jogadorItem}>
      <Text>{item.nome}</Text>
      <Button title="Ver Habilidades" onPress={() => abrirModalHabilidades(item)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jogadores no Jogo</Text>

      <Text style={styles.subtitle}>Selecione o tamanho dos times:</Text>
      <FlatList
        horizontal
        data={[2, 3, 4, 5, 6]}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.timeButton,
              tamanhoTime === item && styles.timeButtonSelected,
            ]}
            onPress={() => setTamanhoTime(item)}
          >
            <Text>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => `${item}`}
      />

      <FlatList
        data={jogadores}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderJogador}
      />

      <Button title="Equilibrar Times" onPress={equilibrarTimes} />

      <Modal visible={!!habilidadesModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Habilidades</Text>
            {habilidadesModal && (
              <>
                <Text>{habilidadesModal.nome}</Text>
                {['passe', 'ataque', 'levantamento'].map((atributo) => (
                  <TextInput
                    key={atributo}
                    style={styles.input}
                    placeholder={atributo.charAt(0).toUpperCase() + atributo.slice(1)}
                    keyboardType="numeric"
                    value={habilidadesModal[atributo]?.toString() ?? '0'}
                    onChangeText={(value) =>
                      setHabilidadesModal((prev) => ({
                        ...prev,
                        [atributo]: parseInt(value, 10) || 0,
                      }))
                    }
                  />
                ))}

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
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  jogadorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  timeButton: {
    padding: 10,
    margin: 5,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  timeButtonSelected: {
    backgroundColor: '#5cb85c',
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
    marginBottom: 10,
    textAlign: 'center',
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
    marginTop: 10,
  },
  button: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
});
export default JogoScreen;