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

  getGuestUser() {
    return {
      isLoggedIn: false,
      id: null,
      name: "게스트",
      email: "",
      avatar: "",
      nationality: "Global",
      preferredCurrency: "KRW",
      preferredLanguage: "KO",
      savedWishlist: [],
      bookedExperiences: []
    };
  }

  loadUser() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Discard legacy dummy profile "Alex Johnson"
        if (parsed && parsed.name === "Alex Johnson") {
          localStorage.removeItem(this.storageKey);
          return this.getGuestUser();
        }
        if (parsed && typeof parsed.isLoggedIn === 'boolean') {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to load user state", e);
    }
    return this.getGuestUser();
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
        id: `user_${Date.now()}`,
        name: "9SEOUL 회원",
        email: "member@9seoul.com",
        avatar: "",
        nationality: "Korea 🇰🇷",
        preferredCurrency: "KRW",
        preferredLanguage: "KO",
        savedWishlist: [],
        bookedExperiences: []
      };
    }
    this.currentUser = profile;
    this.saveUser();
    return this.currentUser;
  }

  signOut() {
    this.currentUser = this.getGuestUser();
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
