'use client';

import React, { useState } from 'react';
import { useTransformedConfigData } from '@/hooks/useTransformConfigData';
import FieldRenderer from '../FieldRenderer';
import 'tailwindcss/tailwind.css';

interface ConfigTabsProps {
  data: { [key: string]: any[] }[];
  blacklist?: string[];
}

const ConfigTabs: React.FC<ConfigTabsProps> = ({ data, blacklist }) => {
  const tabs = useTransformedConfigData({ data, blacklist });
  const [activeTab, setActiveTab] = useState<string | null>(
    tabs[0]?.tabName || null
  );

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <div className="container mx-auto p-4">
      {/* 탭 목록 */}
      <ul className="flex border-b">
        {tabs.map((tab) => (
          <li
            key={tab.tabName}
            onClick={() => handleTabClick(tab.tabName)}
            className={`mr-4 cursor-pointer p-2 ${
              activeTab === tab.tabName
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500'
            }`}
          >
            {tab.info.hdr}
          </li>
        ))}
      </ul>

      {/* 선택된 탭의 필드 렌더링 */}
      <div className="mt-4">
        {tabs
          .filter((tab) => tab.tabName === activeTab)
          .map((tab) => (
            <div key={tab.tabName}>
              <h2 className="text-lg font-semibold mb-4">{tab.tabName}</h2>
              {tab.fields.map((field, index) => (
                <FieldRenderer key={index} field={field} />
              ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export default ConfigTabs;
