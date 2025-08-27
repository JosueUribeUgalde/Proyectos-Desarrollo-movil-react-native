import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  const addTask = (task) => {
    setTasks([...tasks, task]);
  };

  const deleteTask = (index) => {
    tasks.splice(index, 1);
    setTasks([...tasks]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de tareas</Text>
      <TextInput
        style={styles.input}
        value={task}
        placeholder="Agregar nueva tarea"
        onChangeText={setTask}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => addTask(task)}>
          <Text style={styles.buttonText}>Agregar</Text>
        </TouchableOpacity>
       
      </View>
      <View style={styles.taskList}>
        <Text style={styles.title}>Tareas pendientes:</Text>
        {tasks.map((task, index) => (
          <View key={index} style={styles.taskItem}>
            <Text style={styles.taskText}>{task}</Text>
            <TouchableOpacity onPress={() => deleteTask(index)} style={styles.deleteIcon}>
              <MaterialIcons name="delete" size={28} color="#ff3333" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000ff',
    alignItems: 'center',
    paddingTop: 90,
    width: '100%',
  },
  title: {
    marginTop: 30,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  input: {
    backgroundColor: '#ffffff',
    height: 50,
    borderColor: '#000000ff',
    fontWeight: '500',
    borderWidth: 2,
    borderRadius: 14,
    paddingHorizontal: 10,
    marginTop: 10,
    width: '85%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    width: '100%',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#ffffffff',
    paddingHorizontal: 10,
    fontWeight: 'bold',
  },
  button: {
    alignContent: 'center',
    justifyContent: 'center',
    height: 50,
    width: '35%',
    borderRadius: 14,
    marginTop: 10,
    backgroundColor: '#0300b1ff',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskList: {
    marginTop: 20,
    width: '90%',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'space-between',
  },
  taskText: {
    color: '#fff',
    fontSize: 18,
    flex: 1,
  },
  deleteIcon: {
    marginLeft: 10,
    padding: 4,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
});
