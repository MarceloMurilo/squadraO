import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Componente para cada jogador que pode ser arrastado
const DraggablePlayer = ({ jogador, timeIndex, onDragStart }) => {
  return (
    <TouchableOpacity onPressIn={(event) => onDragStart(jogador, timeIndex, event)}>
      <View style={styles.jogadorItem}>
        <Text style={styles.jogadorNome}>{jogador.nome}</Text>
        <Text style={styles.score}>
          Passe: {jogador.passe} | Ataque: {jogador.ataque} | Levantamento: {jogador.levantamento}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const TimesBalanceados = ({ route, navigation }) => {
  const { times } = route.params;
  const [timesAtualizados, setTimesAtualizados] = useState(times);
  const [activeTeam, setActiveTeam] = useState(null);

  // Referência para armazenar o layout de cada time
  const teamsLayout = useRef([]);

  // Estado para o jogador sendo arrastado
  const [draggedPlayer, setDraggedPlayer] = useState(null);
  const [originTeamIndex, setOriginTeamIndex] = useState(null);

  // Valores compartilhados para a posição do jogador arrastado
  const draggedPlayerX = useSharedValue(0);
  const draggedPlayerY = useSharedValue(0);

  // Função para mover jogador entre times
  const moverJogadorEntreTimes = (jogador, timeOrigemIndex, timeDestinoIndex) => {
    const novoTimes = [...timesAtualizados];

    // Remove o jogador do time de origem
    novoTimes[timeOrigemIndex].jogadores = novoTimes[timeOrigemIndex].jogadores.filter(
      (j) => j.id !== jogador.id
    );
    novoTimes[timeOrigemIndex].totalScore = novoTimes[timeOrigemIndex].jogadores.reduce(
      (total, j) => total + j.passe + j.ataque + j.levantamento,
      0
    );

    // Adiciona o jogador ao time de destino
    novoTimes[timeDestinoIndex].jogadores.push(jogador);
    novoTimes[timeDestinoIndex].totalScore = novoTimes[timeDestinoIndex].jogadores.reduce(
      (total, j) => total + j.passe + j.ataque + j.levantamento,
      0
    );

    setTimesAtualizados(novoTimes);
  };

  // Função para tratar o fim do gesto de arrasto
  const handleDragEnd = (gestureY) => {
    if (draggedPlayer !== null && originTeamIndex !== null) {
      let timeDestinoIndex = originTeamIndex; // Padrão para o time original

      // Determina o time alvo baseado na posição Y do gesto
      for (let i = 0; i < teamsLayout.current.length; i++) {
        const { y, height } = teamsLayout.current[i];
        if (gestureY >= y && gestureY <= y + height) {
          timeDestinoIndex = i;
          break;
        }
      }

      if (
        timeDestinoIndex !== originTeamIndex &&
        timeDestinoIndex >= 0 &&
        timeDestinoIndex < timesAtualizados.length
      ) {
        runOnJS(moverJogadorEntreTimes)(draggedPlayer, originTeamIndex, timeDestinoIndex);
      }

      // Resetar estados de drag
      runOnJS(setDraggedPlayer)(null);
      runOnJS(setOriginTeamIndex)(null);
      runOnJS(setActiveTeam)(null);
    }
  };

  // Função para capturar o layout de cada time
  const captureTeamLayout = (index, event) => {
    const { y, height } = event.nativeEvent.layout;
    teamsLayout.current[index] = { y, height };
  };

  // Função para iniciar o arrasto de um jogador
  const handleDragStart = (jogador, timeIndex, event) => {
    const { pageX, pageY } = event.nativeEvent;
    setDraggedPlayer(jogador);
    setOriginTeamIndex(timeIndex);
    // Definir posição inicial do jogador arrastado
    draggedPlayerX.value = pageX;
    draggedPlayerY.value = pageY;
  };

  // Gesture handler para o jogador arrastado
  const draggedGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      // Nenhuma ação necessária no início
    },
    onActive: (event, ctx) => {
      // Atualizar posição do jogador arrastado
      draggedPlayerX.value = event.absoluteX;
      draggedPlayerY.value = event.absoluteY;

      // Determinar qual time está sendo "hovered"
      const absoluteY = event.absoluteY;
      let hoveredTeam = originTeamIndex; // Padrão para o time original
      for (let i = 0; i < teamsLayout.current.length; i++) {
        const { y, height } = teamsLayout.current[i];
        if (absoluteY >= y && absoluteY <= y + height) {
          hoveredTeam = i;
          break;
        }
      }
      runOnJS(setActiveTeam)(hoveredTeam);
    },
    onEnd: (event, ctx) => {
      runOnJS(handleDragEnd)(event.absoluteY);
      // Resetar os valores de posição com animação de mola
      draggedPlayerX.value = withSpring(0);
      draggedPlayerY.value = withSpring(0);
    },
  });

  // Estilo animado para o jogador arrastado
  const draggedPlayerStyle = useAnimatedStyle(() => {
    if (draggedPlayer) {
      return {
        position: 'absolute',
        top: draggedPlayerY.value - 50, // Ajuste para centralizar verticalmente
        left: draggedPlayerX.value - 75, // Ajuste para centralizar horizontalmente
        zIndex: 1000,
        transform: [{ scale: 1.1 }],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
        opacity: 0.9,
        backgroundColor: '#fafafa',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
      };
    }
    return {};
  });

  // Função para renderizar jogadores de um time específico
  const renderJogadores = (timeIndex) => {
    return timesAtualizados[timeIndex].jogadores.map((jogador) => {
      // Ocultar o jogador na lista se está sendo arrastado
      if (draggedPlayer && draggedPlayer.id === jogador.id) {
        return null;
      }

      return (
        <DraggablePlayer
          key={jogador.id}
          jogador={jogador}
          timeIndex={timeIndex}
          onDragStart={handleDragStart}
        />
      );
    });
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <ScrollView>
        {timesAtualizados.map((time, index) => {
          const isActive = activeTeam === index;
          return (
            <View
              key={index}
              style={[
                styles.team,
                isActive ? styles.teamHighlighted : null,
              ]}
              onLayout={(event) => captureTeamLayout(index, event)}
            >
              <Text style={styles.teamTitle}>Time {index + 1}</Text>
              <View style={styles.jogadoresContainer}>
                {renderJogadores(index)}
              </View>
              <Text style={styles.totalScore}>
                Pontuação Total: {time.totalScore}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      {/* Renderizar o jogador arrastado em uma camada separada */}
      {draggedPlayer && (
        <PanGestureHandler onGestureEvent={draggedGestureHandler}>
          <Animated.View style={[styles.draggedPlayer, draggedPlayerStyle]}>
            <Text style={styles.jogadorNome}>{draggedPlayer.nome}</Text>
            <Text style={styles.score}>
              Passe: {draggedPlayer.passe} | Ataque: {draggedPlayer.ataque} | Levantamento: {draggedPlayer.levantamento}
            </Text>
          </Animated.View>
        </PanGestureHandler>
      )}

      <TouchableOpacity
        style={styles.finalizarBotao}
        onPress={() => navigation.goBack({ times: timesAtualizados })}
      >
        <Text style={styles.finalizarTexto}>Finalizar Ajustes</Text>
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
};

// Estilos corrigidos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f2f5',
  },
  team: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    minHeight: 150,
    position: 'relative',
  },
  teamHighlighted: {
    borderColor: '#007bff',
    backgroundColor: '#e6f0ff',
  },
  teamTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  jogadoresContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    minHeight: 100,
  },
  jogadorItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    // Shadows para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, // Estilizado corretamente dentro de style
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevation para Android
    elevation: 2,
  },
  jogadorNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  score: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  totalScore: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#007bff',
  },
  finalizarBotao: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#28a745',
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#28a745',
    shadowOffset: { width: 0, height: 2 }, // Estilizado corretamente dentro de style
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  finalizarTexto: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  draggedPlayer: {
    // Estilos adicionais são aplicados via animatedStyle
  },
});

export default TimesBalanceados;
