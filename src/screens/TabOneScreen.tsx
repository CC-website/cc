import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '../components/Themed';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootTabParamList, RootTabScreenProps } from '../../types';

type DrawerScreenProps = RootTabScreenProps<'TabOne'> & {
  navigation: DrawerNavigationProp<RootTabParamList>;
};

export default function TabOneScreen({ navigation }: DrawerScreenProps) {
  const openDrawer = () => {
    navigation.openDrawer();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openDrawer} style={styles.sidebarTrigger}>
        <Text>Open Sidebar</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20, // Adjust the padding to make space for the header
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  sidebarTrigger: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
  },
});
