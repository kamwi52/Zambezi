import { SavedMaterial } from '../types';

const STORAGE_KEY = 'zambezi_offline_content';

export const saveMaterial = (material: SavedMaterial): void => {
  try {
    const current = getMaterials();
    // Avoid duplicates based on ID or very similar content timestamp
    if (current.find(i => i.id === material.id)) return;
    
    const updated = [material, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to save material", error);
    alert("Storage full or unavailable. Could not save.");
  }
};

export const getMaterials = (): SavedMaterial[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load materials", e);
    return [];
  }
};

export const deleteMaterial = (id: string): void => {
  const current = getMaterials();
  const updated = current.filter(i => i.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const updateMaterial = (id: string, newContent: any): void => {
  try {
    const current = getMaterials();
    const index = current.findIndex(i => i.id === id);
    if (index !== -1) {
      current[index].content = newContent;
      current[index].timestamp = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    }
  } catch (e) {
    console.error("Failed to update material", e);
  }
};

export const getMaterialsForTopic = (subjectId: string, topic: string): SavedMaterial[] => {
    return getMaterials().filter(m => m.subjectId === subjectId && m.topic === topic);
};