/**
 * GPS & Navigation Manager for Seochon
 * Handles Real Geolocation, Landmark Simulation, Haversine Distance, and Walking Routes
 */
import { SEOCHON_SIMULATION_POINTS } from './data.js';

class GPSManager {
  constructor() {
    // Default location: Gyeongbokgung Station Exit 2 (Gateway to Seochon)
    this.currentLocation = {
      lat: 37.5759,
      lng: 126.9734,
      name: "Gyeongbokgung Stn (Exit 2)",
      nameKo: "경복궁역 2번 출구",
      isLive: false,
      timestamp: Date.now()
    };
    this.watchId = null;
    this.listeners = [];
  }

  // Subscribe to location updates
  onLocationChange(callback) {
    this.listeners.push(callback);
  }

  notifyListeners() {
    this.listeners.forEach(cb => cb(this.currentLocation));
  }

  // Start real browser GPS tracking
  startLiveGPS() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            name: "My Live Location (실시간 내 위치)",
            nameKo: "실시간 내 위치",
            isLive: true,
            timestamp: Date.now()
          };
          this.notifyListeners();
          resolve(this.currentLocation);

          // Setup continuous watch
          if (this.watchId !== null) navigator.geolocation.clearWatch(this.watchId);
          this.watchId = navigator.geolocation.watchPosition(
            (pos) => {
              this.currentLocation = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                accuracy: pos.coords.accuracy,
                name: "My Live Location (실시간 내 위치)",
                nameKo: "실시간 내 위치",
                isLive: true,
                timestamp: Date.now()
              };
              this.notifyListeners();
            },
            (err) => console.warn("GPS watch error:", err),
            { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
          );
        },
        (error) => {
          console.warn("Live GPS failed or denied, using simulation:", error.message);
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });
  }

  // Set simulated location from Seochon checkpoints
  setSimulatedLocation(pointId) {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }

    const point = SEOCHON_SIMULATION_POINTS.find(p => p.id === pointId);
    if (point) {
      this.currentLocation = {
        lat: point.lat,
        lng: point.lng,
        name: point.name,
        nameKo: point.nameKo,
        isLive: false,
        timestamp: Date.now()
      };
      this.notifyListeners();
      return this.currentLocation;
    }
    return null;
  }

  // Calculate distance between two lat/lng coordinates using Haversine formula (meters)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c); // Distance in meters
  }

  // Format distance for UI display (e.g., "120 m" or "1.2 km")
  formatDistance(meters) {
    if (meters < 1000) {
      return `${meters}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  }

  // Estimate walking time in minutes (~75 meters/min)
  estimateWalkingTime(meters) {
    const minutes = Math.ceil(meters / 70);
    return minutes < 1 ? 1 : minutes;
  }

  // Generate realistic walking route waypoints and turn-by-turn instructions
  generateWalkingRoute(startLat, startLng, destLat, destLng, destTitle, destAddress) {
    const totalDist = this.calculateDistance(startLat, startLng, destLat, destLng);
    const walkingMinutes = this.estimateWalkingTime(totalDist);

    // Calculate intermediate waypoints for Seochon alleys
    const mid1 = {
      lat: startLat + (destLat - startLat) * 0.35 + (Math.random() * 0.0003 - 0.00015),
      lng: startLng + (destLng - startLng) * 0.3 + (Math.random() * 0.0003 - 0.00015)
    };
    const mid2 = {
      lat: startLat + (destLat - startLat) * 0.7 + (Math.random() * 0.0003 - 0.00015),
      lng: startLng + (destLng - startLng) * 0.75 + (Math.random() * 0.0003 - 0.00015)
    };

    const pathCoordinates = [
      [startLat, startLng],
      [mid1.lat, mid1.lng],
      [mid2.lat, mid2.lng],
      [destLat, destLng]
    ];

    const step1Dist = Math.round(totalDist * 0.35);
    const step2Dist = Math.round(totalDist * 0.35);
    const step3Dist = totalDist - step1Dist - step2Dist;

    const steps = [
      {
        step: 1,
        icon: "arrow-up",
        instruction: `Depart from ${this.currentLocation.name}. Walk straight along the Hanok street.`,
        instructionKo: `${this.currentLocation.nameKo}에서 출발하여 서촌 골목길을 따라 직진하세요.`,
        distance: `${step1Dist}m`,
        time: `${Math.ceil(step1Dist / 70)} min`
      },
      {
        step: 2,
        icon: "corner-up-right",
        instruction: "Turn right toward the traditional art studio alleyway.",
        instructionKo: "전통 문화거리 골목 방향으로 우회전하세요.",
        distance: `${step2Dist}m`,
        time: `${Math.ceil(step2Dist / 70)} min`
      },
      {
        step: 3,
        icon: "map-pin",
        instruction: `Arrive at destination: ${destTitle} (${destAddress})`,
        instructionKo: `목적지 도착: ${destTitle} (${destAddress})`,
        distance: `${step3Dist}m`,
        time: `${Math.max(1, Math.ceil(step3Dist / 70))} min`
      }
    ];

    return {
      totalDistanceMeters: totalDist,
      formattedDistance: this.formatDistance(totalDist),
      estimatedMinutes: walkingMinutes,
      path: pathCoordinates,
      steps: steps,
      destination: {
        lat: destLat,
        lng: destLng,
        title: destTitle,
        address: destAddress
      }
    };
  }
}

export const gpsManager = new GPSManager();
