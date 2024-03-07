// Index.js
import React from 'react';
import { Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EditScreenInfo from '../../src/components/channels/settings/EditScreenInfo';
import { Text, View } from '../../src/components/Themed';
import { useTheme } from '../../src/constants/ThemeContext'; 

export default function Index() {
  const navigation = useNavigation();

  const handelMove = () => {
    return navigation.navigate('Channels');
  };

  return (
    <View style={[styles.container]}>
      <Text style={[styles.title]}>Messages</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/two.tsx" />
      <Button title="Move to channel" onPress={handelMove} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
