/**
 * 9SEOUL Host Portal Manager
 * - Host sign-up (business / individual) with document uploads
 * - Program submission -> pending review queue
 * - Master account (9SEOUL staff) login -> approve / reject
 */

const HOST_PORTAL = (() => {
  const MASTER_ID  = '9seoul_master';
  const MASTER_PW  = 'master9seoul!';
  const HOST_KEY   = '9seoul_host_profile';
  const PENDING_KEY = '9seoul_pending_programs';

  let currentHost  = null;
  let isMasterMode = false;

  const load = key => { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } };
  const save = (key, val) => localStorage.setItem(key, JSON.stringify(val));

  function loadHost()       { currentHost = load(HOST_KEY); return currentHost; }
  function saveHost(data)   { currentHost = data; save(HOST_KEY, data); }
  function loadPending()    { return load(PENDING_KEY) || []; }
  function savePending(list){ save(PENDING_KEY, list); }

  function register({ type, name, email, phone, bizDocBase64, idDocBase64, bankBase64 }) {
    if (!bankBase64) return { ok: false, msg: '통장 사본은 필수입니다.' };
    const doc = type === 'business' ? bizDocBase64 : idDocBase64;
    if (!doc) return { ok: false, msg: type === 'business' ? '사업자등록증을 업로드해 주세요.' : '신분증을 업로드해 주세요.' };
    const profile = { id: `host-${Date.now()}`, type, name, email, phone, doc, bank: bankBase64, status: 'approved', createdAt: new Date().toISOString() };
    saveHost(profile);
    return { ok: true, profile };
  }

  function loginHost(email) {
    const saved = load(HOST_KEY);
    if (saved && saved.email === email) { currentHost = saved; return { ok: true, profile: saved }; }
    return { ok: false, msg: '등록된 이메일이 없습니다. 먼저 가입해 주세요.' };
  }

  function loginMaster(id, pw) {
    if (id === MASTER_ID && pw === MASTER_PW) { isMasterMode = true; return { ok: true }; }
    return { ok: false, msg: 'ID 또는 비밀번호가 틀렸습니다.' };
  }
  function logoutMaster() { isMasterMode = false; }

  function submitProgram(formData) {
    if (!currentHost) return { ok: false, msg: '로그인이 필요합니다.' };
    const list = loadPending();
    const prog = { id: `pending-${Date.now()}`, hostId: currentHost.id, hostName: currentHost.name, hostEmail: currentHost.email, status: 'pending', submittedAt: new Date().toISOString(), reviewNote: '', ...formData };
    list.unshift(prog);
    savePending(list);
    return { ok: true, program: prog };
  }

  function approveProgram(pendingId, adminProgramManager) {
    const list = loadPending();
    const idx  = list.findIndex(p => p.id === pendingId);
    if (idx === -1) return false;
    const p = list[idx];
    p.status = 'approved';
    p.reviewedAt = new Date().toISOString();
    const images = [
      p.moodImageBase64 || 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
      ...(p.detailImages || []),
      ...(p.extraSections || []).map(s => s.imageBase64).filter(Boolean),
    ];
    adminProgramManager.addProgram({
      title: p.titleEn || p.title, titleKo: p.titleKo || p.title,
      category: p.category || 'experience',
      hostName: p.hostName, hostRole: p.hostRole || '9SEOUL Certified Host',
      languages: ['Korean', 'English'],
      venueName: p.venueName, address: p.venueAddress,
      lat: parseFloat(p.lat) || 37.5800, lng: parseFloat(p.lng) || 126.9700,
      priceKrw: parseInt(p.priceKrw, 10) || 50000, priceUsd: parseInt(p.priceUsd, 10) || 38,
      minGuests: parseInt(p.minGuests, 10) || 2, maxGuests: parseInt(p.maxGuests, 10) || 8,
      durationMinutes: parseInt(p.duration, 10) || 90,
      imageUrl: images[0], images,
      nextSlot: p.slots && p.slots[0] ? `Today ${p.slots[0].time}` : 'Today 15:00',
      slots: p.slots || [{ id: `s-${Date.now()}`, time: '15:00', available: 6, max: 6 }],
      summary: p.descriptionFull || p.description || '',
      summaryKo: p.descriptionKo || '',
      inclusions: p.inclusions ? p.inclusions.split(',').map(s => s.trim()) : ['재료 포함', 'English Guide'],
    });
    savePending(list);
    return true;
  }

  function rejectProgram(pendingId, note) {
    const list = loadPending();
    const idx  = list.findIndex(p => p.id === pendingId);
    if (idx === -1) return false;
    list[idx].status = 'rejected';
    list[idx].reviewNote = note || '';
    list[idx].reviewedAt = new Date().toISOString();
    savePending(list);
    return true;
  }

  function getMyPrograms()  { if (!currentHost) return []; return loadPending().filter(p => p.hostId === currentHost.id); }
  function getAllPending()   { return loadPending().filter(p => p.status === 'pending'); }
  function getAllForMaster() { return loadPending(); }
  function logout()         { currentHost = null; isMasterMode = false; }

  return {
    loadHost, register, loginHost, loginMaster, logoutMaster, logout,
    submitProgram, approveProgram, rejectProgram,
    getMyPrograms, getAllPending, getAllForMaster,
    get currentHost()  { return currentHost; },
    get isMasterMode() { return isMasterMode; },
  };
})();

export { HOST_PORTAL };
