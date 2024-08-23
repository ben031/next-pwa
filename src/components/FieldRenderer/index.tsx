import { Field } from '@/hooks/useTransformConfigData';

interface FieldRendererProps {
  field: Field;
}

const FieldRenderer: React.FC<FieldRendererProps> = ({ field }) => {
  switch (field.type) {
    case 'combo':
      return (
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            {field.fieldName}
          </label>
          <select
            defaultValue={
              field.options?.find(
                (option) =>
                  option.label === field.value || option.value === field.value
              )?.value
            }
            className="w-full border border-gray-300 p-2 rounded"
          >
            {field.options?.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );

    case 'edit':
    case 'ip':
    case 'any':
    case 'alert_id':
    case 'sAssign':
    case 'mAssign':
    case 'lAssign':
      return (
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            {field.fieldName}
          </label>
          <input
            type="text"
            defaultValue={field.value}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
      );

    case 'edit+button':
      return (
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            {field.fieldName}
          </label>
          <input
            type="text"
            defaultValue={field.value}
            className="w-full border border-gray-300 p-2 rounded mb-2"
          />
          {field.AssignList?.map((assign, index) => (
            <div key={index} className="flex items-center mb-2">
              <label className="block text-gray-700 font-medium mr-2">
                {assign.label}
              </label>
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600"
              />
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
};
export default FieldRenderer;
