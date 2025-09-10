
import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';

const Item = ({ item }) => (
  <View style={styles.itemContainer}>
    <Text style={styles.itemTitle}>{item.nombre}</Text>
    <Image 
      source={{ uri: item.url }} 
      style={styles.itemImage}
    />
  </View>
);

export default function App() {
  const data = [
    { 
      id: 1, 
      nombre: 'Tamales', 
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZRMXNUHuRtt3xEfwEcHEU7uKAhJUU83J15Q&s'
    },
    { 
      id: 2, 
      nombre: 'Pozole', 
      url: 'https://sabrosano.com/wp-content/uploads/2020/05/Pozole_06-1-principal.jpg'
    },
    { 
      id: 3, 
      nombre: 'Sopes', 
      url: 'https://www.goya.com/wp-content/uploads/2023/10/sopes-900x900.jpg'
    },
    { 
      id: 4, 
      nombre: 'Mole', 
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYrMAdSH_zUbUQRVAXte7INw-YbNMFH-GuuQ&s'
    },
     { 
      id: 5, 
      nombre: 'Chiles rellenos', 
      url: 'https://www.unileverfoodsolutions.com.mx/tendencias/de-mexico-para-el-mundo/platillos-mexicanos/top10-platillos/jcr:content/parsys/content-aside-footer/columncontrol_copy_1598158461/columnctrl_parsys_2/textimage_copy/image.transform/jpeg-optimized/image.1592429865860.jpg'
    },
        { 
      id: 6, 
      nombre: 'Pambazos', 
      url: 'https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480_1_5x/img/recipe/ras/Assets/793A97EF-5AB6-42BC-B6D7-BA32F58729E8/Derivates/71B61452-6C6C-4FF4-A166-FC7206C9FA05.jpg'
    },

  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Este es un ejemplo usando FlatList</Text>
      <View style={styles.listContainer}>
        <FlatList
          data={data}
          renderItem={({ item }) => <Item item={item} />}
          keyExtractor={item => item.id}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContainer: {
    flex: 1,
    width: '100%',
  },
  itemContainer: {
    backgroundColor: 'gray',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,

  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
 
  },
  itemImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    resizeMode: 'cover',
  },
});
