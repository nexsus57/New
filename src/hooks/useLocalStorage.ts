
import { useState, useEffect, type Dispatch, type SetStateAction } from 'react';

function getStorageValue<T>(key: string, defaultValue: T): T {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved) as T;
      } catch (error) {
        console.error('Error parsing JSON from localStorage', error);
        return defaultValue;
      }
    }
  }
  return defaultValue;
}

export const useLocalStorage = <T,>(key: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>] => {
  // Initialize with defaultValue to match server-side rendering
  const [value, setValue] = useState<T>(defaultValue);

  // Sync with localStorage on client mount
  useEffect(() => {
    const storedValue = getStorageValue(key, defaultValue);
    setValue(storedValue);
  }, [key, defaultValue]);

  // Update localStorage when value changes
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error('Could not save to localStorage', error);
    }
  }, [key, value]);

  return [value, setValue];
};
