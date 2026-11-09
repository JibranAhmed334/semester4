import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { sampleDashboardStats } from '../data/sampleData';
import { formatExpoDate, getExpoDateInputValue } from '../data/expoHelpers';

function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const [expos, setExpos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [exposLoading, setExposLoading] = useState(false);
  const [expoModalOpen, setExpoModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expoSearch, setExpoSearch] = useState('');

  const [expoForm, setExpoForm] = useState({
    title: '',
    category: '',
    theme: '',
    boothCount: '0',
    date: '',
    location: '',
    description: ''
  });

  const [selectedBanner, setSelectedBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusAlert, setStatusAlert] = useState(null);
  const [feedbackItems, setFeedbackItems] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [messageContacts, setMessageContacts] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedContactId, setSelectedContactId] = useState('');
  const [conversationMessages, setConversationMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messageError, setMessageError] = useState('');
  const [messageSending, setMessageSending] = useState(false);
  const [exhibitorProfile, setExhibitorProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({
    companyName: '',
    contactEmail: '',
    contactPhone: '',
    category: '',
    description: '',
    products: '',
    services: '',
    website: '',
    logo: ''
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileNotice, setProfileNotice] = useState(null);
  const [exhibitorApplications, setExhibitorApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationNotice, setApplicationNotice] = useState(null);

  // Exhibitor Reserved Stalls State
  const [myBooths, setMyBooths] = useState([]);
  const [myBoothsLoading, setMyBoothsLoading] = useState(false);
  const [editingBooth, setEditingBooth] = useState(null);
  const [boothModalOpen, setBoothModalOpen] = useState(false);
  const [boothEditForm, setBoothEditForm] = useState({ showcaseDetails: '', staffInfo: '' });
  const [boothEditSaving, setBoothEditSaving] = useState(false);
  const [boothNotice, setBoothNotice] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  const canManageExpos = currentUser?.role === 'admin' || currentUser?.role === 'organizer';
  const canManageFeedback = canManageExpos;
  const canEditExpo = (expo) => currentUser?.role === 'admin'
    || (currentUser?.role === 'organizer'
      && String(expo.organizer?._id || expo.organizer) === currentUser.id);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/login');
    } else {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch {
        navigate('/login');
      }
    }
  }, [navigate]);

  useEffect(() => {
    if (activeTab === 'expos' || activeTab === 'overview') {
      fetchExpos();
      fetchCategories();
    }
    if (activeTab === 'my-booths' || activeTab === 'overview' || activeTab === 'bookings') {
      fetchMyBooths();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'feedback' && activeTab !== 'messages') return undefined;

    let cancelled = false;
    const token = localStorage.getItem('token');
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true
    };

    const loadTabData = async () => {
      if (activeTab === 'feedback') {
        setFeedbackLoading(true);
        try {
          const response = await axios.get(`${API_URL}/feedback`, config);
          if (!cancelled) setFeedbackItems(response.data?.feedback || []);
        } catch (error) {
          if (!cancelled) setStatusAlert({ type: 'danger', text: error.response?.data?.message || 'Could not load feedback requests.' });
        } finally {
          if (!cancelled) setFeedbackLoading(false);
        }
        return;
      }

      setMessagesLoading(true);
      setMessageError('');
      try {
        const [contactsResponse, conversationsResponse] = await Promise.all([
          axios.get(`${API_URL}/messages/contacts`, config),
          axios.get(`${API_URL}/messages/conversations`, config)
        ]);
        if (!cancelled) {
          setMessageContacts(contactsResponse.data?.contacts || []);
          setConversations(conversationsResponse.data?.conversations || []);
        }
      } catch (error) {
        if (!cancelled) setMessageError(error.response?.data?.message || 'Could not load messages.');
      } finally {
        if (!cancelled) setMessagesLoading(false);
      }
    };

    loadTabData();
    return () => {
      cancelled = true;
    };
  }, [activeTab, API_URL]);

  useEffect(() => {
    if (activeTab !== 'exhibitor-profile' && activeTab !== 'applications') return undefined;

    let cancelled = false;
    const token = localStorage.getItem('token');
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true
    };

    const loadExhibitorData = async () => {
      if (activeTab === 'exhibitor-profile') {
        setProfileLoading(true);
        try {
          const [profileResponse, categoryResponse] = await Promise.all([
            axios.get(`${API_URL}/exhibitors/me`, config),
            axios.get(`${API_URL}/categories`)
          ]);
          if (!cancelled) {
            const profile = profileResponse.data?.exhibitor || null;
            setExhibitorProfile(profile);
            setCategories(categoryResponse.data?.data || categoryResponse.data?.categories || []);
            if (profile) {
              setProfileForm({
                companyName: profile.companyName || '',
                contactEmail: profile.contactEmail || '',
                contactPhone: profile.contactPhone || '',
                category: profile.category?._id || '',
                description: profile.description || '',
                products: (profile.products || []).join(', '),
                services: (profile.services || []).join(', '),
                website: profile.website || '',
                logo: profile.logo || ''
              });
            } else {
              setProfileForm((form) => ({ ...form, contactEmail: currentUser?.email || '' }));
            }
          }
        } catch (error) {
          if (!cancelled) setProfileNotice({ type: 'danger', text: error.response?.data?.message || 'Could not load your company profile.' });
        } finally {
          if (!cancelled) setProfileLoading(false);
        }
        return;
      }

      setApplicationsLoading(true);
      setApplicationNotice(null);
      try {
        const response = await axios.get(`${API_URL}/exhibitors/applications`, config);
        if (!cancelled) setExhibitorApplications(response.data?.applications || []);
      } catch (error) {
        if (!cancelled) setApplicationNotice({ type: 'danger', text: error.response?.data?.message || 'Could not load exhibitor applications.' });
      } finally {
        if (!cancelled) setApplicationsLoading(false);
      }
    };

    loadExhibitorData();
    return () => {
      cancelled = true;
    };
  }, [activeTab, API_URL, currentUser?.email]);

  useEffect(() => {
    if (activeTab !== 'messages' || !selectedContactId) {
      setConversationMessages([]);
      return undefined;
    }

    let cancelled = false;
    const token = localStorage.getItem('token');
    setMessagesLoading(true);
    axios.get(`${API_URL}/messages/${selectedContactId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true
    }).then((response) => {
      if (!cancelled) setConversationMessages(response.data?.messages || []);
    }).catch((error) => {
      if (!cancelled) setMessageError(error.response?.data?.message || 'Could not load this conversation.');
    }).finally(() => {
      if (!cancelled) setMessagesLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [activeTab, selectedContactId, API_URL]);

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined
      },
      withCredentials: true
    };
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!selectedContactId || !messageText.trim()) return;

    setMessageSending(true);
    setMessageError('');
    try {
      const response = await axios.post(`${API_URL}/messages`, {
        receiverId: selectedContactId,
        messageText: messageText.trim()
      }, getAuthConfig());
      setConversationMessages((currentMessages) => [...currentMessages, response.data.data]);
      setMessageText('');
      const conversationsResponse = await axios.get(`${API_URL}/messages/conversations`, getAuthConfig());
      setConversations(conversationsResponse.data?.conversations || []);
    } catch (error) {
      setMessageError(error.response?.data?.message || 'Message could not be sent.');
    } finally {
      setMessageSending(false);
    }
  };

  const handleFeedbackStatusChange = async (feedbackId, status) => {
    try {
      const response = await axios.patch(
        `${API_URL}/feedback/${feedbackId}/status`,
        { status },
        getAuthConfig()
      );
      setFeedbackItems((items) => items.map((item) => item._id === feedbackId ? response.data.feedback : item));
    } catch (error) {
      setStatusAlert({ type: 'danger', text: error.response?.data?.message || 'Could not update the feedback status.' });
    }
  };

  const handleSaveExhibitorProfile = async (event) => {
    event.preventDefault();
    setProfileSaving(true);
    setProfileNotice(null);
    try {
      const response = await axios.put(`${API_URL}/exhibitors/me`, {
        ...profileForm,
        products: profileForm.products.split(',').map((item) => item.trim()).filter(Boolean),
        services: profileForm.services.split(',').map((item) => item.trim()).filter(Boolean)
      }, getAuthConfig());
      const profile = response.data.exhibitor;
      setExhibitorProfile(profile);
      setProfileForm((form) => ({
        ...form,
        category: profile.category?._id || ''
      }));
      setProfileNotice({ type: 'success', text: 'Company profile saved.' });
    } catch (error) {
      setProfileNotice({ type: 'danger', text: error.response?.data?.message || 'Could not save your company profile.' });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleApplicationStatus = async (applicationId, status) => {
    setApplicationNotice(null);
    try {
      const response = await axios.patch(
        `${API_URL}/exhibitors/applications/${applicationId}`,
        { status },
        getAuthConfig()
      );
      setExhibitorApplications((applications) => applications.map((application) =>
        application._id === applicationId ? response.data.application : application
      ));
    } catch (error) {
      setApplicationNotice({ type: 'danger', text: error.response?.data?.message || 'Could not update this application.' });
    }
  };

  const fetchExpos = async () => {
    setExposLoading(true);
    try {
      const res = await axios.get(`${API_URL}/expos`);
      const list = res.data?.expos || [];
      setExpos(Array.isArray(list) ? list : []);
    } catch (err) {
      console.log('Notice: Failed to fetch expos:', err.message);
    } finally {
      setExposLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/categories`);
      const catList = res.data?.data || res.data?.categories || [];
      setCategories(Array.isArray(catList) ? catList : []);
    } catch (err) {
      console.log('Notice: Failed to fetch categories:', err.message);
    }
  };

  const fetchMyBooths = async () => {
    setMyBoothsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/booths/my`, getAuthConfig());
      setMyBooths(response.data?.booths || []);
    } catch (err) {
      console.log('Notice: Could not load reserved booths:', err.message);
    } finally {
      setMyBoothsLoading(false);
    }
  };

  const handleOpenBoothModal = (booth) => {
    setEditingBooth(booth);
    setBoothEditForm({
      showcaseDetails: booth.showcaseDetails || '',
      staffInfo: booth.staffInfo || ''
    });
    setBoothNotice(null);
    setBoothModalOpen(true);
  };

  const handleSaveBoothDetails = async (e) => {
    e.preventDefault();
    if (!editingBooth) return;
    setBoothEditSaving(true);
    setBoothNotice(null);

    try {
      const response = await axios.put(
        `${API_URL}/booths/${editingBooth._id}`,
        boothEditForm,
        getAuthConfig()
      );
      const updated = response.data?.booth;
      if (updated) {
        setMyBooths((prev) => prev.map((b) => (b._id === updated._id ? updated : b)));
      }
      setBoothNotice({ type: 'success', text: 'Stall showcase and staff details saved successfully!' });
      setTimeout(() => {
        setBoothModalOpen(false);
      }, 700);
    } catch (err) {
      setBoothNotice({
        type: 'danger',
        text: err.response?.data?.message || 'Could not update stall details.'
      });
    } finally {
      setBoothEditSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.log('Logout notice:', err.message);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedBanner(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setExpoForm({
      title: '',
      category: categories[0]?._id || '',
      theme: '',
      boothCount: '0',
      date: '',
      location: '',
      description: ''
    });
    setSelectedBanner(null);
    setBannerPreview(null);
    setStatusAlert(null);
    setExpoModalOpen(true);
  };

  const handleOpenEditModal = (expo) => {
    setIsEditing(true);
    setEditingId(expo._id);
    setExpoForm({
      title: expo.title || '',
      category: typeof expo.category === 'object' ? expo.category?._id : expo.category || '',
      theme: expo.theme || '',
      boothCount: String(expo.boothCount ?? 0),
      date: getExpoDateInputValue(expo.date),
      location: expo.location || '',
      description: expo.description || ''
    });
    setSelectedBanner(null);
    setBannerPreview(expo.bannerUrl || null);
    setStatusAlert(null);
    setExpoModalOpen(true);
  };

  const handleExpoSubmit = async (e) => {
    e.preventDefault();
    if (!expoForm.title.trim() || !expoForm.category || !expoForm.date || !expoForm.location.trim() || !expoForm.description.trim()) {
      setStatusAlert({ type: 'danger', text: 'Title, category, date, location, and description are required.' });
      return;
    }

    if (!isEditing && !selectedBanner) {
      setStatusAlert({ type: 'danger', text: 'Please select an event banner image.' });
      return;
    }

    setIsSubmitting(true);
    setStatusAlert(null);

    const formData = new FormData();
    formData.append('title', expoForm.title.trim());
    formData.append('category', expoForm.category);
    formData.append('theme', expoForm.theme.trim());
    formData.append('boothCount', expoForm.boothCount || '0');
    formData.append('date', expoForm.date);
    formData.append('location', expoForm.location.trim());
    formData.append('description', expoForm.description.trim());

    if (selectedBanner) {
      formData.append('banner', selectedBanner);
    }

    try {
      const config = getAuthConfig();
      config.headers['Content-Type'] = 'multipart/form-data';

      if (isEditing) {
        await axios.put(`${API_URL}/expos/${editingId}`, formData, config);
        setStatusAlert({ type: 'success', text: 'Expo event updated successfully!' });
      } else {
        await axios.post(`${API_URL}/expos`, formData, config);
        setStatusAlert({ type: 'success', text: 'Expo event created and banner uploaded to Cloudinary!' });
      }

      await fetchExpos();
      setTimeout(() => {
        setExpoModalOpen(false);
      }, 700);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Operation failed. Check server connection.';
      setStatusAlert({ type: 'danger', text: errMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExpo = async (id, title) => {
    if (!window.confirm(`Delete expo event "${title}"? This will remove it from the database and Cloudinary.`)) return;

    try {
      const config = getAuthConfig();
      await axios.delete(`${API_URL}/expos/${id}`, config);
      setStatusAlert({ type: 'success', text: `Expo "${title}" removed successfully.` });
      await fetchExpos();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete event.';
      setStatusAlert({ type: 'danger', text: msg });
    }
  };

  const filteredExpos = useMemo(() => {
    return expos.filter((item) => {
      const titleMatch = (item.title || '').toLowerCase().includes(expoSearch.toLowerCase());
      const catMatch = (item.category?.category_name || '').toLowerCase().includes(expoSearch.toLowerCase());
      const themeMatch = (item.theme || '').toLowerCase().includes(expoSearch.toLowerCase());
      return titleMatch || catMatch || themeMatch;
    });
  }, [expos, expoSearch]);

  if (!currentUser) return null;

  return (
    <div className="dashboard-page bg-light min-vh-100 py-4">
      <div className="container">
        {/* Top welcome banner */}
        <div className="bg-navy text-white rounded-4 p-4 mb-4 shadow-sm">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="badge bg-orange text-uppercase px-2 py-1">
                  {currentUser.role || 'Member'} Account
                </span>
                <span className="small text-light text-opacity-75">
                  <i className="bi bi-patch-check-fill text-warning me-1"></i> Active Session
                </span>
              </div>
              <h2 className="fw-bold mb-0">Welcome back, {currentUser.name}!</h2>
              <p className="text-light text-opacity-75 small mb-0">{currentUser.email}</p>
            </div>
            <div className="d-flex gap-2">
              <Link to="/expos" className="btn btn-outline-light btn-sm">
                <i className="bi bi-compass me-1"></i> Browse Expos
              </Link>
              <button onClick={handleLogout} className="btn btn-danger btn-sm">
                <i className="bi bi-box-arrow-right me-1"></i> Logout
              </button>
            </div>
          </div>
        </div>

        {statusAlert && (
          <div className={`alert alert-${statusAlert.type} alert-dismissible fade show small d-flex align-items-center gap-2 mb-4`} role="alert">
            <i className={`bi ${statusAlert.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`}></i>
            <div>{statusAlert.text}</div>
            <button type="button" className="btn-close ms-auto" onClick={() => setStatusAlert(null)}></button>
          </div>
        )}

        <div className="row g-4">
          {/* Sidebar */}
          <div className="col-lg-3">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
              <h6 className="fw-bold text-navy small mb-3 px-2">Navigation</h6>
              <div className="nav flex-column gap-1">
                <button
                  className={`nav-link text-start rounded-3 py-2 px-3 fw-medium ${
                    activeTab === 'overview' ? 'bg-navy text-white' : 'text-secondary btn-link text-decoration-none'
                  }`}
                  onClick={() => setActiveTab('overview')}
                >
                  <i className="bi bi-speedometer2 me-2"></i> Overview
                </button>
                {canManageExpos && (
                  <button
                    className={`nav-link text-start rounded-3 py-2 px-3 fw-medium ${
                      activeTab === 'expos' ? 'bg-navy text-white' : 'text-secondary btn-link text-decoration-none'
                    }`}
                    onClick={() => setActiveTab('expos')}
                  >
                    <i className="bi bi-calendar-event me-2"></i> Expo Management ({expos.length})
                  </button>
                )}
                {currentUser?.role === 'exhibitor' && (
                  <button
                    className={`nav-link text-start rounded-3 py-2 px-3 fw-medium ${
                      activeTab === 'exhibitor-profile' ? 'bg-navy text-white' : 'text-secondary btn-link text-decoration-none'
                    }`}
                    onClick={() => setActiveTab('exhibitor-profile')}
                  >
                    <i className="bi bi-building me-2"></i> Company Profile
                  </button>
                )}
                {currentUser?.role === 'exhibitor' && (
                  <button
                    className={`nav-link text-start rounded-3 py-2 px-3 fw-medium ${
                      activeTab === 'my-booths' ? 'bg-navy text-white' : 'text-secondary btn-link text-decoration-none'
                    }`}
                    onClick={() => setActiveTab('my-booths')}
                  >
                    <i className="bi bi-grid-3x3-gap me-2"></i> My Reserved Stalls ({myBooths.length})
                  </button>
                )}
                {(currentUser?.role === 'exhibitor' || canManageExpos) && (
                  <button
                    className={`nav-link text-start rounded-3 py-2 px-3 fw-medium ${
                      activeTab === 'applications' ? 'bg-navy text-white' : 'text-secondary btn-link text-decoration-none'
                    }`}
                    onClick={() => setActiveTab('applications')}
                  >
                    <i className="bi bi-clipboard-check me-2"></i>
                    {currentUser?.role === 'exhibitor' ? 'My Expo Applications' : 'Exhibitor Applications'}
                  </button>
                )}
                <button
                  className={`nav-link text-start rounded-3 py-2 px-3 fw-medium ${
                    activeTab === 'messages' ? 'bg-navy text-white' : 'text-secondary btn-link text-decoration-none'
                  }`}
                  onClick={() => setActiveTab('messages')}
                >
                  <i className="bi bi-chat-dots me-2"></i> Messages
                </button>
                <button
                  className={`nav-link text-start rounded-3 py-2 px-3 fw-medium ${
                    activeTab === 'feedback' ? 'bg-navy text-white' : 'text-secondary btn-link text-decoration-none'
                  }`}
                  onClick={() => setActiveTab('feedback')}
                >
                  <i className="bi bi-life-preserver me-2"></i> Support Requests
                </button>
                <button
                  className={`nav-link text-start rounded-3 py-2 px-3 fw-medium ${
                    activeTab === 'bookings' ? 'bg-navy text-white' : 'text-secondary btn-link text-decoration-none'
                  }`}
                  onClick={() => setActiveTab('bookings')}
                >
                  <i className="bi bi-bookmark-check me-2"></i> My Bookings
                </button>
                <button
                  className={`nav-link text-start rounded-3 py-2 px-3 fw-medium ${
                    activeTab === 'profile' ? 'bg-navy text-white' : 'text-secondary btn-link text-decoration-none'
                  }`}
                  onClick={() => setActiveTab('profile')}
                >
                  <i className="bi bi-person me-2"></i> Profile Settings
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
              <h6 className="fw-bold text-navy small mb-3 px-2">Quick Links</h6>
              <div className="d-flex flex-column gap-2 small px-2">
                <Link to="/floor-plan" className="text-decoration-none text-secondary">
                  <i className="bi bi-grid-3x3-gap text-orange me-2"></i> Hall Floor Plan
                </Link>
                <Link to="/schedule" className="text-decoration-none text-secondary">
                  <i className="bi bi-calendar3 text-primary me-2"></i> Full Schedule
                </Link>
                <Link to="/exhibitors" className="text-decoration-none text-secondary">
                  <i className="bi bi-building text-navy me-2"></i> Exhibitor Directory
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-lg-9">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <>
                <div className="row g-3 mb-4">
                  <div className="col-sm-6 col-md-3">
                    <div className="card border-0 shadow-sm rounded-4 p-3 bg-white text-center">
                      <div className="fs-3 fw-bold text-navy mb-1">{expos.length}</div>
                      <div className="text-muted small">Registered Expos</div>
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-3">
                    <div className="card border-0 shadow-sm rounded-4 p-3 bg-white text-center">
                      <div className="fs-3 fw-bold text-orange mb-1">
                        {sampleDashboardStats.bookmarkedSessions}
                      </div>
                      <div className="text-muted small">Bookmarked Sessions</div>
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-3">
                    <div className="card border-0 shadow-sm rounded-4 p-3 bg-white text-center">
                      <div className="fs-3 fw-bold text-success mb-1">
                        {currentUser?.role === 'exhibitor' ? myBooths.length : sampleDashboardStats.reservedBooths}
                      </div>
                      <div className="text-muted small">Reserved Stalls</div>
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-3">
                    <div className="card border-0 shadow-sm rounded-4 p-3 bg-white text-center">
                      <div className="fs-3 fw-bold text-primary mb-1">
                        {sampleDashboardStats.unreadMessages}
                      </div>
                      <div className="text-muted small">Notifications</div>
                    </div>
                  </div>
                </div>

                {/* Exhibitor Quick Stalls Snapshot if any reserved */}
                {currentUser?.role === 'exhibitor' && myBooths.length > 0 && (
                  <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h5 className="fw-bold text-navy mb-1">My Reserved Stalls Snapshot</h5>
                        <p className="text-muted small mb-0">Active booth space bookings registered under your brand.</p>
                      </div>
                      <button onClick={() => setActiveTab('my-booths')} className="btn btn-outline-navy btn-sm">
                        Manage All Stalls ({myBooths.length})
                      </button>
                    </div>
                    <div className="row g-3">
                      {myBooths.slice(0, 2).map((b) => (
                        <div key={b._id} className="col-md-6">
                          <div className="p-3 border rounded-3 bg-light">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <span className="fw-bold text-navy">Booth #{b.boothNumber}</span>
                              <span className="badge bg-navy text-white">{b.hall || 'Hall A'}</span>
                            </div>
                            <div className="text-muted small mb-2">
                              {b.expo?.title || 'Expo Event'} • <span className="text-orange fw-semibold">${b.price || 1200}</span>
                            </div>
                            <div className="text-secondary small text-truncate">
                              Showcase: {b.showcaseDetails || 'No details added yet'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Expos Preview */}
                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold text-navy mb-0">Upcoming Event Highlights</h5>
                    <button
                      onClick={() => canManageExpos ? setActiveTab('expos') : navigate('/expos')}
                      className="btn btn-outline-navy btn-sm"
                    >
                      {canManageExpos ? 'Manage All Expos' : 'Browse All Expos'}
                    </button>
                  </div>
                  <div className="row g-3">
                    {expos.slice(0, 2).map((item) => (
                      <div key={item._id} className="col-md-6">
                        <div className="p-3 border rounded-3 bg-light d-flex gap-3 align-items-center">
                          <img
                            src={item.bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'}
                            alt={item.title}
                            className="rounded-2"
                            style={{ width: '80px', height: '60px', objectFit: 'cover' }}
                          />
                          <div className="overflow-hidden">
                            <h6 className="fw-bold text-navy mb-1 text-truncate">{item.title}</h6>
                            <div className="text-muted small">
                              <i className="bi bi-calendar-event me-1 text-orange"></i>{formatExpoDate(item.date)}
                            </div>
                            <div className="text-muted small text-truncate">
                              <i className="bi bi-geo-alt me-1 text-danger"></i>{item.location}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Expos CRUD Management Tab */}
            {activeTab === 'expos' && (
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                  <div>
                    <h4 className="fw-bold text-navy mb-1">Expo Events Management</h4>
                    <p className="text-muted small mb-0">
                      Create, update, and manage exhibitions with real-time Cloudinary image upload.
                    </p>
                  </div>
                  {canManageExpos && (
                    <button onClick={handleOpenAddModal} className="btn btn-orange text-white btn-sm px-3">
                      <i className="bi bi-plus-circle me-1"></i> Add New Expo
                    </button>
                  )}
                </div>

                {/* Search */}
                <div className="mb-3">
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search expos by title, category, or theme..."
                      value={expoSearch}
                      onChange={(e) => setExpoSearch(e.target.value)}
                    />
                  </div>
                </div>

                {/* Table */}
                {exposLoading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-orange" role="status"></div>
                    <p className="text-muted small mt-2">Loading expos from database...</p>
                  </div>
                ) : filteredExpos.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light small text-uppercase text-secondary">
                        <tr>
                          <th>Banner</th>
                          <th>Expo Title</th>
                          <th>Category</th>
                          <th>Booths</th>
                          <th>Date</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="small">
                        {filteredExpos.map((expo) => (
                          <tr key={expo._id}>
                            <td>
                              <img
                                src={expo.bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'}
                                alt={expo.title}
                                className="rounded-2 shadow-sm"
                                style={{ width: '56px', height: '40px', objectFit: 'cover' }}
                              />
                            </td>
                            <td>
                              <div className="fw-semibold text-navy">{expo.title}</div>
                              {expo.location && (
                                <div className="text-muted small text-truncate" style={{ maxWidth: '180px' }}>
                                  <i className="bi bi-geo-alt me-1 text-danger"></i>{expo.location}
                                </div>
                              )}
                            </td>
                            <td>
                              <span className="badge bg-light text-navy border">
                                {expo.category?.category_name || expo.theme || 'General'}
                              </span>
                            </td>
                            <td className="fw-semibold text-orange">
                              {expo.boothCount ?? 0}
                            </td>
                            <td className="text-muted">
                              {formatExpoDate(expo.date)}
                            </td>
                            <td className="text-end">
                              {canEditExpo(expo) && (
                                <div className="btn-group btn-group-sm">
                                  <button
                                    onClick={() => handleOpenEditModal(expo)}
                                    className="btn btn-outline-secondary"
                                    title="Edit"
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteExpo(expo._id, expo.title)}
                                    className="btn btn-outline-danger"
                                    title="Delete"
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-5 bg-light rounded-3">
                    <i className="bi bi-calendar-x fs-1 text-muted mb-2 d-block"></i>
                    <h6 className="fw-bold text-navy">No Expos Found</h6>
                    <p className="text-muted small mb-3">Add your first expo event to begin.</p>
                    <button onClick={handleOpenAddModal} className="btn btn-orange text-white btn-sm">
                      <i className="bi bi-plus-lg me-1"></i> Add Expo
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Exhibitor Profile Tab */}
            {activeTab === 'exhibitor-profile' && currentUser?.role === 'exhibitor' && (
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                  <div>
                    <h4 className="fw-bold text-navy mb-1">Company Profile</h4>
                    <p className="text-muted small mb-0">Keep your public exhibitor directory details up to date.</p>
                  </div>
                  <Link to="/exhibitors" className="btn btn-outline-navy btn-sm">View Directory</Link>
                </div>

                {profileNotice && (
                  <div className={`alert alert-${profileNotice.type}`} role="alert">{profileNotice.text}</div>
                )}

                {profileLoading ? (
                  <div className="text-center py-5"><span className="spinner-border text-orange" role="status"></span></div>
                ) : (
                  <form onSubmit={handleSaveExhibitorProfile}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Company name *</label>
                        <input className="form-control" maxLength={120} required value={profileForm.companyName}
                          onChange={(event) => setProfileForm({ ...profileForm, companyName: event.target.value })} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Contact email *</label>
                        <input type="email" className="form-control" required value={profileForm.contactEmail}
                          onChange={(event) => setProfileForm({ ...profileForm, contactEmail: event.target.value })} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Phone</label>
                        <input type="tel" className="form-control" maxLength={40} value={profileForm.contactPhone}
                          onChange={(event) => setProfileForm({ ...profileForm, contactPhone: event.target.value })} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Industry category</label>
                        <select className="form-select" value={profileForm.category}
                          onChange={(event) => setProfileForm({ ...profileForm, category: event.target.value })}>
                          <option value="">Select category</option>
                          {categories.map((category) => <option key={category._id} value={category._id}>{category.category_name}</option>)}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Products</label>
                        <textarea className="form-control" rows="2" placeholder="Separate items with commas"
                          value={profileForm.products}
                          onChange={(event) => setProfileForm({ ...profileForm, products: event.target.value })} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Services</label>
                        <textarea className="form-control" rows="2" placeholder="Separate items with commas"
                          value={profileForm.services}
                          onChange={(event) => setProfileForm({ ...profileForm, services: event.target.value })} />
                      </div>
                      <div className="col-12">
                        <label className="form-label small fw-semibold">Company description</label>
                        <textarea className="form-control" rows="3" maxLength={2000}
                          value={profileForm.description}
                          onChange={(event) => setProfileForm({ ...profileForm, description: event.target.value })} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Website</label>
                        <input type="url" className="form-control" placeholder="https://example.com" value={profileForm.website}
                          onChange={(event) => setProfileForm({ ...profileForm, website: event.target.value })} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Logo image URL or Bootstrap icon class</label>
                        <input className="form-control" placeholder="https://... or bi-building" value={profileForm.logo}
                          onChange={(event) => setProfileForm({ ...profileForm, logo: event.target.value })} />
                      </div>
                      <div className="col-12">
                        <button className="btn btn-orange text-white" type="submit" disabled={profileSaving}>
                          {profileSaving ? 'Saving...' : exhibitorProfile ? 'Save Company Profile' : 'Create Company Profile'}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Exhibitor Stalls Management Tab */}
            {activeTab === 'my-booths' && currentUser?.role === 'exhibitor' && (
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                  <div>
                    <h4 className="fw-bold text-navy mb-1">My Reserved Stalls & Booths</h4>
                    <p className="text-muted small mb-0">
                      Manage your exhibition stall footprint, showcase offerings, and on-site staff contacts.
                    </p>
                  </div>
                  <Link to="/floor-plan" className="btn btn-orange text-white btn-sm px-3">
                    <i className="bi bi-grid-3x3-gap me-1"></i> Interactive Floor Plan
                  </Link>
                </div>

                {myBoothsLoading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-orange" role="status"></div>
                    <p className="text-muted small mt-2">Loading your reserved stalls...</p>
                  </div>
                ) : myBooths.length > 0 ? (
                  <div className="row g-3">
                    {myBooths.map((booth) => (
                      <div key={booth._id} className="col-12">
                        <div className="border rounded-4 p-3 p-md-4 bg-light shadow-sm">
                          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-2 mb-3">
                            <div>
                              <div className="d-flex align-items-center gap-2 mb-1">
                                <span className="badge bg-navy text-white text-uppercase px-2 py-1">
                                  {booth.hall || 'Hall A'}
                                </span>
                                <span className={`badge ${booth.status === 'occupied' ? 'bg-navy' : 'bg-warning text-dark'} text-uppercase`}>
                                  {booth.status}
                                </span>
                              </div>
                              <h5 className="fw-bold text-navy mb-0">
                                Booth #{booth.boothNumber}
                              </h5>
                              <span className="text-muted small">
                                <i className="bi bi-geo-alt me-1 text-danger"></i>{booth.location}
                              </span>
                            </div>

                            <div className="text-md-end">
                              <div className="small text-muted">Exhibition Tariff:</div>
                              <div className="fs-5 fw-bold text-orange">
                                ${Number(booth.price || 1200).toLocaleString()}
                              </div>
                              <span className="badge bg-light text-navy border small">
                                Dimensions: {booth.size || '10x10 ft'}
                              </span>
                            </div>
                          </div>

                          {/* Expo Context */}
                          {booth.expo && (
                            <div className="p-2 px-3 bg-white rounded-3 border mb-3 small d-flex flex-wrap justify-content-between align-items-center gap-2">
                              <div>
                                <span className="text-muted">Expo Event: </span>
                                <strong className="text-navy">{booth.expo.title}</strong>
                              </div>
                              <div className="text-muted">
                                <i className="bi bi-calendar-event me-1 text-orange"></i>
                                {formatExpoDate(booth.expo.date)} • {booth.expo.location}
                              </div>
                            </div>
                          )}

                          {/* Showcase & Staff Preview */}
                          <div className="row g-3 mb-3">
                            <div className="col-md-7">
                              <div className="p-3 bg-white rounded-3 border h-100">
                                <div className="small text-uppercase fw-bold text-muted mb-1" style={{ fontSize: '11px' }}>
                                  Showcase Offerings & Products
                                </div>
                                <p className="small text-secondary mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                                  {booth.showcaseDetails || 'No showcase information added yet. Describe your products or equipment here.'}
                                </p>
                              </div>
                            </div>
                            <div className="col-md-5">
                              <div className="p-3 bg-white rounded-3 border h-100">
                                <div className="small text-uppercase fw-bold text-muted mb-1" style={{ fontSize: '11px' }}>
                                  On-Site Attendants & Contact
                                </div>
                                <p className="small text-secondary mb-0">
                                  {booth.staffInfo ? (
                                    <span><i className="bi bi-person-badge text-orange me-1"></i>{booth.staffInfo}</span>
                                  ) : (
                                    'No booth managers assigned yet.'
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="d-flex flex-wrap gap-2 justify-content-end">
                            <Link to="/floor-plan" className="btn btn-outline-navy btn-sm">
                              <i className="bi bi-geo me-1"></i> View on Floor Plan
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleOpenBoothModal(booth)}
                              className="btn btn-navy text-white btn-sm"
                            >
                              <i className="bi bi-pencil-square me-1"></i> Update Showcase & Staff
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5 bg-light rounded-4">
                    <i className="bi bi-grid-3x3-gap fs-1 text-muted mb-2 d-block"></i>
                    <h6 className="fw-bold text-navy">No Reserved Stalls Yet</h6>
                    <p className="text-muted small mb-3">
                      Explore the interactive floor plan to select and reserve prime exhibition spaces for your brand.
                    </p>
                    <Link to="/floor-plan" className="btn btn-orange text-white btn-sm px-4">
                      <i className="bi bi-compass me-1"></i> Open Floor Plan & Book a Stall
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === 'applications' && (currentUser?.role === 'exhibitor' || canManageExpos) && (
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <h4 className="fw-bold text-navy mb-1">
                  {currentUser?.role === 'exhibitor' ? 'My Expo Applications' : 'Exhibitor Applications'}
                </h4>
                <p className="text-muted small mb-3">
                  {currentUser?.role === 'exhibitor'
                    ? 'Review the status of your applications to participate in expos.'
                    : 'Review applications submitted to your expos and record a decision.'}
                </p>
                {applicationNotice && <div className={`alert alert-${applicationNotice.type}`} role="alert">{applicationNotice.text}</div>}
                {applicationsLoading ? (
                  <div className="text-center py-5"><span className="spinner-border text-orange" role="status"></span></div>
                ) : exhibitorApplications.length ? (
                  <div className="table-responsive">
                    <table className="table align-middle">
                      <thead><tr><th>Company</th><th>Expo</th><th>Applied</th><th>Documents</th><th>Status</th>{canManageExpos && <th>Decision</th>}</tr></thead>
                      <tbody>
                        {exhibitorApplications.map((application) => (
                          <tr key={application._id}>
                            <td>
                              <div className="fw-semibold">{application.exhibitor?.companyName}</div>
                              {canManageExpos && <div className="text-muted small">{application.exhibitor?.contactEmail}</div>}
                            </td>
                            <td>{application.expo?.title || 'Expo no longer available'}</td>
                            <td>{application.applicationDate ? new Date(application.applicationDate).toLocaleDateString() : new Date(application.createdAt).toLocaleDateString()}</td>
                            <td>
                              {application.documents?.length ? application.documents.map((document) => (
                                <a key={document.url} href={document.url} target="_blank" rel="noreferrer" className="d-block small">
                                  {document.name}
                                </a>
                              )) : <span className="text-muted small">None provided</span>}
                            </td>
                            <td><span className={`badge ${application.status === 'approved' ? 'bg-success' : application.status === 'rejected' ? 'bg-danger' : 'bg-warning text-dark'}`}>{application.status}</span></td>
                            {canManageExpos && (
                              <td>
                                <div className="d-flex gap-2">
                                  <button className="btn btn-sm btn-success" onClick={() => handleApplicationStatus(application._id, 'approved')} disabled={application.status === 'approved'}>Approve</button>
                                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleApplicationStatus(application._id, 'rejected')} disabled={application.status === 'rejected'}>Reject</button>
                                </div>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center bg-light rounded-3 p-4">
                    <p className="text-muted mb-2">No exhibitor applications yet.</p>
                    {currentUser?.role === 'exhibitor' && <Link to="/expos" className="btn btn-outline-navy btn-sm">Browse expos</Link>}
                  </div>
                )}
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h4 className="fw-bold text-navy mb-1">Messages</h4>
                    <p className="text-muted small mb-0">Send a direct message to another EventSphere member.</p>
                  </div>
                  <select
                    className="form-select form-select-sm w-auto"
                    aria-label="Choose a member to message"
                    value={selectedContactId}
                    onChange={(event) => setSelectedContactId(event.target.value)}
                  >
                    <option value="">Choose a member</option>
                    {messageContacts.map((contact) => (
                      <option key={contact._id} value={contact._id}>
                        {contact.name} ({contact.role})
                      </option>
                    ))}
                  </select>
                </div>

                {messageError && <div className="alert alert-danger small" role="alert">{messageError}</div>}

                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="list-group">
                      {conversations.map(({ contact, lastMessage }) => (
                        <button
                          key={contact._id}
                          type="button"
                          className={`list-group-item list-group-item-action ${selectedContactId === contact._id ? 'active' : ''}`}
                          onClick={() => setSelectedContactId(contact._id)}
                        >
                          <div className="fw-semibold">{contact.name}</div>
                          <div className="small text-truncate">{lastMessage.messageText}</div>
                        </button>
                      ))}
                      {!messagesLoading && conversations.length === 0 && (
                        <div className="text-muted small p-3">No conversations yet. Choose a member to start one.</div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-8">
                    <div className="border rounded-3 p-3 bg-light d-flex flex-column" style={{ minHeight: '320px' }}>
                      <div className="flex-grow-1 overflow-auto mb-3" aria-live="polite">
                        {messagesLoading ? (
                          <div className="text-center text-muted py-5">
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Loading conversation...
                          </div>
                        ) : selectedContactId ? (
                          conversationMessages.length ? conversationMessages.map((message) => {
                            const ownMessage = message.isMine;
                            return (
                              <div key={message._id} className={`d-flex mb-2 ${ownMessage ? 'justify-content-end' : 'justify-content-start'}`}>
                                <div className={`rounded-3 px-3 py-2 small ${ownMessage ? 'bg-navy text-white' : 'bg-white border'}`} style={{ maxWidth: '85%', overflowWrap: 'anywhere' }}>
                                  <div>{message.messageText}</div>
                                  <div className={`small mt-1 ${ownMessage ? 'text-white-50' : 'text-muted'}`}>
                                    {new Date(message.createdAt).toLocaleString()}
                                  </div>
                                </div>
                              </div>
                            );
                          }) : <p className="text-muted small text-center mt-5">No messages in this conversation yet.</p>
                        ) : (
                          <p className="text-muted small text-center mt-5">Select a member to view or start a conversation.</p>
                        )}
                      </div>
                      <form onSubmit={handleSendMessage}>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Write a message..."
                            maxLength={2000}
                            value={messageText}
                            onChange={(event) => setMessageText(event.target.value)}
                            disabled={!selectedContactId || messageSending}
                            aria-label="Message text"
                          />
                          <button
                            className="btn btn-navy text-white"
                            type="submit"
                            disabled={!selectedContactId || !messageText.trim() || messageSending}
                          >
                            {messageSending ? 'Sending...' : 'Send'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Support Requests / Feedback Tab */}
            {activeTab === 'feedback' && (
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <div className="mb-3">
                  <h4 className="fw-bold text-navy mb-1">Support Requests</h4>
                  <p className="text-muted small mb-0">
                    {canManageFeedback ? 'Review requests and update their status.' : 'Track the status of requests you submitted.'}
                  </p>
                </div>
                {statusAlert && activeTab === 'feedback' && (
                  <div className={`alert alert-${statusAlert.type} alert-dismissible fade show`} role="alert">
                    {statusAlert.text}
                    <button type="button" className="btn-close" onClick={() => setStatusAlert(null)} aria-label="Dismiss"></button>
                  </div>
                )}
                {feedbackLoading ? (
                  <div className="text-center py-5">
                    <span className="spinner-border text-orange" role="status"></span>
                    <p className="text-muted small mt-2">Loading support requests...</p>
                  </div>
                ) : feedbackItems.length ? (
                  <div className="d-flex flex-column gap-3">
                    {feedbackItems.map((item) => (
                      <article key={item._id} className="border rounded-3 p-3">
                        <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-2">
                          <div>
                            <h6 className="fw-bold text-navy mb-1">{item.subject}</h6>
                            {canManageFeedback && (
                              <div className="text-muted small">
                                {item.user?.name} · {item.user?.email}
                              </div>
                            )}
                          </div>
                          {canManageFeedback ? (
                            <select
                              className="form-select form-select-sm w-auto"
                              value={item.status}
                              onChange={(event) => handleFeedbackStatusChange(item._id, event.target.value)}
                              aria-label={`Update status for ${item.subject}`}
                            >
                              <option value="pending">Pending</option>
                              <option value="in-progress">In progress</option>
                              <option value="resolved">Resolved</option>
                            </select>
                          ) : (
                            <span className={`badge ${item.status === 'resolved' ? 'bg-success' : item.status === 'in-progress' ? 'bg-primary' : 'bg-warning text-dark'}`}>
                              {item.status}
                            </span>
                          )}
                        </div>
                        <p className="text-secondary small mb-2" style={{ whiteSpace: 'pre-wrap' }}>{item.message}</p>
                        <div className="text-muted small">{new Date(item.createdAt).toLocaleString()}</div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5 bg-light rounded-3">
                    <i className="bi bi-inbox fs-1 text-muted mb-2 d-block"></i>
                    <p className="text-muted mb-0">No support requests to show.</p>
                    <Link to="/contact" className="btn btn-outline-navy btn-sm mt-3">Contact support</Link>
                  </div>
                )}
              </div>
            )}

            {/* My Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <h5 className="fw-bold text-navy mb-2">My Booked Sessions & Stalls</h5>
                <p className="text-muted small mb-3">
                  Your reservations synchronized with the convention registration desk.
                </p>

                {/* Show actual reserved stalls if any exist */}
                {myBooths.length > 0 && (
                  <div className="mb-4">
                    <h6 className="fw-bold text-navy mb-2">
                      <i className="bi bi-grid-3x3-gap text-orange me-2"></i>Reserved Exhibition Stalls ({myBooths.length})
                    </h6>
                    <div className="list-group mb-3">
                      {myBooths.map((booth) => (
                        <div key={booth._id} className="list-group-item p-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
                          <div>
                            <div className="d-flex align-items-center gap-2">
                              <span className="fw-bold text-navy">Booth #{booth.boothNumber}</span>
                              <span className="badge bg-navy text-white small">{booth.hall || 'Hall A'}</span>
                              <span className="badge bg-success small">{booth.status}</span>
                            </div>
                            <div className="text-muted small mt-1">
                              <i className="bi bi-calendar-event me-1 text-orange"></i>
                              {booth.expo?.title || 'Expo Event'} • <i className="bi bi-geo-alt me-1 text-danger"></i>{booth.location}
                            </div>
                            {booth.showcaseDetails && (
                              <div className="text-secondary small mt-1 text-truncate" style={{ maxWidth: '450px' }}>
                                Showcase: {booth.showcaseDetails}
                              </div>
                            )}
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <span className="fw-bold text-orange">${Number(booth.price || 1200).toLocaleString()}</span>
                            <Link to="/floor-plan" className="btn btn-outline-navy btn-sm">
                              View Stall
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <h6 className="fw-bold text-navy mb-2">
                  <i className="bi bi-calendar-check text-primary me-2"></i>Convention Sessions & Passes
                </h6>
                <div className="list-group list-group-flush border rounded-3 p-2 bg-light">
                  <div className="list-group-item bg-transparent px-2 py-3 d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="fw-bold text-navy mb-1">Keynote: Future of Autonomous Mobility & AI</h6>
                      <p className="text-muted small mb-0">
                        <i className="bi bi-clock me-1 text-orange"></i>Day 1 • 10:00 AM - 11:30 AM • Main Auditorium
                      </p>
                    </div>
                    <span className="badge bg-primary">Seat Reserved</span>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Settings Tab */}
            {activeTab === 'profile' && (
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <h5 className="fw-bold text-navy mb-3">Profile Information</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">Full Name</label>
                    <input type="text" className="form-control" value={currentUser.name} disabled />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">Email Address</label>
                    <input type="email" className="form-control" value={currentUser.email} disabled />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">Assigned Role</label>
                    <input type="text" className="form-control text-capitalize" value={currentUser.role} disabled />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">Account Status</label>
                    <input type="text" className="form-control" value="Active / Verified" disabled />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Exhibitor Stall Details Update Modal */}
      {boothModalOpen && editingBooth && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(15, 34, 61, 0.55)' }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-navy text-white">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-pencil-square text-orange me-2"></i>
                  Update Booth #{editingBooth.boothNumber} Details
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setBoothModalOpen(false)}
                  disabled={boothEditSaving}
                ></button>
              </div>

              <form onSubmit={handleSaveBoothDetails}>
                <div className="modal-body p-4">
                  {boothNotice && (
                    <div className={`alert alert-${boothNotice.type} small`} role="alert">
                      {boothNotice.text}
                    </div>
                  )}

                  <div className="p-3 bg-light rounded-3 mb-3 border small">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">Sector / Hall:</span>
                      <span className="fw-bold text-navy">{editingBooth.hall || 'Hall A'}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">Footprint Size:</span>
                      <span className="fw-bold text-navy">{editingBooth.size || '10x10 ft'}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Tariff:</span>
                      <span className="fw-bold text-orange">${Number(editingBooth.price || 1200).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-navy">
                      Showcase Offerings & Products
                    </label>
                    <textarea
                      className="form-control"
                      rows="4"
                      maxLength={1000}
                      placeholder="Describe the technologies, hardware, or live demos attendees can see at your booth..."
                      value={boothEditForm.showcaseDetails}
                      onChange={(e) => setBoothEditForm({ ...boothEditForm, showcaseDetails: e.target.value })}
                    ></textarea>
                    <div className="form-text small">Max 1000 characters. Visible on the interactive floor plan.</div>
                  </div>

                  <div className="mb-2">
                    <label className="form-label small fw-semibold text-navy">
                      On-Site Attendants & Contact
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength={500}
                      placeholder="e.g. Elena Rostova (Lead Manager) - 03001234567"
                      value={boothEditForm.staffInfo}
                      onChange={(e) => setBoothEditForm({ ...boothEditForm, staffInfo: e.target.value })}
                    />
                    <div className="form-text small">Key representatives attending the stall.</div>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setBoothModalOpen(false)}
                    disabled={boothEditSaving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-orange text-white btn-sm px-4"
                    disabled={boothEditSaving}
                  >
                    {boothEditSaving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-1"></i> Save Stall Details
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Expo Modal */}
      {expoModalOpen && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(15, 34, 61, 0.5)' }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-navy text-white">
                <h5 className="modal-title fw-bold">
                  {isEditing ? 'Edit Expo Event' : 'Add New Expo Event'}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setExpoModalOpen(false)}
                ></button>
              </div>

              <form onSubmit={handleExpoSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label small fw-semibold text-navy">Expo Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Global Tech & AI Expo 2026"
                        value={expoForm.title}
                        onChange={(e) => setExpoForm({ ...expoForm, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold text-navy">Category *</label>
                      <select
                        className="form-select"
                        value={expoForm.category}
                        onChange={(e) => setExpoForm({ ...expoForm, category: e.target.value })}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.category_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold text-navy">Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={expoForm.date}
                        onChange={(e) => setExpoForm({ ...expoForm, date: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold text-navy">Location / Venue *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. San Francisco, Hall A"
                        value={expoForm.location}
                        onChange={(e) => setExpoForm({ ...expoForm, location: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-navy">Theme</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Sustainable technology"
                        value={expoForm.theme}
                        onChange={(e) => setExpoForm({ ...expoForm, theme: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-navy">Available Booths</label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        className="form-control"
                        value={expoForm.boothCount}
                        onChange={(e) => setExpoForm({ ...expoForm, boothCount: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold text-navy">Description *</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Brief overview of the trade show and exhibitor topics..."
                        value={expoForm.description}
                        onChange={(e) => setExpoForm({ ...expoForm, description: e.target.value })}
                        required
                      ></textarea>
                    </div>

                    {/* Banner Image Picker */}
                    <div className="col-12">
                      <label className="form-label small fw-semibold text-navy">
                        Banner Image {isEditing ? '(Optional to replace)' : '*'}
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleBannerChange}
                        required={!isEditing}
                      />
                      <div className="form-text small">
                        Uploaded images are securely processed and stored via Cloudinary CDN.
                      </div>

                      {bannerPreview && (
                        <div className="mt-3">
                          <span className="small text-muted d-block mb-1">Image Preview:</span>
                          <img
                            src={bannerPreview}
                            alt="Preview"
                            className="rounded-3 border shadow-sm"
                            style={{ maxHeight: '140px', objectFit: 'cover' }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setExpoModalOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-orange text-white btn-sm px-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Saving to Database...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-cloud-arrow-up me-1"></i>
                        {isEditing ? 'Save Changes' : 'Create & Upload Expo'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
