import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {BasicChart} from '../../lib/commonjs';
import {testData} from '../data';

const Charts = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Charts</Text>
      <BasicChart
        data={testData}
        x_key="month"
        y_key="value"
        height={300}
        margin={40}
      />
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

export default Charts;
