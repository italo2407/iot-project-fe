/* eslint-disable no-shadow */
import React, { PureComponent } from 'react';
//import GaugeComponent from 'react-gauge-component';
const GaugeComponent = React.lazy(() => import('react-gauge-component'));

export type GaugeChartProps = {
  data: GaugeChartLimitData[];
  value: number;
  minValue?: number;
  maxValue?: number;
  units?: string;
};

export type GaugeChartLimitData = {
  limit?: number;
  showTick?: boolean;
  color?: string;
  tooltip?: { text: string };
};

export default class GaugeChart extends PureComponent<GaugeChartProps> {
  render() {
    const { data, value, minValue, maxValue, units } = this.props;
    return (
      <GaugeComponent
        type="radial"
        arc={{
          width: 0.4,
          padding: 0.02,
          cornerRadius: 5,
          subArcs: data,
        }}
        pointer={{
          color: '#345243',
          length: 0.8,
          width: 15,
          elastic: true,
        }}
        labels={{
          tickLabels: {
            type: 'outer',
            defaultTickValueConfig: {
              formatTextValue: (value: any) => value + units,
              style: { fontSize: 10 },
            },
          },
        }}
        value={value}
        minValue={minValue}
        maxValue={maxValue}
      />
    );
  }
}
