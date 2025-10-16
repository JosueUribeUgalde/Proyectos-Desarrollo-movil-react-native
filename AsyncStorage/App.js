import { useState,useEffect } from 'react';
import { StyleSheet, Text, View,Alert,TouchableOpacity,ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';


export default function App() {
  //aqui se guradan los datos crypt
  const [cryptoData, setCryptoData] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(true);


async function fetchData() {
try {
  //se obtienen los datos del almacenamiento local
  const dataLocal = await AsyncStorage.getItem('cryptoData');
  const timeLocal = await AsyncStorage.getItem('cryptoDataTime');
  
  //si hay datos esos se cargan en el estado
  if (dataLocal) {
    setCryptoData(JSON.parse(dataLocal));
    setIsLoading(false);
    console.log('Datos cargados desde el almacenamiento local');
    
    // Verificar si el cache ha expirado en 2 mnt
    const now = Date.now();
    const twoMinutes = 2 * 60 * 1000;
    
    if (timeLocal && (now - parseInt(timeLocal)) < twoMinutes) {
      //si esto se cumplio se sale de la funcion
      return;
    } else {
      console.log('Cache expirado actualizando desde API...');
    }
  } else {
    console.log('No hay cache obteniendo datos desde API...');
  }
  
  //api peticion
  const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,dogecoin,solana&vs_currencies=usd&include_24hr_change=true');
  const data = await response.json();
  setCryptoData(data);
  setIsLoading(false);

  //Aqui se va a guardar la informacion en el almacenamiento local
  await AsyncStorage.setItem('cryptoData', JSON.stringify(data));
  await AsyncStorage.setItem('cryptoDataTime', Date.now().toString());
  console.log('Se obtuvieron datos correctamente desde API');
  
} catch (error) {
  console.error('Error fetching data:', error);
  setIsLoading(false);
}}

//Función para limpiar el localStorage
async function clearLocalStorage() {
  try {
    await AsyncStorage.clear();
    setCryptoData(null);
    setIsLoading(true);
    Alert.alert('Exito', 'Cache eliminado correctamente');
    //se refrescan los datos porque si no se ven ya que el fetch solo se ejecuta una vez
    fetchData();
  } catch (error) {
    console.error('Error limpiando localStorage:', error);
  }
}

//Detectar cambios en la conexión
useEffect(() => {
  const unsubscribe = NetInfo.addEventListener(state => {
    setIsConnected(state.isConnected);

    // Si no hay internet sae va a mandar una alerta
    if (!state.isConnected) {
      Alert.alert(
        'Sin conexión a internet',
        'Estás sin internet. Los datos podrían no ser los más recientes.',
        [{ text: 'OK' }]
      );
    }
  });
  return () => unsubscribe();
}, []);

//Vamos a ejecutar fetch una vez 
useEffect(() => {
  fetchData();
}, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Criptomonedas</Text>
        
        {/* Indicador de carga inicial */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Cargando datos...</Text>
          </View>
        )}
        
        <View style={styles.contMoneda}>
          <Text style={styles.moneda}>
            Valor Bitcoin: ${cryptoData?.bitcoin?.usd || 'Cargando...'}
          </Text>
          <Text style={cryptoData?.bitcoin?.usd_24h_change >= 0 ? styles.cambio : styles.cambioNegativo}>
            Cambio 24h: {cryptoData?.bitcoin?.usd_24h_change ? cryptoData.bitcoin.usd_24h_change.toFixed(2) : 'Cargando...'}%
          </Text>
        </View>

        <View style={styles.contMoneda}>
          <Text style={styles.moneda}>
            Valor Ethereum: ${cryptoData?.ethereum?.usd || 'Cargando...'}
          </Text>
          <Text style={cryptoData?.ethereum?.usd_24h_change >= 0 ? styles.cambio : styles.cambioNegativo}>
            Cambio 24h: {cryptoData?.ethereum?.usd_24h_change ? cryptoData.ethereum.usd_24h_change.toFixed(2) : 'Cargando...'}%
          </Text>
        </View>

        <View style={styles.contMoneda}>
          <Text style={styles.moneda}>
            Valor Dogecoin: ${cryptoData?.dogecoin?.usd || 'Cargando...'}
          </Text>
          <Text style={cryptoData?.dogecoin?.usd_24h_change >= 0 ? styles.cambio : styles.cambioNegativo}>
            Cambio 24h: {cryptoData?.dogecoin?.usd_24h_change ? cryptoData.dogecoin.usd_24h_change.toFixed(2) : 'Cargando...'}%
          </Text>
        </View>

        <View style={styles.contMoneda}>
          <Text style={styles.moneda}>
            Valor Solana: ${cryptoData?.solana?.usd || 'Cargando...'}
          </Text>
          <Text style={cryptoData?.solana?.usd_24h_change >= 0 ? styles.cambio : styles.cambioNegativo}>
            Cambio 24h: {cryptoData?.solana?.usd_24h_change ? cryptoData.solana.usd_24h_change.toFixed(2) : 'Cargando...'}%
          </Text>
        </View>

        <TouchableOpacity style={styles.btnLimpiar} onPress={clearLocalStorage}>
          <Text style={styles.btnTexto}>Limpiar Cache</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffe1',
    alignItems: 'center',
    paddingTop: 50,
  },
  moneda: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  cambio: {
    fontSize: 18,
    color: '#009a05ff',
    fontWeight: '500',
  },
  cambioNegativo: {
    fontSize: 18,
    color: '#ff0000',
    fontWeight: '500',
  },
  title: {
    fontSize: 30,
    marginBottom: 40,
    fontWeight: 'bold',
  },
  contMoneda: {
    backgroundColor: '#1a778b6a',
    width: '90%',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#000',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  btnLimpiar: {
    backgroundColor: '#ff0000',
    padding: 15,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  btnTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    width: '90%',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
  },
});
