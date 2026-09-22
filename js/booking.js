/**
 * Booking, Payment, Push Notification & Ticket Pass Manager
 */
import { authManager } from './auth.js';
import { gpsManager } from './gps.js';

class BookingManager {
  constructor() {
    this.currentBookingProgram = null;
    this.selectedSlot = null;
    this.selectedGuests = 1;
    this.selectedPaymentMethod = 'google_pay';
  }

  // Request browser Web Push notification permission
  async requestPushPermission() {
    if (!('Notification' in window)) {
      return false;
    }
    if (Notification.permission === 'granted') {
      return true;
    }
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  // Trigger browser push notification + in-app notification toast
  triggerPushNotification(bookingData) {
    const title = `🎉 Booking Confirmed: ${bookingData.programTitle}`;
    const body = `Your spot for ${bookingData.guests} guest(s) on ${bookingData.date} at ${bookingData.slotTime} is secured! Tap to start GPS walking guidance to ${bookingData.venueName}.`;
    const icon = bookingData.programImage || 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=100';

    // 1. Browser Native Push Notification
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: body,
          icon: icon,
          badge: icon,
          tag: `booking-${bookingData.bookingId}`
        });
      } catch (err) {
        console.warn("Native Notification error:", err);
      }
    }

    // 2. In-App Floating Push Notification Toast
    this.showInAppPushNotification(bookingData);
  }

  showInAppPushNotification(bookingData) {
    let pushDrawer = document.getElementById('in-app-push-banner');
    if (!pushDrawer) {
      pushDrawer = document.createElement('div');
      pushDrawer.id = 'in-app-push-banner';
      pushDrawer.className = 'in-app-push-banner';
      document.body.appendChild(pushDrawer);
    }

    pushDrawer.innerHTML = `
      <div class="push-card-header">
        <div class="push-app-badge">
          <span class="push-bell">🔔</span>
          <span class="push-app-name">9SEOUL NOTIFICATION</span>
        </div>
        <span class="push-time">Just now</span>
      </div>
      <div class="push-card-content">
        <img src="${bookingData.programImage}" class="push-thumb" alt="Thumbnail" />
        <div class="push-text-wrap">
          <h4 class="push-title">✅ Reservation Confirmed!</h4>
          <p class="push-msg"><strong>${bookingData.programTitle}</strong> (${bookingData.slotTime})</p>
          <p class="push-submsg">📍 ${bookingData.venueName} • ${bookingData.distanceText} away</p>
        </div>
      </div>
      <div class="push-actions">
        <button class="push-btn-action" id="push-btn-nav-now">🚶 Start GPS Walking Guide</button>
        <button class="push-btn-close" id="push-btn-dismiss">Dismiss</button>
      </div>
    `;

    pushDrawer.classList.add('visible');

    const navBtn = pushDrawer.querySelector('#push-btn-nav-now');
    const dismissBtn = pushDrawer.querySelector('#push-btn-dismiss');

    navBtn.onclick = () => {
      pushDrawer.classList.remove('visible');
      if (window.appLaunchNavigation) {
        window.appLaunchNavigation(bookingData.programId);
      }
    };

    dismissBtn.onclick = () => {
      pushDrawer.classList.remove('visible');
    };

    // Auto dismiss after 10s if not clicked
    setTimeout(() => {
      if (pushDrawer.classList.contains('visible')) {
        pushDrawer.classList.remove('visible');
      }
    }, 12000);
  }

  // Execute payment & create confirmed booking record
  processPayment(program, slot, guests, paymentMethod, currency = 'USD') {
    const userLoc = gpsManager.currentLocation;
    const distanceMeters = gpsManager.calculateDistance(
      userLoc.lat,
      userLoc.lng,
      program.location.lat,
      program.location.lng
    );

    const pricePerPersonKRW = program.pricing.krw;
    const pricePerPersonUSD = program.pricing.usd;
    const totalKRW = pricePerPersonKRW * guests;
    const totalUSD = pricePerPersonUSD * guests;

    const bookingId = `SC-${Math.floor(100000 + Math.random() * 900000)}`;
    const todayStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const bookingRecord = {
      bookingId: bookingId,
      programId: program.id,
      programTitle: program.title,
      programTitleKo: program.titleKo,
      category: program.category,
      categoryLabel: program.categoryLabel,
      programImage: program.images[0],
      venueName: program.location.name,
      venueAddress: program.location.address,
      hostName: program.host.name,
      date: todayStr,
      slotTime: slot.time,
      guests: guests,
      paymentMethod: paymentMethod,
      currency: currency,
      totalPaid: currency === 'KRW' ? `₩${totalKRW.toLocaleString()}` : `$${totalUSD}`,
      distanceText: gpsManager.formatDistance(distanceMeters),
      destinationLat: program.location.lat,
      destinationLng: program.location.lng,
      createdAt: new Date().toISOString()
    };

    // Store in Auth history
    authManager.addBooking(bookingRecord);

    // Request notification permission and trigger push
    this.requestPushPermission().then(() => {
      this.triggerPushNotification(bookingRecord);
    });

    return bookingRecord;
  }
}

export const bookingManager = new BookingManager();
