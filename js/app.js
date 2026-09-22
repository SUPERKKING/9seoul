/**
 * Mobile App Orchestrator for 9SEOUL
 */
import { adminProgramManager } from './admin.js';
import { gpsManager } from './gps.js';
import { mapController } from './map.js';
import { authManager } from './auth.js';
import { bookingManager } from './booking.js';
import { SEOCHON_SIMULATION_POINTS, HANGUL_NAME_SAMPLES, STAMP_TOUR_DATA } from './data.js';
import { I18N_TRANSLATIONS } from './i18n.js';
import { HOST_PORTAL } from './host.js';

class MobileApp {
  constructor() {
    this.activeTab = 'tab-explore';
    this.activeCategory = 'all'; // 'all' | 'experience' | 'making'
    this.activeSort = 'nearest'; // 'nearest' | 'fastest' | 'rating' | 'price'
    this.searchQuery = '';
    this.activeLanguage = localStorage.getItem('9seoul_lang') || 'EN';
    this.tempSelectedLang = this.activeLanguage;
    this.activeProgram = null;
    this.activeBookingSlot = null;
    this.bookingGuests = 1;
    this.bookingCurrency = 'USD';
    this.navRouteData = null;

    this.init();
  }

  init() {
    // 1. Initialize Splash & Language Onboarding Flow
    this.initSplashAndLanguage();

    // 2. Initialize Google Map
    mapController.init('seochon-map', (prog) => {
      this.highlightCarouselCard(prog.id);
      this.openProgramDetail(prog.id);
    });

    // 3. Populate GPS Simulator Dropdown
    this.populateGPSSimulatorDropdown();

    // 4. Bind All Event Listeners
    this.bindEvents();

    // 5. Apply Active Language
    this.applyLanguage(this.activeLanguage);

    // 6. GPS Updates
    gpsManager.onLocationChange((loc) => {
      this.updateGPSUI(loc);
      this.render();
      if (this.navRouteData && this.activeProgram) {
        this.updateLiveNavigation(this.activeProgram);
      }
    });

    // 7. Host Program Updates
    adminProgramManager.onProgramsUpdated(() => {
      this.render();
    });

    // 8. Auth Updates
    authManager.onAuthChange((user) => {
      this.updateAuthUI(user);
      this.renderPassesTab();
    });

    // 9. Initial Render
    this.updateGPSUI(gpsManager.currentLocation);
    this.updateAuthUI(authManager.currentUser);
    this.render();
    this.renderPassesTab();

    // Global navigation hook for push alert
    window.appLaunchNavigation = (programId) => {
      this.startNavigationToProgram(programId);
    };
  }

  // 9SEOUL Splash Logo & Language Selection Workflow
  initSplashAndLanguage() {
    const splashOverlay = document.getElementById('splash-onboarding-screen');
    const logoScreen = document.getElementById('splash-logo-screen');
    const langScreen = document.getElementById('splash-language-screen');
    const btnConfirmLang = document.getElementById('btn-confirm-language');

    if (!splashOverlay || !logoScreen || !langScreen) return;

    // Transition from Logo Screen to Language Selection Screen
    const goToLanguageScreen = (e) => {
      if (e) e.stopPropagation();
      if (!logoScreen.classList.contains('active')) return;

      // Add immediate tap feedback
      logoScreen.style.transform = 'scale(0.96)';
      logoScreen.style.opacity = '0';
      logoScreen.style.transition = 'all 0.25s ease';

      setTimeout(() => {
        logoScreen.classList.remove('active');
        logoScreen.style.transform = '';
        logoScreen.style.opacity = '';
        langScreen.classList.add('active');
      }, 200);
    };

    // Listen on multiple elements & events (click + touchstart) for instant response
    logoScreen.addEventListener('click', goToLanguageScreen);
    logoScreen.addEventListener('touchstart', goToLanguageScreen, { passive: true });
    splashOverlay.addEventListener('click', (e) => {
      if (logoScreen.classList.contains('active')) {
        goToLanguageScreen(e);
      }
    });

    // 2. Language Option Selection
    const langCards = document.querySelectorAll('.lang-option-card');
    langCards.forEach(card => {
      // Set initial active state based on activeLanguage
      if (card.dataset.lang === this.activeLanguage) {
        langCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      }

      const selectLang = (e) => {
        if (e) e.stopPropagation();
        langCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        this.tempSelectedLang = card.dataset.lang;
      };

      card.addEventListener('click', selectLang);
      card.addEventListener('touchstart', selectLang, { passive: true });
    });

    // 3. Confirm Language & Enter 9SEOUL
    if (btnConfirmLang) {
      const startApp = (e) => {
        if (e) e.stopPropagation();
        this.activeLanguage = this.tempSelectedLang;
        localStorage.setItem('9seoul_lang', this.activeLanguage);
        this.applyLanguage(this.activeLanguage);

        splashOverlay.classList.add('hidden');
        setTimeout(() => {
          splashOverlay.style.display = 'none';
        }, 400);
      };

      btnConfirmLang.addEventListener('click', startApp);
      btnConfirmLang.addEventListener('touchstart', startApp, { passive: true });
    }

    // Quick Language Switcher from Header / Profile
    const openLangChooser = (e) => {
      if (e) e.stopPropagation();
      splashOverlay.style.display = 'flex';
      setTimeout(() => {
        splashOverlay.classList.remove('hidden');
        logoScreen.classList.remove('active');
        langScreen.classList.add('active');
      }, 10);
    };

    document.getElementById('btn-quick-lang-toggle')?.addEventListener('click', openLangChooser);
    document.getElementById('btn-change-lang-from-profile')?.addEventListener('click', (e) => {
      this.closeSheet('auth-modal');
      openLangChooser(e);
    });

    // HOST PORTAL: clicking 9SEOUL logo on language screen
    const langBrandMini = langScreen.querySelector('.lang-brand-mini');
    if (langBrandMini) {
      langBrandMini.style.cursor = 'pointer';
      langBrandMini.title = '호스트 / 파트너 포털';
      langBrandMini.addEventListener('click', (e) => { e.stopPropagation(); this.openHostPortal(); });
    }
    this.initHostPortalUI();
  }

  openHostPortal() {
    const overlay = document.getElementById('host-portal-overlay');
    if (!overlay) return;
    overlay.classList.add('open');
    if (HOST_PORTAL.currentHost) { this.hpShowScreen('hp-host-dashboard'); this.hpRefreshDashboard(); }
    else if (HOST_PORTAL.isMasterMode) { this.hpShowScreen('hp-master-dashboard'); this.hpRefreshMasterDashboard(); }
    else { this.hpShowScreen('hp-entry'); }
  }
  closeHostPortal() { document.getElementById('host-portal-overlay')?.classList.remove('open'); }
  hpShowScreen(id) {
    document.querySelectorAll('.hp-screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id)?.classList.add('active');
  }

  initHostPortalUI() {
    document.getElementById('host-portal-close-btn')?.addEventListener('click', () => this.closeHostPortal());
    document.querySelectorAll('.hp-back-btn').forEach(btn => { btn.addEventListener('click', () => this.hpShowScreen(btn.dataset.target)); });
    document.getElementById('hp-btn-go-host-login')?.addEventListener('click', () => this.hpShowScreen('hp-host-auth'));
    document.getElementById('hp-btn-go-master-login')?.addEventListener('click', () => this.hpShowScreen('hp-master-login'));
    // Auth tabs
    document.querySelectorAll('#hp-host-auth .hp-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('#hp-host-auth .hp-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('#hp-host-auth .hp-tab-pane').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab)?.classList.add('active');
      });
    });
    // Business type toggle
    document.querySelectorAll('#hp-tab-signup .hp-type-btn[data-type]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#hp-tab-signup .hp-type-btn[data-type]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('host-reg-type').value = btn.dataset.type;
        document.getElementById('biz-doc-field').classList.toggle('hidden', btn.dataset.type !== 'business');
        document.getElementById('id-doc-field').classList.toggle('hidden', btn.dataset.type !== 'individual');
      });
    });
    // File upload previews
    this.hpBindFileUpload('biz-doc-input', 'biz-doc-preview', 'biz-doc-zone');
    this.hpBindFileUpload('id-doc-input',  'id-doc-preview',  'id-doc-zone');
    this.hpBindFileUpload('bank-doc-input','bank-doc-preview', 'bank-doc-zone');
    // Host login
    document.getElementById('hp-btn-login-submit')?.addEventListener('click', () => {
      const email = document.getElementById('host-login-email').value.trim();
      const result = HOST_PORTAL.loginHost(email);
      const msgEl = document.getElementById('hp-login-msg');
      if (result.ok) { this.hpShowScreen('hp-host-dashboard'); this.hpRefreshDashboard(); }
      else { msgEl.textContent = result.msg; msgEl.className = 'hp-msg error'; }
    });
    // Signup file stores
    let bizDocBase64 = null, idDocBase64 = null, bankBase64 = null;
    document.getElementById('biz-doc-input')?.addEventListener('change', async e => { bizDocBase64 = await this.hpReadFile(e.target.files[0]); });
    document.getElementById('id-doc-input')?.addEventListener('change',  async e => { idDocBase64  = await this.hpReadFile(e.target.files[0]); });
    document.getElementById('bank-doc-input')?.addEventListener('change', async e => { bankBase64   = await this.hpReadFile(e.target.files[0]); });
    // Signup submit
    document.getElementById('hp-btn-signup-submit')?.addEventListener('click', () => {
      const msgEl = document.getElementById('hp-signup-msg');
      const result = HOST_PORTAL.register({ type: document.getElementById('host-reg-type').value, name: document.getElementById('host-reg-name').value.trim(), email: document.getElementById('host-reg-email').value.trim(), phone: document.getElementById('host-reg-phone').value.trim(), bizDocBase64, idDocBase64, bankBase64 });
      if (result.ok) { msgEl.textContent = '가입 완료! 환영합니다 🎉'; msgEl.className = 'hp-msg success'; setTimeout(() => { this.hpShowScreen('hp-host-dashboard'); this.hpRefreshDashboard(); }, 900); }
      else { msgEl.textContent = result.msg; msgEl.className = 'hp-msg error'; }
    });
    // Host logout
    document.getElementById('hp-host-logout-btn')?.addEventListener('click', () => { HOST_PORTAL.logout(); this.hpShowScreen('hp-entry'); });
    // New program
    document.getElementById('hp-btn-new-program')?.addEventListener('click', () => { this.hpResetProgramForm(); this.hpShowScreen('hp-program-form'); });
    // Category toggle in form
    document.querySelectorAll('#hp-program-form .hp-type-btn[data-cat]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#hp-program-form .hp-type-btn[data-cat]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('pf-category').value = btn.dataset.cat;
      });
    });
    // Slot management
    document.getElementById('pf-add-slot-btn')?.addEventListener('click', () => {
      const row = document.createElement('div'); row.className = 'pf-slot-row';
      row.innerHTML = `<input type="time" class="pf-slot-time" value="15:00" /><input type="number" class="pf-slot-spots" value="6" min="1" max="30" /><button class="pf-slot-remove">✕</button>`;
      row.querySelector('.pf-slot-remove').addEventListener('click', () => row.remove());
      document.getElementById('pf-slots-container').appendChild(row);
    });
    document.querySelector('.pf-slot-remove')?.addEventListener('click', function() { this.closest('.pf-slot-row')?.remove(); });
    // Mood photo
    let moodImageBase64 = null;
    document.getElementById('pf-mood-input')?.addEventListener('change', async e => {
      moodImageBase64 = await this.hpReadFile(e.target.files[0]);
      if (moodImageBase64) { document.getElementById('pf-mood-zone').classList.add('has-file'); document.getElementById('pf-mood-preview').innerHTML = `<img src="${moodImageBase64}" alt="mood" />`; }
    });
    // Detail shots x3
    const detailImages = [null, null, null];
    document.querySelectorAll('.pf-detail-input').forEach(inp => {
      inp.addEventListener('change', async e => {
        const idx = parseInt(inp.dataset.idx);
        detailImages[idx] = await this.hpReadFile(e.target.files[0]);
        const prev = document.getElementById('pf-detail-previews');
        if (prev && detailImages[idx]) { const ex = prev.querySelector(`[data-idx="${idx}"]`); if(ex) ex.remove(); const img = document.createElement('img'); img.src = detailImages[idx]; img.dataset.idx = idx; prev.appendChild(img); }
      });
    });
    // Extra sections
    const extraSections = [];
    document.getElementById('pf-add-extra-btn')?.addEventListener('click', () => {
      const sec = { imageBase64: null, description: '' }; extraSections.push(sec);
      const div = document.createElement('div'); div.className = 'hp-extra-section';
      div.innerHTML = `<div class="hp-extra-section-header"><span>추가 섹션 ${extraSections.length}</span><button class="hp-extra-remove-btn">삭제</button></div><div class="hp-upload-zone hp-extra-zone"><span>📷 사진 업로드</span><input type="file" class="hp-file-input hp-extra-img-input" accept="image/*" /></div><div class="hp-upload-preview hp-extra-preview"></div><textarea class="hp-textarea hp-extra-desc" rows="2" placeholder="이 섹션 설명"></textarea>`;
      div.querySelector('.hp-extra-remove-btn').addEventListener('click', () => div.remove());
      div.querySelector('.hp-extra-img-input').addEventListener('change', async e => { sec.imageBase64 = await this.hpReadFile(e.target.files[0]); if(sec.imageBase64){div.querySelector('.hp-extra-zone').classList.add('has-file');div.querySelector('.hp-extra-preview').innerHTML=`<img src="${sec.imageBase64}" />`;} });
      div.querySelector('.hp-extra-desc').addEventListener('input', e => { sec.description = e.target.value; });
      document.getElementById('pf-extra-sections').appendChild(div);
    });
    // Program submit
    document.getElementById('hp-btn-program-submit')?.addEventListener('click', () => {
      const msgEl = document.getElementById('hp-program-msg');
      const slots = [...document.querySelectorAll('.pf-slot-row')].map((row, i) => ({ id:`s-${Date.now()}-${i}`, time: row.querySelector('.pf-slot-time')?.value||'15:00', available: parseInt(row.querySelector('.pf-slot-spots')?.value,10)||6, max: parseInt(row.querySelector('.pf-slot-spots')?.value,10)||6 }));
      const result = HOST_PORTAL.submitProgram({
        titleKo: document.getElementById('pf-title-ko').value.trim(),
        titleEn: document.getElementById('pf-title-en').value.trim(),
        category: document.getElementById('pf-category').value,
        priceKrw: document.getElementById('pf-price-krw').value,
        priceUsd: document.getElementById('pf-price-usd').value,
        minGuests: document.getElementById('pf-min-guests')?.value || 2,
        maxGuests: document.getElementById('pf-max-guests')?.value || 8,
        venueName: document.getElementById('pf-venue-name').value.trim(),
        venueAddress: document.getElementById('pf-venue-address').value.trim(),
        moodImageBase64,
        descriptionFull: document.getElementById('pf-desc-full').value.trim(),
        descriptionKo: document.getElementById('pf-desc-ko').value.trim(),
        detailImages: detailImages.filter(Boolean),
        descriptionDetail: document.getElementById('pf-desc-detail').value.trim(),
        inclusions: document.getElementById('pf-inclusions').value.trim(),
        extraSections:[...extraSections],
        slots
      });
      if (result.ok) { msgEl.textContent='제출 완료! 9SEOUL 심사 후 승인됩니다 ✅'; msgEl.className='hp-msg success'; setTimeout(()=>{this.hpShowScreen('hp-host-dashboard');this.hpRefreshDashboard();},1200); }
      else { msgEl.textContent=result.msg; msgEl.className='hp-msg error'; }
    });
    // Master login
    document.getElementById('hp-btn-master-login-submit')?.addEventListener('click', () => {
      const id = document.getElementById('master-login-id').value.trim();
      const pw = document.getElementById('master-login-pw').value;
      const result = HOST_PORTAL.loginMaster(id, pw);
      const msgEl = document.getElementById('hp-master-login-msg');
      if (result.ok) { this.hpShowScreen('hp-master-dashboard'); this.hpRefreshMasterDashboard(); }
      else { msgEl.textContent=result.msg; msgEl.className='hp-msg error'; }
    });
    document.getElementById('master-login-pw')?.addEventListener('keydown', e => { if(e.key==='Enter') document.getElementById('hp-btn-master-login-submit')?.click(); });
    document.getElementById('hp-master-logout-btn')?.addEventListener('click', () => { HOST_PORTAL.logoutMaster(); this.hpShowScreen('hp-entry'); });
    // Master tabs
    document.querySelectorAll('[data-mtab]').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('[data-mtab]').forEach(t => t.classList.remove('active')); tab.classList.add('active');
        const isPending = tab.dataset.mtab === 'pending';
        document.getElementById('hp-master-pending-list').classList.toggle('hidden', !isPending);
        document.getElementById('hp-master-all-list').classList.toggle('hidden', isPending);
      });
    });
  }

  hpRefreshDashboard() {
    const host = HOST_PORTAL.currentHost; if (!host) return;
    document.getElementById('hp-dash-welcome').textContent = `안녕하세요, ${host.name}님!`;
    document.getElementById('hp-dash-type-badge').textContent = host.type==='business'?'🏢 사업자':'👤 개인';
    const listEl = document.getElementById('hp-my-programs-list');
    const progs = HOST_PORTAL.getMyPrograms();
    if (!progs.length) { listEl.innerHTML='<p class="hp-empty-msg">아직 등록된 프로그램이 없습니다.</p>'; return; }
    listEl.innerHTML = progs.map(p=>`<div class="hp-prog-card"><div class="hp-prog-card-header"><h5>${p.titleKo||p.titleEn||'제목 없음'}</h5><span class="hp-status-badge ${p.status}">${{pending:'🟡 심사중',approved:'✅ 승인',rejected:'❌ 반려'}[p.status]||p.status}</span></div><small>${new Date(p.submittedAt).toLocaleDateString('ko-KR')} 제출${p.reviewNote?' • '+p.reviewNote:''}</small></div>`).join('');
  }

  hpRefreshMasterDashboard() {
    const pending = HOST_PORTAL.getAllPending();
    const all = HOST_PORTAL.getAllForMaster();
    document.getElementById('hp-pending-count').textContent = pending.length;
    this.hpRenderMasterList('hp-master-pending-list', pending, true);
    this.hpRenderMasterList('hp-master-all-list', all, false);
  }
  hpRenderMasterList(elId, progs, showActions) {
    const el = document.getElementById(elId); if(!el) return;
    if (!progs.length) { el.innerHTML='<p class="hp-empty-msg">항목 없음</p>'; return; }
    el.innerHTML = progs.map(p=>`<div class="hp-prog-card" data-id="${p.id}"><div class="hp-prog-card-header"><h5>${p.titleKo||p.titleEn||'제목 없음'}</h5><span class="hp-status-badge ${p.status}">${{pending:'🟡 심사중',approved:'✅ 승인',rejected:'❌ 반려'}[p.status]||p.status}</span></div><small>호스트: ${p.hostName} (${p.hostEmail}) • ${new Date(p.submittedAt).toLocaleDateString('ko-KR')}</small>${showActions&&p.status==='pending'?`<div class="hp-prog-card-actions"><button class="hp-btn-approve" data-id="${p.id}">✅ 승인</button><button class="hp-btn-reject" data-id="${p.id}">❌ 반려</button></div>`:''}</div>`).join('');
    el.querySelectorAll('.hp-btn-approve').forEach(btn=>{ btn.addEventListener('click', ()=>{ HOST_PORTAL.approveProgram(btn.dataset.id, adminProgramManager); this.render(); this.hpRefreshMasterDashboard(); alert('✅ 승인 완료! 프로그램이 앱에 반영되었습니다.'); }); });
    el.querySelectorAll('.hp-btn-reject').forEach(btn=>{ btn.addEventListener('click', ()=>{ const note=prompt('반려 사유 (선택):')||''; HOST_PORTAL.rejectProgram(btn.dataset.id, note); this.hpRefreshMasterDashboard(); }); });
  }

  hpReadFile(file) {
    if (!file) return Promise.resolve(null);
    return new Promise(resolve => {
      if (file.type.startsWith('image/')) { const r=new FileReader(); r.onload=e=>resolve(e.target.result); r.readAsDataURL(file); }
      else { resolve(`[FILE:${file.name}]`); }
    });
  }
  hpBindFileUpload(inputId, previewId, zoneId) {
    const input=document.getElementById(inputId); if(!input) return;
    input.addEventListener('change', async e => {
      const file=e.target.files[0]; if(!file) return;
      const zone=document.getElementById(zoneId); zone?.classList.add('has-file'); if(zone) { const sp=zone.querySelector('span'); if(sp) sp.textContent=`✓ ${file.name}`; }
      const preview=document.getElementById(previewId);
      if(preview&&file.type.startsWith('image/')) { const d=await this.hpReadFile(file); preview.innerHTML=`<img src="${d}" alt="preview" />`; }
      else if(preview) { preview.innerHTML=`<span class="hp-file-name">📄 ${file.name}</span>`; }
    });
  }
  hpResetProgramForm() {
    ['pf-title-ko','pf-title-en','pf-price-krw','pf-price-usd','pf-venue-name','pf-venue-address','pf-desc-full','pf-desc-ko','pf-desc-detail','pf-inclusions'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
    const minG = document.getElementById('pf-min-guests'); if(minG) minG.value='2';
    const maxG = document.getElementById('pf-max-guests'); if(maxG) maxG.value='8';
    ['pf-mood-preview','pf-detail-previews','pf-extra-sections'].forEach(id=>{const el=document.getElementById(id);if(el)el.innerHTML='';});
    const msgEl=document.getElementById('hp-program-msg'); if(msgEl)msgEl.textContent='';
    document.getElementById('pf-category').value='experience';
  }

  // Apply Language Dictionary Across the UI
  applyLanguage(langCode) {
    const dict = I18N_TRANSLATIONS[langCode] || I18N_TRANSLATIONS.EN;
    const flags = { EN: "🇺🇸", KO: "🇰🇷", JA: "🇯🇵", ZH: "🇨🇳" };

    // Update Header Indicator
    const flagEl = document.getElementById('current-lang-flag');
    const codeEl = document.getElementById('current-lang-code');
    const profLangEl = document.getElementById('profile-lang-indicator');
    const brandSub = document.getElementById('header-brand-subtitle');

    if (flagEl) flagEl.textContent = flags[langCode] || "🌐";
    if (codeEl) codeEl.textContent = langCode;
    if (profLangEl) profLangEl.textContent = `${flags[langCode]} ${langCode}`;
    if (brandSub) brandSub.textContent = dict.brandSubtitle;

    // Search placeholder
    const searchEl = document.getElementById('search-input');
    if (searchEl) searchEl.placeholder = dict.searchPlaceholder;

    // Categories
    const catAll = document.getElementById('label-cat-all');
    const catExp = document.getElementById('label-cat-exp');
    const catMake = document.getElementById('label-cat-make');
    if (catAll) catAll.textContent = dict.allCategory;
    if (catExp) catExp.textContent = dict.experienceCategory;
    if (catMake) catMake.textContent = dict.makingCategory;

    // Sort Options
    const optNearest = document.getElementById('opt-sort-nearest');
    const optFastest = document.getElementById('opt-sort-fastest');
    const optRating = document.getElementById('opt-sort-rating');
    const optPrice = document.getElementById('opt-sort-price');
    if (optNearest) optNearest.textContent = dict.nearestSort;
    if (optFastest) optFastest.textContent = dict.fastestSort;
    if (optRating) optRating.textContent = dict.topRatedSort;
    if (optPrice) optPrice.textContent = dict.priceLowSort;

    // Tab Labels
    const tabExp = document.getElementById('tab-label-explore');
    const tabMap = document.getElementById('tab-label-map');
    const tabPass = document.getElementById('tab-label-passes');
    const tabHost = document.getElementById('tab-label-host');
    if (tabExp) tabExp.textContent = dict.tabExplore;
    if (tabMap) tabMap.textContent = dict.tabMap;
    if (tabPass) tabPass.textContent = dict.tabPasses;
    if (tabHost) tabHost.textContent = dict.tabHost;

    // Wallet & Host headers
    const passHead = document.getElementById('passes-main-heading');
    const passSub = document.getElementById('passes-main-sub');
    const hostHead = document.getElementById('host-main-heading');
    const hostSub = document.getElementById('host-main-sub');
    if (passHead) passHead.textContent = dict.myWallet;
    if (passSub) passSub.textContent = dict.walletSub;
    if (hostHead) hostHead.textContent = dict.hostTitle;
    if (hostSub) hostSub.textContent = dict.hostSub;

    // Detail Sheet Labels
    const priceLabel = document.getElementById('sheet-price-label');
    if (priceLabel) priceLabel.textContent = dict.totalPriceLabel;

    this.render();
    this.renderPassesTab();
  }

  populateGPSSimulatorDropdown() {
    const select = document.getElementById('gps-simulator-select');
    if (!select) return;

    select.innerHTML = SEOCHON_SIMULATION_POINTS.map(p => `
      <option value="${p.id}">${p.name}</option>
    `).join('');
  }

  updateGPSUI(loc) {
    const statusDot = document.getElementById('gps-status-dot');
    if (statusDot) {
      if (loc.isLive) {
        statusDot.className = 'gps-dot-pulse live';
        statusDot.title = 'Live Browser GPS Active';
      } else {
        statusDot.className = 'gps-dot-pulse simulated';
        statusDot.title = 'Simulated Seochon Point';
      }
    }
  }

  updateAuthUI(user) {
    const authAvatar = document.getElementById('auth-user-avatar');
    if (authAvatar && user.avatar) {
      authAvatar.src = user.avatar;
    }
    const passesCountEl = document.getElementById('profile-passes-count');
    const wishlistCountEl = document.getElementById('profile-wishlist-count');

    if (passesCountEl) passesCountEl.textContent = user.bookedExperiences?.length || 0;
    if (wishlistCountEl) wishlistCountEl.textContent = user.savedWishlist?.length || 0;
  }

  bindEvents() {
    // 0. Explore Card Click — Event Delegation (persists across re-renders)
    const programsGrid = document.getElementById('programs-grid');
    if (programsGrid) {
      programsGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.experience-card');
        if (!card) return;
        if (e.target.closest('.card-btn-nav')) {
          e.stopPropagation();
          this.startNavigationToProgram(e.target.closest('.card-btn-nav').dataset.id);
          return;
        }
        if (e.target.closest('.card-btn-wishlist')) {
          e.stopPropagation();
          const btn = e.target.closest('.card-btn-wishlist');
          const isSaved = authManager.toggleWishlist(btn.dataset.id);
          btn.innerHTML = isSaved ? '❤️' : '🤍';
          return;
        }
        this.openProgramDetail(card.dataset.id);
      });
    }

    // 1. Bottom Tab Navigation Switcher
    const navTabs = document.querySelectorAll('.nav-tab-item');
    navTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        this.switchTab(targetTab);
      });
    });

    // 2. Category Filter Buttons (Strictly All, Experience, Making)
    const categoryBtns = document.querySelectorAll('.category-filter-btn, .map-cat-chip');
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.category;
        this.activeCategory = cat;

        // Sync all category buttons
        document.querySelectorAll('.category-filter-btn').forEach(b => {
          b.classList.toggle('active', b.dataset.category === cat);
        });
        document.querySelectorAll('.map-cat-chip').forEach(b => {
          b.classList.toggle('active', b.dataset.category === cat);
        });

        this.render();
      });
    });

    // 3. Sort Selector
    const sortSelect = document.getElementById('sort-selector');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.activeSort = e.target.value;
        this.render();
      });
    }

    // 4. Search Input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.render();
      });
    }

    // 5. GPS Simulator Select
    const simSelect = document.getElementById('gps-simulator-select');
    if (simSelect) {
      simSelect.addEventListener('change', (e) => {
        gpsManager.setSimulatedLocation(e.target.value);
      });
    }

    // 6. Live GPS Button
    const btnLiveGPS = document.getElementById('btn-use-live-gps');
    if (btnLiveGPS) {
      btnLiveGPS.addEventListener('click', async () => {
        btnLiveGPS.textContent = '📡 Syncing...';
        try {
          await gpsManager.startLiveGPS();
          btnLiveGPS.textContent = '📡 Live GPS';
        } catch (err) {
          alert('GPS permission not available. Using Seochon presets.');
          btnLiveGPS.textContent = '📡 Live GPS';
        }
      });
    }

    // 7. Map Recenter FAB
    const btnRecenter = document.getElementById('btn-map-recenter');
    if (btnRecenter) {
      btnRecenter.addEventListener('click', () => {
        const loc = gpsManager.currentLocation;
        mapController.panTo(loc.lat, loc.lng, 16.5);
      });
    }

    // 8. Auth Profile Open
    const btnAuth = document.getElementById('btn-auth-profile');
    if (btnAuth) {
      btnAuth.addEventListener('click', () => this.openAuthModal());
    }

    // 9. Close Sheets & Detail Back Action
    document.querySelectorAll('.sheet-close-btn, .sheet-backdrop, #detail-back-btn, #detail-nav-close').forEach(el => {
      el.addEventListener('click', () => this.closeAllSheets());
    });

    const detailWishlistBtn = document.getElementById('detail-nav-wishlist');
    if (detailWishlistBtn) {
      detailWishlistBtn.addEventListener('click', () => {
        if (this.activeProgram) {
          const isSaved = authManager.toggleWishlist(this.activeProgram.id);
          detailWishlistBtn.innerHTML = isSaved ? '❤️' : '🤍';
          this.render();
        }
      });
    }

    // 10. Guests Stepper
    const guestMinus = document.getElementById('booking-guest-minus');
    const guestPlus = document.getElementById('booking-guest-plus');
    const guestCountEl = document.getElementById('booking-guest-count');

    if (guestMinus && guestPlus) {
      guestMinus.addEventListener('click', () => {
        if (this.bookingGuests > 1) {
          this.bookingGuests--;
          guestCountEl.textContent = this.bookingGuests;
          this.updateBookingPrices();
        }
      });
      guestPlus.addEventListener('click', () => {
        if (this.bookingGuests < 8) {
          this.bookingGuests++;
          guestCountEl.textContent = this.bookingGuests;
          this.updateBookingPrices();
        }
      });
    }

    // 11. Currency Selector
    const currKRW = document.getElementById('curr-krw');
    const currUSD = document.getElementById('curr-usd');
    if (currKRW && currUSD) {
      currKRW.addEventListener('click', () => {
        currKRW.classList.add('active');
        currUSD.classList.remove('active');
        this.bookingCurrency = 'KRW';
        this.updateBookingPrices();
      });
      currUSD.addEventListener('click', () => {
        currUSD.classList.add('active');
        currKRW.classList.remove('active');
        this.bookingCurrency = 'USD';
        this.updateBookingPrices();
      });
    }

    // 12. Payment Checkout Action
    const btnPay = document.getElementById('btn-complete-payment');
    if (btnPay) {
      btnPay.addEventListener('click', () => this.executeBookingPayment());
    }

    // 13. Host Form Submit
    const hostForm = document.getElementById('host-program-form');
    if (hostForm) {
      hostForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleHostFormSubmit(e.target);
      });
    }

    // 14. Close Nav HUD
    const btnCloseNav = document.getElementById('btn-close-nav');
    if (btnCloseNav) {
      btnCloseNav.addEventListener('click', () => {
        document.getElementById('nav-hud-modal').classList.remove('active');
        mapController.clearRoute();
      });
    }

    // 15. View passes shortcut from profile
    document.getElementById('btn-view-passes-from-profile')?.addEventListener('click', () => {
      this.closeSheet('auth-modal');
      this.switchTab('tab-passes');
    });

    // 16. Audio Docent Play/Pause
    const btnDocent = document.getElementById('btn-toggle-docent');
    if (btnDocent) {
      btnDocent.addEventListener('click', () => this.toggleAudioDocent());
    }

    // 17. Hangul Seal Generator
    const btnGenSeal = document.getElementById('btn-generate-seal');
    const sealInput = document.getElementById('seal-name-input');
    if (btnGenSeal && sealInput) {
      btnGenSeal.addEventListener('click', () => this.generateHangulSeal(sealInput.value));
      sealInput.addEventListener('input', () => this.generateHangulSeal(sealInput.value));
    }

    // Sample name chips for seal
    document.querySelectorAll('.sample-name-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const name = chip.dataset.name;
        if (sealInput) sealInput.value = name;
        this.generateHangulSeal(name);
      });
    });

    // 18. Add Review Button
    document.getElementById('btn-open-review-form')?.addEventListener('click', () => {
      const userReview = prompt("Leave a quick review for other travelers:", "Amazing experience! The master was so welcoming and the Hanok atmosphere was unforgettable.");
      if (userReview) {
        alert("✨ Thank you! Your review and photo have been published.");
        this.appendMockReview(userReview);
      }
    });

    // 19. Share to Instagram Story
    document.getElementById('pass-btn-share-story')?.addEventListener('click', () => {
      const progTitle = document.getElementById('pass-prog-title')?.textContent || "Seochon Culture";
      if (navigator.share) {
        navigator.share({
          title: `Exploring ${progTitle} in Seochon!`,
          text: `Just booked an authentic Hanok cultural experience in Seochon, Seoul! 🍵✨ #SeochonVibe #SeoulTravel #Hanok`,
          url: window.location.href
        }).catch(() => {});
      } else {
        alert(`📸 [Instagram Story Card Generated!]\n\n"Exploring ${progTitle} in historic Seochon, Seoul 🇰🇷✨"\nTags: #SeochonVibe #SeoulHanok #KoreaTravel\n\n(Card copied to clipboard for Instagram!)`);
      }
    });
  }

  // Switch Bottom Navigation Tab
  switchTab(tabId) {
    this.activeTab = tabId;

    // Update Bottom Nav UI
    document.querySelectorAll('.nav-tab-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    // Update Tab View Screens
    document.querySelectorAll('.tab-view').forEach(view => {
      view.classList.toggle('active', view.id === tabId);
    });

    // If switching to Map tab, trigger Google Maps resize & render
    if (tabId === 'tab-map') {
      setTimeout(() => {
        if (mapController.map && window.google) {
          google.maps.event.trigger(mapController.map, 'resize');
          const loc = gpsManager.currentLocation;
          mapController.panTo(loc.lat, loc.lng, 16);
        }
      }, 150);
    }

    // If switching to Passes tab, refresh passes
    if (tabId === 'tab-passes') {
      this.renderPassesTab();
    }
  }

  // Get processed, filtered, and sorted programs
  getProcessedPrograms() {
    let list = [...adminProgramManager.getAllPrograms()];
    const userLoc = gpsManager.currentLocation;

    // Calculate real-time Haversine distance
    list = list.map(p => {
      const distance = gpsManager.calculateDistance(userLoc.lat, userLoc.lng, p.location.lat, p.location.lng);
      return {
        ...p,
        currentDistanceMeters: distance,
        formattedDistance: gpsManager.formatDistance(distance),
        estimatedWalkMins: gpsManager.estimateWalkingTime(distance)
      };
    });

    // STRICT Category filter: all, experience, making
    if (this.activeCategory !== 'all') {
      list = list.filter(p => p.category === this.activeCategory);
    }

    // Search query filter
    if (this.searchQuery) {
      list = list.filter(p =>
        p.title.toLowerCase().includes(this.searchQuery) ||
        p.titleKo.toLowerCase().includes(this.searchQuery) ||
        p.host.name.toLowerCase().includes(this.searchQuery) ||
        p.location.address.toLowerCase().includes(this.searchQuery) ||
        p.summary.toLowerCase().includes(this.searchQuery)
      );
    }

    // Sorting
    if (this.activeSort === 'nearest') {
      list.sort((a, b) => a.currentDistanceMeters - b.currentDistanceMeters);
    } else if (this.activeSort === 'fastest') {
      list.sort((a, b) => (a.nextAvailableSlot || '').localeCompare(b.nextAvailableSlot || ''));
    } else if (this.activeSort === 'rating') {
      list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    } else if (this.activeSort === 'price') {
      list.sort((a, b) => a.pricing.krw - b.pricing.krw);
    }

    return list;
  }

  // Render Explore Feed, Map Carousel & Google Map Markers
  render() {
    const container = document.getElementById('programs-grid');
    const countBadge = document.getElementById('results-count-badge');
    const carouselContainer = document.getElementById('map-carousel-container');

    const programs = this.getProcessedPrograms();

    if (countBadge) {
      countBadge.textContent = `${programs.length} spaces available`;
    }

    // 1. Render Explore Feed Cards
    if (container) {
      if (programs.length === 0) {
        container.innerHTML = `
          <div style="text-align:center; padding:40px 16px; color:#94a3b8;">
            <div style="font-size:36px; margin-bottom:8px;">🔍</div>
            <h4>No experiences found</h4>
            <p style="font-size:12px; margin-top:4px;">Try switching to 'Experience' or 'Making' categories.</p>
          </div>
        `;
      } else {
        container.innerHTML = programs.map(p => this.renderProgramCard(p)).join('');
      }
    }

    // 2. Render Map Tab Bottom Carousel
    if (carouselContainer) {
      carouselContainer.innerHTML = programs.map(p => `
        <div class="carousel-card" data-id="${p.id}">
          <img src="${p.images[0]}" class="carousel-thumb" alt="${p.title}" />
          <div class="carousel-body">
            <span class="carousel-cat ${p.category}">${p.categoryLabel}</span>
            <h5 class="carousel-title">${p.title}</h5>
            <div class="carousel-footer">
              <span class="carousel-dist">📍 ${p.formattedDistance}</span>
              <strong class="carousel-price">₩${p.pricing.krw.toLocaleString()}</strong>
            </div>
          </div>
        </div>
      `).join('');

      carouselContainer.querySelectorAll('.carousel-card').forEach(cCard => {
        cCard.addEventListener('click', () => {
          const progId = cCard.dataset.id;
          const prog = programs.find(p => p.id === progId);
          if (prog) {
            mapController.panTo(prog.location.lat, prog.location.lng, 17);
            this.highlightCarouselCard(progId);
            this.openProgramDetail(progId);
          }
        });
      });
    }

    // 3. Update Google Map Markers
    mapController.renderPrograms(programs);
  }

  highlightCarouselCard(progId) {
    const cards = document.querySelectorAll('.carousel-card');
    cards.forEach(c => {
      c.classList.toggle('active', c.dataset.id === progId);
      if (c.dataset.id === progId) {
        c.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    });
  }

  renderProgramCard(p) {
    const isSaved = authManager.currentUser.savedWishlist?.includes(p.id);
    const isMaking = p.category === 'making';
    const categoryBadgeClass = isMaking ? 'badge-making' : 'badge-experience';

    return `
      <article class="experience-card" data-id="${p.id}">
        <div class="card-image-wrap">
          <img src="${p.images[0]}" alt="${p.title}" loading="lazy" />
          <div class="card-gradient-overlay"></div>
          
          <span class="card-category-badge ${categoryBadgeClass}">
            ${p.categoryIcon || (isMaking ? '🏺' : '🍵')} ${p.categoryLabel}
          </span>

          <button class="card-btn-wishlist" data-id="${p.id}" title="Save to Wishlist">
            ${isSaved ? '❤️' : '🤍'}
          </button>

          <div class="card-distance-pill">
            <span class="dist-text">📍 ${p.formattedDistance}</span>
            <span class="dist-walk">(${p.estimatedWalkMins}m walk)</span>
          </div>
        </div>

        <div class="card-content">
          <div class="card-header-row">
            <div class="card-rating">
              ⭐ <strong>${p.rating.toFixed(2)}</strong> <span class="review-count">(${p.reviewCount})</span>
            </div>
            <span class="card-slot-tag">⚡ ${p.nextAvailableSlot}</span>
          </div>

          <h3 class="card-title">${p.title}</h3>
          <p class="card-title-ko">${p.titleKo}</p>
          <p class="card-location">🏛️ ${p.location.name}</p>

          <div class="card-host-row">
            <img src="${p.host.avatar}" class="host-avatar" alt="${p.host.name}" />
            <div class="host-info">
              <span class="host-name">${p.host.name}</span>
              <span class="host-lang">🗣️ ${p.host.languages.join(', ')}</span>
            </div>
          </div>

          <div class="card-footer-row">
            <div>
              <span class="price-krw">₩${p.pricing.krw.toLocaleString()}</span>
              <span class="price-usd">($${p.pricing.usd})</span>
            </div>
            <div class="card-action-btns">
              <button class="card-btn-nav" data-id="${p.id}">🗺️ Walk</button>
              <button class="card-btn-book">Book</button>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  // Toggle Audio Docent Player with Speech / Web Audio Simulation
  toggleAudioDocent() {
    const btn = document.getElementById('btn-toggle-docent');
    const icon = document.getElementById('docent-play-icon');
    const progress = document.getElementById('docent-progress');
    const duration = document.getElementById('docent-duration');

    if (this.isPlayingDocent) {
      this.isPlayingDocent = false;
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (this.docentTimer) clearInterval(this.docentTimer);
      if (btn) btn.classList.remove('playing');
      if (icon) icon.textContent = '▶';
      if (progress) progress.style.width = '0%';
      if (duration) duration.textContent = '0:00 / 0:58 • English Audio Docent';
    } else {
      this.isPlayingDocent = true;
      if (btn) btn.classList.add('playing');
      if (icon) icon.textContent = '⏸';

      const text = document.getElementById('docent-transcript')?.textContent || "Welcome to Seochon culture.";
      if ('speechSynthesis' in window) {
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'en-US';
        utter.rate = 0.95;
        utter.onend = () => {
          this.toggleAudioDocent();
        };
        window.speechSynthesis.speak(utter);
      }

      let sec = 0;
      if (this.docentTimer) clearInterval(this.docentTimer);
      this.docentTimer = setInterval(() => {
        sec++;
        const pct = Math.min(100, (sec / 58) * 100);
        if (progress) progress.style.width = `${pct}%`;
        if (duration) duration.textContent = `0:${String(sec).padStart(2, '0')} / 0:58 • Playing Docent...`;
        if (sec >= 58) {
          this.toggleAudioDocent();
        }
      }, 1000);
    }
  }

  // Generate Hangul Seal Impression
  generateHangulSeal(name) {
    const cleanName = (name || "Alex").trim();
    const formattedKey = cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase();

    const sample = HANGUL_NAME_SAMPLES[formattedKey] || {
      ko: cleanName.length > 2 ? cleanName.slice(0, 3) : "알렉스",
      hanja: "雅樂",
      meaning: `Personal Joseon Seal for ${cleanName}`
    };

    const outHangul = document.getElementById('seal-output-hangul');
    const outHanja = document.getElementById('seal-output-hanja');
    const outMeaning = document.getElementById('seal-output-meaning');

    if (outHangul) outHangul.textContent = sample.ko;
    if (outHanja) outHanja.textContent = sample.hanja;
    if (outMeaning) outMeaning.textContent = `"${sample.meaning}"`;
  }

  // Render Traveler Photo Reviews in Detail Sheet
  renderReviews(reviews) {
    const container = document.getElementById('detail-reviews-container');
    if (!container) return;

    const list = reviews && reviews.length > 0 ? reviews : [
      {
        id: "rev-sample-1",
        author: "Emma Watson",
        country: "🇬🇧 London, UK",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
        rating: 5,
        date: "2 days ago",
        text: "The most serene morning in Seoul! Master Park explained the philosophy behind Korean green tea so poetically. The seasonal Dasik cookies melted in my mouth.",
        photo: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400"
      },
      {
        id: "rev-sample-2",
        author: "Lucas Chen",
        country: "🇸🇬 Singapore",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
        rating: 5,
        date: "5 days ago",
        text: "Hidden gem inside Seochon alleyways! Walking here with the app's GPS route was super easy.",
        photo: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400"
      }
    ];

    container.innerHTML = list.map(r => `
      <div class="review-item-card">
        <div class="review-user-row">
          <div class="review-user-info">
            <img src="${r.avatar}" alt="${r.author}" />
            <div>
              <strong>${r.author}</strong>
              <small>${r.country}</small>
            </div>
          </div>
          <div class="review-date-rating">
            <span style="color:#d97706; font-weight:800;">⭐ ${r.rating}.0</span>
            <small>${r.date}</small>
          </div>
        </div>
        <p class="review-text">"${r.text}"</p>
        ${r.photo ? `<img src="${r.photo}" class="review-photo-thumb" alt="Review photo" />` : ''}
      </div>
    `).join('');
  }

  appendMockReview(text) {
    const container = document.getElementById('detail-reviews-container');
    if (!container) return;

    const newRevHtml = `
      <div class="review-item-card" style="border-color:#be123c;">
        <div class="review-user-row">
          <div class="review-user-info">
            <img src="${authManager.currentUser.avatar || 'avatar_art.jpg'}" alt="User" />
            <div>
              <strong>${authManager.currentUser.name}</strong>
              <small>${authManager.currentUser.nationality}</small>
            </div>
          </div>
          <div class="review-date-rating">
            <span style="color:#d97706; font-weight:800;">⭐ 5.0</span>
            <small>Just now</small>
          </div>
        </div>
        <p class="review-text">"${text}"</p>
      </div>
    `;
    container.insertAdjacentHTML('afterbegin', newRevHtml);
  }

  // Render My Passes Tab & Cultural Stamp Passport
  renderPassesTab() {
    const list = document.getElementById('my-passes-list');
    const stampGrid = document.getElementById('stamp-tour-grid');
    const stampBadge = document.getElementById('stamp-progress-badge');
    const badgeDot = document.getElementById('passes-badge-dot');

    const bookings = authManager.currentUser.bookedExperiences || [];

    // Render Stamp Tour Grid
    if (stampGrid) {
      const unlockedCount = bookings.length >= 1 ? 3 : 2;
      if (stampBadge) stampBadge.textContent = `${unlockedCount} / 4 Stamps`;

      stampGrid.innerHTML = STAMP_TOUR_DATA.map((st, idx) => {
        const isUnlocked = idx < unlockedCount;
        return `
          <div class="passport-stamp-slot ${isUnlocked ? 'unlocked' : 'locked'}">
            <span class="passport-stamp-icon">${st.icon}</span>
            <span class="passport-stamp-name">${st.title}</span>
            <small style="font-size:8px; color:${isUnlocked ? '#059669' : '#94a3b8'}; font-weight:700;">
              ${isUnlocked ? '✓ COLLECTED' : 'LOCKED'}
            </small>
          </div>
        `;
      }).join('');
    }

    if (!list) return;

    if (badgeDot) {
      badgeDot.classList.toggle('visible', bookings.length > 0);
    }

    if (bookings.length === 0) {
      list.innerHTML = `
        <div style="text-align:center; padding:30px 16px; color:#94a3b8; background:#ffffff; border-radius:20px; margin:0 16px;">
          <div style="font-size:36px; margin-bottom:8px;">🎟️</div>
          <h4 style="color:#0f172a;">No confirmed passes yet</h4>
          <p style="font-size:12px; margin-top:4px;">Book an authentic Hanok tea ceremony or craft workshop to get your mobile QR pass & cultural stamp!</p>
          <button class="btn-sheet-book" style="margin-top:14px;" onclick="window.seochonApp.switchTab('tab-explore')">
            Explore Seochon
          </button>
        </div>
      `;
      return;
    }

    list.innerHTML = bookings.map(b => `
      <div class="mobile-pass-card" style="margin-bottom:16px;">
        <div class="pass-top">
          <span class="pass-brand">SEOCHON PASS</span>
          <span class="pass-confirmed">✅ ACTIVE</span>
          <span class="pass-code">${b.bookingId}</span>
        </div>
        <div class="pass-middle">
          <span class="pass-category">${b.categoryLabel}</span>
          <h3>${b.programTitle}</h3>
          <p class="pass-title-ko">${b.programTitleKo || ''}</p>
          <div class="pass-meta-grid">
            <div>
              <small>DATE & TIME</small>
              <strong>Today ${b.slotTime}</strong>
            </div>
            <div>
              <small>GUESTS</small>
              <strong>${b.guests} Traveler(s)</strong>
            </div>
            <div>
              <small>TOTAL PAID</small>
              <strong class="highlight">${b.totalPaid}</strong>
            </div>
            <div>
              <small>DISTANCE</small>
              <strong>${b.distanceText}</strong>
            </div>
          </div>
          <div class="pass-venue-info">
            <small>LOCATION</small>
            <strong>${b.venueName}</strong>
            <p>${b.venueAddress}</p>
          </div>
        </div>
        <div class="pass-bottom-actions">
          <button class="btn-pass-walk" onclick="window.appLaunchNavigation('${b.programId}')">
            🚶 Start GPS Walking Route
          </button>
          <a href="https://www.google.com/maps/dir/?api=1&origin=${gpsManager.currentLocation.lat},${gpsManager.currentLocation.lng}&destination=${b.destinationLat},${b.destinationLng}&travelmode=walking" class="btn-pass-gmaps" target="_blank" rel="noopener">
            📍 Open in Google Maps App
          </a>
        </div>
      </div>
    `).join('');
  }

  // Open Detail Bottom Sheet
  openProgramDetail(progId) {
    const prog = adminProgramManager.getProgramById(progId);
    if (!prog) return;

    this.activeProgram = prog;
    const userLoc = gpsManager.currentLocation;
    const distance = gpsManager.calculateDistance(userLoc.lat, userLoc.lng, prog.location.lat, prog.location.lng);
    const formattedDist = gpsManager.formatDistance(distance);
    const walkMins = gpsManager.estimateWalkingTime(distance);

    document.getElementById('detail-modal-category').innerHTML = `
      <span class="card-category-badge ${prog.category === 'making' ? 'badge-making' : 'badge-experience'}">
        ${prog.categoryIcon} ${prog.categoryLabel}
      </span>
      <span style="font-size:11px; color:#38bdf8; background:rgba(56,189,248,0.15); padding:3px 8px; border-radius:12px;">
        🏃 <strong>${formattedDist}</strong> (${walkMins}m walk)
      </span>
    `;

    document.getElementById('detail-modal-title').textContent = prog.title;
    document.getElementById('detail-modal-title-ko').textContent = prog.titleKo;
    document.getElementById('detail-modal-rating').innerHTML = `⭐ <strong>${prog.rating.toFixed(2)}</strong> (${prog.reviewCount} reviews)`;

    document.getElementById('detail-modal-gallery').innerHTML = `
      <img src="${prog.images[0]}" alt="${prog.title}" />
    `;

    document.getElementById('detail-modal-summary').textContent = prog.summary;
    document.getElementById('detail-modal-summary-ko').textContent = prog.summaryKo;

    document.getElementById('detail-modal-host-avatar').src = prog.host.avatar;
    document.getElementById('detail-modal-host-name').textContent = prog.host.name;
    document.getElementById('detail-modal-host-role').textContent = prog.host.role;
    document.getElementById('detail-modal-host-langs').textContent = `🗣️ Languages: ${prog.host.languages.join(' • ')}`;

    document.getElementById('detail-modal-venue-name').textContent = prog.location.name;
    document.getElementById('detail-modal-venue-address').textContent = prog.location.address;

    document.getElementById('detail-modal-inclusions').innerHTML = prog.inclusions.map(inc => `
      <li style="font-size:12px; color:#cbd5e1; margin-bottom:4px;">✨ ${inc}</li>
    `).join('');

    const slotsContainer = document.getElementById('detail-modal-slots');
    slotsContainer.innerHTML = prog.slots.map((s, idx) => `
      <button class="slot-select-btn ${idx === 0 ? 'selected' : ''}" data-slot-id="${s.id}" data-time="${s.time}">
        <span class="slot-time">${s.time}</span>
        <span class="slot-spots">${s.available} left</span>
      </button>
    `).join('');

    this.activeBookingSlot = prog.slots[0] || { id: 'default', time: '15:00' };

    slotsContainer.querySelectorAll('.slot-select-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        slotsContainer.querySelectorAll('.slot-select-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.activeBookingSlot = {
          id: btn.dataset.slotId,
          time: btn.dataset.time
        };
      });
    });

    // Setup Audio Docent Transcript
    const transcriptEl = document.getElementById('docent-transcript');
    if (transcriptEl && prog.audioDocent) {
      transcriptEl.textContent = `"${prog.audioDocent.transcript}"`;
    }

    // Setup Hangul Seal Simulator (Default to Alex or current user name)
    const userName = (authManager.currentUser.name || "Alex").split(' ')[0];
    const sealInput = document.getElementById('seal-name-input');
    if (sealInput) sealInput.value = userName;
    this.generateHangulSeal(userName);

    // Setup Traveler Photo Reviews Feed
    this.renderReviews(prog.reviews);

    document.getElementById('detail-modal-price-krw').textContent = `₩${prog.pricing.krw.toLocaleString()}`;
    document.getElementById('detail-modal-price-usd').textContent = `($${prog.pricing.usd} USD)`;

    // Minimum Guests Policy Notice
    const minG = prog.minGuests || 2;
    const minGEl = document.getElementById('detail-min-guests-num');
    const minGInlineEl = document.getElementById('detail-min-guests-num-inline');
    if (minGEl) minGEl.textContent = minG;
    if (minGInlineEl) minGInlineEl.textContent = minG;

    document.getElementById('detail-btn-open-checkout').onclick = () => {
      this.closeSheet('detail-modal');
      this.openBookingCheckout(prog);
    };

    document.getElementById('detail-btn-nav-direct').onclick = () => {
      this.closeSheet('detail-modal');
      this.startNavigationToProgram(prog.id);
    };

    this.openSheet('detail-modal');
  }

  // Open Express Checkout Sheet
  openBookingCheckout(prog) {
    this.activeProgram = prog;
    this.bookingGuests = 1;
    document.getElementById('booking-guest-count').textContent = '1';

    const minG = prog.minGuests || 2;
    const coMinGEl = document.getElementById('checkout-min-guests-num');
    if (coMinGEl) coMinGEl.textContent = minG;

    document.getElementById('checkout-prog-thumb').src = prog.images[0];
    document.getElementById('checkout-prog-title').textContent = prog.title;
    document.getElementById('checkout-prog-category').textContent = prog.categoryLabel;
    document.getElementById('checkout-slot-time').textContent = this.activeBookingSlot?.time || '15:30';
    document.getElementById('checkout-venue-name').textContent = prog.location.name;

    this.updateBookingPrices();
    this.openSheet('checkout-modal');
  }

  updateBookingPrices() {
    if (!this.activeProgram) return;

    const prog = this.activeProgram;
    const guests = this.bookingGuests;
    const totalKRW = prog.pricing.krw * guests;
    const totalUSD = prog.pricing.usd * guests;

    const totalEl = document.getElementById('checkout-total-amount');
    const subtotalEl = document.getElementById('checkout-subtotal-amount');

    if (this.bookingCurrency === 'KRW') {
      if (totalEl) totalEl.textContent = `₩${totalKRW.toLocaleString()}`;
      if (subtotalEl) subtotalEl.textContent = `₩${totalKRW.toLocaleString()} KRW (${guests} guest${guests > 1 ? 's' : ''})`;
    } else {
      if (totalEl) totalEl.textContent = `$${totalUSD} USD`;
      if (subtotalEl) subtotalEl.textContent = `$${totalUSD} USD (${guests} guest${guests > 1 ? 's' : ''})`;
    }
  }

  executeBookingPayment() {
    const btnPay = document.getElementById('btn-complete-payment');
    btnPay.textContent = "Processing 1-Tap Payment...";

    setTimeout(() => {
      btnPay.textContent = "🔒 Pay & Confirm Pass";

      const selectedPayRadio = document.querySelector('input[name="payment_method"]:checked');
      const payMethod = selectedPayRadio ? selectedPayRadio.value : 'google_pay';

      const bookingRecord = bookingManager.processPayment(
        this.activeProgram,
        this.activeBookingSlot,
        this.bookingGuests,
        payMethod,
        this.bookingCurrency
      );

      this.closeSheet('checkout-modal');
      this.showTicketPassModal(bookingRecord);
      this.renderPassesTab();
    }, 1000);
  }

  showTicketPassModal(booking) {
    document.getElementById('pass-booking-id').textContent = booking.bookingId;
    document.getElementById('pass-prog-title').textContent = booking.programTitle;
    document.getElementById('pass-prog-title-ko').textContent = booking.programTitleKo;
    document.getElementById('pass-category-badge').textContent = booking.categoryLabel;
    document.getElementById('pass-slot-time').textContent = booking.slotTime;
    document.getElementById('pass-guest-count').textContent = `${booking.guests} Traveler${booking.guests > 1 ? 's' : ''}`;
    document.getElementById('pass-venue-name').textContent = booking.venueName;
    document.getElementById('pass-venue-address').textContent = booking.venueAddress;
    document.getElementById('pass-total-paid').textContent = booking.totalPaid;
    document.getElementById('pass-dist-text').textContent = booking.distanceText;

    const userLoc = gpsManager.currentLocation;
    const gmapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLoc.lat},${userLoc.lng}&destination=${booking.destinationLat},${booking.destinationLng}&travelmode=walking`;
    const gmapsLink = document.getElementById('pass-link-gmaps');
    if (gmapsLink) gmapsLink.href = gmapsUrl;

    document.getElementById('pass-btn-start-nav').onclick = () => {
      this.closeSheet('ticket-pass-modal');
      this.startNavigationToProgram(booking.programId);
    };

    this.openSheet('ticket-pass-modal');
  }

  // Turn-by-Turn Walking Navigation HUD
  startNavigationToProgram(programId) {
    const prog = adminProgramManager.getProgramById(programId);
    if (!prog) return;

    this.activeProgram = prog;
    const userLoc = gpsManager.currentLocation;

    const route = gpsManager.generateWalkingRoute(
      userLoc.lat,
      userLoc.lng,
      prog.location.lat,
      prog.location.lng,
      prog.title,
      prog.location.address
    );

    this.navRouteData = route;

    // Switch to Map Tab & Draw Route
    this.switchTab('tab-map');
    mapController.drawRoute(route);

    document.getElementById('nav-hud-dest-title').textContent = prog.title;
    document.getElementById('nav-hud-dest-address').textContent = prog.location.address;
    document.getElementById('nav-hud-total-dist').textContent = route.formattedDistance;
    document.getElementById('nav-hud-walk-time').textContent = `${route.estimatedMinutes} min`;

    const gmapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLoc.lat},${userLoc.lng}&destination=${prog.location.lat},${prog.location.lng}&travelmode=walking`;
    const gmapsNavEl = document.getElementById('nav-hud-link-gmaps');
    if (gmapsNavEl) gmapsNavEl.href = gmapsUrl;

    const stepsContainer = document.getElementById('nav-hud-steps-list');
    stepsContainer.innerHTML = route.steps.map(step => `
      <div class="nav-step-item">
        <div class="nav-step-icon-wrap">${step.step}</div>
        <div>
          <p class="nav-step-text-en">${step.instruction}</p>
          <p class="nav-step-text-ko">${step.instructionKo}</p>
          <span class="nav-step-meta">🚶 ${step.distance} • ${step.time}</span>
        </div>
      </div>
    `).join('');

    document.getElementById('nav-hud-modal').classList.add('active');
    mapController.panTo(prog.location.lat, prog.location.lng, 16.5);
  }

  updateLiveNavigation(prog) {
    const userLoc = gpsManager.currentLocation;
    const route = gpsManager.generateWalkingRoute(
      userLoc.lat,
      userLoc.lng,
      prog.location.lat,
      prog.location.lng,
      prog.title,
      prog.location.address
    );
    this.navRouteData = route;
    mapController.drawRoute(route);
  }

  // Host Form Submit
  handleHostFormSubmit(form) {
    const formData = new FormData(form);
    const category = formData.get('category');

    const programData = {
      title: formData.get('title'),
      titleKo: formData.get('titleKo'),
      category: category,
      categoryIcon: category === 'making' ? '🏺' : '🍵',
      hostName: formData.get('hostName'),
      hostRole: "Master Artisan",
      venueName: formData.get('venueName'),
      address: formData.get('address'),
      lat: parseFloat(formData.get('lat')),
      lng: parseFloat(formData.get('lng')),
      priceKrw: parseInt(formData.get('priceKrw'), 10),
      priceUsd: parseInt(formData.get('priceUsd'), 10),
      durationMinutes: parseInt(formData.get('durationMinutes'), 10),
      imageUrl: formData.get('imageUrl'),
      summary: formData.get('summary'),
      summaryKo: formData.get('summaryKo')
    };

    const newProg = adminProgramManager.addProgram(programData);
    form.reset();
    alert(`🎉 Success! "${newProg.title}" is now live on the Seochon mobile map!`);
    this.switchTab('tab-explore');
  }

  // Google Auth Profile Modal
  openAuthModal() {
    const user = authManager.currentUser;
    if (user.isLoggedIn) {
      document.getElementById('auth-profile-section').classList.remove('hidden');
      document.getElementById('auth-login-section').classList.add('hidden');
      document.getElementById('profile-avatar-large').src = user.avatar;
      document.getElementById('profile-name-large').textContent = user.name;
      document.getElementById('profile-email-large').textContent = user.email;
      document.getElementById('profile-nationality').textContent = user.nationality;

      document.getElementById('btn-sign-out').onclick = () => {
        authManager.signOut();
        this.closeSheet('auth-modal');
      };
    } else {
      document.getElementById('auth-profile-section').classList.add('hidden');
      document.getElementById('auth-login-section').classList.remove('hidden');
      document.getElementById('btn-google-signin-action').onclick = () => {
        authManager.signInWithGoogle();
        this.closeSheet('auth-modal');
      };
    }
    this.openSheet('auth-modal');
  }

  openSheet(id) {
    const sheet = document.getElementById(id);
    if (sheet) sheet.classList.add('active');
  }

  closeSheet(id) {
    const sheet = document.getElementById(id);
    if (sheet) sheet.classList.remove('active');
  }

  closeAllSheets() {
    document.querySelectorAll('.mobile-bottom-sheet').forEach(s => s.classList.remove('active'));
  }
}

// Immediate & Safe App Bootstrapping
function initApp() {
  if (!window.seochonApp) {
    window.seochonApp = new MobileApp();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
