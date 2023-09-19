import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {LineChart, BasicChart} from '../../lib/commonjs';
import {testData} from '../data';

const Charts = () => {
  useEffect(() => {}, []);

  const yRenderer = (item: string) => {
    const i = parseFloat(item);
    return i.toFixed(0);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Charts</Text>
      <BasicChart
        data={testData}
        x_key="month"
        y_key="value"
        y_label_renderer={yRenderer}
      />
      <LineChart
        data={testData}
        x_key="month"
        y_key="value"
        height={300}
        margin={40}
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

export default Charts;
