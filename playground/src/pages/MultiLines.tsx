import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {MultiLine, separateData} from '../../lib/commonjs';
import {promarData} from '../data';

interface iData {
  datename?: string;
  f1034?: string;
  f01?: string;
  f64?: string;
  f65?: string;
  f1301?: string;
  f1302?: string;
  profit?: string;
  margin?: string;
  dist?: string;
  f02?: string;
}

const colors = [
  '#81968f',
  '#ecb0e1',
  '#de6c83',
  '#c1aac0',
  '#2cf6b3',
  '#87255b',
];

const MultiLines = () => {
  const [data, setData] = useState<iData[]>([]);

  useEffect(() => {
    const separated = separateData(promarData, 'f01', colors);
    setData(separated);
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>MultiLine Charts</Text>
      <MultiLine
        curve={false}
        animated={true}
        data={data}
        lineGradient={true}
        x_key="datename"
        y_key="margin"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 21,
  },
});

export default MultiLines;
