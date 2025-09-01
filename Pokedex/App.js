import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image, ScrollView } from 'react-native';

export default function App() {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [url, setUrl] = useState('');
  const [caughtPokemon, setCaughtPokemon] = useState({}); 
  const [caughtCount, setCaughtCount] = useState(0);

  const [contPokemonAtrapado, setContPokemonAtrapado] = useState(0);

  const [listPokemon, setListPokemon] = useState([]);

  const handlerAgregarPokemon = (name, type, url) => {
    const newPokemon = { name, type, url };
    setListPokemon([...listPokemon, newPokemon]);
    setCaughtCount(caughtCount + 1);
    setName('');
    setType('');
    setUrl('');
  };

  const handleCapture = (index) => {
    setCaughtPokemon(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
    setContPokemonAtrapado(prev => caughtPokemon[index] ? prev - 1 : prev + 1);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
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
        <Text style={styles.textCaptureValue}>Pokemones atrapados: {contPokemonAtrapado}</Text>
        <Text style={styles.textCaptureValue}>Pokemones Totales: {caughtCount}</Text>
        {/* Mostrar la lista de pokemones */}
        <View style={styles.containerList}>
          {listPokemon.map((pokemon, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.cardAlingnElements}>
                <Text style={caughtPokemon[index] ? styles.caughtText : styles.NotcaughtText}>
                  Nombre: {pokemon.name}
                </Text>
                <Text style={caughtPokemon[index] ? styles.caughtText : styles.NotcaughtText}>
                  Tipo: {pokemon.type}
                </Text>
              </View>
              <Image 
                source={{ uri: pokemon.url }} 
                style={{ width: 60, height: 60, borderRadius: 10 }} 
              />
              <TouchableOpacity
                style={[styles.buttonCapture, caughtPokemon[index] ? styles.buttonCaught : null]}
                onPress={() => handleCapture(index)}>
                <Text style={styles.textCapture}>
                  {caughtPokemon[index] ? 'Atrapado' : 'Capturar'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 50,
    width: '100%',
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
    justifyContent: 'space-between',
    height: 250,
    width: '85%',
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
    width: '90%',
  },
  card: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    alignItems: 'center',
  },
  cardAlingnElements: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
    resizeMode: 'contain',
  },
  buttonCapture: {
    backgroundColor: '#000000ff',
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  textCapture: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  NotcaughtText: {
    color: 'white',
    fontWeight: 'bold',
  },
  textCaptureValue: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },
  caughtText: {
    color: 'green',
    fontWeight: 'bold',
    textDecorationLine: 'line-through',
  },
  buttonCaught: {
    backgroundColor: 'green',
  },
  scrollViewContainer: {
    flexGrow: 1,
paddingBottom: 50,
  },
});
