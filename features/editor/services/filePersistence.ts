import { TabModel } from '../models/tab';

const STORAGE_KEY = 'editor-tabs';

export function saveTabs(tabs: TabModel[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tabs));
}

export function loadTabs(): TabModel[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}
