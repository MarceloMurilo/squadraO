import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AuthContext from '../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
  
    try {
      const response = await login(email, password);
  
      if (response && response.token) {
        console.log('Login bem-sucedido. Token:', response.token);
        navigation.navigate('Home');
      } else {
        Alert.alert('Erro de Login', 'Usuário ou senha inválidos.');
      }
    } catch (error) {
      console.error('Erro ao realizar login:', error.message || error);
      Alert.alert('Erro', 'Ocorreu um erro ao realizar o login. Tente novamente mais tarde.');
    }
  };

  return (
    <View style={styles.Body}>
      <View style={styles.header}>
        <Text style={styles.title}>Bem-vindo de volta!</Text>
      </View>
      <View style={styles.Main}>
        <View style={styles.inputContainer}>
          <View style={styles.bgTextEmail}>
            <Text style={styles.inputName}> Nome de usuário ou Email</Text>
          </View>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Digite seu email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.bgTextPassword}>
            <Text style={styles.inputName}>Senha</Text>
          </View>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Digite sua senha"
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.butLog} onPress={handleLogin}>
          <Text style={styles.buttonText}>Logar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>Registrar-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 100,
    alignItems: 'center',
  },
  Body: {
    backgroundColor: '#37A0EC',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Main: {
    backgroundColor: '#ffffff',
    height: 622,
    borderRadius: 39,
    top: 25,
    width: '100%',
    paddingTop: 40,
  },
  title: {
    color: 'white',
    fontSize: 30,
    position: 'relative',
    top: 70,
  },
  inputContainer: {
    marginTop: 5,
    position: 'relative',
    alignItems: 'center',
  },
  input: {
    borderStyle: 'solid',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 20,
    borderColor: '#FF7014',
    padding: 10,
    width: 290,
    height: 50,
  },
  bgTextEmail: {
    alignItems: 'center',
    borderRadius: 50,
    width: 193,
    height: 25,
    backgroundColor: 'white',
    position: 'absolute',
    top: -13,
    left: 58,
    paddingBottom: 5,
    zIndex: 1,
  },
  bgTextPassword: {
    alignItems: 'center',
    borderRadius: 50,
    width: 54,
    height: 25,
    backgroundColor: 'white',
    position: 'absolute',
    top: -13,
    left: 58,
    paddingBottom: 5,
    zIndex: 1,
  },
  inputName: {
    fontSize: 14,
    color: '#37A0EC',
  },
  butLog: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#FF7014',
    height: 45,
    width: 120,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    left: 215,
  },
  buttonText: {
    color: '#FF7014',
  },
  linkText: {
    color: '#37A0EC',
    marginTop: 10,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});

export default LoginScreen;
