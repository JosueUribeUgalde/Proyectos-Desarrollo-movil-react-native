import { StyleSheet, Text, View, TouchableOpacity,TextInput } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [counter, setContador] = useState(0);
const incremnt=() => {
        setContador(counter +1);
        console.log(counter + 1);};
const decrement = () => {
        setContador(counter - 1);
        console.log(counter - 1);
      }

      //funcion donde simplemnte se cambia valor al escribir en input pero como lo recibe como string hay que parsear 
      const handleInputChange = (counter) => {
    setContador(parseInt(counter, 10) || 0); //cuando no se escribe nada se pone 0 
      };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>My contador</Text>
      <Text style={styles.title}>My contador: {counter}</Text>
      <TextInput
        style={styles.title}
        placeholder='mi numberito'
        keyboardType='numeric'
        value={counter.toString()}
        onChangeText={handleInputChange}
      />
      <TouchableOpacity style={styles.button} onPress={incremnt}>
        <Text style={styles.textButton}>Incrementar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={decrement}>
        <Text style={styles.textButton}>Bajar numero</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    padding: 10,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: '#007BFF',
    color: 'white',
  },
  textButton: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
});
