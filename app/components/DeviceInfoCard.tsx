import {
  FontAwesomeIcon,
  type FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';

export type DeviceInfoCardProps = {
  label: string;
  value: string | number;
  icon: FontAwesomeIconProps['icon'];
};

const DeviceInfoCard = ({ label, value, icon }: DeviceInfoCardProps) => {
  return (
    <div className="bg-white shadow-custom rounded-lg py-4 px-8 flex items-center justify-between">
      <div>
        <h2 className="text-gray-700 text-sm font-light mb-2">{label}</h2>
        <p className="text-base font-semibold">{value}</p>
      </div>
      <div className="bg-icon">
        <FontAwesomeIcon icon={icon} />
      </div>
    </div>
  );
};

export default DeviceInfoCard;
