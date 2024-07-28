'use client';

import { useEffect, useState } from 'react';
import { getData, openDB } from '@/utils/db';

const Test3 = () => {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (navigator.onLine) {
      setIsAuth(true);
    } else {
      console.log('offLine');
      const fetchData = async () => {
        try {
          const db = await openDB();
          const result = await getData(db, 'dataSets', 'dataA');
          if (result) {
            setIsAuth(true);
          }
        } catch (error) {
          setIsAuth(false);
        } finally {
        }
      };

      fetchData();
    }
  }, []);

  return isAuth ? <>Is Auth</> : <>No Auth</>;
};

export default Test3;
