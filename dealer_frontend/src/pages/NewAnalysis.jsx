import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
  Alert,
  Box,
  LinearProgress,
  Chip,
  Paper,
  Container,
} from "@mui/material";
import {
  PlayArrow,
  Check,
  Error,
  Schedule,
  Refresh,
  Language,
  Translate,
  Link,
  Add,
} from "@mui/icons-material";
import api from "../Services/api";

// ✅ BMW Theme
const MODERN_BMW_THEME = {
  primary: "#1C69D4",
  primaryDark: "#0A4B9C",
  primaryLight: "#4D8FDF",
  primaryUltraLight: "#E8F1FD",
  accent: "#FF6D00",
  accentLight: "#FF9D45",
  accentUltraLight: "#FFF3E8",
  background: "#FFFFFF",
  surface: "#F8FAFC",
  surfaceElevated: "#FFFFFF",
  border: "#E2E8F0",
  borderLight: "#F1F5F9",
  textPrimary: "#1E293B",
  textSecondary: "#64748B",
  textTertiary: "#94A3B8",
  success: "#10B981",
  successLight: "#D1FAE5",
  warning: "#F59E0B",
  warningLight: "#FEF3C7",
  error: "#EF4444",
  errorLight: "#FEE2E2",
  gradientPrimary: "linear-gradient(135deg, #1C69D4 0%, #0A4B9C 100%)",
  gradientAccent: "linear-gradient(135deg, #FF6D00 0%, #FF8A00 100%)",
  gradientSuccess: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
  shadowSm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  shadowMd:
    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  shadowLg:
    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
};

// 🌍 Language Options
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

// ⚙️ Task Status Configuration
const STATUS_CONFIG = {
  pending: {
    color: "default",
    icon: <Schedule sx={{ color: MODERN_BMW_THEME.textTertiary }} />,
    label: "Pending",
    bgColor: MODERN_BMW_THEME.surface,
    textColor: MODERN_BMW_THEME.textTertiary,
  },
  processing: {
    color: "primary",
    icon: <Refresh sx={{ color: MODERN_BMW_THEME.primary }} />,
    label: "Processing",
    bgColor: MODERN_BMW_THEME.primaryUltraLight,
    textColor: MODERN_BMW_THEME.primary,
  },
  completed: {
    color: "success",
    icon: <Check sx={{ color: MODERN_BMW_THEME.success }} />,
    label: "Completed",
    bgColor: MODERN_BMW_THEME.successLight,
    textColor: MODERN_BMW_THEME.success,
  },
  failed: {
    color: "error",
    icon: <Error sx={{ color: MODERN_BMW_THEME.error }} />,
    label: "Failed",
    bgColor: MODERN_BMW_THEME.errorLight,
    textColor: MODERN_BMW_THEME.error,
  },
};

export default function NewAnalysis() {
  const [url, setUrl] = useState("");
  const [lang, setLang] = useState("auto");
  const [target, setTarget] = useState("en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [taskId, setTaskId] = useState("");
  const [currentTask, setCurrentTask] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [enableTranscription, setEnableTranscription] = useState(true);
  const [intervalId, setIntervalId] = useState(null);

  // 🕒 Polling
  const pollTaskStatus = async (tid) => {
    try {
      const res = await api.get(`/analyze-status/${tid}`);
      setCurrentTask(res.data);
      if (["completed", "failed"].includes(res.data.status)) {
        clearInterval(intervalId);
        setIntervalId(null);
        setLoading(false);
        if (res.data.status === "completed") {
           setResultData(res.data.result || res.data.analysis_result);
        }
      }
    } catch (err) {
      console.error("Polling error:", err);
      setError("Unable to fetch analysis status.");
      clearInterval(intervalId);
      setIntervalId(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (taskId && !intervalId) {
      const interval = setInterval(() => pollTaskStatus(taskId), 3000);
      setIntervalId(interval);
      pollTaskStatus(taskId);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [taskId]);

  // ▶️ Submit analysis
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTaskId("");
    setCurrentTask(null);

    try {
      const res = await api.post("/analyze", {
        citnow_url: url,
        transcription_language: lang,
        target_language: target,
        enable_transcription: enableTranscription
      });
      const id = res.data.task_id;
      if (!id) throw new Error("No Task ID received.");
      setTaskId(id);
      setCurrentTask({
        task_id: id,
        status: "pending",
        message: "Queued for processing...",
      });
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to start analysis.");
      setLoading(false);
    }
  };

  const resetForm = () => {
    setUrl("");
    setLang("auto");
    setTarget("en");
    setTaskId("");
    setCurrentTask(null);
    setError("");
    setLoading(false);
    if (intervalId) clearInterval(intervalId);
  };

  const manuallyFetchStatus = () => {
    if (taskId) pollTaskStatus(taskId);
  };

  return (
 <Container 
    maxWidth="md" 
    sx={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      py: 6 
    }}
  >
    {/* Header */}
    <Box sx={{ textAlign: "center", mb: 6 }}>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          mb: 2,
          background: MODERN_BMW_THEME.gradientPrimary,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        New Video Analysis
      </Typography>

      <Typography
        variant="h6"
        sx={{
          color: MODERN_BMW_THEME.textSecondary,
          fontWeight: 400,
          maxWidth: "600px",
          mx: "auto",
          lineHeight: 1.6,
        }}
      >
        Upload a CitNow video URL to start automated analysis with AI-powered insights.
      </Typography>
    </Box>


      {/* Main Content Card */}
      <Box sx={{ width: "100%", maxWidth: "800px", mx: "auto" }}>
        <Card
          sx={{
            background: MODERN_BMW_THEME.surfaceElevated,
            border: `1px solid ${MODERN_BMW_THEME.border}`,
            borderRadius: 3,
            boxShadow: MODERN_BMW_THEME.shadowLg,
            mx: 2,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Error Message */}
            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  border: `1px solid ${MODERN_BMW_THEME.errorLight}`,
                  backgroundColor: MODERN_BMW_THEME.errorLight,
                }}
                action={
                  <Button color="inherit" onClick={resetForm}>
                    Reset
                  </Button>
                }
              >
                {error}
              </Alert>
            )}

            {/* Task Status */}
            {currentTask && (
              <Paper
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: 2,
                  backgroundColor: STATUS_CONFIG[currentTask.status]?.bgColor,
                  border: `1px solid ${MODERN_BMW_THEME.borderLight}`,
                }}
                elevation={0}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1.5,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {STATUS_CONFIG[currentTask.status]?.icon}
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      sx={{
                        color: STATUS_CONFIG[currentTask.status]?.textColor || MODERN_BMW_THEME.textPrimary,
                      }}
                    >
                      {STATUS_CONFIG[currentTask.status]?.label}
                    </Typography>
                  </Box>
                  <Chip
                    label={STATUS_CONFIG[currentTask.status]?.label}
                    sx={{
                      backgroundColor: STATUS_CONFIG[currentTask.status]?.bgColor,
                      color: STATUS_CONFIG[currentTask.status]?.textColor || MODERN_BMW_THEME.textPrimary,
                      fontWeight: 600,
                    }}
                  />
                </Box>

                {currentTask.status === "processing" && (
                  <LinearProgress
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      mb: 2,
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: MODERN_BMW_THEME.primary,
                      },
                    }}
                  />
                )}

                {currentTask.message && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {currentTask.message}
                  </Typography>
                )}

                {currentTask.status === "completed" && (
                  <>
                  <Alert
                    severity="success"
                    sx={{
                      mt: 2,
                      borderRadius: 2,
                      backgroundColor: MODERN_BMW_THEME.successLight,
                    }}
                  >
                    <Typography fontWeight="600" color="success.main">
                      ✅ Analysis Completed Successfully!
                    </Typography>
                  </Alert>

                  {resultData && (
                    <Box sx={{ mt: 3, p: 2, background: '#fff', borderRadius: 2, border: `1px solid ${MODERN_BMW_THEME.border}` }}>
                       <Typography variant="h6" fontWeight="700" sx={{ mb: 2, color: MODERN_BMW_THEME.primary }}>
                         Analysis Result Summary
                       </Typography>
                       <Grid container spacing={2}>
                          <Grid item xs={4}>
                             <Paper sx={{ p: 2, textAlign: 'center', background: MODERN_BMW_THEME.surface }}>
                                <Typography variant="h5" fontWeight="800" color={MODERN_BMW_THEME.success}>
                                   {(resultData.overall_quality?.overall_score || 0).toFixed(1)}
                                </Typography>
                                <Typography variant="caption" fontWeight="600">Overall</Typography>
                             </Paper>
                          </Grid>
                          <Grid item xs={4}>
                             <Paper sx={{ p: 2, textAlign: 'center', background: MODERN_BMW_THEME.surface }}>
                                <Typography variant="h5" fontWeight="800" color={MODERN_BMW_THEME.primary}>
                                   {(resultData.video_analysis?.quality_score || resultData.video_quality_score || 0).toFixed(1)}
                                </Typography>
                                <Typography variant="caption" fontWeight="600">Video</Typography>
                             </Paper>
                          </Grid>
                          <Grid item xs={4}>
                             <Paper sx={{ p: 2, textAlign: 'center', background: MODERN_BMW_THEME.surface }}>
                                <Typography variant="h5" fontWeight="800" color={MODERN_BMW_THEME.accent}>
                                   {(resultData.audio_analysis?.score || resultData.audio_quality_score || 0).toFixed(1)}
                                </Typography>
                                <Typography variant="caption" fontWeight="600">Audio</Typography>
                             </Paper>
                          </Grid>
                       </Grid>
                       <Button 
                         fullWidth 
                         variant="text" 
                         onClick={() => window.location.href='/results'} 
                         sx={{ mt: 2, fontWeight: 700 }}
                       >
                         View Full Details
                       </Button>
                    </Box>
                  )}
                  </>
                )}

                {currentTask.status === "failed" && (
                  <Alert
                    severity="error"
                    sx={{
                      mt: 2,
                      borderRadius: 2,
                      backgroundColor: MODERN_BMW_THEME.errorLight,
                    }}
                  >
                    ❌ Analysis Failed —
                    {currentTask.error_message || "Please try again."}
                  </Alert>
                )}

                {currentTask.status === "processing" && (
                  <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Refresh />}
                      onClick={manuallyFetchStatus}
                      sx={{
                        borderColor: MODERN_BMW_THEME.primary,
                        color: MODERN_BMW_THEME.primary,
                        fontWeight: 500,
                      }}
                    >
                      Refresh Status
                    </Button>
                  </Box>
                )}
              </Paper>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Link sx={{ color: MODERN_BMW_THEME.textSecondary, fontSize: 20 }} />
                        <span>CitNow Video URL</span>
                      </Box>
                    }
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    disabled={loading || currentTask}
                    helperText="Enter the full CitNow video URL for processing"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: MODERN_BMW_THEME.background,
                      },
                    }}
                  />
                </Grid>

                {/* Language Selection */}
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Language sx={{ color: MODERN_BMW_THEME.textSecondary, fontSize: 20 }} />
                        <span>Spoken Language</span>
                      </Box>
                    }
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    disabled={loading || currentTask}
                  >
                    {LANGS.map((l) => (
                      <MenuItem key={l.code} value={l.code}>
                        {l.icon} {l.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Translate sx={{ color: MODERN_BMW_THEME.textSecondary, fontSize: 20 }} />
                        <span>Target Language</span>
                      </Box>
                    }
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    disabled={loading || currentTask}
                  >
                    {LANGS.filter((l) => l.code !== "auto").map((l) => (
                      <MenuItem key={l.code} value={l.code}>
                        {l.icon} {l.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Buttons */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      alignItems: "center",
                      justifyContent: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<PlayArrow />}
                      disabled={loading || currentTask}
                      sx={{
                        background: MODERN_BMW_THEME.gradientPrimary,
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        boxShadow: MODERN_BMW_THEME.shadowMd,
                        "&:hover": {
                          boxShadow: MODERN_BMW_THEME.shadowLg,
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      {loading ? "Starting..." : "Start Analysis"}
                    </Button>

                    {(currentTask && ["completed", "failed"].includes(currentTask.status)) && (
                      <Button
                        variant="outlined"
                        onClick={resetForm}
                        startIcon={<Add />}
                        sx={{
                          borderRadius: 3,
                          px: 4,
                          py: 1.5,
                          fontWeight: 600,
                          borderColor: MODERN_BMW_THEME.primary,
                          color: MODERN_BMW_THEME.primary,
                          "&:hover": {
                            backgroundColor: MODERN_BMW_THEME.primaryUltraLight,
                            borderColor: MODERN_BMW_THEME.primaryDark,
                          },
                        }}
                      >
                        New Analysis
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Box>
    
  </Container>
  );
}