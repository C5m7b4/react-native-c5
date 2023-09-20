import React, {useEffect, useState, useMemo} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {BoxPlot, IQR, quartile, BoxPlotPress} from '../../lib/commonjs';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

interface IData {
  datename: string;
  cashier: number;
  voids: number;
}

interface IResult {
  cashier: number;
  cnt: number;
}

interface PredicateResult {
  dayData: IData[];
  index: number;
  m: number;
  maxwo: number;
  minwo: number;
  outliers: number[];
  predicateResult: IResult[];
  q1: number;
  q3: number;
  record: string;
  x: number;
}

const BoxPlots = () => {
  const [predicateResult, setPredicateResult] = useState<IResult[]>([]);
  const boxData = useMemo(() => {
    return [
      {datename: 'Mon', cashier: 1, voids: 12},
      {datename: 'Mon', cashier: 2, voids: 2.75},
      {datename: 'Mon', cashier: 3, voids: 21},
      {datename: 'Mon', cashier: 4, voids: 15.75},
      {namename: 'Mon', cashier: 5, voids: 6.25},
      {datename: 'Mon', cashier: 6, voids: 5},
      {datename: 'Mon', cashier: 7, voids: 8.47},
      {datename: 'Mon', cashier: 8, voids: 7.68},
      {datename: 'Mon', cashier: 9, voids: 3.15},
      {datename: 'Mon', cashier: 10, voids: 9.75},

      {datename: 'Tue', cashier: 1, voids: 1.13},
      {datename: 'Tue', cashier: 2, voids: 4.25},
      {datename: 'Tue', cashier: 3, voids: 3.63},
      {datename: 'Tue', cashier: 4, voids: 1.89},
      {datename: 'Tue', cashier: 5, voids: 18.21},
      {datename: 'Tue', cashier: 6, voids: 7.21},
      {datename: 'Tue', cashier: 2, voids: 5.24},
    ];
  }, []);

  useEffect(() => {}, [boxData]);
  const yRenderer = (item: string) => {
    const i = parseFloat(item);
    return i.toFixed(0);
  };

  const unique = (d: IData[]) => {
    const x_key = 'cashier';
    const newArray: number[] = [];
    d.forEach(r => {
      if (!newArray.includes(r[x_key])) {
        if (typeof r[x_key] !== 'undefined' && r[x_key] != null) {
          newArray.push(r[x_key]);
        }
      }
    });
    return newArray;
  };

  const count = (data: IData[], key: number) =>
    data.filter(c => c.cashier === key);

  const transactions = (data: IData[]) => {
    const newArray: number[] = [];
    const uniques = unique(data);
    uniques.map(c => {
      newArray.push(count(data, c).length);
    });
    return newArray;
  };

  const predicate = (data: IData[]) => {
    const uniques = unique(data);
    const transCounts = transactions(data);
    const results: IResult[] = [];
    const q3 = quartile(transCounts, 0.75);
    const iqr = IQR(transCounts);
    uniques.map(c => {
      const cnt = count(data, c);
      if (cnt.length > q3 + 1.5 * iqr) {
        results.push({cashier: c, cnt: cnt.length});
      }
    });
    return results;
  };

  const handleClick = (e: PredicateResult) => {
    console.log(e);
    setPredicateResult(e.predicateResult);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>BoxPlot</Text>
      <BoxPlot
        height={300}
        width={SCREEN_WIDTH - 50}
        data={boxData}
        x_key="datename"
        y_key="voids"
        y_label_renderer={yRenderer}
        predicate={predicate}
        onPress={(record: typeof BoxPlotPress) => handleClick(record)}
        bar_gradient_config={{
          x1: 0,
          y1: 0,
          x2: 10,
          y2: 0,
          GradientUnits: 'userSpaceOnUse',
          stop1: {
            offset: '0%',
            stopColor: 'red',
            stopOpacity: 0.8,
          },
          stop2: {
            offset: '100%',
            stopColor: 'orange',
            stopOpacity: 0.3,
          },
        }}
      />
      <View>
        {predicateResult.length > 0 ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10,
            }}>
            {predicateResult.map((r: IResult, i: number) => {
              return (
                <View key={i} style={{flexDirection: 'row', width: '80%'}}>
                  <Text style={{width: '50%', textAlign: 'left', fontSize: 20}}>
                    Cashier {r.cashier}
                  </Text>
                  <Text
                    style={{width: '50%', textAlign: 'right', fontSize: 20}}>
                    # of occurences{r.cnt}
                  </Text>
                </View>
              );
            })}
          </View>
        ) : (
          <View>
            <Text style={{fontSize: 21, marginTop: 10}}>
              There are no predicate results to show
            </Text>
          </View>
        )}
      </View>
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

export default BoxPlots;
