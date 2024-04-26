import React from 'react';
import { View, StyleSheet } from 'react-native';

const DynamicCircularBorder = ({ numberOfLines }) => {
  const renderBorderLines = () => {
    const borderLines = [];
    const radius = 100; // Adjust the radius of the circle as needed
    const angleIncrement = 360 / numberOfLines;

    for (let i = 0; i < numberOfLines; i++) {
      const angle = (angleIncrement * i * Math.PI) / 180;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      borderLines.push(
        <View
          key={i}
          style={[
            styles.borderLine,
            {
              left: radius + x - 1, // Adjust -1 to align the lines perfectly
              top: radius - y - 1, // Adjust -1 to align the lines perfectly
              transform: [{ rotate: `${angleIncrement * i}deg` }],
            },
          ]}
        />
      );
    }

    return borderLines;
  };

  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        {/* Your circle content here */}
      </View>
      {renderBorderLines()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 30, // Adjust the width and height as needed
    height: 30,
  },
  circle: {
    width: '50%',
    height: '100%',
    borderRadius: 100, // Half of width and height to make it a circle
    backgroundColor: 'lightblue', // Example background color
    justifyContent: 'center',
    alignItems: 'center',
  },
  borderLine: {
    position: 'absolute',
    backgroundColor: 'black', // Example border color
    height: 3, // Example border width
    width: '100%',
  },
});

export default DynamicCircularBorder;