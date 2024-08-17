import { useState, useEffect } from 'react';

interface FieldOption {
  label: string;
  value: string;
}

interface Field {
  fieldName: string;
  type: string;
  ID: string;
  value: string;
  max?: string;
  options: FieldOption[];
}

interface Tab {
  tabName: string;
  fields: Field[];
}

export function useTransformConfigData(
  data: { [key: string]: any[] }[] | undefined
): Tab[] {
  const [transformedData, setTransformedData] = useState<Tab[]>([]);

  useEffect(() => {
    if (data) {
      const transformed = data.map((tabObj) => {
        const [tabName, fieldsArray] = Object.entries(tabObj)[0];

        const fields = fieldsArray.map((fieldObj: { [key: string]: any[] }) => {
          const [fieldName, fieldDataArray] = Object.entries(fieldObj)[0];
          const fieldData = fieldDataArray[0];

          let options: FieldOption[] = [];
          if (fieldData.type === 'combo' && fieldData.list) {
            const optionsObject = fieldData.list[0];
            options = Object.keys(optionsObject).map((key: string) => {
              const [, label] = optionsObject[key].split(';');
              return { label, value: optionsObject[key] };
            });
          }

          return {
            fieldName,
            type: fieldData.type,
            ID: fieldData.ID,
            value: fieldData.value,
            max: fieldData.max,
            options,
          };
        });

        return {
          tabName,
          fields,
        };
      });

      setTransformedData(transformed);
    }
  }, [data]);

  return transformedData;
}
