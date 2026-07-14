import { useCallback, useEffect, useState } from 'react';
import { locationService } from '../services/api';

const CACHE_KEY = 'aashanway-current-location';
const CACHE_TIME = 30 * 60 * 1000;
let activeRequest = null;

function savedLocation() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY)); } catch { return null; }
}

function locateDevice() {
  if (activeRequest) return activeRequest;
  activeRequest = new Promise((resolve, reject) => {
    if (!navigator.geolocation) { reject(new Error('Location is not supported by this browser')); return; }
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        resolve(await locationService.reverse(coords.latitude, coords.longitude));
      } catch {
        resolve({ label: `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`, latitude: coords.latitude, longitude: coords.longitude, updatedAt: Date.now() });
      }
    }, (error) => {
      const messages = { 1: 'Location permission denied — tap to retry', 2: 'Location unavailable — tap to retry', 3: 'Location request timed out — tap to retry' };
      reject(new Error(messages[error.code] || 'Could not detect location'));
    }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 5 * 60 * 1000 });
  }).finally(() => { activeRequest = null; });
  return activeRequest;
}

export default function useCurrentLocation() {
  const cached = savedLocation();
  const [location, setLocation] = useState(cached?.label || 'Detecting your location...');
  const [loading, setLoading] = useState(false);

  const capture = useCallback(async () => {
    setLoading(true);
    setLocation((current) => current || 'Detecting your location...');
    try {
      const result = await locateDevice();
      localStorage.setItem(CACHE_KEY, JSON.stringify(result));
      setLocation(result.label);
    } catch (error) { setLocation(error.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const current = savedLocation();
    if (!current?.updatedAt || Date.now() - current.updatedAt > CACHE_TIME) capture();
  }, [capture]);

  return { location, loading, refreshLocation: capture };
}
