import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Box, Chip, Tooltip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  TablePagination, Grid, LinearProgress, Avatar, Fade, Container, TextField, Stack,
  InputAdornment, Divider, Badge, MenuItem, Menu
} from '@mui/material';
import {
  Business, DirectionsCar, Person, Description, Email, Phone, Videocam, Mic,
  Vibration, VolumeUp, VolumeOff, Warning, CheckCircle, Score, Visibility, ArrowBack,
  Delete as DeleteIcon, FileDownload as FileDownloadIcon, Search as SearchIcon,
  FilterList, Refresh, Analytics, TrendingUp, Star, Assessment, Dashboard as DashboardIcon,
  PieChart, Timeline, Speed, Group, VideoLibrary, EmojiEvents, PictureAsPdf
} from '@mui/icons-material';
import api from '../../services/api';
import { getDealerUserStats } from '../../services/dealer_user';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Modern BMW-Inspired Theme (same as your dealer management)
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
  successUltraLight: '#ECFDF5',
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

// Enhanced Quality Score Display

const QualityScoreBadge = ({ score, label, type = 'overall' }) => {
  const getColorConfig = () => {
    if (score >= 8) return { color: MODERN_BMW_THEME.success, bg: MODERN_BMW_THEME.successLight };
    if (score >= 6) return { color: MODERN_BMW_THEME.primary, bg: MODERN_BMW_THEME.primaryUltraLight };
    if (score >= 4) return { color: MODERN_BMW_THEME.warning, bg: MODERN_BMW_THEME.warningLight };
    return { color: MODERN_BMW_THEME.error, bg: MODERN_BMW_THEME.errorLight };
  };

  const colors = getColorConfig();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{
        width: type === 'overall' ? 44 : 36,
        height: type === 'overall' ? 44 : 36,
        borderRadius: '50%',
        background: colors.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `2px solid ${colors.color}30`
      }}>
        <Typography variant={type === 'overall' ? 'h6' : 'body2'} sx={{
          color: colors.color,
          fontWeight: 700
        }}>
          {score.toFixed(1)}
        </Typography>
      </Box>
      {/* For Video and Audio - just colored text, no chip */}
      {type !== 'overall' && (
        <Typography variant="body2" sx={{
          color: colors.color,
          fontWeight: 600,
          fontSize: '0.875rem'
        }}>
          {label || 'N/A'}
        </Typography>
      )}
      {/* For Overall - show label without "OVERALL" text */}
      {type === 'overall' && (
        <Chip
          label={label || 'N/A'}
          size="small"
          sx={{
            background: colors.bg,
            color: colors.color,
            fontWeight: 600,
            fontSize: '0.7rem',
            height: '20px'
          }}
        />
      )}
    </Box>
  );
};

// Enhanced Stats Cards
const StatsCard = ({ icon: Icon, value, label, color, trend }) => (
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
        mb: 0.5
      }}>
        {value}
      </Typography>
      <Typography variant="body2" sx={{
        color: MODERN_BMW_THEME.textSecondary,
        fontWeight: 500
      }}>
        {label}
      </Typography>
    </CardContent>
  </Card>
);

export default function Results() {
  const { user: authUser } = useContext(AuthContext);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [userStats, setUserStats] = useState([]);
  const [dealershipFilter, setDealershipFilter] = useState(''); // '' = All
  const [exportAnchor, setExportAnchor] = useState(null); // export dropdown

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [allRows, setAllRows] = useState([]); // All loaded rows
  const [currentPageBackend, setCurrentPageBackend] = useState(1); // Backend page number
  const [hasMore, setHasMore] = useState(true); // More data to load


  // Dashboard stats
  const [stats, setStats] = useState({
    totalResults: 0,
    averageVideoScore: 0,
    averageAudioScore: 0,
    averageOverallScore: 0,
    qualityDistribution: { excellent: 0, good: 0, fair: 0, poor: 0 }
  });



  const loadData = async () => {
    setLoading(true);
    try {
      // Load results
      const res = await api.get('/results?page=1&per_page=100');
      const data = res.data;

      // Handle NEW format securely
      let rawResults = data.results || data || [];

      // Ensure it's an array before processing
      let results = [];
      if (Array.isArray(rawResults)) {
        results = rawResults;
      } else if (typeof rawResults === 'object') {
        const values = Object.values(rawResults);
        if (values.length > 0 && Array.isArray(values[0])) {
          results = values[0];
        }
      }

      // 🔐 HIERARCHY FILTER: Each user sees only THEIR OWN uploaded analyses
      // Try all possible ID field names from authUser
      const currentUserId = authUser?.id || authUser?._id || authUser?.user_id;
      console.log('🔐 Results filter - currentUserId:', currentUserId, 'authUser:', authUser);

      if (currentUserId && results.length > 0) {
        const before = results.length;
        results = results.filter(r => {
          const submittedBy = r.submitted_by_user_id
            || r.user_id
            || r.submitted_by
            || r.created_by;
          return submittedBy === currentUserId
            || submittedBy === String(currentUserId)
            || String(submittedBy) === String(currentUserId);
        });
        console.log(`🔐 Filtered from ${before} → ${results.length} results for user ${authUser?.username}`);
      }

      // Update states safely
      setRows(results);
      setAllRows(results);
      setCurrentPageBackend(2);
      setHasMore(false); // disable lazy loading since we filter client-side

      // Only show current user's own stats - no other users
      setUserStats([]);

      // Compute stats from FILTERED results only
      if (Array.isArray(results) && results.length > 0) {
        const avgVideo = results.reduce((sum, r) => sum + (r.video_analysis?.quality_score || r.video_quality_score || 0), 0) / results.length;
        const avgAudio = results.reduce((sum, r) => sum + (r.audio_analysis?.score || r.audio_quality_score || 0), 0) / results.length;
        const avgOverall = results.reduce((sum, r) => sum + (r.overall_quality?.overall_score || r.overall_quality_score || 0), 0) / results.length;

        const distribution = { excellent: 0, good: 0, fair: 0, poor: 0 };
        results.forEach(r => {
          const score = r.overall_quality?.overall_score || r.overall_quality_score || 0;
          if (score >= 8) distribution.excellent++;
          else if (score >= 6) distribution.good++;
          else if (score >= 4) distribution.fair++;
          else distribution.poor++;
        });

        setStats({
          totalResults: results.length,   // use FILTERED count, not backend total
          averageVideoScore: avgVideo,
          averageAudioScore: avgAudio,
          averageOverallScore: avgOverall,
          qualityDistribution: distribution
        });
      } else {
        setStats({
          totalResults: 0,
          averageVideoScore: 0,
          averageAudioScore: 0,
          averageOverallScore: 0,
          qualityDistribution: { excellent: 0, good: 0, fair: 0, poor: 0 }
        });
      }

    } catch (error) {
      console.error('Error loading results:', error);
      setRows([]);
      setAllRows([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshCounter]);


  const handleViewDetails = (result) => {
    setSelectedResult(result);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this analysis record?')) return;
    try {
      await api.delete(`/results/${id}`);
      setRows(rs => rs.filter(r => r._id !== id));
      setAllRows(rs => rs.filter(r => r._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete record.');
    }
  };

  const loadNextPage = async () => {
    if (!hasMore) {
      console.log('No more data to load');
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(`/results?page=${currentPageBackend}&per_page=100`);
      const data = res.data;
      const nextResults = data.results || data || [];

      console.log(`Loaded page ${currentPageBackend}: ${nextResults.length} results`);

      if (nextResults.length === 0) {
        setHasMore(false);
        console.log('No more results, setting hasMore to false');
      } else {
        // ✅ Update BOTH states
        setRows(prev => [...prev, ...nextResults]);
        setAllRows(prev => [...prev, ...nextResults]); // Also update allRows

        // Update page counter
        setCurrentPageBackend(prev => prev + 1);

        // ✅ Check if still has more based on backend response
        if (data.has_more !== undefined) {
          setHasMore(data.has_more);
        } else if (data.total !== undefined) {
          // Calculate if we've loaded all data
          const totalLoaded = rows.length + nextResults.length;
          setHasMore(totalLoaded < data.total);
        } else {
          // If we got fewer than 100 results, assume no more data
          setHasMore(nextResults.length === 100);
        }
      }

    } catch (error) {
      console.error('Error loading next page:', error);
      setHasMore(false); // Stop trying if there's an error
    } finally {
      setLoading(false);
    }
  };
  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);

    // Calculate the row index for the last item on the new page
    const lastRowIndex = (newPage + 1) * rowsPerPage;

    // Check if we need to load more data
    // Load more when we're within 2 pages of the end of loaded data
    if (hasMore && lastRowIndex >= allRows.length - (rowsPerPage * 2)) {
      console.log(`Loading more data. Last row index: ${lastRowIndex}, All rows: ${allRows.length}`);
      loadNextPage();
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Unique dealerships from loaded results for filter dropdown
  const dealershipOptions = Array.from(
    new Set(
      (allRows || [])
        .map(r => r.citnow_metadata?.dealership)
        .filter(Boolean)
    )
  ).sort();

  const filteredRows = (allRows || []).filter(r => {
    const term = searchTerm.toLowerCase();
    const dm = r.citnow_metadata || {};
    const dealershipMatch = !dealershipFilter || (dm.dealership || '') === dealershipFilter;
    const searchMatch = (
      (dm.dealership || '').toLowerCase().includes(term) ||
      (dm.vehicle || dm.registration || '').toLowerCase().includes(term) ||
      (dm.email || '').toLowerCase().includes(term) ||
      (dm.phone || '').toLowerCase().includes(term) ||
      (dm.service_advisor || '').toLowerCase().includes(term)
    );
    return dealershipMatch && searchMatch;
  });

  // Get current page data
  const paginatedRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Add this useEffect to debug pagination
  useEffect(() => {
    console.log('📊 Pagination Debug:', {
      page,
      rowsPerPage,
      allRowsCount: allRows.length,
      rowsCount: rows.length,
      currentPageBackend,
      hasMore,
      paginatedRowsCount: paginatedRows.length,
      filteredRowsCount: filteredRows.length
    });
  }, [page, rowsPerPage, allRows.length, rows.length, currentPageBackend, hasMore, paginatedRows.length, filteredRows.length]);

  const exportToCsv = () => {
    if (!filteredRows.length) {
      alert('No results to export');
      return;
    }

    const headers = [
      'Dealership',
      'Vehicle/Registration',
      'VIN',
      'Email',
      'Phone',
      'Video Score',
      'Audio Score',
      'Overall Score',
      'Transcription',
      'Summary',
      'Translation',
      'Uploaded (Date)',
      'Video Link',
      'ID'
    ];

    const lines = filteredRows.map(r => {
      const m = r.citnow_metadata || {};
      const vehicleReg = [m.vehicle, m.registration].filter(Boolean).join('/');
      const vin = m.vin || '';
      const email = m.email || '';
      const phone = m.phone || '';
      const vidScore = (r.video_analysis?.quality_score || 0).toFixed(1);
      const audScore = (r.audio_analysis?.score || 0).toFixed(1);
      const overall = (r.overall_quality?.overall_score || 0).toFixed(1);
      const transcription = r.transcription?.text || '';
      const summary = r.summarization?.summary || '';
      const translation = r.translation?.translated_text || '';
      const uploadedDate = r.created_at ? new Date(r.created_at).toLocaleString() : '';
      const videoLink = m.page_url || '';
      const id = r._id;

      const row = [
        m.dealership || '',
        vehicleReg,
        vin,
        email,
        phone,
        vidScore,
        audScore,
        overall,
        transcription,
        summary,
        translation,
        uploadedDate,
        videoLink,
        id
      ];

      return row.map(cell => `"${('' + cell).replace(/"/g, '""')}"`).join(',');
    });

    const csv = [headers.join(','), ...lines].join('\r\n');
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quality_analysis_results_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToPdf = () => {
    if (!filteredRows.length) {
      alert('No results to export');
      return;
    }

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    // Header
    doc.setFillColor(14, 35, 66);
    doc.rect(0, 0, 297, 18, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('CitNOW Analytics — Quality Analysis Report', 14, 12);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleString()}`, 220, 12);

    // Table
    const columns = [
      { header: 'Dealership', dataKey: 'dealership' },
      { header: 'Vehicle', dataKey: 'vehicle' },
      { header: 'Service Advisor', dataKey: 'advisor' },
      { header: 'Video Score', dataKey: 'video' },
      { header: 'Audio Score', dataKey: 'audio' },
      { header: 'Overall Score', dataKey: 'overall' },
      { header: 'Quality', dataKey: 'quality' },
      { header: 'Date', dataKey: 'date' },
    ];

    const tableData = filteredRows.map(r => {
      const m = r.citnow_metadata || {};
      return {
        dealership: m.dealership || '—',
        vehicle: [m.vehicle, m.registration].filter(Boolean).join(' / ') || '—',
        advisor: m.service_advisor || '—',
        video: (r.video_analysis?.quality_score || 0).toFixed(1),
        audio: (r.audio_analysis?.score || 0).toFixed(1),
        overall: (r.overall_quality?.overall_score || 0).toFixed(1),
        quality: r.overall_quality?.overall_label || '—',
        date: r.created_at ? new Date(r.created_at).toLocaleDateString() : '—',
      };
    });

    autoTable(doc, {
      startY: 22,
      columns,
      body: tableData,
      headStyles: {
        fillColor: [14, 35, 66],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9,
      },
      bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: {
        video: { halign: 'center' },
        audio: { halign: 'center' },
        overall: { halign: 'center' },
        quality: { halign: 'center' },
      },
      margin: { left: 14, right: 14 },
      didDrawPage: (data) => {
        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `Page ${data.pageNumber} of ${pageCount}`,
          data.settings.margin.left,
          doc.internal.pageSize.height - 5
        );
      },
    });

    doc.save(`quality_analysis_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const getUserName = (userId) => {
    //  Add array check
    if (!Array.isArray(userStats)) return null;
    const user = userStats.find(u => u.user_id === userId);
    return user ? user.username : null;
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedResult(null);
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      py: 4
    }}>
      <Container maxWidth="xl">
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
            Quality Analysis Results
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: MODERN_BMW_THEME.textSecondary,
              fontWeight: 400,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Comprehensive overview of all video quality assessments with detailed analytics and insights
          </Typography>
        </Box>

        {/* Stats Overview */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              icon={VideoLibrary}
              value={stats.totalResults}
              label="Total Analyses"
              color={MODERN_BMW_THEME.primary}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              icon={Videocam}
              value={stats.averageVideoScore.toFixed(1)}
              label="Avg Video Score"
              color={MODERN_BMW_THEME.success}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              icon={Mic}
              value={stats.averageAudioScore.toFixed(1)}
              label="Avg Audio Score"
              color={MODERN_BMW_THEME.accent}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              icon={Score}
              value={stats.averageOverallScore.toFixed(1)}
              label="Avg Overall Score"
              color={MODERN_BMW_THEME.primary}
            />
          </Grid>
        </Grid>
        {/* User Analysis Stats Section */}
        {/* User Analysis Stats Section */}
        {Array.isArray(userStats) && userStats.length > 0 ? (
          <Card sx={{
            background: MODERN_BMW_THEME.surfaceElevated,
            border: `1px solid ${MODERN_BMW_THEME.border}`,
            borderRadius: 3,
            boxShadow: MODERN_BMW_THEME.shadowSm,
            mb: 4
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Group sx={{
                  fontSize: 28,
                  color: MODERN_BMW_THEME.primary,
                  mr: 2
                }} />
                <Typography variant="h5" sx={{
                  color: MODERN_BMW_THEME.textPrimary,
                  fontWeight: 600
                }}>
                  User Analysis Statistics
                </Typography>
              </Box>

              <Grid container spacing={2}>
                {userStats.map((user, index) => {
                  // ✅ Add null checks for user properties
                  const username = user?.username || 'Unknown User';
                  const email = user?.email || 'No email';
                  const role = user?.role || 'unknown';
                  const videosAnalyzed = user?.videos_analyzed || 0;
                  const userId = user?.user_id || `user-${index}`;

                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={userId}>
                      <Card sx={{
                        background: MODERN_BMW_THEME.surface,
                        border: `1px solid ${MODERN_BMW_THEME.borderLight}`,
                        borderRadius: 2,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          boxShadow: MODERN_BMW_THEME.shadowMd,
                          transform: 'translateY(-2px)'
                        }
                      }}>
                        <CardContent sx={{ p: 2.5, textAlign: 'center' }}>
                          <Avatar
                            sx={{
                              width: 56,
                              height: 56,
                              background: MODERN_BMW_THEME.gradientPrimary,
                              fontWeight: 600,
                              fontSize: '18px',
                              mb: 2,
                              mx: 'auto'
                            }}
                          >
                            {username.charAt(0).toUpperCase()}
                          </Avatar>

                          <Typography variant="h6" sx={{
                            color: MODERN_BMW_THEME.textPrimary,
                            fontWeight: 600,
                            mb: 0.5
                          }}>
                            {username}
                          </Typography>

                          <Typography variant="body2" sx={{
                            color: MODERN_BMW_THEME.textSecondary,
                            mb: 1
                          }}>
                            {email}
                          </Typography>

                          <Chip
                            label={role === 'dealer_admin' ? 'Admin' : 'User'}
                            size="small"
                            sx={{
                              background: role === 'dealer_admin'
                                ? MODERN_BMW_THEME.primaryUltraLight
                                : MODERN_BMW_THEME.successLight,
                              color: role === 'dealer_admin'
                                ? MODERN_BMW_THEME.primary
                                : MODERN_BMW_THEME.success,
                              fontWeight: 600,
                              mb: 2
                            }}
                          />

                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                            background: MODERN_BMW_THEME.primaryUltraLight,
                            borderRadius: 2,
                            py: 1,
                            border: `1px solid ${MODERN_BMW_THEME.primary}20`
                          }}>
                            <VideoLibrary sx={{
                              fontSize: 20,
                              color: MODERN_BMW_THEME.primary
                            }} />
                            <Typography variant="h6" sx={{
                              color: MODERN_BMW_THEME.primary,
                              fontWeight: 700
                            }}>
                              {videosAnalyzed}
                            </Typography>
                            <Typography variant="body2" sx={{
                              color: MODERN_BMW_THEME.textSecondary,
                              fontWeight: 500
                            }}>
                              videos
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        ) : null}

        {/* Results Table Section */}
        <Card sx={{
          background: MODERN_BMW_THEME.surfaceElevated,
          border: `1px solid ${MODERN_BMW_THEME.border}`,
          borderRadius: 3,
          boxShadow: MODERN_BMW_THEME.shadowSm,
          overflow: 'hidden'
        }}>
          <CardContent sx={{ p: 0 }}>
            {/* Enhanced Action Bar */}
            <Box sx={{
              p: 3,
              background: MODERN_BMW_THEME.surface,
              borderBottom: `1px solid ${MODERN_BMW_THEME.border}`
            }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  size="small"
                  placeholder="Search by dealership, vehicle, email, phone, or advisor…"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(0);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: MODERN_BMW_THEME.textTertiary }} />
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    flexGrow: 1,
                    '& .MuiOutlinedInput-root': {
                      background: MODERN_BMW_THEME.background,
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: MODERN_BMW_THEME.primary,
                      },
                    }
                  }}
                />

                {/* Dealership Filter Dropdown */}
                {dealershipOptions.length > 0 && (
                  <TextField
                    select
                    size="small"
                    label="Dealership"
                    value={dealershipFilter}
                    onChange={(e) => { setDealershipFilter(e.target.value); setPage(0); }}
                    sx={{
                      minWidth: 230,
                      '& .MuiOutlinedInput-root': {
                        background: MODERN_BMW_THEME.background,
                        borderRadius: 2,
                        '&:hover fieldset': { borderColor: MODERN_BMW_THEME.primary },
                      }
                    }}
                  >
                    <MenuItem value="">🏢 All Dealerships</MenuItem>
                    {dealershipOptions.map(d => (
                      <MenuItem key={d} value={d}>{d}</MenuItem>
                    ))}
                  </TextField>
                )}

                <Button
                  startIcon={<Refresh />}
                  variant="outlined"
                  onClick={() => setRefreshCounter(prev => prev + 1)}
                  disabled={loading}
                  sx={{
                    borderColor: MODERN_BMW_THEME.border,
                    color: MODERN_BMW_THEME.textSecondary,
                    borderRadius: 2,
                    fontWeight: 500,
                    '&:hover': {
                      borderColor: MODERN_BMW_THEME.primary,
                      color: MODERN_BMW_THEME.primary
                    }
                  }}
                >
                  Refresh
                </Button>

                {/* Single Export dropdown */}
                <Button
                  variant="contained"
                  endIcon={<FileDownloadIcon />}
                  disabled={!filteredRows.length}
                  onClick={(e) => setExportAnchor(e.currentTarget)}
                  sx={{
                    background: MODERN_BMW_THEME.gradientPrimary,
                    borderRadius: 2,
                    px: 3,
                    fontWeight: 600,
                    boxShadow: MODERN_BMW_THEME.shadowMd,
                    '&:hover': {
                      boxShadow: MODERN_BMW_THEME.shadowLg,
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  Export
                </Button>
                <Menu
                  anchorEl={exportAnchor}
                  open={Boolean(exportAnchor)}
                  onClose={() => setExportAnchor(null)}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  PaperProps={{
                    elevation: 4,
                    sx: { borderRadius: 2, mt: 0.5, minWidth: 160 }
                  }}
                >
                  <MenuItem onClick={() => { exportToCsv(); setExportAnchor(null); }} sx={{ gap: 1.5, py: 1.2 }}>
                    <FileDownloadIcon sx={{ color: MODERN_BMW_THEME.primary, fontSize: 20 }} />
                    Export CSV
                  </MenuItem>
                  <MenuItem onClick={() => { exportToPdf(); setExportAnchor(null); }} sx={{ gap: 1.5, py: 1.2 }}>
                    <PictureAsPdf sx={{ color: '#e74c3c', fontSize: 20 }} />
                    Export PDF
                  </MenuItem>
                </Menu>
              </Stack>
            </Box>

            {loading ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Box sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  border: `3px solid ${MODERN_BMW_THEME.border}`,
                  borderTop: `3px solid ${MODERN_BMW_THEME.primary}`,
                  animation: 'spin 1s linear infinite',
                  mx: 'auto',
                  mb: 3
                }} />
                <Typography variant="h6" sx={{
                  color: MODERN_BMW_THEME.textSecondary,
                  fontWeight: 500
                }}>
                  Loading analysis results...
                </Typography>
              </Box>
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{
                        backgroundColor: MODERN_BMW_THEME.surface,
                        '& th': {
                          borderBottom: `2px solid ${MODERN_BMW_THEME.border}`,
                          fontWeight: 600,
                          color: MODERN_BMW_THEME.textPrimary,
                          fontSize: '0.875rem',
                          py: 2
                        }
                      }}>
                        <TableCell>Dealership</TableCell>
                        <TableCell>Vehicle</TableCell>
                        <TableCell>Service Advisor</TableCell>
                        <TableCell>Video Quality</TableCell>
                        <TableCell>Audio Quality</TableCell>
                        <TableCell>Overall Score</TableCell>
                        <TableCell>Submitted By</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedRows.map((r, index) => (
                        <Fade in={true} timeout={600} key={r._id}>
                          <TableRow
                            hover
                            sx={{
                              '&:hover': {
                                backgroundColor: MODERN_BMW_THEME.surface
                              },
                              '& td': {
                                borderBottom: `1px solid ${MODERN_BMW_THEME.borderLight}`,
                                py: 1.5
                              }
                            }}
                          >
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    background: MODERN_BMW_THEME.gradientPrimary,
                                    fontWeight: 600,
                                    fontSize: '14px',
                                    mr: 2
                                  }}
                                >
                                  <Business sx={{ fontSize: 16 }} />
                                </Avatar>
                                <Box>
                                  <Typography variant="body2" sx={{
                                    color: MODERN_BMW_THEME.textPrimary,
                                    fontWeight: 600
                                  }}>
                                    {r.citnow_metadata?.dealership || '—'}
                                  </Typography>
                                  <Typography variant="caption" sx={{
                                    color: MODERN_BMW_THEME.textTertiary
                                  }}>
                                    {r.citnow_metadata?.email || '—'}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <DirectionsCar sx={{
                                  color: MODERN_BMW_THEME.primary,
                                  mr: 1.5,
                                  fontSize: 18
                                }} />
                                <Box>
                                  <Typography variant="body2" sx={{
                                    color: MODERN_BMW_THEME.textPrimary,
                                    fontWeight: 500
                                  }}>
                                    {r.citnow_metadata?.vehicle || r.citnow_metadata?.registration || '—'}
                                  </Typography>
                                  <Typography variant="caption" sx={{
                                    color: MODERN_BMW_THEME.textTertiary,
                                    fontFamily: 'monospace'
                                  }}>
                                    {r.citnow_metadata?.vin || '—'}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Person sx={{
                                  color: MODERN_BMW_THEME.textSecondary,
                                  mr: 1.5,
                                  fontSize: 18
                                }} />
                                <Typography variant="body2" sx={{
                                  color: MODERN_BMW_THEME.textPrimary
                                }}>
                                  {r.citnow_metadata?.service_advisor || '—'}
                                </Typography>
                              </Box>
                            </TableCell>

                            {/* Video Quality - Just colored text */}
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{
                                  width: 36,
                                  height: 36,
                                  borderRadius: '50%',
                                  background: (() => {
                                    const score = r.video_analysis?.quality_score || 0;
                                    if (score >= 8) return MODERN_BMW_THEME.successLight;
                                    if (score >= 6) return MODERN_BMW_THEME.primaryUltraLight;
                                    if (score >= 4) return MODERN_BMW_THEME.warningLight;
                                    return MODERN_BMW_THEME.errorLight;
                                  })(),
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  border: `2px solid ${(() => {
                                    const score = r.video_analysis?.quality_score || 0;
                                    if (score >= 8) return MODERN_BMW_THEME.success + '30';
                                    if (score >= 6) return MODERN_BMW_THEME.primary + '30';
                                    if (score >= 4) return MODERN_BMW_THEME.warning + '30';
                                    return MODERN_BMW_THEME.error + '30';
                                  })()}`
                                }}>
                                  <Typography variant="body2" sx={{
                                    color: (() => {
                                      const score = r.video_analysis?.quality_score || 0;
                                      if (score >= 8) return MODERN_BMW_THEME.success;
                                      if (score >= 6) return MODERN_BMW_THEME.primary;
                                      if (score >= 4) return MODERN_BMW_THEME.warning;
                                      return MODERN_BMW_THEME.error;
                                    })(),
                                    fontWeight: 700
                                  }}>
                                    {(r.video_analysis?.quality_score || 0).toFixed(1)}
                                  </Typography>
                                </Box>
                                <Typography variant="body2" sx={{
                                  color: (() => {
                                    const score = r.video_analysis?.quality_score || 0;
                                    if (score >= 8) return MODERN_BMW_THEME.success;
                                    if (score >= 6) return MODERN_BMW_THEME.primary;
                                    if (score >= 4) return MODERN_BMW_THEME.warning;
                                    return MODERN_BMW_THEME.error;
                                  })(),
                                  fontWeight: 600
                                }}>
                                  {r.video_analysis?.quality_label || 'N/A'}
                                </Typography>
                              </Box>
                            </TableCell>

                            {/* Audio Quality - Just colored text */}
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{
                                  width: 36,
                                  height: 36,
                                  borderRadius: '50%',
                                  background: (() => {
                                    const score = r.audio_analysis?.score || 0;
                                    if (score >= 8) return MODERN_BMW_THEME.successLight;
                                    if (score >= 6) return MODERN_BMW_THEME.primaryUltraLight;
                                    if (score >= 4) return MODERN_BMW_THEME.warningLight;
                                    return MODERN_BMW_THEME.errorLight;
                                  })(),
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  border: `2px solid ${(() => {
                                    const score = r.audio_analysis?.score || 0;
                                    if (score >= 8) return MODERN_BMW_THEME.success + '30';
                                    if (score >= 6) return MODERN_BMW_THEME.primary + '30';
                                    if (score >= 4) return MODERN_BMW_THEME.warning + '30';
                                    return MODERN_BMW_THEME.error + '30';
                                  })()}`
                                }}>
                                  <Typography variant="body2" sx={{
                                    color: (() => {
                                      const score = r.audio_analysis?.score || 0;
                                      if (score >= 8) return MODERN_BMW_THEME.success;
                                      if (score >= 6) return MODERN_BMW_THEME.primary;
                                      if (score >= 4) return MODERN_BMW_THEME.warning;
                                      return MODERN_BMW_THEME.error;
                                    })(),
                                    fontWeight: 700
                                  }}>
                                    {(r.audio_analysis?.score || 0).toFixed(1)}
                                  </Typography>
                                </Box>
                                <Typography variant="body2" sx={{
                                  color: (() => {
                                    const score = r.audio_analysis?.score || 0;
                                    if (score >= 8) return MODERN_BMW_THEME.success;
                                    if (score >= 6) return MODERN_BMW_THEME.primary;
                                    if (score >= 4) return MODERN_BMW_THEME.warning;
                                    return MODERN_BMW_THEME.error;
                                  })(),
                                  fontWeight: 600
                                }}>
                                  {r.audio_analysis?.clarity_level || 'N/A'}
                                </Typography>
                              </Box>
                            </TableCell>

                            {/* Overall Score - Keep badge but remove "OVERALL" text */}
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{
                                  width: 44,
                                  height: 44,
                                  borderRadius: '50%',
                                  background: (() => {
                                    const score = r.overall_quality?.overall_score || 0;
                                    if (score >= 8) return MODERN_BMW_THEME.successLight;
                                    if (score >= 6) return MODERN_BMW_THEME.primaryUltraLight;
                                    if (score >= 4) return MODERN_BMW_THEME.warningLight;
                                    return MODERN_BMW_THEME.errorLight;
                                  })(),
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  border: `2px solid ${(() => {
                                    const score = r.overall_quality?.overall_score || 0;
                                    if (score >= 8) return MODERN_BMW_THEME.success + '30';
                                    if (score >= 6) return MODERN_BMW_THEME.primary + '30';
                                    if (score >= 4) return MODERN_BMW_THEME.warning + '30';
                                    return MODERN_BMW_THEME.error + '30';
                                  })()}`
                                }}>
                                  <Typography variant="h6" sx={{
                                    color: (() => {
                                      const score = r.overall_quality?.overall_score || 0;
                                      if (score >= 8) return MODERN_BMW_THEME.success;
                                      if (score >= 6) return MODERN_BMW_THEME.primary;
                                      if (score >= 4) return MODERN_BMW_THEME.warning;
                                      return MODERN_BMW_THEME.error;
                                    })(),
                                    fontWeight: 700
                                  }}>
                                    {(r.overall_quality?.overall_score || 0).toFixed(1)}
                                  </Typography>
                                </Box>
                                <Chip
                                  label={r.overall_quality?.overall_label || 'N/A'}
                                  size="small"
                                  sx={{
                                    background: (() => {
                                      const score = r.overall_quality?.overall_score || 0;
                                      if (score >= 8) return MODERN_BMW_THEME.successLight;
                                      if (score >= 6) return MODERN_BMW_THEME.primaryUltraLight;
                                      if (score >= 4) return MODERN_BMW_THEME.warningLight;
                                      return MODERN_BMW_THEME.errorLight;
                                    })(),
                                    color: (() => {
                                      const score = r.overall_quality?.overall_score || 0;
                                      if (score >= 8) return MODERN_BMW_THEME.success;
                                      if (score >= 6) return MODERN_BMW_THEME.primary;
                                      if (score >= 4) return MODERN_BMW_THEME.warning;
                                      return MODERN_BMW_THEME.error;
                                    })(),
                                    fontWeight: 600,
                                    fontSize: '0.7rem',
                                    height: '20px'
                                  }}
                                />
                              </Box>
                            </TableCell>

                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Person sx={{
                                  color: MODERN_BMW_THEME.textSecondary,
                                  mr: 1.5,
                                  fontSize: 18
                                }} />
                                <Typography variant="body2" sx={{
                                  color: MODERN_BMW_THEME.textPrimary
                                }}>
                                  {getUserName(r.submitted_by_user_id) || '—'}
                                </Typography>
                              </Box>
                            </TableCell>

                            <TableCell align="center">
                              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                <Tooltip title="View detailed analysis">
                                  <IconButton
                                    size="small"
                                    sx={{
                                      color: MODERN_BMW_THEME.primary,
                                      background: `${MODERN_BMW_THEME.primary}08`,
                                      '&:hover': {
                                        background: `${MODERN_BMW_THEME.primary}15`
                                      }
                                    }}
                                    onClick={() => handleViewDetails(r)}
                                  >
                                    <Visibility fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete record">
                                  <IconButton
                                    size="small"
                                    sx={{
                                      color: MODERN_BMW_THEME.error,
                                      background: `${MODERN_BMW_THEME.error}08`,
                                      '&:hover': {
                                        background: `${MODERN_BMW_THEME.error}15`
                                      }
                                    }}
                                    onClick={() => handleDelete(r._id)}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </TableCell>
                          </TableRow>
                        </Fade>
                      ))}
                      {paginatedRows.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                            <Assessment sx={{
                              fontSize: 64,
                              color: MODERN_BMW_THEME.textTertiary,
                              mb: 2,
                              opacity: 0.5
                            }} />
                            <Typography variant="h6" sx={{
                              color: MODERN_BMW_THEME.textSecondary,
                              fontWeight: 500,
                              mb: 1
                            }}>
                              {searchTerm ? 'No results found' : 'No analysis results available'}
                            </Typography>
                            <Typography variant="body2" sx={{
                              color: MODERN_BMW_THEME.textTertiary
                            }}>
                              {searchTerm ? 'Try adjusting your search terms' : 'Analysis results will appear here once available'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Enhanced Pagination */}
                {filteredRows.length > 0 && (
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={filteredRows.length} // Uses allRows via filteredRows
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                      borderTop: `1px solid ${MODERN_BMW_THEME.border}`,
                      '& .MuiTablePagination-toolbar': {
                        padding: 2
                      }
                    }}
                  />
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Analysis Report Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              maxHeight: '95vh',
              background: MODERN_BMW_THEME.background,
              border: `1px solid ${MODERN_BMW_THEME.border}`,
              borderRadius: 3,
              boxShadow: MODERN_BMW_THEME.shadowXl,
            }
          }}
        >
          {/* Modern Header */}
          <DialogTitle sx={{
            background: MODERN_BMW_THEME.gradientPrimary,
            color: MODERN_BMW_THEME.background,
            fontWeight: 600,
            py: 3,
            position: 'relative'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  backdropFilter: 'blur(10px)'
                }}>
                  <Assessment sx={{ fontSize: 24, color: MODERN_BMW_THEME.background }} />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={600}>
                    Analysis Report
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 400 }}>
                    Detailed performance assessment
                  </Typography>
                </Box>
              </Box>
              <IconButton
                onClick={handleCloseDialog}
                sx={{
                  color: MODERN_BMW_THEME.background,
                  background: 'rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.3)'
                  }
                }}
              >
                <ArrowBack />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent dividers sx={{
            background: MODERN_BMW_THEME.background,
            p: 0,
            overflow: 'auto'
          }}>
            {selectedResult && (
              <Box sx={{ maxWidth: 1200, mx: 'auto', p: 4 }}>
                {/* Service Information Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12}>
                    <Card sx={{
                      background: MODERN_BMW_THEME.surfaceElevated,
                      border: `1px solid ${MODERN_BMW_THEME.border}`,
                      borderRadius: 3,
                      boxShadow: MODERN_BMW_THEME.shadowSm
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <DirectionsCar sx={{
                            fontSize: 28,
                            color: MODERN_BMW_THEME.primary,
                            mr: 2
                          }} />
                          <Typography variant="h6" sx={{
                            color: MODERN_BMW_THEME.textPrimary,
                            fontWeight: 600
                          }}>
                            Service Information
                          </Typography>
                        </Box>

                        <Grid container spacing={2}>
                          {[
                            {
                              label: 'Dealership',
                              value: selectedResult.citnow_metadata?.dealership,
                              icon: Business
                            },
                            {
                              label: 'Vehicle',
                              value: selectedResult.citnow_metadata?.vehicle || selectedResult.citnow_metadata?.registration,
                              icon: DirectionsCar
                            },
                            {
                              label: 'Service Advisor',
                              value: selectedResult.citnow_metadata?.service_advisor,
                              icon: Person
                            },
                            {
                              label: 'VIN',
                              value: selectedResult.citnow_metadata?.vin,
                              icon: Description,
                              monospace: true
                            },
                            {
                              label: 'Email',
                              value: selectedResult.citnow_metadata?.email,
                              icon: Email
                            },
                            {
                              label: 'Phone',
                              value: selectedResult.citnow_metadata?.phone,
                              icon: Phone
                            }
                          ].map((item, index) => (
                            <Grid item xs={12} sm={6} md={4} key={item.label}>
                              <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                p: 2,
                                background: MODERN_BMW_THEME.surface,
                                borderRadius: 2,
                                border: `1px solid ${MODERN_BMW_THEME.borderLight}`
                              }}>
                                <item.icon sx={{
                                  fontSize: 20,
                                  color: MODERN_BMW_THEME.primary,
                                  mr: 2
                                }} />
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="caption" sx={{
                                    color: MODERN_BMW_THEME.textSecondary,
                                    fontWeight: 500,
                                    display: 'block',
                                    mb: 0.5
                                  }}>
                                    {item.label}
                                  </Typography>
                                  <Typography variant="body2" sx={{
                                    color: MODERN_BMW_THEME.textPrimary,
                                    fontWeight: 600,
                                    fontFamily: item.monospace ? 'monospace' : 'inherit'
                                  }}>
                                    {item.value || 'N/A'}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>

                        {/* Video Link */}
                        <Box sx={{ mt: 3, pt: 3, borderTop: `1px solid ${MODERN_BMW_THEME.borderLight}` }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Videocam sx={{
                                fontSize: 24,
                                color: MODERN_BMW_THEME.primary,
                                mr: 2
                              }} />
                              <Box>
                                <Typography variant="body1" sx={{
                                  color: MODERN_BMW_THEME.textPrimary,
                                  fontWeight: 600,
                                  mb: 0.5
                                }}>
                                  Video Recording
                                </Typography>
                                <Typography variant="body2" sx={{
                                  color: MODERN_BMW_THEME.textSecondary
                                }}>
                                  {selectedResult.citnow_metadata?.page_url ?
                                    'Watch the original video recording' :
                                    'No video URL available'
                                  }
                                </Typography>
                              </Box>
                            </Box>
                            {selectedResult.citnow_metadata?.page_url ? (
                              <Button
                                variant="contained"
                                href={selectedResult.citnow_metadata.page_url}
                                target="_blank"
                                startIcon={<Videocam />}
                                sx={{
                                  background: MODERN_BMW_THEME.gradientPrimary,
                                  borderRadius: 2,
                                  px: 3,
                                  fontWeight: 600,
                                  boxShadow: MODERN_BMW_THEME.shadowMd,
                                  '&:hover': {
                                    boxShadow: MODERN_BMW_THEME.shadowLg,
                                    transform: 'translateY(-1px)'
                                  },
                                  transition: 'all 0.2s ease-in-out'
                                }}
                              >
                                Watch Video
                              </Button>
                            ) : (
                              <Chip
                                label="Not Available"
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderColor: MODERN_BMW_THEME.textTertiary,
                                  color: MODERN_BMW_THEME.textTertiary
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Quality Assessment Section */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" sx={{
                    color: MODERN_BMW_THEME.textPrimary,
                    fontWeight: 600,
                    mb: 3
                  }}>
                    Quality Assessment
                  </Typography>

                  {/* Video & Audio Quality Side by Side */}
                  <Box sx={{
                    display: 'flex',
                    gap: 3,
                    mb: 4,
                    flexDirection: { xs: 'column', md: 'row' }
                  }}>
                    {/* Video Quality - Left Side */}
                    <Card sx={{
                      background: MODERN_BMW_THEME.surfaceElevated,
                      border: `1px solid ${MODERN_BMW_THEME.border}`,
                      borderRadius: 3,
                      boxShadow: MODERN_BMW_THEME.shadowSm,
                      flex: 1,
                      minWidth: { md: 0 }
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        {/* Video Header */}
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 3,
                          gap: 2
                        }}>
                          <Box sx={{
                            width: 50,
                            height: 50,
                            borderRadius: '50%',
                            background: MODERN_BMW_THEME.primaryUltraLight,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <Videocam sx={{ fontSize: 24, color: MODERN_BMW_THEME.primary }} />
                          </Box>
                          <Box>
                            <Typography variant="h4" sx={{
                              color: MODERN_BMW_THEME.textPrimary,
                              fontWeight: 700,
                              lineHeight: 1.2
                            }}>
                              {selectedResult.video_analysis?.quality_score?.toFixed(1) || '0.0'}/10
                            </Typography>
                            <Typography variant="body2" sx={{
                              color: MODERN_BMW_THEME.textSecondary,
                              fontWeight: 500
                            }}>
                              Video Quality
                            </Typography>
                          </Box>
                          <Chip
                            label={selectedResult.video_analysis?.quality_label || 'N/A'}
                            size="small"
                            sx={{
                              background:
                                selectedResult.video_analysis?.quality_label === 'Excellent' ? MODERN_BMW_THEME.successLight :
                                  selectedResult.video_analysis?.quality_label === 'Good' ? MODERN_BMW_THEME.primaryUltraLight :
                                    selectedResult.video_analysis?.quality_label === 'Fair' ? MODERN_BMW_THEME.warningLight :
                                      MODERN_BMW_THEME.errorLight,
                              color:
                                selectedResult.video_analysis?.quality_label === 'Excellent' ? MODERN_BMW_THEME.success :
                                  selectedResult.video_analysis?.quality_label === 'Good' ? MODERN_BMW_THEME.primary :
                                    selectedResult.video_analysis?.quality_label === 'Fair' ? MODERN_BMW_THEME.warning :
                                      MODERN_BMW_THEME.error,
                              fontWeight: 600,
                              ml: 'auto'
                            }}
                          />
                        </Box>

                        {/* Video Detailed Metrics */}
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" sx={{
                            color: MODERN_BMW_THEME.textSecondary,
                            mb: 2,
                            fontWeight: 600
                          }}>
                            VIDEO METRICS
                          </Typography>

                          <Grid container spacing={2}>
                            {/* Resolution & Basic Info */}
                            <Grid item xs={6}>
                              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                                Resolution:
                              </Typography>
                              <Typography variant="body2" sx={{ color: MODERN_BMW_THEME.textSecondary, fontSize: '0.8rem' }}>
                                {selectedResult.video_analysis?.detailed_analysis?.resolution || 'N/A'}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                                Duration:
                              </Typography>
                              <Typography variant="body2" sx={{ color: MODERN_BMW_THEME.textSecondary, fontSize: '0.8rem' }}>
                                {selectedResult.video_analysis?.detailed_analysis?.duration || 'N/A'}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                                Frame Rate:
                              </Typography>
                              <Typography variant="body2" sx={{ color: MODERN_BMW_THEME.textSecondary, fontSize: '0.8rem' }}>
                                {selectedResult.video_analysis?.detailed_analysis?.frame_rate || 'N/A'}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                                Stability:
                              </Typography>
                              <Typography variant="body2" sx={{ color: MODERN_BMW_THEME.textSecondary, fontSize: '0.8rem' }}>
                                {selectedResult.video_analysis?.shake_level || 'N/A'}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>

                        {/* Quality Scores */}
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" sx={{
                            color: MODERN_BMW_THEME.textSecondary,
                            mb: 2,
                            fontWeight: 600
                          }}>
                            QUALITY SCORES
                          </Typography>

                          <Grid container spacing={1}>
                            <Grid item xs={6}>
                              <Box sx={{ textAlign: 'center', p: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: MODERN_BMW_THEME.primary }}>
                                  {selectedResult.video_analysis?.detailed_analysis?.sharpness?.replace('%', '') || '0'}%
                                </Typography>
                                <Typography variant="caption" sx={{ color: MODERN_BMW_THEME.textSecondary }}>
                                  Sharpness
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6}>
                              <Box sx={{ textAlign: 'center', p: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: MODERN_BMW_THEME.primary }}>
                                  {selectedResult.video_analysis?.detailed_analysis?.brightness?.replace('%', '') || '0'}%
                                </Typography>
                                <Typography variant="caption" sx={{ color: MODERN_BMW_THEME.textSecondary }}>
                                  Brightness
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6}>
                              <Box sx={{ textAlign: 'center', p: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: MODERN_BMW_THEME.primary }}>
                                  {selectedResult.video_analysis?.detailed_analysis?.contrast?.replace('%', '') || '0'}%
                                </Typography>
                                <Typography variant="caption" sx={{ color: MODERN_BMW_THEME.textSecondary }}>
                                  Contrast
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6}>
                              <Box sx={{ textAlign: 'center', p: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: MODERN_BMW_THEME.primary }}>
                                  {selectedResult.video_analysis?.detailed_analysis?.color_vibrancy?.replace('%', '') || '0'}%
                                </Typography>
                                <Typography variant="caption" sx={{ color: MODERN_BMW_THEME.textSecondary }}>
                                  Color
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>

                        {/* Video Issues */}
                        {selectedResult.video_analysis?.issues?.length > 0 && (
                          <Box>
                            <Typography variant="subtitle2" sx={{
                              color: MODERN_BMW_THEME.textSecondary,
                              mb: 1,
                              fontWeight: 600
                            }}>
                              DETECTED ISSUES
                            </Typography>
                            <Box sx={{ pl: 1 }}>
                              {selectedResult.video_analysis.issues.map((issue, index) => (
                                <Typography key={index} variant="body2" sx={{
                                  color: MODERN_BMW_THEME.warning,
                                  mb: 0.5,
                                  fontSize: '0.8rem',
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  gap: 1
                                }}>
                                  <Box component="span" sx={{ fontSize: '0.6rem', mt: '0.2rem' }}>•</Box>
                                  {issue}
                                </Typography>
                              ))}
                            </Box>
                          </Box>
                        )}
                      </CardContent>
                    </Card>

                    {/* Audio Quality - Right Side */}
                    <Card sx={{
                      background: MODERN_BMW_THEME.surfaceElevated,
                      border: `1px solid ${MODERN_BMW_THEME.border}`,
                      borderRadius: 3,
                      boxShadow: MODERN_BMW_THEME.shadowSm,
                      flex: 1,
                      minWidth: { md: 0 }
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        {/* Audio Header */}
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 3,
                          gap: 2
                        }}>
                          <Box sx={{
                            width: 50,
                            height: 50,
                            borderRadius: '50%',
                            background: MODERN_BMW_THEME.accentUltraLight,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <Mic sx={{ fontSize: 24, color: MODERN_BMW_THEME.accent }} />
                          </Box>
                          <Box>
                            <Typography variant="h4" sx={{
                              color: MODERN_BMW_THEME.textPrimary,
                              fontWeight: 700,
                              lineHeight: 1.2
                            }}>
                              {Math.round(selectedResult.audio_analysis?.score || 0)}/10
                            </Typography>
                            <Typography variant="body2" sx={{
                              color: MODERN_BMW_THEME.textSecondary,
                              fontWeight: 500
                            }}>
                              Audio Quality
                            </Typography>
                          </Box>
                          <Chip
                            label={
                              selectedResult.audio_analysis?.clarity_level ||
                              selectedResult.audio_analysis?.prediction ||
                              'N/A'
                            }
                            size="small"
                            sx={{
                              background:
                                selectedResult.audio_analysis?.clarity_level === 'Excellent' ? MODERN_BMW_THEME.successLight :
                                  selectedResult.audio_analysis?.clarity_level === 'Very Good' ? MODERN_BMW_THEME.successLight :
                                    selectedResult.audio_analysis?.clarity_level === 'Good' ? MODERN_BMW_THEME.primaryUltraLight :
                                      selectedResult.audio_analysis?.clarity_level === 'Fair' ? MODERN_BMW_THEME.warningLight :
                                        selectedResult.audio_analysis?.clarity_level === 'Poor' ? MODERN_BMW_THEME.errorLight :
                                          MODERN_BMW_THEME.errorLight,
                              color:
                                selectedResult.audio_analysis?.clarity_level === 'Excellent' ? MODERN_BMW_THEME.success :
                                  selectedResult.audio_analysis?.clarity_level === 'Very Good' ? MODERN_BMW_THEME.success :
                                    selectedResult.audio_analysis?.clarity_level === 'Good' ? MODERN_BMW_THEME.primary :
                                      selectedResult.audio_analysis?.clarity_level === 'Fair' ? MODERN_BMW_THEME.warning :
                                        selectedResult.audio_analysis?.clarity_level === 'Poor' ? MODERN_BMW_THEME.error :
                                          MODERN_BMW_THEME.error,
                              fontWeight: 600,
                              ml: 'auto'
                            }}
                          />
                        </Box>

                        {/* Audio Detailed Metrics */}
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" sx={{
                            color: MODERN_BMW_THEME.textSecondary,
                            mb: 2,
                            fontWeight: 600
                          }}>
                            AUDIO METRICS
                          </Typography>

                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                                Volume Level:
                              </Typography>
                              <Typography variant="body2" sx={{ color: MODERN_BMW_THEME.textSecondary, fontSize: '0.8rem' }}>
                                {selectedResult.audio_analysis?.detailed_analysis?.volume_level || 'N/A'}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                                Noise Level:
                              </Typography>
                              <Typography variant="body2" sx={{ color: MODERN_BMW_THEME.textSecondary, fontSize: '0.8rem' }}>
                                {selectedResult.audio_analysis?.detailed_analysis?.noise_level || 'N/A'}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                                Speech Clarity:
                              </Typography>
                              <Typography variant="body2" sx={{ color: MODERN_BMW_THEME.textSecondary, fontSize: '0.8rem' }}>
                                {selectedResult.audio_analysis?.detailed_analysis?.speech_clarity || 'N/A'}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                                Background Noise:
                              </Typography>
                              <Typography variant="body2" sx={{ color: MODERN_BMW_THEME.textSecondary, fontSize: '0.8rem' }}>
                                {selectedResult.audio_analysis?.detailed_analysis?.background_noise || 'N/A'}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>

                        {/* Audio Component Scores */}
                        {selectedResult.audio_analysis?.component_scores && (
                          <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" sx={{
                              color: MODERN_BMW_THEME.textSecondary,
                              mb: 2,
                              fontWeight: 600
                            }}>
                              COMPONENT SCORES
                            </Typography>

                            <Grid container spacing={1}>
                              {Object.entries(selectedResult.audio_analysis.component_scores).map(([key, value]) => (
                                <Grid item xs={6} key={key}>
                                  <Box sx={{ textAlign: 'center', p: 1 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: MODERN_BMW_THEME.accent }}>
                                      {Math.round(value)}%
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: MODERN_BMW_THEME.textSecondary }}>
                                      {key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
                                    </Typography>
                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        )}

                        {/* Audio Issues */}
                        {selectedResult.audio_analysis?.issues?.length > 0 && (
                          <Box>
                            <Typography variant="subtitle2" sx={{
                              color: MODERN_BMW_THEME.textSecondary,
                              mb: 1,
                              fontWeight: 600
                            }}>
                              DETECTED ISSUES
                            </Typography>
                            <Box sx={{ pl: 1 }}>
                              {selectedResult.audio_analysis.issues.map((issue, index) => (
                                <Typography key={index} variant="body2" sx={{
                                  color: MODERN_BMW_THEME.warning,
                                  mb: 0.5,
                                  fontSize: '0.8rem',
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  gap: 1
                                }}>
                                  <Box component="span" sx={{ fontSize: '0.6rem', mt: '0.2rem' }}>•</Box>
                                  {issue}
                                </Typography>
                              ))}
                            </Box>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Box>

                  {/* Overall Quality Card */}
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Card sx={{
                        background: MODERN_BMW_THEME.surfaceElevated,
                        border: `1px solid ${MODERN_BMW_THEME.border}`,
                        borderRadius: 3,
                        boxShadow: MODERN_BMW_THEME.shadowSm
                      }}>
                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                          <Box sx={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            background: MODERN_BMW_THEME.successUltraLight,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 2
                          }}>
                            <Assessment sx={{ fontSize: 28, color: MODERN_BMW_THEME.success }} />
                          </Box>
                          <Typography variant="h3" sx={{
                            color: MODERN_BMW_THEME.textPrimary,
                            fontWeight: 700,
                            mb: 1
                          }}>
                            {selectedResult.overall_quality?.overall_score || 0}/10
                          </Typography>
                          <Typography variant="body2" sx={{
                            color: MODERN_BMW_THEME.textSecondary,
                            fontWeight: 800,
                            mb: 2
                          }}>
                            OVERALL QUALITY
                          </Typography>
                          <Chip
                            label={selectedResult.overall_quality?.overall_label || 'N/A'}
                            size="small"
                            sx={{
                              background:
                                selectedResult.overall_quality?.overall_label === 'Excellent' ? MODERN_BMW_THEME.successLight :
                                  selectedResult.overall_quality?.overall_label === 'Very Good' ? MODERN_BMW_THEME.successLight :
                                    selectedResult.overall_quality?.overall_label === 'Good' ? MODERN_BMW_THEME.primaryUltraLight :
                                      selectedResult.overall_quality?.overall_label === 'Fair' ? MODERN_BMW_THEME.warningLight :
                                        selectedResult.overall_quality?.overall_label === 'Poor' ? MODERN_BMW_THEME.errorLight :
                                          MODERN_BMW_THEME.errorLight,
                              color:
                                selectedResult.overall_quality?.overall_label === 'Excellent' ? MODERN_BMW_THEME.success :
                                  selectedResult.overall_quality?.overall_label === 'Very Good' ? MODERN_BMW_THEME.success :
                                    selectedResult.overall_quality?.overall_label === 'Good' ? MODERN_BMW_THEME.primary :
                                      selectedResult.overall_quality?.overall_label === 'Fair' ? MODERN_BMW_THEME.warning :
                                        selectedResult.overall_quality?.overall_label === 'Poor' ? MODERN_BMW_THEME.error :
                                          MODERN_BMW_THEME.error,
                              fontWeight: 600
                            }}
                          />

                          {/* Breakdown */}
                          {selectedResult.overall_quality?.breakdown && (
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 4 }}>
                              <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="body2" sx={{ color: MODERN_BMW_THEME.textSecondary }}>
                                  Audio
                                </Typography>
                                <Typography variant="h6" sx={{ color: MODERN_BMW_THEME.accent, fontWeight: 600 }}>
                                  {selectedResult.overall_quality.breakdown.audio_quality}/10
                                </Typography>
                              </Box>
                              <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="body2" sx={{ color: MODERN_BMW_THEME.textSecondary }}>
                                  Video
                                </Typography>
                                <Typography variant="h6" sx={{ color: MODERN_BMW_THEME.primary, fontWeight: 600 }}>
                                  {selectedResult.overall_quality.breakdown.video_quality}/10
                                </Typography>
                              </Box>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>

                {/* Content Analysis Section */}
                <Box>
                  <Typography variant="h5" sx={{
                    color: MODERN_BMW_THEME.textPrimary,
                    fontWeight: 600,
                    mb: 3
                  }}>
                    Content Analysis
                  </Typography>

                  <Grid container spacing={3}>
                    {/* Transcription */}
                    <Grid item xs={12} md={4}>
                      <Card sx={{
                        background: MODERN_BMW_THEME.surfaceElevated,
                        border: `1px solid ${MODERN_BMW_THEME.border}`,
                        borderRadius: 3,
                        boxShadow: MODERN_BMW_THEME.shadowSm,
                        height: '100%'
                      }}>
                        <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Description sx={{
                              color: MODERN_BMW_THEME.primary,
                              mr: 2,
                              fontSize: 20
                            }} />
                            <Typography variant="h6" sx={{
                              color: MODERN_BMW_THEME.textPrimary,
                              fontWeight: 600
                            }}>
                              Transcription
                            </Typography>
                          </Box>
                          <Paper sx={{
                            p: 2,
                            background: MODERN_BMW_THEME.surface,
                            border: `1px solid ${MODERN_BMW_THEME.borderLight}`,
                            borderRadius: 2,
                            flex: 1,
                            overflow: 'auto',
                            maxHeight: 300
                          }}>
                            <Typography variant="body2" sx={{
                              color: MODERN_BMW_THEME.textPrimary,
                              whiteSpace: 'pre-wrap',
                              lineHeight: 1.6,
                              fontSize: '0.875rem'
                            }}>
                              {selectedResult.transcription?.text || 'No transcription available'}
                            </Typography>
                          </Paper>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Summary */}
                    <Grid item xs={12} md={4}>
                      <Card sx={{
                        background: MODERN_BMW_THEME.surfaceElevated,
                        border: `1px solid ${MODERN_BMW_THEME.border}`,
                        borderRadius: 3,
                        boxShadow: MODERN_BMW_THEME.shadowSm,
                        height: '100%'
                      }}>
                        <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Description sx={{
                              color: MODERN_BMW_THEME.accent,
                              mr: 2,
                              fontSize: 20
                            }} />
                            <Typography variant="h6" sx={{
                              color: MODERN_BMW_THEME.textPrimary,
                              fontWeight: 600
                            }}>
                              Summary
                            </Typography>
                          </Box>
                          <Paper sx={{
                            p: 2,
                            background: MODERN_BMW_THEME.surface,
                            border: `1px solid ${MODERN_BMW_THEME.borderLight}`,
                            borderRadius: 2,
                            flex: 1,
                            overflow: 'auto',
                            maxHeight: 300
                          }}>
                            <Typography variant="body2" sx={{
                              color: MODERN_BMW_THEME.textPrimary,
                              whiteSpace: 'pre-wrap',
                              lineHeight: 1.6,
                              fontSize: '0.875rem'
                            }}>
                              {selectedResult.summarization?.summary || 'No summary available'}
                            </Typography>
                          </Paper>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Translation */}
                    <Grid item xs={12} md={4}>
                      <Card sx={{
                        background: MODERN_BMW_THEME.surfaceElevated,
                        border: `1px solid ${MODERN_BMW_THEME.border}`,
                        borderRadius: 3,
                        boxShadow: MODERN_BMW_THEME.shadowSm,
                        height: '100%'
                      }}>
                        <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Description sx={{
                              color: MODERN_BMW_THEME.success,
                              mr: 2,
                              fontSize: 20
                            }} />
                            <Typography variant="h6" sx={{
                              color: MODERN_BMW_THEME.textPrimary,
                              fontWeight: 600
                            }}>
                              Translation
                            </Typography>
                          </Box>
                          <Paper sx={{
                            p: 2,
                            background: MODERN_BMW_THEME.surface,
                            border: `1px solid ${MODERN_BMW_THEME.borderLight}`,
                            borderRadius: 2,
                            flex: 1,
                            overflow: 'auto',
                            maxHeight: 300
                          }}>
                            <Typography variant="body2" sx={{
                              color: MODERN_BMW_THEME.textPrimary,
                              whiteSpace: 'pre-wrap',
                              lineHeight: 1.6,
                              fontSize: '0.875rem'
                            }}>
                              {selectedResult.translation?.translated_text || 'No translation available'}
                            </Typography>
                          </Paper>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{
            px: 3,
            py: 2,
            background: MODERN_BMW_THEME.surface,
            borderTop: `1px solid ${MODERN_BMW_THEME.border}`
          }}>
            <Button
              onClick={handleCloseDialog}
              variant="outlined"
              sx={{
                borderColor: MODERN_BMW_THEME.border,
                color: MODERN_BMW_THEME.textSecondary,
                borderRadius: 2,
                px: 4,
                fontWeight: 500,
                '&:hover': {
                  borderColor: MODERN_BMW_THEME.textSecondary,
                  color: MODERN_BMW_THEME.textPrimary,
                  background: `${MODERN_BMW_THEME.textSecondary}08`
                }
              }}
            >
              Close Report
            </Button>
          </DialogActions>
        </Dialog>

        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </Container>
    </Box>
  );
}
