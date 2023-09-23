import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {PieChart} from '../../lib/commonjs';

const pieData = [
  {value: 50, label: 'Groc'},
  {
    value: 10,
    label: 'Meat',
  },
];

const Pies = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pie Chart</Text>
      <PieChart data={pieData} value="value" label="label" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 21,
  },
});

export default Pies;
