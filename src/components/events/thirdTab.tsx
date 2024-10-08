import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { main_url } from '../../constants/Urls';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ThirdTab = ({ selectedMonth, selectedEvents }) => {
  const [filterWeek, setFilterWeek] = useState(''); // State to hold the filter value
  const currentMonth = new Date().getMonth();
  const monthToDisplay = selectedMonth ?? currentMonth;
  const year = new Date().getFullYear();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September', 'October',
    'November', 'December'
  ];

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  const getEventsForDay = (day) => {
    return selectedEvents.filter(event => new Date(event.date).getDate() === day);
  };

  const getDayOfWeek = (day) => {
    const date = new Date(year, monthToDisplay, day);
    return daysOfWeek[date.getDay()];
  };

  const renderDay = (day) => {
    const eventsForDay = getEventsForDay(day);
    const dayOfWeek = getDayOfWeek(day);

    return (
      <TouchableOpacity key={day} style={[styles.dayContainer, eventsForDay.length ? styles.eventDay : styles.noEventDay]}>
        <Text style={styles.dayText}>{`${dayOfWeek}, ${day}`}</Text>
        {eventsForDay.length ? (
          eventsForDay.map((event, idx) => (
            <TouchableOpacity key={idx} style={styles.eventContainer} onPress={() => console.log(`Event ${event.id} clicked`)}>
              {/* Horizontal layout for image and text */}
              <View style={styles.eventDetailsContainer}>
                {/* Event image */}
                <Image
                  source={{
                    uri: event.image
                      ? `${main_url.replace(/\/$/, '')}/${event.image.replace(/^\//, '')}`
                      : null, // Fallback to null if image is null or undefined
                  }}
                  style={styles.eventImage}
                />
                {/* Event details (name, date, status) */}
                <View style={styles.eventTextContainer}>
                  <Text style={styles.eventTitle}>{event.name}</Text>
                  <Text style={styles.eventDate}>{`${new Date(event.date).toLocaleDateString()} ${new Date(event.date).toLocaleTimeString()}`}</Text>
                  <Text style={styles.eventStatus}>{`${event.status}`}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noEventText}>No events</Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderWeeks = () => {
    const daysInMonth = getDaysInMonth(monthToDisplay, year);
    const weeks = [];
    let currentWeek = [];

    const firstDayOfMonth = new Date(year, monthToDisplay, 1).getDay();

    for (let i = 0; i < firstDayOfMonth; i++) {
      currentWeek.push(<View key={`empty-${i}`} style={styles.emptyDay} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(renderDay(day));

      if (new Date(year, monthToDisplay, day).getDay() === 6 || day === daysInMonth) {
        weeks.push(
          <View key={`week-${weeks.length + 1}`} style={styles.weekContainer}>
            <Text style={styles.weekTitle}>{`Week ${weeks.length + 1}`}</Text>
            <View>{currentWeek}</View>
          </View>
        );
        currentWeek = [];
      }
    }

    return weeks;
  };

  const filteredWeeks = () => {
    const weeks = renderWeeks();
    if (filterWeek) {
      const weekNumber = parseInt(filterWeek, 10);
      if (!isNaN(weekNumber) && weekNumber > 0 && weekNumber <= weeks.length) {
        return weeks.filter((_, index) => index + 1 === weekNumber);
      }
    }
    return weeks;
  };

  return (
    <View style={styles.container}>
      {/* Input field to filter by week number */}
      <TextInput
        style={styles.input}
        placeholder="Enter week number"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
        value={filterWeek}
        onChangeText={setFilterWeek}
      />
      {/* Display the month name */}
      <Text style={styles.monthTitle}>{monthNames[monthToDisplay]}</Text>
      {/* Scrollable area for the weeks */}
      <ScrollView>
        {filteredWeeks()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#202020',
    padding: 20,
  },
  input: {
    backgroundColor: '#303030',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  monthTitle: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  weekContainer: {
    marginBottom: 20,
  },
  weekTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dayContainer: {
    marginVertical: 5,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#303030',
  },
  eventDay: {
    borderColor: '#00ff00',
    borderWidth: 2,
  },
  noEventDay: {
    borderColor: '#555',
    borderWidth: 1,
  },
  dayText: {
    fontSize: 18,
    color: '#fff',
  },
  eventContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#36393f',
    borderRadius: 5,
  },
  eventDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Vertically center image and text
  },
  eventImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10, // Space between image and text
  },
  eventTextContainer: {
    flexDirection: 'column', // Stack text vertically
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  eventDate: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 3,
  },
  eventStatus: {
    fontSize: 14,
    color: '#00ff00', // Status color
    marginTop: 3,
  },
  noEventText: {
    color: '#aaa',
  },
});

export default ThirdTab;
