import type { GaugeChartProps } from './GaugeChart';
import GaugeChart from './GaugeChart';

export type GaugeChartCardProps = GaugeChartProps & {
  title: string;
  units?: string;
};

const GaugeChartCard = ({
  title,
  data,
  value,
  units,
  minValue,
  maxValue,
}: GaugeChartCardProps) => {
  return (
    <div className="bg-white shadow-custom rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="flex justify-center items-center h-48">
        <GaugeChart
          data={data}
          value={value}
          minValue={minValue}
          maxValue={maxValue}
          units={units}
        />
      </div>
      <div className="text-center mt-2">
        <span className="text-2xl font-bold">{value}</span>
        {units && <span className="ml-1 text-gray-500">{units}</span>}
      </div>
    </div>
  );
};
export default GaugeChartCard;
