import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity,Image} from 'react-native';

export default function App() {
const [name, setName] = useState('');
const [type, setType] = useState('');
const [url, setUrl] = useState('');

const [contPokemonAtrapado, setContPokemonAtrapado] = useState(0);

const [listPokemon, setListPokemon] = useState([]);

const handlerAgregarPokemon = (name, type, url) => {
  const newPokemon = { name, type, url };
  setListPokemon([...listPokemon, newPokemon]);
  setName('');
  setType('');
  setUrl('');
};


  return (
    <View style={styles.container}>
      <Text style={styles.textTitle}>Pokédex</Text>
    <View style={styles.containerInputs}>
      <TextInput style={styles.textImput} placeholder="Ingresa el nombre del pokemon" value={name} onChangeText={setName} />
      <TextInput style={styles.textImput} placeholder="Ingresa el tipo del pokemon" value={type} onChangeText={setType} />
      <TextInput style={styles.textImput} placeholder="Ingresa la url del pokemon" value={url} onChangeText={setUrl} />
      <TouchableOpacity style={styles.button} onPress={() => handlerAgregarPokemon(name, type, url)}>
        <Text style={styles.buttonText}>Agregar Pokemon</Text>
      </TouchableOpacity>
    </View>
    {/* Mostrar la lista de pokemones */}
    <View style={styles.containerList}>
      {listPokemon.map((pokemon, index) => (
        <View key={index} style={styles.card}>
          <Text>Nombre: {pokemon.name}</Text>
          <Text>Tipo: {pokemon.type}</Text>
          <Image source={{ uri: pokemon.url }} style={{ width: 100, height: 100 }} />
        </View>
      ))}
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
  containerList: {
    marginTop: 30,
    width: '80%',
  },
  card: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
});
