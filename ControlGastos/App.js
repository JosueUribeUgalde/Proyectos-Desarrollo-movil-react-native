import { StyleSheet, Text, View,TextInput } from 'react-native';
import { useState } from 'react';

export default function App() {
const [gasto, setgasto] = useState('');
const [monto, setmonto] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>App de control de gastos</Text>
      <TextInput
      style={styles.input}
      placeholder='Ingresa el titulo de gasto'
      value={gasto}
      onChangeText={setgasto}
      />
            <TextInput
      style={styles.input}
      placeholder='Ingresa el monto de gasto'
      value={monto}
      onChangeText={setmonto}
      keyboardType='numeric'
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    paddingTop: 80,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000ff',
    textAlign: 'center',
  },
  input: {
    width: '80%',
    borderColor: '#000000ff',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
});
