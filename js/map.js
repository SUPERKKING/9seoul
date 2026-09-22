/**
 * Google Maps Manager for Seochon Experience Explorer
 * Handles Google Maps initialization, custom dark/heritage styling, markers, InfoWindows, and Walking Route Polylines.
 */
import { gpsManager } from './gps.js';

class GoogleMapController {
  constructor() {
    this.map = null;
    this.markers = [];
    this.userMarker = null;
    this.userOverlay = null;
    this.routePolyline = null;
    this.infoWindow = null;
    this.onMarkerClickCallback = null;
    this.isGoogleLoaded = false;
  }

  // Warm Sepia & Retro Map Styling (Warm Earth, Mustard & Chestnut Brown)
  getMapStyles() {
    return [
      { elementType: "geometry", stylers: [{ color: "#f8f5ee" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#4a3525" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#fdfbf7" }, { weight: 2 }] },
      {
        featureType: "administrative",
        elementType: "geometry.stroke",
        stylers: [{ color: "#d7c9b8" }]
      },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#4a3525" }, { weight: 3 }]
      },
      {
        featureType: "landscape.natural",
        elementType: "geometry",
        stylers: [{ color: "#f1ebe1" }]
      },
      {
        featureType: "poi",
        elementType: "geometry",
        stylers: [{ color: "#e9dfd1" }]
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6d4c41" }]
      },
      {
        featureType: "poi.park",
        elementType: "geometry.fill",
        stylers: [{ color: "#ded3c0" }]
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#ffffff" }]
      },
      {
        featureType: "road.arterial",
        elementType: "geometry",
        stylers: [{ color: "#fbf8f2" }]
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#f4c724" }]
      },
      {
        featureType: "water",
        elementType: "geometry.fill",
        stylers: [{ color: "#d5ded9" }]
      }
    ];
  }

  init(containerId = 'seochon-map', onMarkerClick = null) {
    this.onMarkerClickCallback = onMarkerClick;
    const initialLoc = gpsManager.currentLocation;
    const container = document.getElementById(containerId);
    if (!container) return;

    if (typeof google === 'undefined' || !google.maps) {
      console.warn("Google Maps JavaScript API not yet loaded, retrying...");
      setTimeout(() => this.init(containerId, onMarkerClick), 500);
      return;
    }

    this.isGoogleLoaded = true;

    // Initialize Google Map
    this.map = new google.maps.Map(container, {
      center: { lat: initialLoc.lat, lng: initialLoc.lng },
      zoom: 16,
      styles: this.getMapStyles(),
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: true,
      fullscreenControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
      }
    });

    this.infoWindow = new google.maps.InfoWindow();

    // Render User GPS Location marker
    this.updateUserMarker(initialLoc);

    // Listen to GPS changes
    gpsManager.onLocationChange((newLoc) => {
      this.updateUserMarker(newLoc);
    });

    return this.map;
  }

  // Render or update user location marker with pulsing radar
  updateUserMarker(loc) {
    if (!this.map || !window.google) return;

    const userLatLng = new google.maps.LatLng(loc.lat, loc.lng);

    if (this.userMarker) {
      this.userMarker.setPosition(userLatLng);
    } else {
      // User GPS Pulse Pin
      this.userMarker = new google.maps.Marker({
        position: userLatLng,
        map: this.map,
        title: `📍 ${loc.name} (Your GPS Location)`,
        zIndex: 999,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#f4c724',
          fillOpacity: 1,
          strokeColor: '#4a3525',
          strokeWeight: 3
        }
      });

      this.userMarker.addListener('click', () => {
        if (this.infoWindow) {
          this.infoWindow.setContent(`
            <div style="color:#4a3525; padding:6px 10px; font-family:sans-serif;">
              <strong style="font-size:13px;">📍 ${loc.name}</strong>
              <div style="font-size:11px; color:#8d7b68; margin-top:2px;">Your Current GPS Location in Seochon</div>
            </div>
          `);
          this.infoWindow.open(this.map, this.userMarker);
        }
      });
    }
  }

  // Render experience / making program markers on Google Map
  renderPrograms(programs) {
    if (!this.map || !window.google) return;

    // Clear existing markers
    this.markers.forEach(m => m.setMap(null));
    this.markers = [];

    programs.forEach(prog => {
      const isMaking = prog.category === 'making';
      const categoryLabel = isMaking ? 'Making (제작)' : 'Experience (경험)';
      const iconEmoji = prog.categoryIcon || (isMaking ? '🏺' : '🍵');

      const userLoc = gpsManager.currentLocation;
      const distance = gpsManager.calculateDistance(userLoc.lat, userLoc.lng, prog.location.lat, prog.location.lng);
      const formattedDist = gpsManager.formatDistance(distance);

      // Create Custom Styled 9SEOUL Yellow-Brown Gradient Pin
      const marker = new google.maps.Marker({
        position: { lat: prog.location.lat, lng: prog.location.lng },
        map: this.map,
        title: prog.title,
        programId: prog.id,
        animation: google.maps.Animation.DROP,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="44" height="52" viewBox="0 0 44 52">
              <defs>
                <linearGradient id="pinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#f4c724"/>
                  <stop offset="100%" stop-color="#4a3525"/>
                </linearGradient>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#000000" flood-opacity="0.35"/>
                </filter>
              </defs>
              <path d="M22 0C9.85 0 0 9.85 0 22C0 36.5 22 52 22 52C22 52 44 36.5 44 22C44 9.85 34.15 0 22 0Z" fill="url(#pinGrad)" filter="url(#shadow)" stroke="#ffffff" stroke-width="2"/>
              <circle cx="22" cy="20" r="14" fill="#ffffff" fill-opacity="0.95"/>
              <text x="22" y="25" font-size="14" text-anchor="middle" font-family="sans-serif">${iconEmoji}</text>
            </svg>
          `)}`,
          scaledSize: new google.maps.Size(38, 45),
          anchor: new google.maps.Point(19, 45)
        }
      });

      const popupHtml = `
        <div class="google-map-infowindow" style="width:240px; font-family:'Plus Jakarta Sans', sans-serif; color:#0f172a; padding:4px;">
          <div style="position:relative; width:100%; height:110px; border-radius:8px; overflow:hidden; margin-bottom:8px;">
            <img src="${prog.images[0]}" style="width:100%; height:100%; object-fit:cover;" alt="${prog.title}" />
            <span style="position:absolute; top:6px; left:6px; background:${pinColor}; color:#ffffff; font-size:10px; font-weight:700; padding:2px 8px; border-radius:12px;">
              ${categoryLabel}
            </span>
          </div>
          <h4 style="font-size:13px; font-weight:700; margin:0 0 4px; line-height:1.3; color:#0f172a;">${prog.title}</h4>
          <p style="font-size:11px; color:#64748b; margin:0 0 6px;">📍 ${prog.location.address}</p>
          <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px; margin-bottom:8px;">
            <span style="color:#0284c7; font-weight:700;">🏃 ${formattedDist} away</span>
            <strong style="color:#0f172a; font-size:12px;">₩${prog.pricing.krw.toLocaleString()} ($${prog.pricing.usd})</strong>
          </div>
          <button id="infowindow-btn-${prog.id}" style="width:100%; background:linear-gradient(135deg, #f58529, #dd2a7b); color:#ffffff; border:none; font-size:12px; font-weight:800; padding:8px 10px; border-radius:8px; cursor:pointer; box-shadow:0 3px 10px rgba(221,42,123,0.3);">
            View Details & Book
          </button>
        </div>
      `;

      marker.addListener('click', () => {
        if (this.infoWindow) {
          this.infoWindow.setContent(popupHtml);
          this.infoWindow.open(this.map, marker);

          setTimeout(() => {
            const btn = document.getElementById(`infowindow-btn-${prog.id}`);
            if (btn && this.onMarkerClickCallback) {
              btn.onclick = () => this.onMarkerClickCallback(prog);
            }
          }, 150);
        }

        if (this.onMarkerClickCallback) {
          this.onMarkerClickCallback(prog);
        }
      });

      this.markers.push(marker);
    });
  }

  // Draw walking route navigation on Google Map
  drawRoute(routeData) {
    if (!this.map || !window.google) return;

    this.clearRoute();

    const pathCoordinates = routeData.path.map(p => ({
      lat: p[0],
      lng: p[1]
    }));

    // Polyline for Walking Route (Vibrant Instagram Rose)
    this.routePolyline = new google.maps.Polyline({
      path: pathCoordinates,
      geodesic: true,
      strokeColor: '#e11d48',
      strokeOpacity: 0.95,
      strokeWeight: 6,
      map: this.map
    });

    // Fit Google Map bounds to route
    const bounds = new google.maps.LatLngBounds();
    pathCoordinates.forEach(coord => bounds.extend(coord));
    this.map.fitBounds(bounds);
  }

  clearRoute() {
    if (this.routePolyline) {
      this.routePolyline.setMap(null);
      this.routePolyline = null;
    }
  }

  // Pan smoothly to specific coordinates
  panTo(lat, lng, zoom = 16) {
    if (this.map && window.google) {
      this.map.panTo({ lat: lat, lng: lng });
      if (zoom) this.map.setZoom(zoom);
    }
  }
}

export const mapController = new GoogleMapController();
