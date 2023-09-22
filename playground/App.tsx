import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {multiply} from './lib/commonjs';

import Charts from './src/pages/Charts';
import BarCharts from './src/pages/BarCharts';
import BoxPlots from './src/pages/BoxPlots';
import MultiLines from './src/pages/MultiLines';

const Page1 = () => {
  const [mulResult, setMulResult] = useState(0);

  const handleMultiply = () => {
    const r = multiply(10, 5);
    setMulResult(r);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Page 1</Text>
      <TouchableOpacity style={styles.button} onPress={handleMultiply}>
        <Text style={styles.buttonText}>Multiply</Text>
      </TouchableOpacity>
      <Text style={styles.text}>{mulResult}</Text>
    </View>
  );
};

const Page2 = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Page 2</Text>
    </View>
  );
};

const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={Page1} />
        <Drawer.Screen name="Page2" component={Page2} />
        <Drawer.Screen name="Charts" component={Charts} />
        <Drawer.Screen name="BarCharts" component={BarCharts} />
        <Drawer.Screen name="BoxPlots" component={BoxPlots} />
        <Drawer.Screen name="MultiLines" component={MultiLines} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 22,
  },
  button: {
    backgroundColor: 'blue',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  buttonText: {
    width: '100%',
    textAlign: 'center',
    fontSize: 21,
    color: '#fff',
  },
});

export default App;
