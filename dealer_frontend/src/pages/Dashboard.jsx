import React, { useEffect, useState, useContext } from 'react';
import {
  Grid, Card, CardContent, Typography, Box, LinearProgress, Chip, Button, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Container, Alert
} from '@mui/material';
import {
  TrendingUp, Star, VideoLibrary, Group, EmojiEvents, Timeline, PieChart,
  Refresh, Videocam, Mic, Assessment
} from '@mui/icons-material';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend
} from 'recharts';
import { getDealerDashboard } from '../Services/api';
import { AuthContext } from '../contexts/AuthContext';

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
  gradientAccent: 'linear-gradient(135deg, #FF6D00 0%, #FF8A00 100%)'
};

const CHART_COLORS = [MODERN_BMW_THEME.success, MODERN_BMW_THEME.primary, MODERN_BMW_THEME.warning, MODERN_BMW_THEME.error];

const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
  <Card sx={{
    background: MODERN_BMW_THEME.surfaceElevated,
    border: `1px solid ${MODERN_BMW_THEME.border}`,
    borderRadius: 4,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    height: '100%',
    transition: 'transform 0.2s',
    '&:hover': { transform: 'translateY(-4px)' }
  }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{
          width: 48, height: 48, borderRadius: '50%',
          background: `${color}15`, display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <Icon sx={{ color }} />
        </Box>
        <Typography variant="h4" fontWeight="700" color={MODERN_BMW_THEME.textPrimary}>
          {value}
        </Typography>
      </Box>
      <Typography variant="body2" fontWeight="600" color={MODERN_BMW_THEME.textSecondary}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="caption" color={MODERN_BMW_THEME.textTertiary}>
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month'); // default to month for better viz
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getDealerDashboard(timeRange);
      setData(res.data);
      setError(null);
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError('Failed to load real-time analytics data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !data) return <LinearProgress />;

  const pieData = data?.quality_distribution ? 
    Object.entries(data.quality_distribution).map(([name, value]) => ({ name, value })) : [];

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="800" sx={{
            color: MODERN_BMW_THEME.textPrimary,
            background: MODERN_BMW_THEME.gradientPrimary,
            backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            Performance Analytics
          </Typography>
          <Typography variant="body2" color={MODERN_BMW_THEME.textSecondary}>
            Real-time data for {user?.showroom_name || 'your dealership'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, background: MODERN_BMW_THEME.surface, p: 0.5, borderRadius: 2 }}>
          {['day', 'week', 'month', 'quarter'].map((range) => (
            <Button
              key={range}
              size="small"
              variant={timeRange === range ? 'contained' : 'text'}
              onClick={() => setTimeRange(range)}
              sx={{
                borderRadius: 1.5,
                textTransform: 'capitalize',
                fontWeight: 600,
                px: 2,
                boxShadow: timeRange === range ? '0 4px 12px rgba(28, 105, 212, 0.2)' : 'none'
              }}
            >
              {range}
            </Button>
          ))}
          <IconButton onClick={loadData} size="small" sx={{ ml: 1 }}>
            <Refresh fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Videos"
            value={data?.total_videos_analyzed || 0}
            icon={VideoLibrary}
            color={MODERN_BMW_THEME.primary}
            subtitle={`Analyzed in selected ${timeRange}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Quality Score"
            value={data?.average_overall_quality?.toFixed(1) || '0.0'}
            icon={Star}
            color={MODERN_BMW_THEME.accent}
            subtitle="Average across all videos"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Video Alerts"
            value={data?.low_quality_video_count || 0}
            icon={Videocam}
            color={MODERN_BMW_THEME.error}
            subtitle="Low quality video detections"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Audio Alerts"
            value={data?.low_quality_audio_count || 0}
            icon={Mic}
            color={MODERN_BMW_THEME.warning}
            subtitle="Poor audio clarity issues"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 4, height: '100%', border: `1px solid ${MODERN_BMW_THEME.border}` }}>
            <CardContent>
              <Typography variant="h6" fontWeight="700" sx={{ mb: 3 }}>Recent Analyzed Videos</Typography>
              <TableContainer component={Paper} elevation={0} sx={{ background: 'transparent' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Vehicle</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Advisor</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="center">Score</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="center">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(data?.recent_analyses || []).map((row) => (
                      <TableRow key={row._id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="600">{row.citnow_metadata?.vehicle || '—'}</Typography>
                          <Typography variant="caption" color="textSecondary">{row.citnow_metadata?.registration || '—'}</Typography>
                        </TableCell>
                        <TableCell>{row.citnow_metadata?.service_advisor || '—'}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={row.overall_quality?.overall_score?.toFixed(1) || '0.0'}
                            size="small"
                            sx={{
                              fontWeight: 700,
                              background: MODERN_BMW_THEME.primaryUltraLight,
                              color: MODERN_BMW_THEME.primary
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={row.status || 'Completed'}
                            size="small"
                            color={row.status === 'completed' ? 'success' : 'primary'}
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 4, height: '100%', border: `1px solid ${MODERN_BMW_THEME.border}` }}>
            <CardContent>
              <Typography variant="h6" fontWeight="700" sx={{ mb: 3 }}>Quality Distribution</Typography>
              <Box sx={{ height: 300, width: '100%' }}>
                <ResponsiveContainer>
                  <RechartsPieChart>
                    <Pie
                      data={pieData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
