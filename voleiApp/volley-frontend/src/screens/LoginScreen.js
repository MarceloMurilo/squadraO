import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import AuthContext from '../contexts/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  console.log('Login Screen Renderizou');
  const handleLogin = async () => {
    const success = await login(email, password);
    if (success) {
      navigation.navigate('Home'); // Redireciona para a HomeScreen após login
    } else {
      alert('Login falhou. Verifique suas credenciais.');
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

          {/* adicionar: 
          checkbox para manter-se conectado
          link para esqueceu a senha
          link para cadastro
          API de conexão por google e outras plataformas
          Termos de Uso e políticas de privacidade */}



      
          <TouchableOpacity style={styles.butLog} onPress={handleLogin}>
            <Text style={styles.buttonText}>Logar</Text> 
          </TouchableOpacity>


     
      {/* <Button title="Registrar" onPress={() => navigation.navigate('Register')} /> */}

    </View>
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
    background: 'none', 
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
  }
});

export default LoginScreen;
