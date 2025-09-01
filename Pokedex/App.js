import { StyleSheet, Text, TextInput, View, TouchableOpacity} from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.textTitle}>Pokédex</Text>
    <View style={styles.containerInputs}>
      <TextInput style={styles.textImput} placeholder="Ingresa el nombre del pokemon" />
      <TextInput style={styles.textImput} placeholder="Ingresa el tipo del pokemon" />
      <TextInput style={styles.textImput} placeholder="Ingresa la url del pokemon" />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Agregar Pokemon</Text>
      </TouchableOpacity>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 50,
    height: '100%',
  },
  textTitle: {
    fontSize: 30,
  },
  textImput: {
    height: 45,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 20,
    fontSize: 16,
  },
  containerInputs: {
    marginTop: 20,
    width: '80%',
    justifyContent: 'space-between',
    height: '30%',
  },
  button: {
    backgroundColor: '#000000ff',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
