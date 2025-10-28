import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  RefreshControl
} from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://express-dqfkhte5chced0e0.eastus2-01.azurewebsites.net/api/users';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    descripcion: '',
    autor: '',
    fecha: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadCachedPosts();
    fetchPosts();
  }, []);

  // Cargar posts desde caché
  const loadCachedPosts = async () => {
    try {
      const cached = await AsyncStorage.getItem('posts');
      if (cached) {
        setPosts(JSON.parse(cached));
      }
    } catch (error) {
      console.error('Error loading cache:', error);
    }
  };

  // Guardar posts en caché
  const saveCachePost = async (postsData) => {
    try {
      await AsyncStorage.setItem('posts', JSON.stringify(postsData));
    } catch (error) {
      console.error('Error saving cache:', error);
    }
  };

  // GET de api
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setSyncing(true);
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }
      
      const result = await response.json();
      const fetchedPosts = result.data || [];
      setPosts(fetchedPosts);
      await saveCachePost(fetchedPosts);
      setError(null);
    } catch (err) {
      setError(err.message);
      Alert.alert('Error', 'No se pudieron cargar los posts desde el servidor');
    } finally {
      setLoading(false);
      setSyncing(false);
      setRefreshing(false);
    }
  };

  // POST del api
  const createPost = async () => {
    try {
      setSyncing(true);
      
      // Optimistic update
      const tempPost = {
        id: Date.now(),
        ...formData,
        synced: false
      };
      
      const updatedPosts = [...posts, tempPost];
      setPosts(updatedPosts);
      await saveCachePost(updatedPosts);
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al crear el post');
      }

      const result = await response.json();
      
      // Reemplazar el post temporal con el del servidor
      const finalPosts = updatedPosts.map(p => 
        p.id === tempPost.id ? { ...result.data, synced: true } : p
      );
      
      setPosts(finalPosts);
      await saveCachePost(finalPosts);
      
      Alert.alert('Éxito', 'Post creado correctamente');
      resetForm();
      setModalVisible(false);
    } catch (err) {
      Alert.alert('Error', 'No se pudo crear el post. Se guardó localmente.');
      // El post ya está en la lista como pendiente de sincronización
    } finally {
      setSyncing(false);
    }
  };

  //  Actualizar post
  const updatePost = async () => {
    try {
      setSyncing(true);
      
     
      const updatedPosts = posts.map(p => 
        p.id === selectedPost.id ? { ...p, ...formData, synced: false } : p
      );
      setPosts(updatedPosts);
      await saveCachePost(updatedPosts);

      const response = await fetch(`${API_URL}/${selectedPost.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el post');
      }

      const result = await response.json();
      
      const finalPosts = posts.map(p => 
        p.id === selectedPost.id ? { ...result.data, synced: true } : p
      );
      
      setPosts(finalPosts);
      await saveCachePost(finalPosts);
      
      Alert.alert('Éxito', 'Post actualizado correctamente');
      resetForm();
      setModalVisible(false);
      setDetailModalVisible(false);
    } catch (err) {
      Alert.alert('Error', 'No se pudo actualizar el post. Se guardó localmente.');
    } finally {
      setSyncing(false);
    }
  };

  // DELETE - Eliminar post
  const deletePost = async (postId) => {
    Alert.alert(
      'Confirmar',
      '¿Estás seguro de eliminar este post?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              setSyncing(true);
              
              // Optimistic update
              const updatedPosts = posts.filter(p => p.id !== postId);
              setPosts(updatedPosts);
              await saveCachePost(updatedPosts);

              const response = await fetch(`${API_URL}/${postId}`, {
                method: 'DELETE',
              });

              if (!response.ok) {
                throw new Error('Error al eliminar el post');
              }

              Alert.alert('Éxito', 'Post eliminado correctamente');
              setDetailModalVisible(false);
            } catch (err) {
              Alert.alert('Error', 'No se pudo eliminar el post del servidor');
              // Revertir si falla
              fetchPosts();
            } finally {
              setSyncing(false);
            }
          }
        }
      ]
    );
  };

  // Pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  // Filtrar posts
  const filteredPosts = posts.filter(post => {
    const query = searchQuery.toLowerCase();
    return (
      post.name?.toLowerCase().includes(query) ||
      post.descripcion?.toLowerCase().includes(query) ||
      post.autor?.toLowerCase().includes(query)
    );
  });

  // Abrir modal para crear
  const openCreateModal = () => {
    resetForm();
    setEditMode(false);
    setModalVisible(true);
  };

  // Abrir modal para editar
  const openEditModal = (post) => {
    setSelectedPost(post);
    setFormData({
      name: post.name,
      descripcion: post.descripcion,
      autor: post.autor,
      fecha: post.fecha
    });
    setEditMode(true);
    setDetailModalVisible(false);
    setModalVisible(true);
  };

  // Ver detalle
  const viewPostDetail = (post) => {
    setSelectedPost(post);
    setDetailModalVisible(true);
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      name: '',
      descripcion: '',
      autor: '',
      fecha: new Date().toISOString().split('T')[0]
    });
    setSelectedPost(null);
  };

  // Guardar post (crear o editar)
  const handleSavePost = () => {
    if (!formData.name || !formData.descripcion || !formData.autor) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    if (editMode) {
      updatePost();
    } else {
      createPost();
    }
  };

  const renderPost = ({ item }) => (
    <TouchableOpacity 
      style={[styles.postCard, !item.synced && styles.postCardPending]}
      onPress={() => viewPostDetail(item)}
    >
      <View style={styles.postHeader}>
        <Text style={styles.postTitle}>{item.name}</Text>
        {!item.synced && <Text style={styles.syncBadge}> Pendiente</Text>}
      </View>
      <Text style={styles.postDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.postFooter}>
        <Text style={styles.postAutor}> {item.autor}</Text>
        <Text style={styles.postFecha}> {item.fecha}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && posts.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando posts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>MY POSTS de mi api</Text>
        {syncing && <Text style={styles.syncingText}> Sincronizando...</Text>}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder=" Buscar por título, descripción o autor..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Posts List */}
      <FlatList
        data={filteredPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id?.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No se encontraron posts' : 'No hay posts aún'}
            </Text>
          </View>
        }
      />

      {/* Botón Crear */}
      <TouchableOpacity style={styles.fab} onPress={openCreateModal}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Modal Crear/Editar */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editMode ? ' Editar Post' : ' Nuevo Post'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Título"
              value={formData.name}
              onChangeText={(text) => setFormData({...formData, name: text})}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descripción"
              value={formData.descripcion}
              onChangeText={(text) => setFormData({...formData, descripcion: text})}
              multiline
              numberOfLines={4}
            />

            <TextInput
              style={styles.input}
              placeholder="Autor"
              value={formData.autor}
              onChangeText={(text) => setFormData({...formData, autor: text})}
            />

            <TextInput
              style={styles.input}
              placeholder="Fecha (YYYY-MM-DD)"
              value={formData.fecha}
              onChangeText={(text) => setFormData({...formData, fecha: text})}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, styles.saveButton]}
                onPress={handleSavePost}
                disabled={syncing}
              >
                <Text style={styles.buttonText}>
                  {syncing ? 'Guardando...' : 'Guardar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Detalle */}
      <Modal
        visible={detailModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}> Detalle del Post</Text>

            {selectedPost && (
              <>
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Título:</Text>
                  <Text style={styles.detailValue}>{selectedPost.name}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Descripción:</Text>
                  <Text style={styles.detailValue}>{selectedPost.descripcion}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Autor:</Text>
                  <Text style={styles.detailValue}>{selectedPost.autor}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Fecha:</Text>
                  <Text style={styles.detailValue}>{selectedPost.fecha}</Text>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    style={[styles.button, styles.deleteButton]}
                    onPress={() => deletePost(selectedPost.id)}
                  >
                    <Text style={styles.buttonText}> Eliminar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.button, styles.editButton]}
                    onPress={() => openEditModal(selectedPost)}
                  >
                    <Text style={styles.buttonText}> Editar</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  style={[styles.button, styles.closeButton]}
                  onPress={() => setDetailModalVisible(false)}
                >
                  <Text style={[styles.buttonText, {color: '#fff'}]}>Cerrar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  syncingText: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 5,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  postCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postCardPending: {
    borderLeftWidth: 4,
    borderLeftColor: '#FFA500',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  syncBadge: {
    fontSize: 10,
    color: '#FFA500',
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  postDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  postAutor: {
    fontSize: 12,
    color: '#888',
  },
  postFecha: {
    fontSize: 12,
    color: '#888',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
   
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    height: 460,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  cancelButton: {
    backgroundColor: '#666',
    height: 50,
  },
  editButton: {
    backgroundColor: '#FFA500',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  closeButton: {
    backgroundColor: '#333',
    height: 50,
    marginTop: 10,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    height: 30,
    width: 100,
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailSection: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});
