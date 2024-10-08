import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Dimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import FirstTab from './firstTab';
import SecondTab from './secondTab';
import ThirdTab from './thirdTab';

// Define the screen width for proper tab layout
const initialLayout = { width: Dimensions.get('window').width };

export default function ListEvents({ visible, onClose, setOverview, navigation }) {
  const [index, setIndex] = useState(0); // Current tab index
  const [routes] = useState([ // Tabs configuration
    { key: 'first', title: 'Tab 1' },
    { key: 'second', title: 'Tab 2' },
    { key: 'third', title: 'Tab 3' },
  ]);

  // State to store the selected month and its events
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedEvents, setSelectedEvents] = useState([]);

  // Function to handle selecting a month in Tab 2
  const handleMonthSelection = (month, events) => {
    setSelectedMonth(month);
    setSelectedEvents(events); // Pass events specific to the selected month
    setIndex(2); // Switch to Tab 3
  };

  // Custom render functions for each tab to pass the necessary props
  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'first':
        return (
          <FirstTab
            visible={visible}
            onClose={onClose}
            setOverview={setOverview}
            navigation={navigation}
          />
        );
      case 'second':
        return (
          <SecondTab
            visible={visible}
            onClose={onClose}
            setOverview={setOverview}
            navigation={navigation}
            onMonthSelect={handleMonthSelection} // Pass the handler to Tab 2
          />
        );
      case 'third':
        return (
          <ThirdTab
            selectedMonth={selectedMonth} // Pass selected month to Tab 3
            selectedEvents={selectedEvents} // Pass events of selected month
          />
        );
      default:
        return null;
    }
  };

  // Custom tab bar render function for styling
  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={styles.tabIndicator}
      style={styles.tabBar}
      renderLabel={({ route, focused }) => (
        <Text style={[styles.tabLabel, focused ? styles.tabLabelActive : null]}>
          {route.title}
        </Text>
      )}
    />
  );

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Icon name="arrow-left" size={18} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Update Channel</Text>
        </View>

        {/* Tab View starts here */}
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          renderTabBar={renderTabBar} // Custom tab bar rendering
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          style={styles.tabView}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#202020',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Centers the text and aligns it in the middle
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1e1e1e',
    borderBottomWidth: 0.5,
    borderBottomColor: '#444',
  },
  backButton: {
    position: 'absolute', // To align the back button on the left
    left: 10,
    padding: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    flex: 1, // This ensures the title remains centered
    textAlign: 'center', // Aligns the title text in the center
  },
  tabView: {
    marginTop: 20,
    flex: 1,
  },
  tabBar: {
    backgroundColor: '#1e1e1e',
  },
  tabLabel: {
    color: '#888',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabLabelActive: {
    color: '#fff',
  },
  tabIndicator: {
    backgroundColor: '#4caf50',
    height: 3,
  },
});
