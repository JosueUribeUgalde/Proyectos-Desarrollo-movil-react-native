import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [DATA, setDATA] = useState([]);
  const [loading, setLoading] = useState(true);

  // Guardar datos en AsyncStorage
  const guardarEnStorage = async (datos) => {
    try {
      const jsonData = JSON.stringify(datos);
      await AsyncStorage.setItem('usuarios', jsonData);
      console.log('Datos guardados en AsyncStorage');
      console.log(jsonData);// solamente para verificar que datos gurdo
    } catch (error) {
      console.error('Error guardando datos:', error);
    }
  };

  // Leer datos de AsyncStorage
  const leerDeStorage = async () => {
    try {
      const jsonData = await AsyncStorage.getItem('usuarios');
      if (jsonData !== null) {
        const datos = JSON.parse(jsonData);
        return datos;
      }
      return null;
    } catch (error) {
      console.error('Error leyendo datos:', error);
      return null;
    }
  };

  async function datos() {
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/users');
      const response = await res.json();
      return response;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  // Cargar dados si hay locales pues los carga sino hace fetch 
  const cargarDatos = async () => {
    setLoading(true);
    
    const datosLocales = await leerDeStorage();
    
    if (datosLocales) {
      console.log('Cargando datos desde AsyncStorage');
      setDATA(datosLocales);
      setLoading(false);
    } else {
      console.log('No hay datos locales, obteniendo de API...');
      const datosAPI = await datos();
      if (datosAPI) {
        setDATA(datosAPI);
        await guardarEnStorage(datosAPI);
      }
      setLoading(false);
    }
  };

  // si se limpio el local con esta funcion se pide y se llena el DATA
  const refrescarDatos = async () => {
    setLoading(true);
    const nuevosDatos = await datos();
    if (nuevosDatos) {
      setDATA(nuevosDatos);
      await guardarEnStorage(nuevosDatos);
      Alert.alert('Éxito', 'Datos actualizados desde la API');
    }
    setLoading(false);
  };

  // Uso de revoveItem para limpiar lo que guardamo¿ 
  const limpiarStorage = async () => {
    try {
      await AsyncStorage.removeItem('usuarios');
      setDATA([]);
      Alert.alert('Éxito', 'Datos locales eliminados');
    } catch (error) {
      console.error('Error limpiando storage:', error);
    }
  };

  //ejecucion de cargar datos al iniciar
  useEffect(() => {
    cargarDatos();
  }, []);

  const Item = ({name,username,email,address,phone}) => (
    <View style={styles.item}>
      <Text style={styles.title}>Nombre: {name}</Text>
      <Text style={styles.title}>Username: {username}</Text>
      <Text style={styles.title}>Email: {email}</Text>
      <Text style={styles.title}>Dirección(calle): {address}</Text>
      <Text style={styles.title}>Telefono: {phone}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>Lista de users renderizados:</Text>
      
    
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={refrescarDatos}>
          <Text style={styles.buttonText}>Refrescar API</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonDanger} onPress={limpiarStorage}>
          <Text style={styles.buttonText}>Limpiar Local</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={styles.loading}>Cargando datos...</Text>
      ) : (
        <FlatList
          data={DATA}
          renderItem={({item}) => <Item name={item.name} username={item.username} email={item.email} address={item.address.street} phone={item.phone} />}
          keyExtractor={item => item.id.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c9c8c8ff',
    alignItems: 'center',
    paddingTop: 50,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 20,
    width: '100%',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  buttonDanger: {
    backgroundColor: '#f44336',
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
  },
  loading: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  item: {
    backgroundColor: '#657a7eff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    width: 350,
  },
});
