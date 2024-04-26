import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function Circle({ radius, centerX, centerY, color }) {
  const points = [];

  // Iterate over a range of x values
  for (let x = centerX - radius; x <= centerX + radius; x++) {
    // Solve for y using the equation of the circle
    const y = Math.sqrt(Math.pow(radius, 2) - Math.pow(x - centerX, 2)) + centerY;
    
    // Push the point to the array
    points.push({ x, y });
  }

  return (
    <View style={styles.container}>
      {points.map((point, index) => (
        <View key={index} style={[styles.point, { left: point.x, top: point.y, backgroundColor: color }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  point: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1,
  },
});
