import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { register } from '../services/authService';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Console log para depuração
  console.log('Register Screen Renderizou');
  
  const handleRegister = async () => {
    console.log("Tentando registrar com os valores:", name, email, password);
  
    const response = await register(name, email, password);
    
    if (response) {
      console.log("Registro bem-sucedido, redirecionando para Login");
      navigation.navigate('Login');
    } else {
      console.error("Falha no registro");
      alert('Registro falhou. Tente novamente.');
    }
  };

  // Aqui você coloca o conteúdo correto a ser renderizado
  return (
    <View style={styles.container}>
      <Text>Nome:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Digite seu nome"
      />
      <Text>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Digite seu email"
      />
      <Text>Password:</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Digite sua senha"
        secureTextEntry
      />
      <Button title="Registrar" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 20,
    padding: 8,
  },
});

export default RegisterScreen;
