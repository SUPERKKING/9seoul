/**
 * Host & Admin Experience Program Manager
 * Allows hosts to add new programs or update existing ones in Seochon.
 * Category is strictly 'experience' (경험) or 'making' (제작).
 */
import { INITIAL_PROGRAMS } from './data.js';

class AdminProgramManager {
  constructor() {
    this.storageKey = 'seochon_custom_programs';
    this.programs = this.loadPrograms();
    this.listeners = [];
  }

  loadPrograms() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to read programs from storage", e);
    }
    // Deep clone initial data
    return JSON.parse(JSON.stringify(INITIAL_PROGRAMS));
  }

  savePrograms() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.programs));
      this.notifyListeners();
    } catch (e) {
      console.warn("Failed to persist programs to storage", e);
    }
  }

  onProgramsUpdated(cb) {
    this.listeners.push(cb);
  }

  notifyListeners() {
    this.listeners.forEach(cb => cb(this.programs));
  }

  getAllPrograms() {
    return this.programs;
  }

  getProgramById(id) {
    return this.programs.find(p => p.id === id);
  }

  // Add new experience or making program
  addProgram(programData) {
    const isMaking = programData.category === 'making';
    const newProg = {
      id: `prog-${Date.now()}`,
      title: programData.title || "Untitled Seochon Workshop",
      titleKo: programData.titleKo || programData.title,
      category: isMaking ? 'making' : 'experience', // Strictly 'experience' or 'making'
      categoryLabel: isMaking ? 'Making (제작)' : 'Experience (경험)',
      categoryIcon: programData.categoryIcon || (isMaking ? '🏺' : '🍵'),
      host: {
        name: programData.hostName || "Seochon Artisan",
        role: programData.hostRole || "Cultural Instructor",
        avatar: programData.hostAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        languages: programData.languages || ["English", "Korean"]
      },
      location: {
        name: programData.venueName || "Seochon Creative Space",
        nameKo: programData.venueNameKo || "서촌 크리에이티브 공간",
        address: programData.address || "Jahamun-ro, Jongno-gu, Seoul",
        addressKo: programData.addressKo || "서울시 종로구 자하문로",
        lat: parseFloat(programData.lat) || 37.5800,
        lng: parseFloat(programData.lng) || 126.9700,
        landmarkDistanceDesc: "Near Seochon Center"
      },
      pricing: {
        krw: parseInt(programData.priceKrw, 10) || 45000,
        usd: parseInt(programData.priceUsd, 10) || 35
      },
      durationMinutes: parseInt(programData.durationMinutes, 10) || 90,
      rating: 5.0,
      reviewCount: 1,
      images: [
        programData.imageUrl || "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80"
      ],
      nextAvailableSlot: programData.nextSlot || "Today 16:00",
      slots: programData.slots && programData.slots.length > 0 ? programData.slots : [
        { id: `s-${Date.now()}-1`, time: "14:00", available: 5, max: 6 },
        { id: `s-${Date.now()}-2`, time: "16:30", available: 6, max: 6 }
      ],
      summary: programData.summary || "Exclusive cultural and artistic program in the heart of historic Seochon.",
      summaryKo: programData.summaryKo || "서촌에서 즐기는 특별한 문화예술 프로그램입니다.",
      inclusions: programData.inclusions || ["Materials Provided", "Guided English Instruction", "Tea & Refreshment"],
      badge: "✨ Newly Added",
      featured: false
    };

    this.programs.unshift(newProg);
    this.savePrograms();
    return newProg;
  }

  // Update existing program
  updateProgram(id, updatedFields) {
    const index = this.programs.findIndex(p => p.id === id);
    if (index === -1) return null;

    const existing = this.programs[index];
    const isMaking = (updatedFields.category || existing.category) === 'making';

    this.programs[index] = {
      ...existing,
      ...updatedFields,
      category: isMaking ? 'making' : 'experience',
      categoryLabel: isMaking ? 'Making (제작)' : 'Experience (경험)',
      host: {
        ...existing.host,
        ...(updatedFields.host || {})
      },
      location: {
        ...existing.location,
        ...(updatedFields.location || {})
      },
      pricing: {
        ...existing.pricing,
        ...(updatedFields.pricing || {})
      }
    };

    this.savePrograms();
    return this.programs[index];
  }

  // Reset to initial defaults
  resetToDefaults() {
    this.programs = JSON.parse(JSON.stringify(INITIAL_PROGRAMS));
    this.savePrograms();
    return this.programs;
  }
}

export const adminProgramManager = new AdminProgramManager();
