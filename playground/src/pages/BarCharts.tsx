import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {testData} from '../data';
import {BarChart} from '../../lib/commonjs';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const BarCharts = () => {
  const yRenderer = (item: string) => {
    const i = parseFloat(item);
    return i.toFixed(0);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bar Chart</Text>
      <BarChart
        data={testData}
        x_key="month"
        y_key="value"
        height={300}
        width={SCREEN_WIDTH - 50}
        y_label_renderer={yRenderer}
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

export default BarCharts;
