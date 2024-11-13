import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
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

  return (
    <View style={styles.Body}>
      <View style={styles.header}>
        <Text style={styles.title}>Bom te conhecer!</Text>
      </View>

      <View style={styles.Main}>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <View style={styles.bgTextNome}>
              <Text style={styles.inputName}>Nome Completo</Text>
            </View>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Digite seu nome"
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.bgTextEmail}>
              <Text style={styles.inputName}>Email</Text>
            </View>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Digite seu email"
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

          <TouchableOpacity style={styles.butReg} onPress={handleRegister}>
            <Text style={styles.buttonText}>Cadastrar</Text> 
          </TouchableOpacity>
        </View>
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
  },
  title: {
    color: 'white',
    fontSize: 30,
    position: 'relative',
    top: 70,
  },
  container: {
    padding: 20,
    paddingTop: 40,
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
  bgTextNome: {
    alignItems: 'center',
    borderRadius: 50,
    width: 130,
    height: 25,
    backgroundColor: 'white',
    position: 'absolute',
    top: -13,
    left: 40,
    paddingBottom: 5,
    zIndex: 1,  
  },
  bgTextEmail: {
    alignItems: 'center',
    borderRadius: 50,
    width: 55,
    height: 25,
    backgroundColor: 'white',
    position: 'absolute',
    top: -13,
    left: 40,
    paddingBottom: 5,
    zIndex: 1,  
  },
  bgTextPassword: {
    alignItems: 'center',
    borderRadius: 50,
    width: 59,
    height: 25,
    backgroundColor: 'white',
    position: 'absolute',
    top: -13,
    left: 40,
    paddingBottom: 5,
    zIndex: 1,  
  },
  inputName: {
    fontSize: 14,
    color: '#37A0EC',
  },
  butReg: {
    background: 'none', 
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#FF7014',
    height: 45,
    width: 120,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    left: 197,
  },
  buttonText: {
    color: '#FF7014',
  }
});

export default RegisterScreen;
