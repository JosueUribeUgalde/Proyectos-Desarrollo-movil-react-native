import { StyleSheet, Text, View,TextInput, TouchableOpacity} from 'react-native';
import { useState } from 'react';

export default function App() {
const [gasto, setgasto] = useState('');
const [monto, setmonto] = useState('');

// Cambiado: total como número
const [total, settotal] = useState(0);
// Cambiado: lista como array (antes era objeto y causaba TypeError al usar spread)
const [lista, setlista] = useState([]);

function agregarGasto(gasto, monto){
  const parsed = parseFloat(monto);
  const valor = isNaN(parsed) ? 0 : parsed;
  setlista(prev => [...prev, {gasto: gasto, monto: valor}]);
  settotal(prev => prev + valor);
  setgasto('');
  setmonto('');
};


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

      <TouchableOpacity style={styles.button} onPress={() => agregarGasto(gasto, monto)}>
        <Text style={styles.buttonText}>agregar el gasto</Text>
      </TouchableOpacity>
      {/* Corregido: eliminado el punto después de total */}
      <Text style={styles.title}>Total de gastos: {total}</Text>
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
  button: {
    backgroundColor: '#000000ff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '40%',
    height: 40,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
