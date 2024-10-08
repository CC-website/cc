import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { main_url } from '../../constants/Urls';

// Helper function to generate the days in a month
const getDaysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate(); // 0 gets the last day of the previous month
};

// Helper function to get the day of the week the month starts on
const getFirstDayOfMonth = (month, year) => {
  return new Date(year, month, 1).getDay(); // Returns 0 for Sunday, 1 for Monday, ..., 6 for Saturday
};

// List of month names
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 
  'June', 'July', 'August', 'September', 'October', 
  'November', 'December'
];

const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const SecondTab = ({ visible, onClose, setOverview, onMonthSelect }) => {
  const currentYear = new Date().getFullYear();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch events from backend
  const fetchEvents = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const jsonObject = JSON.parse(token);
      const response = await axios.get(`${main_url}/api/events/?channel_id=${setOverview.id}`, {
        headers: {
          'Authorization': `Bearer ${jsonObject.access}`,
        },
      });
      setEvents(response.data);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load events.');
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchEvents();
    }
  }, [visible]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEvents(); 
  };

  // Function to check if a specific day has an event
  const isEventDay = (month, day) => {
    return events.some(event => {
      const eventDate = new Date(event.date); // Assuming event.date is a valid date string
      return eventDate.getFullYear() === currentYear && eventDate.getMonth() === month && eventDate.getDate() === day;
    });
  };

  // Handle month selection
  const handleMonthClick = (month) => {
    const monthEvents = events.filter(event => new Date(event.date).getMonth() === month);
    onMonthSelect(month, monthEvents);  // Pass selected month and its events to the parent component
  };

  // Generate the weeks in a month for a proper calendar view
  const renderMonth = (month, year) => {
    const daysInMonth = getDaysInMonth(month, year);
    const firstDayOfMonth = getFirstDayOfMonth(month, year);

    // Create an array to represent the days in the month
    let daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Add empty spaces to the beginning of the array for the days before the first of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.unshift(null);
    }

    // Split the days array into chunks of 7 to represent the weeks
    const weeksArray = [];
    for (let i = 0; i < daysArray.length; i += 7) {
      weeksArray.push(daysArray.slice(i, i + 7));
    }

    return (
      <TouchableOpacity onPress={() => handleMonthClick(month)} key={month}>
        <View style={styles.monthContainer}>
          <Text style={styles.monthTitle}>{monthNames[month]}</Text>
          {/* Render the days of the week */}
          <View style={styles.weekRow}>
            {daysOfWeek.map((day, index) => (
              <Text key={index} style={styles.dayOfWeek}>{day}</Text>
            ))}
          </View>
          {/* Render the days of the month */}
          {weeksArray.map((week, index) => (
            <View 
              key={index} 
              style={[styles.weekRow, week.includes(null) || week.length < 7 ? styles.weekRowAlignLeft : null]}
            >
              {week.map((day, idx) => (
                <Text 
                  key={idx} 
                  style={[
                    styles.day, 
                    day && isEventDay(month, day) ? styles.eventDay : null
                  ]}
                >
                  {day || ''}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  // Render the entire calendar with 2 columns, 6 months per row
  const renderCalendar = () => {
    const monthsArray = Array.from({ length: 12 }, (_, i) => i);

    return (
      <FlatList
        data={monthsArray}
        keyExtractor={(item) => item.toString()}
        numColumns={2}
        renderItem={({ item }) => renderMonth(item, currentYear)}
      />
    );
  };

  // Show loading spinner until data is fetched
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <ScrollView horizontal={true}>
      <View style={styles.container}>
        {renderCalendar()}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#202020',
  },
  monthContainer: {
    flex: 1,
    margin: 2,
    borderWidth: 1,
    borderColor: '#404040',
    borderRadius: 8,
    padding: 5,
    backgroundColor: '#303030',
  },
  monthTitle: {
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
    marginBottom: 6,
    fontWeight: 'bold',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  weekRowAlignLeft: {
    justifyContent: 'flex-start',  // Align to the left for incomplete rows
  },
  dayOfWeek: {
    color: 'white',
    width: 20,
    height: 20,
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: 'bold',
  },
  day: {
    color: 'white',
    width: 20,
    height: 20,
    textAlign: 'center',
    lineHeight: 20,
    margin: 2,
    borderRadius: 14,
  },
  eventDay: {
    borderWidth: 2,
    borderColor: 'yellow',
    backgroundColor: '#505050',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#202020',
  },
});

export default SecondTab;
