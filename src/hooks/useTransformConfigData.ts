import { useMemo } from 'react';
interface BaseField {
  fieldName: string;
  options?: FieldOption[];
}

interface ComboField extends BaseField {
  type: 'combo';
  ID: string;
  value: string;
  max?: string;
  list: Array<{ [key: string]: string }>;
}

interface EditField extends BaseField {
  type: 'edit';
  ID: string;
  value: string;
  max?: string;
}

interface IpField extends BaseField {
  type: 'ip';
  ID: string;
  value: string;
  max?: string;
}

interface AnyField extends BaseField {
  type: 'any';
  ID: string;
  value: string;
  max?: string;
}

interface AlertIdField extends BaseField {
  type: 'alert_id';
  ID: string;
  value: string;
  max?: string;
  alert_id: string;
}

interface AssignField extends BaseField {
  type: 'sAssign' | 'mAssign' | 'lAssign';
  ID: string;
  value: string;
  text_num: string;
  max?: string;
}

interface EditButtonField extends BaseField {
  type: 'edit+button';
  ID: string;
  value: string;
  max?: string;
  num?: string;
  AssignList?: Array<{ [key: string]: string }>;
  assignList?: AssignOption[];
}

export type Field =
  | ComboField
  | EditField
  | IpField
  | AnyField
  | AlertIdField
  | AssignField
  | EditButtonField;

interface TabInfo {
  id: string;
  tab_id: string;
  visible: string;
  hdr: string;
  num_type: string;
}

interface Tab {
  tabName: string;
  info: TabInfo;
  fields: Field[];
}

interface UseTransformedConfigDataProps {
  data: { [key: string]: any[] }[];
  blacklist?: string[];
}

interface FieldOption {
  label: string;
  value: string; // 원본 데이터 문자열
  max?: number; // range 타입일 때 최대 값(num3)
  type: 'string' | 'range' | 'none'; // combo 타입 (0: string, 1: range, 2: none)
}

interface AssignOption {
  label: string; // string_data,
  typeName: string; // type_name
}

function parseComboList(
  comboList: Array<{ [key: string]: string }>
): FieldOption[] {
  return comboList.flatMap((item) => {
    return Object.values(item).map((value) => {
      const [realValue, label, num3, num4] = value.split(';');

      return {
        value: realValue, // 원본 데이터 문자열
        label, // 실제 사용되는 인덱스 값
        max: num4 === '1' ? parseInt(num3, 10) : undefined, // range 타입일 경우 최대 값
        type:
          parseInt(num4, 10) === 0
            ? 'string'
            : parseInt(num4, 10) === 1
            ? 'range'
            : 'none', // combo 타입 (0: string, 1: range, 2: none)
      };
    });
  });
}

function parseAssignList(
  assignList: Array<{ [key: string]: string }>
): AssignOption[] {
  return assignList.flatMap((item) => {
    return Object.values(item).map((value) => {
      const [label, typeName] = value.split(';');
      return {
        label: label, // 예: "REPORT MAP"
        typeName: typeName, // 예: "check box"
      };
    });
  });
}

function processField(fieldData: Field, fieldName: string): Field | null {
  switch (fieldData.type) {
    case 'combo':
      if ('list' in fieldData) {
        const options = parseComboList(fieldData.list);
        return { ...fieldData, fieldName, options };
      }
      break;

    case 'edit':
    case 'ip':
    case 'any':
    case 'alert_id':
    case 'sAssign':
    case 'mAssign':
    case 'lAssign':
      return { ...fieldData, fieldName };

    case 'edit+button':
      if (fieldData.AssignList) {
        const assignList = parseAssignList(fieldData.AssignList);
        return { ...fieldData, fieldName, assignList };
      }
      return { ...fieldData, fieldName };
  }

  return null;
}

export function useTransformedConfigData({
  data,
  blacklist = [],
}: UseTransformedConfigDataProps): Tab[] {
  return useMemo(() => {
    if (!data) return [];

    return data
      .map((tabObj) => {
        const [tabName, tabFields] = Object.entries(tabObj)[0];
        if (blacklist.includes(tabName)) return null;

        let tabInfo: TabInfo | undefined;
        const fields: Field[] = [];

        tabFields.forEach((fieldObj) => {
          const [fieldName, fieldDataArray] = Object.entries(fieldObj)[0];

          if (fieldName === 'info') {
            tabInfo = (fieldDataArray as TabInfo[])[0];
          } else {
            const fieldData = (fieldDataArray as Field[])[0];

            const processedField = processField(fieldData, fieldName);
            if (processedField) {
              fields.push(processedField);
            }
          }
        });

        if (!tabInfo) return null;

        return {
          tabName,
          info: tabInfo,
          fields,
        };
      })
      .filter((field) => field !== null);
  }, [data, blacklist]);
}
