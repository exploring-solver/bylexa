import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { List, FAB, useTheme } from 'react-native-paper';
import { fetchProjects } from '../../services/Api';
import { Colors } from '@/constants/Colors';

const ProjectList = ({ navigation }) => {
  const [projects, setProjects] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const fetchedProjects = await fetchProjects();
        setProjects(fetchedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    loadProjects();
  }, []);

  const renderProject = ({ item }) => (
    <List.Item
      title={item.name}
      description={item.description}
      onPress={() => navigation.navigate('ProjectDetails', { id: item._id })}
      left={props => <List.Icon {...props} icon="folder" />}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={projects}
        renderItem={renderProject}
        keyExtractor={item => item._id}
      />
      <FAB
        style={[styles.fab]}
        icon="plus"
        onPress={() => navigation.navigate('CreateProject')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0
  },
});

export default ProjectList;