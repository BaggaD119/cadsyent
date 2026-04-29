const CADSYENT_CMS_STORAGE_KEY = 'cadsyent.cms.v1';
const CADSYENT_CMS_ROW_ID = 'main';
const CADSYENT_SUPABASE_TABLE = 'site_content';
const CADSYENT_AUTH_STORAGE_KEY = 'cadsyent.supabase.auth.v1';

const CADSYENT_CMS_DEFAULTS = {
  brandName: 'CADSY BROWN ENTERTAINMENT',
  brandLogo: '',
  social: {
    instagramUrl: '#',
    tiktokUrl: '#',
    linkedinUrl: '#'
  },
  hero: {
    kicker: "The Original Advocate For The World's Most",
    titleLine1: 'EXTRAORDINARY',
    titleLine2: 'TALENT',
    meta1: 'Global Talent Representation',
    meta2: 'Music, Film, Creator Entertainment',
    heroImage: '',
    heroSlides: []
  },
  preloader: {
    media: ''
  },
  fashion: {
    lead: 'Cadsy Brown Entertainment represents musicians, actors, and content creators building global audiences. We help talent lead conversations and shape culture across music, film, and digital platforms.',
    cards: [
      {
        id: 'talent-1',
        title: 'Actress',
        body: 'Strategic management for recording artists, producers, and DJs across releases, partnerships, and touring opportunities.',
        image: '',
        url: ''
      },
      {
        id: 'talent-2',
        title: 'Musician',
        body: 'Career representation for screen talent spanning film, television, streaming productions, and brand collaborations.',
        image: '',
        url: ''
      },
      {
        id: 'talent-3',
        title: 'Musician',
        body: 'End-to-end support for digital creators building consistent content, loyal communities, and high-impact partnerships.',
        image: '',
        url: ''
      }
    ],
    card1: {
      title: 'Actress',
      body: 'Strategic management for recording artists, producers, and DJs across releases, partnerships, and touring opportunities.',
      image: '',
      url: ''
    },
    card2: {
      title: 'Musician',
      body: 'Career representation for screen talent spanning film, television, streaming productions, and brand collaborations.',
      image: '',
      url: ''
    },
    card3: {
      title: 'Musician',
      body: 'End-to-end support for digital creators building consistent content, loyal communities, and high-impact partnerships.',
      image: '',
      url: ''
    }
  },
  divisions: {
    division1: { title: 'Entertainment', body: 'Hosts, broadcasters, creators, and podcasters shaping entertainment globally.', image: '' },
    division2: { title: 'Sport', body: 'World-class athletes and football talent across leading leagues and major tournaments.', image: '' },
    division3: { title: 'Music', body: 'Recording artists, producers, and DJs developing influential sound and visual identities.', image: '' },
    division4: { title: 'Gaming', body: 'End-to-end representation for esports talent, gaming creators, and strategic partnerships.', image: '' },
    division5: { title: 'Literary', body: 'Award-winning authors, creators, and storytellers across publishing and media adaptation.', image: '' }
  },
  events: {
    news: [
      { id: 'news-1', title: 'Agency Updates', body: 'Latest announcements, talent milestones, and partnership highlights from across Cadsy Brown Entertainment divisions.', published: true },
      { id: 'news-2', title: 'Media Features', body: 'Coverage from global media platforms spotlighting our talent and campaigns.', published: true }
    ],
    blogs: [
      { id: 'blog-1', title: 'Culture Insights', body: 'Perspectives on talent, storytelling, and trends shaping entertainment, music, film, and digital culture.', image: '', published: true },
      { id: 'blog-2', title: 'Behind The Campaigns', body: 'How we build long-term partnerships and help creators scale their global presence.', image: '', published: true },
      { id: 'blog-3', title: 'Creator Playbooks', body: 'Practical strategy for creators and brands looking to grow meaningful audience relationships.', image: '', published: true }
    ],
    testimonials: [
      { id: 'tm-1', name: 'Amelia Jordan', role: 'Content Creator', initials: 'AJ', feedback: 'Cadsy Brown Entertainment helped me move from local projects to global creator partnerships in less than a year.', published: true },
      { id: 'tm-2', name: 'Daniel Kofi', role: 'Brand Director', initials: 'DK', feedback: 'Their team is reliable, strategic, and very sharp with culture-led campaigns that actually convert.', published: true },
      { id: 'tm-3', name: 'Sarah Nettey', role: 'Talent Manager', initials: 'SN', feedback: 'Every collaboration has been smooth. Cadsy Brown Entertainment delivers premium talent and clear communication.', published: true }
    ]
  },
  contact: {
    email: 'hello@cadsyent.com',
    phone: '+233 54 688 8842',
    phoneHref: '+233546888842',
    address: 'Abelemkpe Santana Road, Swanika Street'
  },
  footer: {
    copy: '© 2026 Cadsy Brown Entertainment. All rights reserved.'
  }
};

const deepClone = (value) => JSON.parse(JSON.stringify(value));
const isObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);
const safeParse = (value) => { try { return JSON.parse(value); } catch { return null; } };
const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const nowSeconds = () => Math.floor(Date.now() / 1000);
const normalizeSupabaseAssetUrl = (value = '') => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (/^https?:\/\/[^/]+\/object\//i.test(raw)) {
    return raw.replace(/^(https?:\/\/[^/]+)\/object\//i, '$1/storage/v1/object/');
  }
  if (/^\/object\//i.test(raw)) {
    return raw.replace(/^\/object\//i, '/storage/v1/object/');
  }
  return raw;
};
const toAbsoluteSupabaseUrl = (baseUrl, value) => {
  const cleanBase = String(baseUrl || '').replace(/\/+$/, '');
  const raw = normalizeSupabaseAssetUrl(value);
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) return raw;
  if (/^object\//i.test(raw)) return `${cleanBase}/storage/v1/${raw}`;
  if (raw.startsWith('/')) return `${cleanBase}${raw}`;
  return `${cleanBase}/${raw}`;
};
const resolveCmsAssetUrl = (value = '') => {
  const normalized = normalizeSupabaseAssetUrl(value);
  if (!normalized) return '';
  if (/^https?:\/\//i.test(normalized)) return normalized;
  const { url } = getSupabaseConfig();
  if (!url) return normalized;
  return toAbsoluteSupabaseUrl(url, normalized);
};

const deepMerge = (base, override) => {
  if (!isObject(base)) return override;
  const out = { ...base };
  if (!isObject(override)) return out;
  Object.keys(override).forEach((key) => {
    const baseValue = base[key];
    const overrideValue = override[key];
    if (isObject(baseValue) && isObject(overrideValue)) out[key] = deepMerge(baseValue, overrideValue);
    else out[key] = overrideValue;
  });
  return out;
};

const normalizeMissionContent = (content) => {
  const next = deepClone(content || {});
  if (!next.hero || !isObject(next.hero)) next.hero = {};
  if (!next.fashion || !isObject(next.fashion)) next.fashion = {};
  if (!next.fashion.card1 || !isObject(next.fashion.card1)) next.fashion.card1 = {};
  if (!next.fashion.card2 || !isObject(next.fashion.card2)) next.fashion.card2 = {};
  if (!next.fashion.card3 || !isObject(next.fashion.card3)) next.fashion.card3 = {};

  if (String(next.hero.meta2 || '').trim().toLowerCase() === 'music, film, creator culture') {
    next.hero.meta2 = 'Music, Film, Creator Entertainment';
  }

  const normalizedBrand = String(next.brandName || '').trim().toLowerCase();
  if (!normalizedBrand || normalizedBrand === 'cadsyent' || normalizedBrand === 'cadsybrownent') {
    next.brandName = 'Cadsy Brown Entertainment';
  }

  if (next.footer && typeof next.footer.copy === 'string' && /cadsyent/i.test(next.footer.copy)) {
    next.footer.copy = next.footer.copy.replace(/cadsyent/gi, 'Cadsy Brown Entertainment');
  }
  if (typeof next.brandLogo === 'string') {
    next.brandLogo = resolveCmsAssetUrl(next.brandLogo);
  }

  const lead = String(next.fashion.lead || '').toLowerCase();
  const hasLegacyLead =
    lead.includes('cadsyent fashion represents') ||
    lead.includes('fashion, luxury, and beauty') ||
    lead.includes('cadsyent represents musicians, actors, and content creators building global audiences');
  if (hasLegacyLead) {
    next.fashion.lead = 'Cadsy Brown Entertainment represents musicians, actors, and content creators building global audiences. We help talent lead conversations and shape culture across music, film, and digital platforms.';
  }

  if (String(next.fashion.card1.title || '').trim().toLowerCase() === 'art + commerce') {
    next.fashion.card1.title = 'Musicians';
    next.fashion.card1.body = 'Strategic management for recording artists, producers, and DJs across releases, partnerships, and touring opportunities.';
  }

  if (String(next.fashion.card2.title || '').trim().toLowerCase() === 'img models') {
    next.fashion.card2.title = 'Actors';
    next.fashion.card2.body = 'Career representation for screen talent spanning film, television, streaming productions, and brand collaborations.';
  }

  if (String(next.fashion.card3.title || '').trim().toLowerCase() === 'the wall group') {
    next.fashion.card3.title = 'Content Creators';
    next.fashion.card3.body = 'End-to-end support for digital creators building consistent content, loyal communities, and high-impact partnerships.';
  }

  const defaultCards = (CADSYENT_CMS_DEFAULTS.fashion.cards || []).map((item, index) => ({
    id: item.id || `talent-${index + 1}`,
    title: String(item.title || ''),
    body: String(item.body || ''),
    image: String(item.image || ''),
    url: String(item.url || '')
  }));
  const toCard = (item, index) => ({
    id: String(item?.id || `talent-${index + 1}`),
    title: String(item?.title || ''),
    body: String(item?.body || ''),
    image: resolveCmsAssetUrl(item?.image || ''),
    url: String(item?.url || '')
  });

  const legacyCards = [next.fashion.card1, next.fashion.card2, next.fashion.card3]
    .map((item, index) => toCard(item, index))
    .filter((item) => item.title || item.body || item.image || item.url);

  const cardsManaged = next.fashion.cardsManaged === true;
  const listCards = Array.isArray(next.fashion.cards)
    ? next.fashion.cards.map((item, index) => toCard(item, index)).filter((item) => item.title || item.body || item.image || item.url)
    : [];
  const normalizedListCards = !cardsManaged && listCards.length > 3 ? listCards.slice(0, 3) : listCards;

  const normalizedCards = cardsManaged
    ? (normalizedListCards.length ? normalizedListCards : (legacyCards.length ? legacyCards : defaultCards))
    : (legacyCards.length ? legacyCards : (normalizedListCards.length ? normalizedListCards : defaultCards));
  next.fashion.cards = normalizedCards;
  next.fashion.card1 = toCard(normalizedCards[0] || defaultCards[0] || {}, 0);
  next.fashion.card2 = toCard(normalizedCards[1] || defaultCards[1] || {}, 1);
  next.fashion.card3 = toCard(normalizedCards[2] || defaultCards[2] || {}, 2);
  if (next.divisions && isObject(next.divisions)) {
    ['division1', 'division2', 'division3', 'division4', 'division5'].forEach((key) => {
      if (next.divisions[key] && typeof next.divisions[key].image === 'string') {
        next.divisions[key].image = resolveCmsAssetUrl(next.divisions[key].image);
      }
    });
  }
  if (next.hero && isObject(next.hero) && typeof next.hero.heroImage === 'string') {
    next.hero.heroImage = resolveCmsAssetUrl(next.hero.heroImage);
  }
  if (next.hero && isObject(next.hero) && Array.isArray(next.hero.heroSlides)) {
    next.hero.heroSlides = next.hero.heroSlides.map((slide) => {
      if (typeof slide === 'string') {
        const value = slide.trim();
        if (!value) return value;
        if (value.startsWith('video:')) return `video:${resolveCmsAssetUrl(value.slice(6).trim())}`;
        if (value.startsWith('image:')) return `image:${resolveCmsAssetUrl(value.slice(6).trim())}`;
        return resolveCmsAssetUrl(value);
      }
      if (isObject(slide)) {
        return { ...slide, url: resolveCmsAssetUrl(slide.url || '') };
      }
      return slide;
    });
  }
  if (next.events && isObject(next.events) && Array.isArray(next.events.blogs)) {
    next.events.blogs = next.events.blogs.map((item) => ({
      ...item,
      image: resolveCmsAssetUrl(item?.image || '')
    }));
  }

  return next;
};

const getSupabaseConfig = () => {
  const cfg = window.CADSYENT_SUPABASE || {};
  return {
    url: typeof cfg.url === 'string' ? cfg.url.trim().replace(/\/+$/, '') : '',
    anonKey: typeof cfg.anonKey === 'string' ? cfg.anonKey.trim() : '',
    bucket: typeof cfg.bucket === 'string' ? cfg.bucket.trim() : 'cadsyent-cms'
  };
};

const hasSupabaseConfig = () => {
  const cfg = getSupabaseConfig();
  return Boolean(cfg.url && cfg.anonKey);
};

const getAuthSession = () => {
  const raw = localStorage.getItem(CADSYENT_AUTH_STORAGE_KEY);
  return raw ? safeParse(raw) : null;
};

const setAuthSession = (session) => {
  if (!session) return;
  const normalized = { ...session };
  if (!normalized.expires_at && typeof normalized.expires_in === 'number') {
    normalized.expires_at = nowSeconds() + Math.max(0, normalized.expires_in - 30);
  }
  localStorage.setItem(CADSYENT_AUTH_STORAGE_KEY, JSON.stringify(normalized));
};

const clearAuthSession = () => localStorage.removeItem(CADSYENT_AUTH_STORAGE_KEY);
const getAuthToken = () => {
  const session = getAuthSession();
  return session && typeof session.access_token === 'string' ? session.access_token : '';
};

const isAdminAuthenticated = () => {
  const session = getAuthSession();
  if (!session || typeof session.access_token !== 'string') return false;
  if (!session.expires_at) return true;
  return session.expires_at > nowSeconds();
};

const refreshAdminSession = async () => {
  const session = getAuthSession();
  const refreshToken = session && typeof session.refresh_token === 'string' ? session.refresh_token : '';
  if (!refreshToken) {
    clearAuthSession();
    return false;
  }

  const { url, anonKey } = getSupabaseConfig();
  const response = await fetch(`${url}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ refresh_token: refreshToken })
  });

  if (!response.ok) {
    clearAuthSession();
    return false;
  }

  const nextSession = await response.json();
  setAuthSession(nextSession);
  return true;
};

const ensureAdminSession = async () => {
  const session = getAuthSession();
  if (!session) return false;
  if (!session.expires_at || session.expires_at > nowSeconds()) return true;
  return refreshAdminSession();
};

const signInAdmin = async (email, password) => {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) throw new Error('Supabase config missing. Set url and anonKey first.');

  const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) throw new Error(`Sign-in failed: ${await response.text()}`);
  const session = await response.json();
  setAuthSession(session);
  return session;
};

const sendPasswordReset = async (email, redirectTo = '') => {
  const { url, anonKey } = getSupabaseConfig();
  const response = await fetch(`${url}/auth/v1/recover`, {
    method: 'POST',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, redirect_to: redirectTo || undefined })
  });
  if (!response.ok) throw new Error(`Password reset failed: ${await response.text()}`);
  return true;
};

const signOutEverywhere = async () => {
  const { url, anonKey } = getSupabaseConfig();
  const token = getAuthToken();
  if (token) {
    await fetch(`${url}/auth/v1/logout?scope=global`, {
      method: 'POST',
      headers: { apikey: anonKey, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    });
  }
  clearAuthSession();
};

const requestSupabase = async (path, options = {}, useAdminToken = false) => {
  const { url, anonKey } = getSupabaseConfig();
  let token = anonKey;
  if (useAdminToken) {
    const ready = await ensureAdminSession();
    if (!ready) throw new Error('Admin session expired. Please sign in again.');
    token = getAuthToken();
  }
  const response = await fetch(`${url}${path}`, {
    ...options,
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  if (!response.ok) throw new Error(`Supabase request failed (${response.status}): ${await response.text()}`);
  const text = await response.text();
  return text ? safeParse(text) : null;
};

const loadContentFromLocal = () => {
  const raw = localStorage.getItem(CADSYENT_CMS_STORAGE_KEY);
  const parsed = raw ? safeParse(raw) : null;
  return deepMerge(deepClone(CADSYENT_CMS_DEFAULTS), parsed || {});
};

const saveContentToLocal = (content) => {
  const merged = deepMerge(deepClone(CADSYENT_CMS_DEFAULTS), content || {});
  localStorage.setItem(CADSYENT_CMS_STORAGE_KEY, JSON.stringify(merged));
  return merged;
};

const resetContentLocal = () => {
  localStorage.removeItem(CADSYENT_CMS_STORAGE_KEY);
  return loadContentFromLocal();
};

const loadContentFromSupabase = async () => {
  const rows = await requestSupabase(
    `/rest/v1/${CADSYENT_SUPABASE_TABLE}?id=eq.${encodeURIComponent(CADSYENT_CMS_ROW_ID)}&select=content&limit=1`,
    { method: 'GET', headers: { 'Cache-Control': 'no-cache' } },
    false
  );
  const row = Array.isArray(rows) && rows.length ? rows[0] : null;
  const content = row && isObject(row.content) ? row.content : {};
  return deepMerge(deepClone(CADSYENT_CMS_DEFAULTS), content);
};

const saveContentToSupabase = async (content) => {
  const merged = deepMerge(deepClone(CADSYENT_CMS_DEFAULTS), content || {});
  await requestSupabase(`/rest/v1/${CADSYENT_SUPABASE_TABLE}`, {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify([{ id: CADSYENT_CMS_ROW_ID, content: merged }])
  }, true);
  return merged;
};

const loadContent = async () => {
  if (hasSupabaseConfig()) {
    try {
      const remote = await loadContentFromSupabase();
      localStorage.setItem(CADSYENT_CMS_STORAGE_KEY, JSON.stringify(remote));
      return remote;
    } catch {
      return loadContentFromLocal();
    }
  }
  return loadContentFromLocal();
};

const saveContent = async (content, options = {}) => {
  const allowLocalFallback = options.allowLocalFallback !== false;
  if (hasSupabaseConfig()) {
    try {
      const remoteSaved = await saveContentToSupabase(content);
      localStorage.setItem(CADSYENT_CMS_STORAGE_KEY, JSON.stringify(remoteSaved));
      return remoteSaved;
    } catch (error) {
      if (!allowLocalFallback) throw error;
      return saveContentToLocal(content);
    }
  }
  return saveContentToLocal(content);
};

const resetContent = async (options = {}) => {
  const allowLocalFallback = options.allowLocalFallback !== false;
  if (hasSupabaseConfig()) {
    const defaults = deepClone(CADSYENT_CMS_DEFAULTS);
    try {
      const remoteSaved = await saveContentToSupabase(defaults);
      localStorage.setItem(CADSYENT_CMS_STORAGE_KEY, JSON.stringify(remoteSaved));
      return remoteSaved;
    } catch (error) {
      if (!allowLocalFallback) throw error;
      return resetContentLocal();
    }
  }
  return resetContentLocal();
};

const verifyPublicContentReadable = async () => {
  if (!hasSupabaseConfig()) return true;
  try {
    await requestSupabase(
      `/rest/v1/${CADSYENT_SUPABASE_TABLE}?id=eq.${encodeURIComponent(CADSYENT_CMS_ROW_ID)}&select=id&limit=1`,
      { method: 'GET', headers: { 'Cache-Control': 'no-cache' } },
      false
    );
    return true;
  } catch (error) {
    throw new Error(`Public read check failed: ${error.message}`);
  }
};

const uploadImageToSupabase = async (file, keyHint = 'image') => {
  const { url, anonKey, bucket } = getSupabaseConfig();
  const ready = await ensureAdminSession();
  if (!ready) throw new Error('Admin session expired. Please sign in again.');
  const token = getAuthToken();

  const ext = (file.name.includes('.') ? file.name.split('.').pop() : 'jpg').toLowerCase();
  const safeHint = slugify(keyHint || 'image') || 'image';
  const path = `cms/${safeHint}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const response = await fetch(`${url}/storage/v1/object/${bucket}/${path}`, {
    method: 'POST',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
      'x-upsert': 'true',
      'Content-Type': file.type || 'application/octet-stream'
    },
    body: file
  });
  if (!response.ok) {
    const raw = await response.text();
    if (response.status === 413) {
      throw new Error('Upload failed: file is too large for the current Supabase bucket size limit. Compress the video or increase the bucket file size limit in Supabase Storage settings.');
    }
    throw new Error(`Image upload failed (${response.status}): ${raw}`);
  }
  const publicUrl = `${url}/storage/v1/object/public/${bucket}/${path}`;

  // Prefer a long-lived signed URL so images still render when bucket is private.
  try {
    const signResponse = await fetch(`${url}/storage/v1/object/sign/${bucket}/${path}`, {
      method: 'POST',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ expiresIn: 60 * 60 * 24 * 365 * 5 })
    });
    if (signResponse.ok) {
      const signed = await signResponse.json();
      const maybeSigned = (signed && (signed.signedURL || signed.signedUrl || signed.url)) || '';
      if (typeof maybeSigned === 'string' && maybeSigned.trim()) {
        return toAbsoluteSupabaseUrl(url, maybeSigned);
      }
    }
  } catch {
    // Fall back to public URL if signing fails for any reason.
  }

  return publicUrl;
};

const setText = (selector, value) => {
  const el = document.querySelector(selector);
  if (el && typeof value === 'string') el.textContent = value;
};
const setLink = (selector, href) => {
  const el = document.querySelector(selector);
  if (el && typeof href === 'string' && href.trim()) el.setAttribute('href', href);
};
const setPhoneLink = (selector, number) => {
  const el = document.querySelector(selector);
  if (!el) return;
  const clean = typeof number === 'string' ? number.replace(/[^\d+]/g, '') : '';
  if (clean) el.setAttribute('href', `tel:${clean}`);
};

const normalizeCardUrl = (value = '') => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://${raw}`;
};

const setCardLink = (target, url) => {
  const card = typeof target === 'string' ? document.querySelector(target) : target;
  if (!card) return;
  const href = normalizeCardUrl(url);
  if (!href) {
    card.classList.remove('is-linked');
    card.removeAttribute('role');
    card.removeAttribute('tabindex');
    card.removeAttribute('aria-label');
    card.removeAttribute('data-href');
    return;
  }

  card.classList.add('is-linked');
  card.setAttribute('role', 'link');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', 'Open talent link');
  card.setAttribute('data-href', href);

  if (card.dataset.linkBound === '1') return;
  card.dataset.linkBound = '1';
  card.addEventListener('click', (event) => {
    const target = event.target;
    if (target && target.closest('a, button, input, textarea, select')) return;
    const nextHref = card.getAttribute('data-href');
    if (nextHref) window.location.assign(nextHref);
  });
  card.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    const nextHref = card.getAttribute('data-href');
    if (nextHref) window.location.assign(nextHref);
  });
};

const getTalentCards = (fashion = {}) => {
  const fixImageUrl = (value) => {
    const raw = resolveCmsAssetUrl(value);
    if (!raw) return '';
    const match = raw.match(/(https?:\/\/[^"'\s]+?supabase\.co)(https?:\/\/[^"'\s]+)$/i);
    if (match && match[2]) return match[2];
    return raw;
  };
  const toCard = (item, index) => ({
    id: String(item?.id || `talent-${index + 1}`),
    title: String(item?.title || ''),
    body: String(item?.body || ''),
    image: fixImageUrl(item?.image),
    url: String(item?.url || '')
  });
  const fromList = Array.isArray(fashion.cards) ? fashion.cards.map((item, index) => toCard(item, index)) : [];
  if (fromList.length) return fromList;
  return [fashion.card1, fashion.card2, fashion.card3]
    .map((item, index) => toCard(item, index))
    .filter((item) => item.title || item.body || item.image || item.url);
};

const renderTalentCards = (fashion = {}) => {
  const grid = document.querySelector('.fashion-grid');
  if (!grid) return;

  const maxItems = Number.parseInt(grid.dataset.maxItems || '', 10);
  const cards = getTalentCards(fashion);
  const visibleCards = Number.isFinite(maxItems) && maxItems > 0
    ? cards.slice(0, maxItems)
    : cards;
  grid.innerHTML = '';

  visibleCards.forEach((item, index) => {
    const article = document.createElement('article');
    article.className = 'feature-card';

    const image = document.createElement('div');
    image.className = `feature-image image-${((index % 3) + 1)}`;
    if (item.image) {
      image.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.28)), url("${item.image}")`;
      image.style.backgroundSize = 'cover';
      image.style.backgroundPosition = 'center 18%';
    }

    const title = document.createElement('h3');
    title.textContent = item.title || '';

    const body = document.createElement('p');
    body.textContent = item.body || '';

    article.append(image, title, body);
    setCardLink(article, item.url);
    grid.appendChild(article);
  });
};

const setBrandIdentity = (brandName, brandLogo) => {
  const label = typeof brandName === 'string' && brandName.trim() ? brandName.trim() : 'Cadsy Brown Entertainment';
  const logoUrl = typeof brandLogo === 'string' ? resolveCmsAssetUrl(brandLogo) : '';
  document.querySelectorAll('.brand, .menu-brand').forEach((el) => {
    el.innerHTML = '';
    if (logoUrl) {
      const img = document.createElement('img');
      img.className = 'brand-logo-image';
      img.src = logoUrl;
      img.alt = `${label} logo`;
      el.appendChild(img);
      el.classList.add('has-brand-logo');
      return;
    }
    el.textContent = label;
    el.classList.remove('has-brand-logo');
  });
};
const setOverlayImage = (selector, imageData, fallbackClass = '') => {
  const el = document.querySelector(selector);
  if (!el) return;
  const isTalentFeature = /^#feature-image-\d+$/.test(selector);
  const preferredPosition = isTalentFeature ? 'center 18%' : 'center';
  if (typeof imageData === 'string' && imageData.trim()) {
    el.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.24), rgba(0, 0, 0, 0.5)), url("${imageData}")`;
    el.style.backgroundSize = 'cover';
    el.style.backgroundPosition = preferredPosition;
    return;
  }
  el.style.backgroundImage = '';
  el.style.backgroundSize = '';
  el.style.backgroundPosition = '';
  if (fallbackClass) {
    el.classList.add(fallbackClass);
  }
};

const setDivisionHoverImage = (selector, imageData) => {
  const el = document.querySelector(selector);
  if (!el) return;
  const item = el.closest('.division-item');
  const hasImage = typeof imageData === 'string' && imageData.trim();
  if (item) item.classList.toggle('has-hover-media', Boolean(hasImage));
  if (hasImage) {
    el.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.36)), url("${imageData}")`;
    el.style.backgroundSize = 'cover';
    el.style.backgroundPosition = 'center 18%';
    return;
  }
  el.style.backgroundImage = '';
  el.style.backgroundSize = '';
  el.style.backgroundPosition = '';
};

const isLikelyVideoUrl = (value = '') => {
  const clean = String(value || '').trim().toLowerCase();
  return /\.(mp4|webm|ogg|mov)(\?|#|$)/.test(clean) || clean.includes('/video/');
};

const normalizeHeroSlides = (hero = {}) => {
  const parseSlide = (raw) => {
    if (!raw) return null;
    if (typeof raw === 'string') {
      const value = raw.trim();
      if (!value) return null;
      if (value.startsWith('video:')) return { type: 'video', url: resolveCmsAssetUrl(value.slice(6).trim()) };
      if (value.startsWith('image:')) return { type: 'image', url: resolveCmsAssetUrl(value.slice(6).trim()) };
      return { type: isLikelyVideoUrl(value) ? 'video' : 'image', url: resolveCmsAssetUrl(value) };
    }
    if (!isObject(raw)) return null;
    const url = typeof raw.url === 'string' ? raw.url.trim() : '';
    if (!url) return null;
    const type = raw.type === 'video' || raw.type === 'image'
      ? raw.type
      : (isLikelyVideoUrl(url) ? 'video' : 'image');
    return { type, url: resolveCmsAssetUrl(url) };
  };

  const slideList = Array.isArray(hero.heroSlides) ? hero.heroSlides : [];
  const normalizedSlides = slideList.map(parseSlide).filter((item) => item && item.url);
  if (normalizedSlides.length) return normalizedSlides;

  const fallback = parseSlide(hero.heroImage);
  return fallback && fallback.url ? [fallback] : [];
};

const setHeroMedia = (selector, hero = {}) => {
  const el = document.querySelector(selector);
  if (!el) return;

  if (el._cadsyentHeroTimer) {
    clearInterval(el._cadsyentHeroTimer);
    el._cadsyentHeroTimer = null;
  }
  el.querySelectorAll('video').forEach((video) => video.pause());
  el.innerHTML = '';
  el.classList.remove('has-hero-slides');

  const slides = normalizeHeroSlides(hero);
  if (!slides.length) {
    el.style.backgroundImage = '';
    el.style.backgroundSize = '';
    el.style.backgroundPosition = '';
    return;
  }

  if (slides.length === 1 && slides[0].type === 'image') {
    el.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.24), rgba(0, 0, 0, 0.5)), url("${slides[0].url}")`;
    el.style.backgroundSize = 'cover';
    el.style.backgroundPosition = 'center';
    return;
  }

  el.style.backgroundImage = '';
  el.style.backgroundSize = '';
  el.style.backgroundPosition = '';
  el.classList.add('has-hero-slides');

  const stage = document.createElement('div');
  stage.className = 'hero-media-stage';

  const slideElements = slides.map((slide, index) => {
    const layer = document.createElement('div');
    layer.className = `hero-media-slide${index === 0 ? ' is-active' : ''}`;
    if (slide.type === 'video') {
      const video = document.createElement('video');
      video.className = 'hero-media-asset';
      video.src = slide.url;
      video.muted = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.loop = slides.length === 1;
      if (index === 0) {
        video.autoplay = true;
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') playPromise.catch(() => {});
      }
      layer.appendChild(video);
    } else {
      const image = document.createElement('img');
      image.className = 'hero-media-asset';
      image.src = slide.url;
      image.alt = '';
      layer.appendChild(image);
    }
    stage.appendChild(layer);
    return layer;
  });

  el.appendChild(stage);
  if (slideElements.length <= 1) return;

  let activeIndex = 0;
  const activateSlide = (index) => {
    slideElements.forEach((slideEl, slideIndex) => {
      const active = slideIndex === index;
      slideEl.classList.toggle('is-active', active);
      const video = slideEl.querySelector('video');
      if (!video) return;
      if (active) {
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') playPromise.catch(() => {});
      } else {
        video.pause();
      }
    });
  };

  el._cadsyentHeroTimer = window.setInterval(() => {
    activeIndex = (activeIndex + 1) % slideElements.length;
    activateSlide(activeIndex);
  }, 6500);
};

const renderEventsModules = (content) => {
  const newsList = document.querySelector('#news-list');
  const blogsList = document.querySelector('#blogs-list');
  const testimonialsTrack = document.querySelector('#testimonials-track');
  if (!newsList && !blogsList && !testimonialsTrack) return;

  const newsItems = (content.events?.news || []).filter((item) => item && item.published !== false);
  const blogItems = (content.events?.blogs || []).filter((item) => item && item.published !== false);
  const testimonialItems = (content.events?.testimonials || []).filter((item) => item && item.published !== false);

  if (newsList) {
    newsList.innerHTML = '';
    newsItems.forEach((item) => {
      const article = document.createElement('article');
      article.className = 'division-item';
      article.innerHTML = `<h3>${item.title || ''}</h3><p>${item.body || ''}</p>`;
      newsList.appendChild(article);
    });
  }

  if (blogsList) {
    blogsList.innerHTML = '';
    blogItems.forEach((item, index) => {
      const article = document.createElement('article');
      article.className = 'feature-card';
      const image = document.createElement('div');
      image.className = `feature-image image-${((index % 3) + 1)}`;
      if (item.image) {
        image.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.5)), url("${item.image}")`;
        image.style.backgroundSize = 'cover';
        image.style.backgroundPosition = 'center';
      }
      const title = document.createElement('h3');
      title.textContent = item.title || '';
      const body = document.createElement('p');
      body.textContent = item.body || '';
      article.append(image, title, body);
      blogsList.appendChild(article);
    });
  }

  if (testimonialsTrack) {
    testimonialsTrack.innerHTML = '';
    const feed = testimonialItems.length ? testimonialItems : [];
    const doubled = feed.concat(feed);
    doubled.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'testimonial-card';
      card.innerHTML = `
        <div class="testimonial-profile">
          <span class="testimonial-avatar">${item.initials || 'TM'}</span>
          <div>
            <h3>${item.name || ''}</h3>
            <p>${item.role || ''}</p>
          </div>
        </div>
        <p class="testimonial-text">"${item.feedback || ''}"</p>
      `;
      testimonialsTrack.appendChild(card);
    });
  }
};

const applyContent = (content = deepClone(CADSYENT_CMS_DEFAULTS)) => {
  const merged = normalizeMissionContent(deepMerge(deepClone(CADSYENT_CMS_DEFAULTS), content || {}));
  setBrandIdentity(merged.brandName, merged.brandLogo);
  setLink('#social-instagram', merged.social.instagramUrl);
  setLink('#social-tiktok', merged.social.tiktokUrl);
  setLink('#social-linkedin', merged.social.linkedinUrl);
  setText('#hero-kicker', merged.hero.kicker);
  const line1 = document.querySelector('#hero-title-line-1');
  const line2 = document.querySelector('#hero-title-line-2');
  if (line1) line1.dataset.text = merged.hero.titleLine1;
  if (line2) line2.dataset.text = merged.hero.titleLine2;
  setText('#hero-meta-1', merged.hero.meta1);
  setText('#hero-meta-2', merged.hero.meta2);
  setHeroMedia('.hero-media', merged.hero);
  setText('#fashion-lead', merged.fashion.lead);
  renderTalentCards(merged.fashion);
  setText('#division-title-1', merged.divisions.division1.title);
  setText('#division-body-1', merged.divisions.division1.body);
  setDivisionHoverImage('#division-image-1', merged.divisions.division1.image);
  setText('#division-title-2', merged.divisions.division2.title);
  setText('#division-body-2', merged.divisions.division2.body);
  setDivisionHoverImage('#division-image-2', merged.divisions.division2.image);
  setText('#division-title-3', merged.divisions.division3.title);
  setText('#division-body-3', merged.divisions.division3.body);
  setDivisionHoverImage('#division-image-3', merged.divisions.division3.image);
  setText('#division-title-4', merged.divisions.division4.title);
  setText('#division-body-4', merged.divisions.division4.body);
  setDivisionHoverImage('#division-image-4', merged.divisions.division4.image);
  setText('#division-title-5', merged.divisions.division5.title);
  setText('#division-body-5', merged.divisions.division5.body);
  setDivisionHoverImage('#division-image-5', merged.divisions.division5.image);
  setText('#contact-email-link', merged.contact.email);
  setLink('#contact-email-link', `mailto:${merged.contact.email}`);
  setText('#contact-phone-link', merged.contact.phone);
  setPhoneLink('#contact-phone-link', merged.contact.phoneHref || merged.contact.phone);
  setText('#contact-address-text', merged.contact.address);
  setText('#footer-copy', merged.footer.copy);
  renderEventsModules(merged);
  window.dispatchEvent(new CustomEvent('cadsyent:content-applied', { detail: merged }));
  return merged;
};

const getStorageMode = () => (hasSupabaseConfig() ? 'supabase+local-fallback' : 'local-only');

window.CadsyentCMS = {
  storageKey: CADSYENT_CMS_STORAGE_KEY,
  defaults: deepClone(CADSYENT_CMS_DEFAULTS),
  loadContent,
  saveContent,
  resetContent,
  applyContent,
  getStorageMode,
  verifyPublicContentReadable,
  signInAdmin,
  sendPasswordReset,
  signOutEverywhere,
  isAdminAuthenticated,
  ensureAdminSession,
  uploadImageToSupabase
};

const applyOnReady = async () => {
  if (!document.querySelector('body')) return;
  const content = await loadContent();
  applyContent(content);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => applyOnReady(), { once: true });
} else {
  applyOnReady();
}



