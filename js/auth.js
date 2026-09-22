/**
 * Google Authentication & User Profile Manager for 9SEOUL
 * Preloaded with rich sample traveler data, active wallet passes, and wishlist.
 */

class AuthManager {
  constructor() {
    this.storageKey = '9seoul_auth_user';
    this.currentUser = this.loadUser();
    this.listeners = [];
  }

  loadUser() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name) return parsed;
      }
    } catch (e) {
      console.warn("Failed to load user state", e);
    }

    // Default Preloaded Traveler Profile with Active Passes for Instant Testing
    return {
      isLoggedIn: true,
      id: "google_10829371289",
      name: "Alex Johnson",
      email: "alex.traveler@gmail.com",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      nationality: "United States 🇺🇸",
      preferredCurrency: "USD",
      preferredLanguage: "EN",
      savedWishlist: ["prog-1", "prog-2", "prog-4"],
      bookedExperiences: [
        {
          bookingId: "9S-892104",
          programId: "prog-1",
          programTitle: "Seochon Hanok Mindful Tea Ceremony & Heritage House Tour",
          programTitleKo: "서촌 100년 고택 한옥 다도 및 명상 체험",
          category: "experience",
          categoryLabel: "Experience (경험)",
          programImage: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800",
          venueName: "Nuha-dong Hanok Pavilion (Jaha Tea House)",
          venueAddress: "24 Jahamun-ro 7-gil, Jongno-gu, Seoul",
          hostName: "Master Sun-hee Park",
          date: "Today",
          slotTime: "15:30",
          guests: 2,
          paymentMethod: "google_pay",
          currency: "USD",
          totalPaid: "$68 USD",
          distanceText: "140m away",
          destinationLat: 37.5802,
          destinationLng: 126.9698,
          createdAt: new Date().toISOString()
        },
        {
          bookingId: "9S-451820",
          programId: "prog-2",
          programTitle: "Joseon White Porcelain (Baekja) Wheel Pottery Workshop",
          programTitleKo: "조선 백자 물레 성형 & 도예 컵/화병 제작 클래스",
          category: "making",
          categoryLabel: "Making (제작)",
          programImage: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800",
          venueName: "Clay & Soul Atelier Seochon",
          venueAddress: "18 Pirundae-ro, Jongno-gu, Seoul",
          hostName: "Ceramist Min-woo Kang",
          date: "Tomorrow",
          slotTime: "16:00",
          guests: 1,
          paymentMethod: "google_pay",
          currency: "USD",
          totalPaid: "$52 USD",
          distanceText: "320m away",
          destinationLat: 37.5768,
          destinationLng: 126.9679,
          createdAt: new Date().toISOString()
        }
      ]
    };
  }

  saveUser() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.currentUser));
      this.notifyListeners();
    } catch (e) {
      console.warn("Failed to save user state", e);
    }
  }

  onAuthChange(cb) {
    this.listeners.push(cb);
  }

  notifyListeners() {
    this.listeners.forEach(cb => cb(this.currentUser));
  }

  // Simulated Google Sign In
  signInWithGoogle(profile = null) {
    if (!profile) {
      profile = {
        isLoggedIn: true,
        id: `google_${Date.now()}`,
        name: "Alex Johnson",
        email: "alex.traveler@gmail.com",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        nationality: "United States 🇺🇸",
        preferredCurrency: "USD",
        preferredLanguage: "EN",
        savedWishlist: ["prog-1", "prog-2", "prog-4"],
        bookedExperiences: this.currentUser?.bookedExperiences || []
      };
    }
    this.currentUser = profile;
    this.saveUser();
    return this.currentUser;
  }

  signOut() {
    this.currentUser = {
      isLoggedIn: false,
      id: null,
      name: "Guest Explorer",
      email: "",
      avatar: "",
      nationality: "Global",
      preferredCurrency: "USD",
      preferredLanguage: "EN",
      savedWishlist: [],
      bookedExperiences: []
    };
    this.saveUser();
    return this.currentUser;
  }

  toggleWishlist(programId) {
    if (!this.currentUser.savedWishlist) {
      this.currentUser.savedWishlist = [];
    }
    const idx = this.currentUser.savedWishlist.indexOf(programId);
    if (idx > -1) {
      this.currentUser.savedWishlist.splice(idx, 1);
    } else {
      this.currentUser.savedWishlist.push(programId);
    }
    this.saveUser();
    return this.currentUser.savedWishlist.includes(programId);
  }

  addBooking(bookingRecord) {
    if (!this.currentUser.bookedExperiences) {
      this.currentUser.bookedExperiences = [];
    }
    this.currentUser.bookedExperiences.unshift(bookingRecord);
    this.saveUser();
  }
}

export const authManager = new AuthManager();
