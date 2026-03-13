import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Paper, Typography, Button, LinearProgress,
  Card, CardContent, Alert, Chip, Grid, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Tooltip, Snackbar, TextField, MenuItem, Container,
  Avatar, Fade, Stack, InputAdornment, Divider
} from '@mui/material';
import {
  Upload, PlayArrow, CheckCircle, Error, TableChart,
  Close, History, Refresh, Stop, Delete, Download, Translate,
  CloudUpload, Dashboard, Archive, Description, Search,
  Business, Videocam, Speed, TrendingUp
} from '@mui/icons-material';
import api from '../Services/api';

// Modern BMW-Inspired Theme
const MODERN_BMW_THEME = {
  primary: '#1C69D4',
  primaryDark: '#0A4B9C',
  primaryLight: '#4D8FDF',
  primaryUltraLight: '#E8F1FD',
  accent: '#FF6D00',
  accentLight: '#FF9D45',
  accentUltraLight: '#FFF3E8',
  background: '#FFFFFF',
  surface: '#F8FAFC',
  surfaceElevated: '#FFFFFF',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  gradientPrimary: 'linear-gradient(135deg, #1C69D4 0%, #0A4B9C 100%)',
  gradientAccent: 'linear-gradient(135deg, #FF6D00 0%, #FF8A00 100%)',
  gradientSuccess: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  shadowXl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
};

// Persistent storage key
const STORAGE_KEY = 'bulkProcessingBatches';

// Enhanced Language options with icons
const LANGS = [
  { code: "auto", name: "Auto Detect", icon: "🔍" },
  { code: "en", name: "English", icon: "🇺🇸" },
  { code: "as", name: "Assamese", icon: "🇮🇳" },
  { code: "bn", name: "Bengali", icon: "🇮🇳" },
  { code: "gu", name: "Gujarati", icon: "🇮🇳" },
  { code: "hi", name: "Hindi", icon: "🇮🇳" },
  { code: "kn", name: "Kannada", icon: "🇮🇳" },
  { code: "ml", name: "Malayalam", icon: "🇮🇳" },
  { code: "mr", name: "Marathi", icon: "🇮🇳" },
  { code: "ne", name: "Nepali", icon: "🇳🇵" },
  { code: "or", name: "Odia", icon: "🇮🇳" },
  { code: "pa", name: "Punjabi", icon: "🇮🇳" },
  { code: "sa", name: "Sanskrit", icon: "🇮🇳" },
  { code: "ta", name: "Tamil", icon: "🇮🇳" },
  { code: "te", name: "Telugu", icon: "🇮🇳" },
  { code: "ur", name: "Urdu", icon: "🇵🇰" },
];

// Enhanced Stats Card Component
const StatsCard = ({ icon: Icon, value, label, color, trend, subtitle }) => (
  <Card sx={{
    background: MODERN_BMW_THEME.surfaceElevated,
    border: `1px solid ${MODERN_BMW_THEME.border}`,
    borderRadius: 3,
    boxShadow: MODERN_BMW_THEME.shadowSm,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      boxShadow: MODERN_BMW_THEME.shadowMd,
      transform: 'translateY(-2px)'
    }
  }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon sx={{ fontSize: 24, color }} />
        </Box>
        {trend && (
          <Chip
            label={trend}
            size="small"
            color={trend.includes('+') ? 'success' : 'error'}
            sx={{ fontWeight: 600 }}
          />
        )}
      </Box>
      <Typography variant="h4" sx={{
        color: MODERN_BMW_THEME.textPrimary,
        fontWeight: 700,
        mb: 0.5,
        lineHeight: 1
      }}>
        {value}
      </Typography>
      <Typography variant="body2" sx={{
        color: MODERN_BMW_THEME.textSecondary,
        fontWeight: 500,
        mb: 0.5
      }}>
        {label}
      </Typography>
      {subtitle && (
        <Typography variant="caption" sx={{
          color: MODERN_BMW_THEME.textTertiary
        }}>
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

// Enhanced Status Badge Component
const StatusBadge = ({ status, size = 'medium' }) => {
  const getStatusConfig = (status) => {
    const config = {
      pending: { 
        bgColor: MODERN_BMW_THEME.surface, 
        textColor: MODERN_BMW_THEME.textTertiary,
        icon: <Upload sx={{ fontSize: size === 'small' ? 16 : 20 }} />
      },
      processing: { 
        bgColor: MODERN_BMW_THEME.primaryUltraLight, 
        textColor: MODERN_BMW_THEME.primary,
        icon: <PlayArrow sx={{ fontSize: size === 'small' ? 16 : 20 }} />
      },
      completed: { 
        bgColor: MODERN_BMW_THEME.successLight, 
        textColor: MODERN_BMW_THEME.success,
        icon: <CheckCircle sx={{ fontSize: size === 'small' ? 16 : 20 }} />
      },
      failed: { 
        bgColor: MODERN_BMW_THEME.errorLight, 
        textColor: MODERN_BMW_THEME.error,
        icon: <Error sx={{ fontSize: size === 'small' ? 16 : 20 }} />
      },
      cancelled: { 
        bgColor: MODERN_BMW_THEME.warningLight, 
        textColor: MODERN_BMW_THEME.warning,
        icon: <Stop sx={{ fontSize: size === 'small' ? 16 : 20 }} />
      },
      stopping: { 
        bgColor: MODERN_BMW_THEME.warningLight, 
        textColor: MODERN_BMW_THEME.warning,
        icon: <Stop sx={{ fontSize: size === 'small' ? 16 : 20 }} />
      }
    };
    return config[status] || config.pending;
  };

  const config = getStatusConfig(status);

  return (
    <Chip 
      icon={config.icon}
      label={status?.toUpperCase()}
      size={size}
      sx={{
        backgroundColor: config.bgColor,
        color: config.textColor,
        fontWeight: 600,
        border: `1px solid ${config.textColor}20`,
        '& .MuiChip-icon': {
          color: `${config.textColor} !important`
        }
      }}
    />
  );
};

export default function BulkUpload() {
  const [file, setFile] = useState(null);
  const [batchId, setBatchId] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [excelPreview, setExcelPreview] = useState(null);
  const [activeBatches, setActiveBatches] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [stopDialog, setStopDialog] = useState({ open: false, batchId: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, batchId: null });
  const [isLoading, setIsLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [targetLanguage, setTargetLanguage] = useState('en');
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  const isMounted = useRef(true);
  const pollingIntervalRef = useRef(null);

  // Calculate batch statistics
  const batchStats = {
    totalBatches: activeBatches.length,
    completedBatches: activeBatches.filter(b => b.status === 'completed').length,
    processingBatches: activeBatches.filter(b => ['processing', 'pending'].includes(b.status)).length,
    totalVideos: activeBatches.reduce((sum, b) => sum + (b.total_urls || 0), 0),
    processedVideos: activeBatches.reduce((sum, b) => sum + (b.processed_urls || 0), 0),
    successRate: activeBatches.reduce((sum, b) => {
      if (b.total_urls > 0) {
        return sum + ((b.processed_urls - (b.failed_urls || 0)) / b.total_urls);
      }
      return sum;
    }, 0) / (activeBatches.filter(b => b.total_urls > 0).length || 1) * 100
  };

  useEffect(() => {
    isMounted.current = true;

    const init = async () => {
      try {
        const meRes = await api.get('/users/me');
        const me = meRes.data;
        setCurrentUser(me);
        await fetchServerBatches(me);
      } catch (err) {
        console.warn('Could not fetch user or server batches, falling back to local storage', err);
        loadActiveBatchesFromStorage(null);
      }
    };

    init();

    return () => {
      isMounted.current = false;
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activeBatches));
    } catch (err) {
      console.error('Error persisting batches to localStorage:', err);
    }
  }, [activeBatches]);

  const showSnackbarMessage = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const normalizeBatch = (b) => {
    const batchIdVal = b.batchId || b.batch_id || b.batch_id?.toString() || (b.batchId ? b.batchId.toString() : undefined);
    const filename = b.filename || b.original_filename || 'Unknown file';
    let created_at = b.created_at || b.createdAt || null;
    if (created_at && !(typeof created_at === 'string')) {
      try { created_at = new Date(created_at).toISOString(); } catch { created_at = null; }
    }
    return {
      ...b,
      batchId: batchIdVal,
      batch_id: b.batch_id || batchIdVal,
      filename,
      created_at,
      total_urls: Number(b.total_urls || 0),
      processed_urls: Number(b.processed_urls || b.processed || 0),
      failed_urls: Number(b.failed_urls || 0),
      dealer_id: b.dealer_id || b.dealerId || null,
    };
  };

  const fetchServerBatches = async (me = null) => {
    try {
      const res = await api.get('/bulk-batches');
      const serverBatches = Array.isArray(res.data) ? res.data.map(normalizeBatch) : [];
      const filtered = me && me.role === 'dealer_admin' && me.dealer_id
        ? serverBatches.filter(b => String(b.dealer_id) === String(me.dealer_id))
        : serverBatches;
      setActiveBatches(filtered);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      const activeBatch = filtered.find(b => ['processing', 'pending', 'stopping'].includes(b.status));
      if (activeBatch) {
        setBatchId(activeBatch.batchId);
        setStatus(activeBatch);
        startPolling(activeBatch.batchId);
      }
    } catch (err) {
      console.warn('fetchServerBatches failed, will fallback to localStorage', err);
      loadActiveBatchesFromStorage(me);
    }
  };

  const loadActiveBatchesFromStorage = (me = null) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;
      const raw = JSON.parse(stored);
      const normalized = (Array.isArray(raw) ? raw : []).map(normalizeBatch);
      const filtered = normalized.filter(b => {
        if (!b.dealer_id) return false;
        if (me && me.role === 'dealer_admin') {
          return String(b.dealer_id) === String(me.dealer_id);
        }
        return true;
      });
      setActiveBatches(filtered);
      const activeBatch = filtered.find(b => ['processing', 'pending', 'stopping'].includes(b.status));
      if (activeBatch) {
        setBatchId(activeBatch.batchId);
        setStatus(activeBatch);
        startPolling(activeBatch.batchId);
      }
    } catch (err) {
      console.error('Error loading batches from storage:', err);
    }
  };

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
      setFile(selectedFile);
      setError('');
      setExcelPreview({
        totalRows: 'Ready for processing',
        message: `File selected: ${selectedFile.name}`
      });
    } else {
      setError('Please upload an Excel file (.xlsx or .xls)');
    }
  };

  const startBulkProcessing = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }
    if (isLoading) return;

    setIsLoading(true);
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_language', targetLanguage);

    try {
      const response = await api.post('/bulk-analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const data = response.data;
      const newBatchId = data.batch_id;
      setBatchId(newBatchId);

      const initialStatus = {
        batchId: newBatchId,
        status: 'processing',
        total_urls: data.total_urls,
        processed_urls: 0,
        target_language: targetLanguage,
        failed_urls: 0,
        progress_percentage: 0,
        filename: file.name,
        created_at: new Date().toISOString(),
        dealer_id: currentUser?.dealer_id || null,
      };

      setStatus(initialStatus);
      saveBatchToStorage(initialStatus);
      await fetchServerBatches(currentUser);
      startPolling(newBatchId);
      showSnackbarMessage('Bulk processing started successfully!', 'success');

    } catch (err) {
      const msg = err?.response?.data?.detail || err.message || 'Failed to start bulk processing';
      setError(msg);
      showSnackbarMessage(msg, 'error');
      console.error('startBulkProcessing error:', err);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const startPolling = (batchIdToPoll) => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    pollingIntervalRef.current = setInterval(async () => {
      if (!isMounted.current) return;
      try {
        const response = await api.get(`/bulk-status/${batchIdToPoll}`);
        const statusData = response.data;
        const updatedStatus = { ...normalizeBatch(statusData), batchId: batchIdToPoll };

        setStatus(prev => ({ ...prev, ...updatedStatus }));
        saveBatchToStorage(updatedStatus);

        if (['completed', 'failed', 'cancelled'].includes(statusData.status)) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
          setLoading(false);
          fetchBatchResults(batchIdToPoll);
          await fetchServerBatches(currentUser);
        }
      } catch (err) {
        if (err?.response?.status === 404) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
          removeBatchFromStorage(batchIdToPoll);
          if (batchId === batchIdToPoll) {
            clearCurrentBatch();
          }
          showSnackbarMessage('Batch was deleted on server', 'warning');
        } else {
          console.error('Error polling status:', err);
        }
      }
    }, 5000);
  };

  const fetchBatchResults = async (batchIdToFetch) => {
    try {
      const response = await api.get(`/bulk-results/${batchIdToFetch}`);
      const results = response.data;
      if (status && status.batchId === batchIdToFetch) {
        const finalStatus = { ...status, ...results };
        saveBatchToStorage(finalStatus);
        setStatus(finalStatus);
      }
      if (results?.results) setList(results.results);
    } catch (err) {
      console.error('Error fetching batch results:', err);
    }
  };

  const stopBatchProcessing = async (batchIdToStop) => {
    try {
      const response = await api.post(`/bulk-cancel/${batchIdToStop}`);
      if (response.status === 200) {
        showSnackbarMessage('Batch processing stop requested', 'success');
        setStopDialog({ open: false, batchId: null });
        if (status && status.batchId === batchIdToStop) {
          const updatedStatus = { ...status, status: 'stopping' };
          setStatus(updatedStatus);
          saveBatchToStorage(updatedStatus);
        }
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        setLoading(false);
        await fetchServerBatches(currentUser);
      } else {
        throw new Error('Failed to stop batch');
      }
    } catch (err) {
      showSnackbarMessage('Failed to stop batch', 'error');
      console.error('Error stopping batch:', err);
    }
  };

  const deleteBatch = async (batchIdToDelete) => {
    try {
      const response = await api.delete(`/bulk-job/${batchIdToDelete}`);
      if (response.status === 200) {
        showSnackbarMessage('Batch deleted successfully', 'success');
        setDeleteDialog({ open: false, batchId: null });
        removeBatchFromStorage(batchIdToDelete);
        if (batchId === batchIdToDelete) clearCurrentBatch();
        await fetchServerBatches(currentUser);
      } else {
        throw new Error('Failed to delete batch');
      }
    } catch (err) {
      showSnackbarMessage('Failed to delete batch', 'error');
      console.error('Error deleting batch:', err);
    }
  };

  const downloadResults = async (batchIdToDownload) => {
    try {
      const response = await api.get(`/bulk-results/${batchIdToDownload}`);
      const data = response.data;
      const blob = new Blob([JSON.stringify(data.results || [], null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `batch-${batchIdToDownload}-results.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showSnackbarMessage('Results downloaded successfully', 'success');
    } catch (err) {
      showSnackbarMessage('Failed to download results', 'error');
      console.error('Error downloading results:', err);
    }
  };

  const downloadStructuredZip = async (batchIdToDownload) => {
    try {
      const response = await api.get(`/bulk-download/${batchIdToDownload}/structured`, { responseType: 'blob' });
      const disposition = response.headers['content-disposition'] || '';
      const match = disposition.match(/filename="?(.+)"?/);
      const filename = match ? match[1] : `batch_${batchIdToDownload}_reports.zip`;
      const url = URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showSnackbarMessage('Structured ZIP downloaded', 'success');
    } catch (err) {
      console.error('Error downloading structured ZIP:', err);
      showSnackbarMessage('Failed to download structured ZIP', 'error');
    }
  };

  const saveBatchToStorage = (batchData) => {
    setActiveBatches(prev => {
      try {
        const batches = [...prev];
        const idx = batches.findIndex(b => b.batchId === batchData.batchId);
        if (idx >= 0) batches[idx] = { ...batches[idx], ...normalizeBatch(batchData) };
        else batches.push(normalizeBatch(batchData));
        return batches;
      } catch (err) {
        console.error('Error saving batch to storage:', err);
        return prev;
      }
    });
  };

  const removeBatchFromStorage = (batchIdToRemove) => {
    setActiveBatches(prev => {
      try {
        const batches = prev.filter(b => b.batchId !== batchIdToRemove);
        return batches;
      } catch (err) {
        console.error('Error removing batch from storage:', err);
        return prev;
      }
    });
  };

  const formatBatchDate = (b) => {
    const raw = b.created_at || b.createdAt || b.createdAtString || null;
    if (!raw) return 'Unknown date';
    const d = new Date(raw);
    return isNaN(d.getTime()) ? 'Unknown date' : d.toLocaleString();
  };

  const resumeBatchTracking = (batch) => {
    setBatchId(batch.batchId);
    setStatus(batch);
    if (['processing', 'pending'].includes(batch.status)) {
      startPolling(batch.batchId);
    }
  };

  const clearCurrentBatch = () => {
    setBatchId(null);
    setStatus(null);
    setFile(null);
    setExcelPreview(null);
    setList([]);
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const canStopBatch = (batchStatus) => ['processing', 'pending'].includes(batchStatus);
  const canDeleteBatch = (batchStatus) => ['completed', 'failed', 'cancelled', 'stopping'].includes(batchStatus);
  const canDownloadResults = (batchStatus) => batchStatus === 'completed';

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Modern Header */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: MODERN_BMW_THEME.textPrimary,
            mb: 2,
            background: MODERN_BMW_THEME.gradientPrimary,
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Bulk Video Analysis
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: MODERN_BMW_THEME.textSecondary,
            fontWeight: 400,
            maxWidth: '800px',
            mx: 'auto',
            lineHeight: 1.6,
            mb: 3
          }}
        >
          Upload Excel files with multiple video URLs for batch processing. 
          Track progress in real-time and download comprehensive analysis reports.
        </Typography>

        <Button 
          startIcon={<History />} 
          onClick={() => setShowHistory(true)} 
          variant="outlined"
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1,
            fontWeight: 600,
            borderColor: MODERN_BMW_THEME.primary,
            color: MODERN_BMW_THEME.primary,
            '&:hover': {
              backgroundColor: MODERN_BMW_THEME.primaryUltraLight,
              borderColor: MODERN_BMW_THEME.primaryDark
            }
          }}
        >
          View History ({activeBatches.length})
        </Button>
      </Box>

      {/* Stats Overview */}
      <Grid container spacing={3}sx={{
    py: 4,
    textAlign: "center",
    display: "flex",
    
    alignItems: "center",
    justifyContent: "center",
  }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            icon={Business}
            value={batchStats.totalBatches}
            label="Total Batches"
            color={MODERN_BMW_THEME.primary}
            subtitle="All time"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            icon={CheckCircle}
            value={batchStats.completedBatches}
            label="Completed"
            color={MODERN_BMW_THEME.success}
            subtitle="Successfully processed"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            icon={Videocam}
            value={batchStats.totalVideos}
            label="Total Videos"
            color={MODERN_BMW_THEME.accent}
            subtitle="Across all batches"
          />
        </Grid>
        
      </Grid>

      <Grid container spacing={4} sx={{
    py: 4,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  }}>
        {/* Left Column - Upload & Settings */}
        <Grid item xs={12} lg={6}>
          {/* Excel Format Guide */}
          <Card sx={{
            background: MODERN_BMW_THEME.surfaceElevated,
            border: `1px solid ${MODERN_BMW_THEME.border}`,
            borderRadius: 3,
            boxShadow: MODERN_BMW_THEME.shadowMd,
            mb: 4
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ color: MODERN_BMW_THEME.textPrimary, fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TableChart sx={{ color: MODERN_BMW_THEME.primary }} />
                Expected Excel Format
              </Typography>
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: MODERN_BMW_THEME.surface }}>
                      <TableCell sx={{ fontWeight: 600, color: MODERN_BMW_THEME.textPrimary }}>OEM Code</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: MODERN_BMW_THEME.textPrimary }}>Location</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: MODERN_BMW_THEME.textPrimary }}>Video URL</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: MODERN_BMW_THEME.textPrimary }}>Vehicle ID</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: MODERN_BMW_THEME.textPrimary }}>Customer Name</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ color: MODERN_BMW_THEME.textSecondary }}>38536</TableCell>
                      <TableCell sx={{ color: MODERN_BMW_THEME.textSecondary }}>Kun Motoren Private Limited</TableCell>
                      <TableCell sx={{ color: MODERN_BMW_THEME.textSecondary, fontFamily: 'monospace', fontSize: '0.75rem' }}>
                        https://southasia.citnow.com/...
                      </TableCell>
                      <TableCell sx={{ color: MODERN_BMW_THEME.textSecondary }}>TS09FW4707</TableCell>
                      <TableCell sx={{ color: MODERN_BMW_THEME.textSecondary }}>Bmw</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Typography variant="body2" sx={{ color: MODERN_BMW_THEME.textTertiary, mt: 2, fontStyle: 'italic' }}>
                💡 The system automatically detects columns containing video URLs. Ensure your Excel file has at least one column with valid CitNow URLs.
              </Typography>
            </CardContent>
          </Card>

          {/* Upload Card */}
          <Card sx={{
            background: MODERN_BMW_THEME.surfaceElevated,
            border: `1px solid ${MODERN_BMW_THEME.border}`,
            borderRadius: 3,
            boxShadow: MODERN_BMW_THEME.shadowMd,
            height: '100%'
          }}>
            <CardContent sx={{ p: 4 }}>
              {/* File Upload Section */}
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4, 
                  mb: 4, 
                  border: `2px dashed ${MODERN_BMW_THEME.border}`,
                  borderRadius: 3,
                  backgroundColor: MODERN_BMW_THEME.surface,
                  textAlign: 'center',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: MODERN_BMW_THEME.primary,
                    backgroundColor: MODERN_BMW_THEME.primaryUltraLight
                  }
                }}
              >
                <CloudUpload sx={{ fontSize: 48, color: MODERN_BMW_THEME.primary, mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ color: MODERN_BMW_THEME.textPrimary, fontWeight: 600 }}>
                  Upload Excel File
                </Typography>
                <Typography variant="body2" sx={{ color: MODERN_BMW_THEME.textSecondary, mb: 3, lineHeight: 1.6 }}>
                  Upload an Excel file containing video URLs for batch processing. 
                  The system will automatically detect and process CitNow URLs.
                </Typography>

                <Button 
                  variant="outlined" 
                  component="label" 
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    borderColor: MODERN_BMW_THEME.primary,
                    color: MODERN_BMW_THEME.primary,
                    '&:hover': {
                      backgroundColor: MODERN_BMW_THEME.primaryUltraLight,
                      borderColor: MODERN_BMW_THEME.primaryDark
                    }
                  }}
                  disabled={!!batchId && canStopBatch(status?.status)}
                >
                  Choose Excel File
                  <input type="file" hidden accept=".xlsx,.xls" onChange={handleFileUpload}
                    disabled={!!batchId && canStopBatch(status?.status)} />
                </Button>

                {file && (
                  <Box sx={{ mt: 3, p: 2, backgroundColor: MODERN_BMW_THEME.successLight, borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ color: MODERN_BMW_THEME.success, fontWeight: 600 }}>
                      ✅ Selected: {file.name}
                    </Typography>
                    {excelPreview && (
                      <Typography variant="body2" sx={{ color: MODERN_BMW_THEME.textSecondary, mt: 1 }}>
                        {excelPreview.message}
                      </Typography>
                    )}
                  </Box>
                )}
              </Paper>

              {/* Translation Settings */}
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  mb: 4,
                  backgroundColor: MODERN_BMW_THEME.surface,
                  border: `1px solid ${MODERN_BMW_THEME.borderLight}`,
                  borderRadius: 2
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ color: MODERN_BMW_THEME.textPrimary, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Translate sx={{ color: MODERN_BMW_THEME.primary }} />
                  Translation Settings
                </Typography>
                
                <TextField 
                  fullWidth 
                  select 
                  label="Target Language" 
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: MODERN_BMW_THEME.background,
                    }
                  }}
                >
                  {LANGS.filter(l => l.code !== 'auto').map(lang => (
                    <MenuItem key={lang.code} value={lang.code}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography variant="body1">{lang.icon}</Typography>
                        <Typography>{lang.name}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Paper>

              {/* Action Button */}
              <Box sx={{ textAlign: 'center' }}>
                <Button 
                  variant="contained" 
                  size="large" 
                  startIcon={<PlayArrow />}
                  onClick={startBulkProcessing}
                  disabled={!file || loading || (!!batchId && canStopBatch(status?.status))}
                  sx={{
                    background: MODERN_BMW_THEME.gradientPrimary,
                    borderRadius: 3,
                    px: 6,
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '16px',
                    boxShadow: MODERN_BMW_THEME.shadowMd,
                    '&:hover': {
                      boxShadow: MODERN_BMW_THEME.shadowLg,
                      transform: 'translateY(-1px)'
                    },
                    '&:disabled': {
                      background: MODERN_BMW_THEME.textTertiary,
                      transform: 'none'
                    },
                    transition: 'all 0.2s ease-in-out',
                    minWidth: 200
                  }}
                >
                  {loading ? 'Processing...' : 'Start Bulk Processing'}
                </Button>

                {batchId && (
                  <Button 
                    variant="outlined" 
                    onClick={clearCurrentBatch} 
                    disabled={loading}
                    sx={{ ml: 2, borderRadius: 3, fontWeight: 600 }}
                  >
                    New Upload
                  </Button>
                )}
              </Box>

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mt: 3,
                    borderRadius: 2,
                    border: `1px solid ${MODERN_BMW_THEME.errorLight}`,
                    backgroundColor: MODERN_BMW_THEME.errorLight
                  }}
                >
                  {error}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Status & Preview */}
        <Grid item xs={12} lg={6}>
          {/* Current Status */}
          {status && (
            <Card sx={{
              background: MODERN_BMW_THEME.surfaceElevated,
              border: `1px solid ${MODERN_BMW_THEME.border}`,
              borderRadius: 3,
              boxShadow: MODERN_BMW_THEME.shadowMd,
              mb: 4
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Box>
                    <Typography variant="h6" sx={{ color: MODERN_BMW_THEME.textPrimary, fontWeight: 600, mb: 1 }}>
                      Processing Status
                    </Typography>
                    <Typography variant="body2" sx={{ color: MODERN_BMW_THEME.textSecondary }}>
                      Batch ID: {status.batchId}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <StatusBadge status={status.status} />
                    
                    {canStopBatch(status.status) && (
                      <Tooltip title="Stop Processing">
                        <IconButton 
                          sx={{ 
                            color: MODERN_BMW_THEME.error,
                            backgroundColor: `${MODERN_BMW_THEME.error}08`,
                            '&:hover': { backgroundColor: `${MODERN_BMW_THEME.error}15` }
                          }}
                          onClick={() => setStopDialog({ open: true, batchId: status.batchId })}
                        >
                          <Stop />
                        </IconButton>
                      </Tooltip>
                    )}
                    
                    {canDownloadResults(status.status) && (
                      <>
                        <Tooltip title="Download JSON Results">
                          <IconButton 
                            sx={{ 
                              color: MODERN_BMW_THEME.primary,
                              backgroundColor: `${MODERN_BMW_THEME.primary}08`,
                              '&:hover': { backgroundColor: `${MODERN_BMW_THEME.primary}15` }
                            }}
                            onClick={() => downloadResults(status.batchId)}
                          >
                            <Description />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download Structured ZIP">
                          <IconButton 
                            sx={{ 
                              color: MODERN_BMW_THEME.primary,
                              backgroundColor: `${MODERN_BMW_THEME.primary}08`,
                              '&:hover': { backgroundColor: `${MODERN_BMW_THEME.primary}15` }
                            }}
                            onClick={() => downloadStructuredZip(status.batchId)}
                          >
                            <Archive />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                    
                    {canDeleteBatch(status.status) && (
                      <Tooltip title="Delete Batch">
                        <IconButton 
                          sx={{ 
                            color: MODERN_BMW_THEME.error,
                            backgroundColor: `${MODERN_BMW_THEME.error}08`,
                            '&:hover': { backgroundColor: `${MODERN_BMW_THEME.error}15` }
                          }}
                          onClick={() => setDeleteDialog({ open: true, batchId: status.batchId })}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Box>

                {/* Progress Stats */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ color: MODERN_BMW_THEME.textSecondary, mb: 1 }}>Total URLs</Typography>
                      <Typography variant="h4" sx={{ color: MODERN_BMW_THEME.textPrimary, fontWeight: 700 }}>
                        {status.total_urls}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ color: MODERN_BMW_THEME.textSecondary, mb: 1 }}>Processed</Typography>
                      <Typography variant="h4" sx={{ color: MODERN_BMW_THEME.primary, fontWeight: 700 }}>
                        {status.processed_urls}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ color: MODERN_BMW_THEME.textSecondary, mb: 1 }}>Failed</Typography>
                      <Typography variant="h4" sx={{ color: MODERN_BMW_THEME.error, fontWeight: 700 }}>
                        {status.failed_urls}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ color: MODERN_BMW_THEME.textSecondary, mb: 1 }}>Progress</Typography>
                      <Typography variant="h4" sx={{ color: MODERN_BMW_THEME.success, fontWeight: 700 }}>
                        {status.progress_percentage}%
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Progress Bar */}
                <Box sx={{ mb: 3 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={status.progress_percentage || 0} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: MODERN_BMW_THEME.borderLight,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: MODERN_BMW_THEME.primary,
                        borderRadius: 4
                      }
                    }} 
                  />
                </Box>

                {/* Current URL */}
                {status.current_url && (
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 2, 
                      backgroundColor: MODERN_BMW_THEME.surface,
                      border: `1px solid ${MODERN_BMW_THEME.borderLight}`,
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="body2" sx={{ color: MODERN_BMW_THEME.textPrimary, fontWeight: 600, mb: 1 }}>
                      🎥 Currently Processing:
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: MODERN_BMW_THEME.textSecondary, 
                      fontFamily: 'monospace',
                      wordBreak: 'break-all'
                    }}>
                      {status.current_url}
                    </Typography>
                  </Paper>
                )}

                {/* Status Messages */}
                {status.status === 'completed' && (
                  <Alert 
                    severity="success" 
                    sx={{ 
                      mt: 2,
                      borderRadius: 2,
                      border: `1px solid ${MODERN_BMW_THEME.successLight}`,
                      backgroundColor: MODERN_BMW_THEME.successLight
                    }}
                  >
                    ✅ Bulk processing completed! Processed: {status.processed_urls} | Failed: {status.failed_urls}
                  </Alert>
                )}
                
                {status.status === 'failed' && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mt: 2,
                      borderRadius: 2,
                      border: `1px solid ${MODERN_BMW_THEME.errorLight}`,
                      backgroundColor: MODERN_BMW_THEME.errorLight
                    }}
                  >
                    ❌ Processing failed. Please check the server logs for details.
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* Results Preview */}
          {list.length > 0 && (
            <Card sx={{
              background: MODERN_BMW_THEME.surfaceElevated,
              border: `1px solid ${MODERN_BMW_THEME.border}`,
              borderRadius: 3,
              boxShadow: MODERN_BMW_THEME.shadowMd
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ color: MODERN_BMW_THEME.textPrimary, fontWeight: 600 }}>
                    Results Preview
                  </Typography>
                  <TextField
                    size="small"
                    placeholder="Search results..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: MODERN_BMW_THEME.textTertiary }} />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: MODERN_BMW_THEME.background,
                      }
                    }}
                  />
                </Box>
                <Typography variant="body2" sx={{ color: MODERN_BMW_THEME.textSecondary, mb: 3 }}>
                  Showing {list.length} processed videos
                </Typography>
                {/* Add results table or preview here */}
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Enhanced History Dialog */}
      <Dialog 
        open={showHistory} 
        onClose={() => setShowHistory(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: MODERN_BMW_THEME.background,
            border: `1px solid ${MODERN_BMW_THEME.border}`,
            boxShadow: MODERN_BMW_THEME.shadowXl
          }
        }}
      >
        <DialogTitle sx={{
          background: MODERN_BMW_THEME.gradientPrimary,
          color: MODERN_BMW_THEME.background,
          fontWeight: 600,
          py: 3
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <History sx={{ fontSize: 24 }} />
              <Typography variant="h6" sx={{ color: MODERN_BMW_THEME.background, fontWeight: 600 }}>
                Processing History
              </Typography>
            </Box>
            <IconButton 
              onClick={() => setShowHistory(false)}
              sx={{ 
                color: MODERN_BMW_THEME.background,
                background: 'rgba(255, 255, 255, 0.2)',
                '&:hover': { background: 'rgba(255, 255, 255, 0.3)' }
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {activeBatches.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <History sx={{ fontSize: 64, color: MODERN_BMW_THEME.textTertiary, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" sx={{ color: MODERN_BMW_THEME.textSecondary, fontWeight: 500, mb: 1 }}>
                No Processing History
              </Typography>
              <Typography variant="body2" sx={{ color: MODERN_BMW_THEME.textTertiary }}>
                Your batch processing history will appear here once you start analyzing videos.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {activeBatches.map((b) => (
                <Fade in={true} key={b.batchId}>
                  <Card 
                    sx={{ 
                      p: 3,
                      border: `1px solid ${MODERN_BMW_THEME.border}`,
                      borderRadius: 2,
                      backgroundColor: MODERN_BMW_THEME.surfaceElevated,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        borderColor: MODERN_BMW_THEME.primaryLight,
                        boxShadow: MODERN_BMW_THEME.shadowMd
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ color: MODERN_BMW_THEME.textPrimary, fontWeight: 600, mb: 1 }}>
                          {b.filename || 'Unknown file'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: MODERN_BMW_THEME.textSecondary, mb: 1 }}>
                          Batch: {b.batchId} | {formatBatchDate(b)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: MODERN_BMW_THEME.textPrimary }}>
                          Processed: {b.processed_urls || 0} / {b.total_urls || 0} 
                          {b.failed_urls > 0 && ` | Failed: ${b.failed_urls}`}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <StatusBadge status={b.status} size="small" />
                        
                        {['processing','pending'].includes(b.status) && (
                          <Button 
                            size="small" 
                            startIcon={<Refresh />} 
                            onClick={() => { resumeBatchTracking(b); setShowHistory(false); }}
                            sx={{ 
                              fontWeight: 600,
                              borderRadius: 2
                            }}
                          >
                            Track
                          </Button>
                        )}
                        
                        {canDownloadResults(b.status) && (
                          <Tooltip title="Download Results">
                            <IconButton 
                              size="small"
                              sx={{ 
                                color: MODERN_BMW_THEME.primary,
                                backgroundColor: `${MODERN_BMW_THEME.primary}08`,
                                '&:hover': { backgroundColor: `${MODERN_BMW_THEME.primary}15` }
                              }}
                              onClick={() => downloadResults(b.batchId)}
                            >
                              <Download />
                            </IconButton>
                          </Tooltip>
                        )}
                        
                        {canDeleteBatch(b.status) && (
                          <Tooltip title="Delete Batch">
                            <IconButton 
                              size="small"
                              sx={{ 
                                color: MODERN_BMW_THEME.error,
                                backgroundColor: `${MODERN_BMW_THEME.error}08`,
                                '&:hover': { backgroundColor: `${MODERN_BMW_THEME.error}15` }
                              }}
                              onClick={() => setDeleteDialog({ open: true, batchId: b.batchId })}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </Box>
                  </Card>
                </Fade>
              ))}
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: `1px solid ${MODERN_BMW_THEME.border}` }}>
          <Button 
            onClick={() => setShowHistory(false)}
            sx={{ 
              fontWeight: 600,
              borderRadius: 2,
              px: 4
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Stop Dialog */}
      <Dialog 
        open={stopDialog.open} 
        onClose={() => setStopDialog({ open: false, batchId: null })}
        PaperProps={{ 
          sx: { 
            borderRadius: 3,
            background: MODERN_BMW_THEME.background,
            border: `1px solid ${MODERN_BMW_THEME.border}`,
            boxShadow: MODERN_BMW_THEME.shadowXl
          } 
        }}
      >
        <DialogTitle sx={{ color: MODERN_BMW_THEME.textPrimary, fontWeight: 600, py: 3 }}>
          Stop Batch Processing?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: MODERN_BMW_THEME.textSecondary, lineHeight: 1.6 }}>
            Are you sure you want to stop this batch? Current progress will be saved and you can resume later.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: `1px solid ${MODERN_BMW_THEME.border}` }}>
          <Button 
            onClick={() => setStopDialog({ open: false, batchId: null })}
            sx={{ 
              fontWeight: 600,
              borderRadius: 2,
              px: 4,
              borderColor: MODERN_BMW_THEME.border,
              color: MODERN_BMW_THEME.textSecondary
            }}
          >
            Cancel
          </Button>
          <Button 
            color="error" 
            variant="contained" 
            onClick={() => stopBatchProcessing(stopDialog.batchId)}
            sx={{ 
              fontWeight: 600, 
              borderRadius: 2,
              px: 4,
              background: MODERN_BMW_THEME.gradientAccent,
              boxShadow: MODERN_BMW_THEME.shadowMd,
              '&:hover': {
                boxShadow: MODERN_BMW_THEME.shadowLg
              }
            }}
          >
            Stop Processing
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Delete Dialog */}
      <Dialog 
        open={deleteDialog.open} 
        onClose={() => setDeleteDialog({ open: false, batchId: null })}
        PaperProps={{ 
          sx: { 
            borderRadius: 3,
            background: MODERN_BMW_THEME.background,
            border: `1px solid ${MODERN_BMW_THEME.border}`,
            boxShadow: MODERN_BMW_THEME.shadowXl
          } 
        }}
      >
        <DialogTitle sx={{ color: MODERN_BMW_THEME.textPrimary, fontWeight: 600, py: 3 }}>
          Delete Batch?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: MODERN_BMW_THEME.textSecondary, lineHeight: 1.6 }}>
            Are you sure you want to delete this batch and all its results? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: `1px solid ${MODERN_BMW_THEME.border}` }}>
          <Button 
            onClick={() => setDeleteDialog({ open: false, batchId: null })}
            sx={{ 
              fontWeight: 600,
              borderRadius: 2,
              px: 4,
              borderColor: MODERN_BMW_THEME.border,
              color: MODERN_BMW_THEME.textSecondary
            }}
          >
            Cancel
          </Button>
          <Button 
            color="error" 
            variant="contained" 
            onClick={() => deleteBatch(deleteDialog.batchId)}
            sx={{ 
              fontWeight: 600, 
              borderRadius: 2,
              px: 4,
              background: MODERN_BMW_THEME.gradientAccent,
              boxShadow: MODERN_BMW_THEME.shadowMd,
              '&:hover': {
                boxShadow: MODERN_BMW_THEME.shadowLg
              }
            }}
          >
            Delete Batch
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity} 
          sx={{ 
            width: '100%',
            borderRadius: 2,
            fontWeight: 600,
            boxShadow: MODERN_BMW_THEME.shadowMd
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}