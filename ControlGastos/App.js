import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={style.title}>App de control de gastos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000ff',
    textAlign: 'center',
  },
});
