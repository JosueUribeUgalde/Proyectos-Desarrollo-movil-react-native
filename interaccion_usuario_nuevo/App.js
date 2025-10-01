import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';

export default function App() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    if (!nombre || !correo || !fechaNacimiento || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }
    Alert.alert('Éxito', `Registro exitoso. ¡Bienvenido, ${nombre}, ${correo}!`);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Dame tus datos</Text>
      
      <TextInput 
        placeholder="Nombre" 
        style={styles.input} 
        value={nombre}
        onChangeText={setNombre} 
      />
      
      <TextInput 
        placeholder="Correo" 
        style={styles.input} 
        keyboardType="email-address" 
        value={correo}
        onChangeText={setCorreo} 
      />
      
      <TextInput 
        placeholder="Fecha de Nacimiento (DD/MM/AAAA)" 
        style={styles.input} 
        value={fechaNacimiento}
        onChangeText={setFechaNacimiento} 
      />
      
      <TextInput 
        placeholder="Contraseña" 
        style={styles.input} 
        secureTextEntry 
        value={password}
        onChangeText={setPassword} 
      />
      
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    height: 50,
    backgroundColor: 'white',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 15,
    width: '100%',
    paddingHorizontal: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


