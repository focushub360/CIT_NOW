import React, { useEffect, useMemo, useRef, useState } from 'react';
import { 
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  IconButton,
  Stack
} from '@mui/material';
import {
  Save,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  Link as LinkIcon,
  FormatListBulleted,
  FormatListNumbered
} from '@mui/icons-material';
import { useThemeSettings } from '../../contexts/ThemeContext';

const MODERN_BMW_THEME = {
  primary: '#1C69D4',
  primaryDark: '#0A4B9C',
  surface: '#F8FAFC',
  surfaceElevated: '#FFFFFF',
  border: '#E2E8F0',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  success: '#10B981',
};

export default function ThemeSettings() {
  const { settings, updateSettings, loading: themeLoading } = useThemeSettings();

  const BRANDS = useMemo(() => ([
    'Multi Franchise',
    'BMW',
    'MINI',
    'CitNOW'
  ]), []);

  const [brand, setBrand] = useState(settings?.brand || 'Multi Franchise');
  const [customHtml, setCustomHtml] = useState(settings?.custom_content_html || '');
  const editorRef = useRef(null);

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState(null);

  const [dealerWebsite, setDealerWebsite] = useState(settings?.website_links?.dealer_website || '');
  const [facebook, setFacebook] = useState(settings?.website_links?.facebook || '');
  const [instagram, setInstagram] = useState(settings?.website_links?.instagram || '');
  const [youtube, setYoutube] = useState(settings?.website_links?.youtube || '');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  // Update local state if settings change (e.g. after initial load)
  useEffect(() => {
    setBrand(settings?.brand || 'Multi Franchise');
    setCustomHtml(settings?.custom_content_html || '');
    setDealerWebsite(settings?.website_links?.dealer_website || '');
    setFacebook(settings?.website_links?.facebook || '');
    setInstagram(settings?.website_links?.instagram || '');
    setYoutube(settings?.website_links?.youtube || '');
  }, [settings]);

  useEffect(() => {
    if (!logoFile) {
      setLogoPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(logoFile);
    setLogoPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [logoFile]);

  const exec = (command) => {
    try {
      editorRef.current?.focus();
      // eslint-disable-next-line no-undef
      document.execCommand(command, false);
      setCustomHtml(editorRef.current?.innerHTML || '');
    } catch {
      // no-op: execCommand may be blocked in some browsers
    }
  };

  const insertLink = () => {
    // eslint-disable-next-line no-undef
    const url = window.prompt('Enter URL');
    if (!url) return;
    try {
      editorRef.current?.focus();
      // eslint-disable-next-line no-undef
      document.execCommand('createLink', false, url);
      setCustomHtml(editorRef.current?.innerHTML || '');
    } catch {
      // no-op
    }
  };
  
  const handleSave = async () => {
    setLoading(true);
    const success = await updateSettings({
      brand,
      custom_content_html: customHtml,
      website_links: {
        dealer_website: dealerWebsite,
        facebook,
        instagram,
        youtube
      }
    });
    
    setLoading(false);
    if (success) {
      setSuccess('Theme settings saved.');
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto', minHeight: '100vh' }}>
      <Snackbar open={!!success} autoHideDuration={4000} onClose={() => setSuccess('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" sx={{ width: '100%', borderRadius: 2 }}>{success}</Alert>
      </Snackbar>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: MODERN_BMW_THEME.textPrimary }}>
          Theme Settings
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 2, border: `1px solid ${MODERN_BMW_THEME.border}`, boxShadow: 'none' }}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          {/* 1 of 4 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 2 }}>
            <Box>
              <Typography variant="subtitle1" fontWeight={800} sx={{ color: MODERN_BMW_THEME.textPrimary }}>
                Current Brand
              </Typography>
              <Typography variant="body2" sx={{ color: MODERN_BMW_THEME.textSecondary }}>
                Select the brand you want to make edits to.
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: MODERN_BMW_THEME.textSecondary, pt: 0.5 }}>
              1 of 4
            </Typography>
          </Box>

          <FormControl fullWidth size="small" sx={{ maxWidth: 360 }}>
            <InputLabel id="brand-label">Brand</InputLabel>
            <Select
              labelId="brand-label"
              label="Brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            >
              {BRANDS.map((b) => (
                <MenuItem key={b} value={b}>{b}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider sx={{ my: 3 }} />

          {/* 2 of 4 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 1.5 }}>
            <Box>
              <Typography variant="subtitle1" fontWeight={800} sx={{ color: MODERN_BMW_THEME.textPrimary }}>
                Custom Content
              </Typography>
              <Typography variant="body2" sx={{ color: MODERN_BMW_THEME.textSecondary }}>
                Write a piece of custom text that will be visible on your video page.
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: MODERN_BMW_THEME.textSecondary, pt: 0.5 }}>
              2 of 4
            </Typography>
          </Box>

          <Box sx={{ border: `1px solid ${MODERN_BMW_THEME.border}`, borderRadius: 1.5, overflow: 'hidden' }}>
            <Box sx={{ background: '#EEF2F7', borderBottom: `1px solid ${MODERN_BMW_THEME.border}`, px: 1, py: 0.5 }}>
              <Stack direction="row" spacing={0.5}>
                <IconButton size="small" onClick={() => exec('bold')}><FormatBold fontSize="small" /></IconButton>
                <IconButton size="small" onClick={() => exec('italic')}><FormatItalic fontSize="small" /></IconButton>
                <IconButton size="small" onClick={() => exec('underline')}><FormatUnderlined fontSize="small" /></IconButton>
                <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                <IconButton size="small" onClick={insertLink}><LinkIcon fontSize="small" /></IconButton>
                <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                <IconButton size="small" onClick={() => exec('insertUnorderedList')}><FormatListBulleted fontSize="small" /></IconButton>
                <IconButton size="small" onClick={() => exec('insertOrderedList')}><FormatListNumbered fontSize="small" /></IconButton>
              </Stack>
            </Box>
            <Box
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={() => setCustomHtml(editorRef.current?.innerHTML || '')}
              dangerouslySetInnerHTML={{ __html: customHtml }}
              sx={{
                minHeight: 160,
                p: 1.5,
                outline: 'none',
                background: '#fff',
                '&:empty:before': {
                  content: '"Start typing..."',
                  color: MODERN_BMW_THEME.textSecondary
                }
              }}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* 3 of 4 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 1.5 }}>
            <Box>
              <Typography variant="subtitle1" fontWeight={800} sx={{ color: MODERN_BMW_THEME.textPrimary }}>
                Logo
              </Typography>
              <Typography variant="body2" sx={{ color: MODERN_BMW_THEME.textSecondary }}>
                Upload your company logo, a transparent one will work best.
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: MODERN_BMW_THEME.textSecondary, pt: 0.5 }}>
              3 of 4
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button variant="contained" component="label" size="small" sx={{ textTransform: 'none' }}>
              Select a Logo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              />
            </Button>
            <Typography variant="body2" sx={{ color: MODERN_BMW_THEME.textSecondary }}>
              Please make sure your logo is no larger than 25MB and it’s a GIF, JPEG, BMP or PNG.
            </Typography>
          </Box>
          {logoPreviewUrl && (
            <Box sx={{ mt: 2, p: 2, border: `1px solid ${MODERN_BMW_THEME.border}`, borderRadius: 1.5, display: 'inline-flex', alignItems: 'center', background: '#fff' }}>
              <img src={logoPreviewUrl} alt="Logo preview" style={{ height: 48, width: 'auto' }} />
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* 4 of 4 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 1.5 }}>
            <Box>
              <Typography variant="subtitle1" fontWeight={800} sx={{ color: MODERN_BMW_THEME.textPrimary }}>
                Website Links
              </Typography>
              <Typography variant="body2" sx={{ color: MODERN_BMW_THEME.textSecondary }}>
                Edit the website links that are displayed for this brand.
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: MODERN_BMW_THEME.textSecondary, pt: 0.5 }}>
              4 of 4
            </Typography>
          </Box>

          <Stack spacing={2} sx={{ maxWidth: 520 }}>
            <TextField label="Dealer Website" size="small" value={dealerWebsite} onChange={(e) => setDealerWebsite(e.target.value)} />
            <TextField label="Facebook" size="small" value={facebook} onChange={(e) => setFacebook(e.target.value)} />
            <TextField label="Instagram" size="small" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
            <TextField label="YouTube" size="small" value={youtube} onChange={(e) => setYoutube(e.target.value)} />
          </Stack>
        </CardContent>
        
        {/* Footer Actions */}
        <Box sx={{ 
          p: 2, 
          borderTop: `1px solid ${MODERN_BMW_THEME.border}`, 
          display: 'flex', 
          justifyContent: 'flex-end',
          background: '#fff'
        }}>
          <Button 
            variant="contained" 
            onClick={handleSave} 
            disabled={loading || themeLoading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />} 
            sx={{ 
              background: MODERN_BMW_THEME.primary,
              textTransform: 'none', 
              px: { xs: 3, sm: 5 }, 
              py: 1.2, 
              borderRadius: 2,
              fontWeight: 600,
              boxShadow: 'none',
              '&:hover': {
                background: MODERN_BMW_THEME.primaryDark,
              }
            }}
          >
            {loading ? 'Saving Preferences...' : 'Save Theme Settings'}
          </Button>
        </Box>
      </Card>
      
    </Box>
  );
}
