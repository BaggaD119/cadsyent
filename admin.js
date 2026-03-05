const cmsApi = window.CadsyentCMS || {
  signInAdmin: async () => { throw new Error('CMS failed to load. Hard refresh this page and try again.'); },
  ensureAdminSession: async () => false,
  isAdminAuthenticated: () => false,
  sendPasswordReset: async () => { throw new Error('CMS failed to load. Hard refresh this page and try again.'); },
  signOutEverywhere: async () => {},
  saveContent: async () => { throw new Error('CMS failed to load. Hard refresh this page and try again.'); },
  resetContent: async () => { throw new Error('CMS failed to load. Hard refresh this page and try again.'); },
  loadContent: async () => { throw new Error('CMS failed to load. Hard refresh this page and try again.'); },
  uploadImageToSupabase: async () => { throw new Error('CMS failed to load. Hard refresh this page and try again.'); }
};

const sections = [
  { id: 'brand-hero', title: 'Brand and Hero', fields: [
    { key: 'brandName', label: 'Brand Name', type: 'text' },
    { key: 'brandLogo', label: 'Brand Logo', type: 'image' },
    { key: 'preloader.media', label: 'Preloader Media (Video/Image)', type: 'media' },
    { key: 'hero.kicker', label: 'Hero Kicker', type: 'text' },
    { key: 'hero.titleLine1', label: 'Hero Title Line 1', type: 'text' },
    { key: 'hero.titleLine2', label: 'Hero Title Line 2', type: 'text' },
    { key: 'hero.meta1', label: 'Hero Meta 1', type: 'text' },
    { key: 'hero.meta2', label: 'Hero Meta 2', type: 'text' },
    { key: 'hero.heroSlides', label: 'Hero Background Media (Images/Videos)', type: 'media-list' }
  ]},
  { id: 'social', title: 'Social Links', fields: [
    { key: 'social.instagramUrl', label: 'Instagram URL', type: 'url' },
    { key: 'social.tiktokUrl', label: 'TikTok URL', type: 'url' },
    { key: 'social.linkedinUrl', label: 'LinkedIn URL', type: 'url' }
  ]},
  { id: 'fashion', title: 'Talent Section', fields: [
    { key: 'fashion.lead', label: 'Talent Lead Text', type: 'textarea' },
    { key: 'fashion.card1.title', label: 'Card 1 Title', type: 'text' },
    { key: 'fashion.card1.body', label: 'Card 1 Description', type: 'textarea' },
    { key: 'fashion.card1.image', label: 'Card 1 Photo', type: 'image' },
    { key: 'fashion.card1.url', label: 'Card 1 Link URL', type: 'url' },
    { key: 'fashion.card2.title', label: 'Card 2 Title', type: 'text' },
    { key: 'fashion.card2.body', label: 'Card 2 Description', type: 'textarea' },
    { key: 'fashion.card2.image', label: 'Card 2 Photo', type: 'image' },
    { key: 'fashion.card2.url', label: 'Card 2 Link URL', type: 'url' },
    { key: 'fashion.card3.title', label: 'Card 3 Title', type: 'text' },
    { key: 'fashion.card3.body', label: 'Card 3 Description', type: 'textarea' },
    { key: 'fashion.card3.image', label: 'Card 3 Photo', type: 'image' },
    { key: 'fashion.card3.url', label: 'Card 3 Link URL', type: 'url' }
  ]},
  { id: 'divisions', title: 'Divisions', fields: [
    { key: 'divisions.division1.title', label: 'Division 1 Title', type: 'text' },
    { key: 'divisions.division1.body', label: 'Division 1 Description', type: 'textarea' },
    { key: 'divisions.division1.image', label: 'Division 1 Hover Image', type: 'image' },
    { key: 'divisions.division2.title', label: 'Division 2 Title', type: 'text' },
    { key: 'divisions.division2.body', label: 'Division 2 Description', type: 'textarea' },
    { key: 'divisions.division2.image', label: 'Division 2 Hover Image', type: 'image' },
    { key: 'divisions.division3.title', label: 'Division 3 Title', type: 'text' },
    { key: 'divisions.division3.body', label: 'Division 3 Description', type: 'textarea' },
    { key: 'divisions.division3.image', label: 'Division 3 Hover Image', type: 'image' },
    { key: 'divisions.division4.title', label: 'Division 4 Title', type: 'text' },
    { key: 'divisions.division4.body', label: 'Division 4 Description', type: 'textarea' },
    { key: 'divisions.division4.image', label: 'Division 4 Hover Image', type: 'image' },
    { key: 'divisions.division5.title', label: 'Division 5 Title', type: 'text' },
    { key: 'divisions.division5.body', label: 'Division 5 Description', type: 'textarea' },
    { key: 'divisions.division5.image', label: 'Division 5 Hover Image', type: 'image' }
  ]},
  { id: 'events-modules', title: 'Events Modules', fields: [] },
  { id: 'contact-footer', title: 'Contact and Footer', fields: [
    { key: 'contact.email', label: 'Email', type: 'text' },
    { key: 'contact.phone', label: 'Phone (display text)', type: 'text' },
    { key: 'contact.phoneHref', label: 'Phone Link Value (digits)', type: 'text' },
    { key: 'contact.address', label: 'Address', type: 'text' },
    { key: 'footer.copy', label: 'Footer Copyright', type: 'text' }
  ]}
];

const authForm = document.querySelector('#admin-auth-form');
const signinButton = document.querySelector('#admin-signin');
const emailInput = document.querySelector('#admin-email');
const passwordInput = document.querySelector('#admin-password');
const resetPasswordBtn = document.querySelector('#admin-reset-password');
const signoutButton = document.querySelector('#admin-signout');
const form = document.querySelector('#admin-form');
const fieldsRoot = document.querySelector('#admin-fields');
const categoriesRoot = document.querySelector('#admin-categories');
const sectionTitleEl = document.querySelector('#admin-section-title');
const resetButton = document.querySelector('#admin-reset');
const statusEl = document.querySelector('#admin-status');

let draftContent = null;
let activeSectionId = sections[0].id;
const imageState = {};
const DEFAULT_ADMIN_EMAIL = 'info@cadsybrownent.com';
const DEFAULT_ADMIN_PASSWORD = '@CadsyBrownOfficial1';

const uid = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const getByPath = (obj, path) => path.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), obj);
const setByPath = (obj, path, value) => {
  const parts = path.split('.');
  let cursor = obj;
  for (let i = 0; i < parts.length - 1; i += 1) {
    if (!cursor[parts[i]] || typeof cursor[parts[i]] !== 'object') cursor[parts[i]] = {};
    cursor = cursor[parts[i]];
  }
  cursor[parts[parts.length - 1]] = value;
};

const ensureEventsModules = () => {
  if (!draftContent.events) draftContent.events = {};
  if (!Array.isArray(draftContent.events.news)) draftContent.events.news = [];
  if (!Array.isArray(draftContent.events.blogs)) draftContent.events.blogs = [];
  if (!Array.isArray(draftContent.events.testimonials)) draftContent.events.testimonials = [];
};

const normalizeHeroMediaDraft = () => {
  if (!draftContent.hero || typeof draftContent.hero !== 'object') draftContent.hero = {};
  if (!Array.isArray(draftContent.hero.heroSlides)) draftContent.hero.heroSlides = [];
  if (!draftContent.hero.heroSlides.length && typeof draftContent.hero.heroImage === 'string' && draftContent.hero.heroImage.trim()) {
    draftContent.hero.heroSlides = [draftContent.hero.heroImage.trim()];
  }
};

const renderStatus = (message, isError = false) => {
  if (!statusEl) {
    if (isError && typeof window !== 'undefined' && typeof window.alert === 'function') {
      window.alert(message);
    }
    return;
  }
  statusEl.textContent = message;
  statusEl.classList.toggle('is-error', isError);
};

const ensureAuthOrFail = async () => {
  const ok = await cmsApi.ensureAdminSession();
  if (!ok) {
    renderAuthState();
    throw new Error('Session expired. Please sign in again.');
  }
  return true;
};

const renderAuthState = () => {
  const isAuthed = cmsApi.isAdminAuthenticated();
  form.classList.toggle('admin-locked', !isAuthed);
  signoutButton.disabled = !isAuthed;
};

const createInput = (field, initialValue) => {
  const wrapper = document.createElement('label');
  wrapper.className = 'admin-field';
  wrapper.setAttribute('for', field.key);
  const label = document.createElement('span');
  label.className = 'admin-label';
  label.textContent = field.label;
  wrapper.appendChild(label);

  if (field.type === 'textarea') {
    const textarea = document.createElement('textarea');
    textarea.id = field.key;
    textarea.className = 'admin-input';
    textarea.rows = 4;
    textarea.value = String(initialValue || '');
    textarea.addEventListener('input', () => setByPath(draftContent, field.key, textarea.value));
    wrapper.appendChild(textarea);
    return wrapper;
  }

  if (field.type === 'image') {
    imageState[field.key] = String(initialValue || '');
    const row = document.createElement('div');
    row.className = 'admin-image-row';
    const input = document.createElement('input');
    input.className = 'admin-input';
    input.type = 'file';
    input.accept = 'image/*';
    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'admin-btn admin-btn-tertiary';
    clearBtn.textContent = 'Remove';
    const preview = document.createElement('img');
    preview.className = 'admin-image-preview';
    preview.hidden = !imageState[field.key];
    if (imageState[field.key]) preview.src = imageState[field.key];

    input.addEventListener('change', async (event) => {
      const [file] = event.target.files || [];
      if (!file) return;
      try {
        await ensureAuthOrFail();
        renderStatus(`Uploading ${field.label}...`);
        const url = await cmsApi.uploadImageToSupabase(file, field.key);
        imageState[field.key] = url;
        setByPath(draftContent, field.key, url);
        preview.src = url;
        preview.hidden = false;
        renderStatus(`${field.label} uploaded. Save to publish.`);
      } catch (error) {
        renderStatus(error.message, true);
      }
    });

    clearBtn.addEventListener('click', () => {
      imageState[field.key] = '';
      setByPath(draftContent, field.key, '');
      preview.src = '';
      preview.hidden = true;
      input.value = '';
      renderStatus(`${field.label} removed. Save to publish.`);
    });

    row.append(input, clearBtn);
    wrapper.append(row, preview);
    return wrapper;
  }

  if (field.type === 'media') {
    imageState[field.key] = String(initialValue || '');
    const row = document.createElement('div');
    row.className = 'admin-image-row';

    const urlInput = document.createElement('input');
    urlInput.className = 'admin-input';
    urlInput.type = 'text';
    urlInput.placeholder = 'https://...mp4 or https://...jpg';
    urlInput.value = imageState[field.key];

    const fileInput = document.createElement('input');
    fileInput.className = 'admin-input';
    fileInput.type = 'file';
    fileInput.accept = 'image/*,video/*';

    const uploadBtn = document.createElement('button');
    uploadBtn.type = 'button';
    uploadBtn.className = 'admin-btn';
    uploadBtn.textContent = 'Upload';

    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'admin-btn admin-btn-tertiary';
    clearBtn.textContent = 'Remove';

    const imagePreview = document.createElement('img');
    imagePreview.className = 'admin-image-preview';
    const videoPreview = document.createElement('video');
    videoPreview.className = 'admin-image-preview';
    videoPreview.muted = true;
    videoPreview.loop = true;
    videoPreview.playsInline = true;

    const renderPreview = (url) => {
      const clean = String(url || '').trim();
      if (!clean) {
        imagePreview.hidden = true;
        imagePreview.src = '';
        videoPreview.hidden = true;
        videoPreview.pause();
        videoPreview.src = '';
        return;
      }
      // Check if URL is likely a video
      const isVideo = /\.(mp4|webm|ogg|mov)(\?|#|$)/i.test(clean) || clean.includes('/video/');
      if (isVideo) {
        imagePreview.hidden = true;
        imagePreview.src = '';
        videoPreview.hidden = false;
        videoPreview.src = clean;
        const playPromise = videoPreview.play();
        if (playPromise && typeof playPromise.catch === 'function') playPromise.catch(() => {});
      } else {
        videoPreview.hidden = true;
        videoPreview.pause();
        videoPreview.src = '';
        imagePreview.hidden = false;
        imagePreview.src = clean;
      }
    };

    const applyMediaValue = (url) => {
      imageState[field.key] = url;
      setByPath(draftContent, field.key, url);
      urlInput.value = url;
      renderPreview(url);
    };

    urlInput.addEventListener('input', () => applyMediaValue(urlInput.value.trim()));

    uploadBtn.addEventListener('click', async () => {
      const [file] = fileInput.files || [];
      if (!file) {
        renderStatus('Select a media file first.', true);
        return;
      }
      try {
        await ensureAuthOrFail();
        renderStatus(`Uploading ${field.label}...`);
        const url = await cmsApi.uploadImageToSupabase(file, field.key);
        applyMediaValue(url);
        fileInput.value = '';
        renderStatus(`${field.label} uploaded. Save to publish.`);
      } catch (error) {
        renderStatus(error.message, true);
      }
    });

    clearBtn.addEventListener('click', () => {
      fileInput.value = '';
      applyMediaValue('');
      renderStatus(`${field.label} removed. Save to publish.`);
    });

    row.append(fileInput, uploadBtn, clearBtn);
    wrapper.append(urlInput, row, imagePreview, videoPreview);
    renderPreview(imageState[field.key]);
    return wrapper;
  }

  if (field.type === 'media-list') {
    const initialList = Array.isArray(initialValue)
      ? initialValue.filter(Boolean).map((item) => String(item).trim()).filter(Boolean)
      : [];
    const setListValue = (list) => setByPath(draftContent, field.key, list);
    setListValue(initialList);

    const helper = document.createElement('small');
    helper.className = 'admin-helper';
    helper.textContent = 'One URL per line. Optional prefixes: "video:" or "image:".';

    const textarea = document.createElement('textarea');
    textarea.id = field.key;
    textarea.className = 'admin-input';
    textarea.rows = 5;
    textarea.placeholder = 'https://...jpg\nvideo:https://...mp4';
    textarea.value = initialList.join('\n');
    textarea.addEventListener('input', () => {
      const list = textarea.value
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
      setListValue(list);
    });

    const row = document.createElement('div');
    row.className = 'admin-image-row';
    const input = document.createElement('input');
    input.className = 'admin-input';
    input.type = 'file';
    input.accept = 'image/*,video/*';
    const uploadBtn = document.createElement('button');
    uploadBtn.type = 'button';
    uploadBtn.className = 'admin-btn';
    uploadBtn.textContent = 'Upload and Add';
    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'admin-btn admin-btn-tertiary';
    clearBtn.textContent = 'Clear All';

    uploadBtn.addEventListener('click', async () => {
      const [file] = input.files || [];
      if (!file) {
        renderStatus('Select an image or video file first.', true);
        return;
      }
      try {
        await ensureAuthOrFail();
        renderStatus(`Uploading ${field.label}...`);
        const url = await cmsApi.uploadImageToSupabase(file, field.key);
        const list = textarea.value
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean);
        const prefix = file.type.startsWith('video/') ? 'video:' : '';
        list.push(`${prefix}${url}`);
        textarea.value = list.join('\n');
        setListValue(list);
        input.value = '';
        renderStatus(`${field.label} uploaded. Save to publish.`);
      } catch (error) {
        renderStatus(error.message, true);
      }
    });

    clearBtn.addEventListener('click', () => {
      textarea.value = '';
      setListValue([]);
      input.value = '';
      renderStatus(`${field.label} cleared. Save to publish.`);
    });

    row.append(input, uploadBtn, clearBtn);
    wrapper.append(helper, textarea, row);
    return wrapper;
  }

  const input = document.createElement('input');
  input.className = 'admin-input';
  input.type = field.type === 'url' ? 'url' : 'text';
  input.value = String(initialValue || '');
  input.addEventListener('input', () => setByPath(draftContent, field.key, input.value));
  wrapper.appendChild(input);
  return wrapper;
};

const createModuleCard = (groupName, item, index) => {
  const card = document.createElement('article');
  card.className = 'module-card';

  const header = document.createElement('div');
  header.className = 'module-card-head';
  header.innerHTML = `<strong>${groupName} Item ${index + 1}</strong>`;

  const toggleWrap = document.createElement('label');
  toggleWrap.className = 'module-toggle';
  const toggle = document.createElement('input');
  toggle.type = 'checkbox';
  toggle.checked = item.published !== false;
  const toggleText = document.createElement('span');
  toggleText.textContent = 'Published';
  toggle.addEventListener('change', () => { item.published = toggle.checked; });
  toggleWrap.append(toggle, toggleText);

  const actions = document.createElement('div');
  actions.className = 'module-actions';
  const up = document.createElement('button');
  up.type = 'button'; up.className = 'admin-btn'; up.textContent = 'Up';
  const down = document.createElement('button');
  down.type = 'button'; down.className = 'admin-btn'; down.textContent = 'Down';
  const del = document.createElement('button');
  del.type = 'button'; del.className = 'admin-btn'; del.textContent = 'Delete';
  actions.append(up, down, del);

  header.append(toggleWrap, actions);
  card.appendChild(header);

  const fields = document.createElement('div');
  fields.className = 'module-fields';
  const addField = (labelText, key, type = 'text') => {
    const label = document.createElement('label');
    label.className = 'admin-field';
    const title = document.createElement('span');
    title.className = 'admin-label';
    title.textContent = labelText;
    label.appendChild(title);
    const input = type === 'textarea' ? document.createElement('textarea') : document.createElement('input');
    input.className = 'admin-input';
    if (type === 'textarea') input.rows = 3;
    else input.type = 'text';
    input.value = item[key] || '';
    input.addEventListener('input', () => { item[key] = input.value; });
    label.appendChild(input);
    fields.appendChild(label);
  };

  if (groupName === 'News') {
    addField('Title', 'title');
    addField('Description', 'body', 'textarea');
  }
  if (groupName === 'Blogs') {
    addField('Title', 'title');
    addField('Description', 'body', 'textarea');
    addField('Image URL', 'image');

    const uploadWrap = document.createElement('div');
    uploadWrap.className = 'module-upload';
    const uploadInput = document.createElement('input');
    uploadInput.type = 'file';
    uploadInput.accept = 'image/*';
    uploadInput.className = 'admin-input';
    const uploadBtn = document.createElement('button');
    uploadBtn.type = 'button';
    uploadBtn.className = 'admin-btn';
    uploadBtn.textContent = 'Upload Image';
    uploadBtn.addEventListener('click', async () => {
      const [file] = uploadInput.files || [];
      if (!file) {
        renderStatus('Select an image file first.', true);
        return;
      }
      try {
        await ensureAuthOrFail();
        renderStatus('Uploading blog image...');
        const url = await cmsApi.uploadImageToSupabase(file, `${groupName}-${item.id}`);
        item.image = url;
        renderForm();
        renderStatus('Blog image uploaded.');
      } catch (error) {
        renderStatus(error.message, true);
      }
    });
    uploadWrap.append(uploadInput, uploadBtn);
    fields.appendChild(uploadWrap);
  }
  if (groupName === 'Testimonials') {
    addField('Name', 'name');
    addField('Role', 'role');
    addField('Initials', 'initials');
    addField('Feedback', 'feedback', 'textarea');
  }

  card.appendChild(fields);

  up.addEventListener('click', () => moveItem(groupName, index, -1));
  down.addEventListener('click', () => moveItem(groupName, index, 1));
  del.addEventListener('click', () => removeItem(groupName, index));
  return card;
};

const getGroupArray = (groupName) => {
  ensureEventsModules();
  if (groupName === 'News') return draftContent.events.news;
  if (groupName === 'Blogs') return draftContent.events.blogs;
  return draftContent.events.testimonials;
};

const moveItem = (groupName, index, delta) => {
  const arr = getGroupArray(groupName);
  const nextIndex = index + delta;
  if (nextIndex < 0 || nextIndex >= arr.length) return;
  const [item] = arr.splice(index, 1);
  arr.splice(nextIndex, 0, item);
  renderForm();
};

const removeItem = (groupName, index) => {
  const arr = getGroupArray(groupName);
  arr.splice(index, 1);
  renderForm();
};

const addItem = (groupName) => {
  const arr = getGroupArray(groupName);
  if (groupName === 'News') arr.push({ id: uid('news'), title: 'New Headline', body: 'Describe this news item.', published: true });
  if (groupName === 'Blogs') arr.push({ id: uid('blog'), title: 'New Blog', body: 'Blog summary goes here.', image: '', published: true });
  if (groupName === 'Testimonials') arr.push({ id: uid('tm'), name: 'Client Name', role: 'Role', initials: 'CL', feedback: 'Client feedback text.', published: true });
  renderForm();
};

const renderModulesEditor = () => {
  ensureEventsModules();
  const root = document.createElement('div');
  root.className = 'modules-editor';

  const buildGroup = (groupName, items) => {
    const section = document.createElement('section');
    section.className = 'module-group';
    const head = document.createElement('div');
    head.className = 'module-group-head';
    const title = document.createElement('h3');
    title.textContent = groupName;
    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'admin-btn admin-btn-primary';
    addBtn.textContent = `Add ${groupName.slice(0, -1)}`;
    addBtn.addEventListener('click', () => addItem(groupName));
    head.append(title, addBtn);
    section.appendChild(head);

    const list = document.createElement('div');
    list.className = 'module-list';
    items.forEach((item, index) => list.appendChild(createModuleCard(groupName, item, index)));
    if (!items.length) {
      const empty = document.createElement('p');
      empty.className = 'module-empty';
      empty.textContent = `No ${groupName.toLowerCase()} items yet.`;
      list.appendChild(empty);
    }
    section.appendChild(list);
    root.appendChild(section);
  };

  buildGroup('News', draftContent.events.news);
  buildGroup('Blogs', draftContent.events.blogs);
  buildGroup('Testimonials', draftContent.events.testimonials);
  fieldsRoot.appendChild(root);
};

const renderCategories = () => {
  categoriesRoot.innerHTML = '';
  sections.forEach((section) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'admin-category';
    btn.textContent = section.title;
    btn.setAttribute('aria-pressed', String(section.id === activeSectionId));
    if (section.id === activeSectionId) btn.classList.add('is-active');
    btn.addEventListener('click', () => { activeSectionId = section.id; renderForm(); });
    categoriesRoot.appendChild(btn);
  });
};

const renderForm = () => {
  if (!draftContent) return;
  fieldsRoot.innerHTML = '';
  const section = sections.find((item) => item.id === activeSectionId) || sections[0];
  sectionTitleEl.textContent = section.title;
  renderCategories();
  if (section.id === 'events-modules') {
    renderModulesEditor();
    return;
  }
  const sectionEl = document.createElement('section');
  sectionEl.className = 'admin-section';
  const grid = document.createElement('div');
  grid.className = 'admin-fields-grid';
  section.fields.forEach((field) => grid.appendChild(createInput(field, getByPath(draftContent, field.key))));
  sectionEl.appendChild(grid);
  fieldsRoot.appendChild(sectionEl);
};

const handleAdminSignIn = async (event) => {
  if (event) event.preventDefault();
  try {
    renderStatus('Signing in...');
    if (signinButton) signinButton.disabled = true;
    await cmsApi.signInAdmin(emailInput.value.trim(), passwordInput.value);
    renderAuthState();
    draftContent = await cmsApi.loadContent();
    normalizeHeroMediaDraft();
    renderForm();
    renderStatus('Signed in. Remote sync enabled.');
    passwordInput.value = '';
  } catch (error) {
    renderStatus(error.message, true);
  } finally {
    if (signinButton) signinButton.disabled = false;
  }
};

if (authForm) {
  authForm.addEventListener('submit', (event) => {
    event.preventDefault();
    handleAdminSignIn(event);
  });
}

if (signinButton) {
  signinButton.addEventListener('click', (event) => {
    event.preventDefault();
    handleAdminSignIn(event);
  });
}

if (emailInput) {
  emailInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAdminSignIn(event);
    }
  });
}

if (passwordInput) {
  passwordInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAdminSignIn(event);
    }
  });
}

resetPasswordBtn.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  if (!email) {
    renderStatus('Enter your admin email first.', true);
    return;
  }
  try {
    await cmsApi.sendPasswordReset(email, `${window.location.origin}${window.location.pathname}`);
    renderStatus('Password reset email sent.');
  } catch (error) {
    renderStatus(error.message, true);
  }
});

signoutButton.addEventListener('click', async () => {
  await cmsApi.signOutEverywhere();
  renderAuthState();
  renderStatus('Signed out on all devices.');
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!draftContent) return;
  try {
    await ensureAuthOrFail();
    draftContent = await cmsApi.saveContent(draftContent, { allowLocalFallback: false });
    renderStatus('Saved to Supabase successfully.');
  } catch (error) {
    renderStatus(error.message, true);
  }
});

resetButton.addEventListener('click', async () => {
  const confirmed = window.confirm('Reset all admin content to default values?');
  if (!confirmed) return;
  try {
    await ensureAuthOrFail();
    draftContent = await cmsApi.resetContent({ allowLocalFallback: false });
    renderForm();
    renderStatus('Remote content reset to defaults.');
  } catch (error) {
    renderStatus(error.message, true);
  }
});

const startSessionMonitor = () => {
  window.setInterval(async () => {
    const stillValid = await cmsApi.ensureAdminSession();
    if (!stillValid && cmsApi.isAdminAuthenticated() === false) {
      renderAuthState();
    }
  }, 30000);
};

const initAdmin = async () => {
  try {
    if (emailInput && !emailInput.value) emailInput.value = DEFAULT_ADMIN_EMAIL;
    if (passwordInput && !passwordInput.value) passwordInput.value = DEFAULT_ADMIN_PASSWORD;
    draftContent = await cmsApi.loadContent();
    normalizeHeroMediaDraft();
    renderAuthState();
    renderForm();
    renderStatus(cmsApi.isAdminAuthenticated() ? 'Signed in. Remote sync enabled.' : 'Sign in with Supabase Auth to save remotely.');
    startSessionMonitor();
  } catch (error) {
    renderStatus(`Init failed: ${error.message}`, true);
  }
};

initAdmin();
