import { StyleSheet, Text, View, FlatList } from 'react-native';
import { useState, useEffect } from 'react';

export default function App() {
  const [DATA, setDATA] = useState([]);

  async function datos() {
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/users');
      const response = await res.json();
      return response;
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    datos().then(data => {
      setDATA(data);
    });
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
      <Text style={styles.title}>Lista de users renderizados:</Text>
      <FlatList
        data={DATA}
        renderItem={({item}) => <Item name={item.name} username={item.username} email={item.email} address={item.address.street} phone={item.phone} />}
        keyExtractor={item => item.id}
      />
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    backgroundColor: '#657a7eff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
  },
});
