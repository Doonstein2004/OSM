import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Alert, 
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  IconButton
} from '@mui/material';
import { 
  CalendarMonth as CalendarIcon,
  Error as ErrorIcon,
  Link as LinkIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import axios from 'axios';

/**
 * Componente para importar calendarios de ligas predefinidas desde fuentes externas
 * 
 * @param {Object} props - Props del componente
 * @param {string|number} props.leagueId - ID de la liga
 * @param {Function} props.onImport - Función a ejecutar después de importar el calendario
 * @returns {JSX.Element}
 */
const CalendarImport = ({ leagueId, onImport }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [importResult, setImportResult] = useState(null);
  const [errorsExpanded, setErrorsExpanded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url) {
      setError('Debes proporcionar una URL válida');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess(false);
      setImportResult(null);
      
      const response = await axios.post(`http://localhost:8000/calendar/leagues/${leagueId}/import`, {
        external_url: url
      });
      
      setImportResult(response.data);
      setSuccess(true);
      
      // Notificar al componente padre
      if (onImport) {
        onImport();
      }
    } catch (err) {
      setError('Error al importar el calendario: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <CalendarIcon sx={{ mr: 2, color: 'primary.main' }} />
        <Typography variant="h6" component="h2">
          Importar Calendario
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Puedes importar el calendario desde una fuente externa como FlashScore, Marca, etc. 
        Introduce la URL de la página que contiene el calendario de la liga.
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="URL del calendario"
          variant="outlined"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.flashscore.com/football/spain/laliga/fixtures/"
          disabled={loading}
          required
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CalendarIcon />}
        >
          {loading ? 'Importando...' : 'Importar Calendario'}
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Calendario importado correctamente
        </Alert>
      )}
      
      {importResult && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Resultado de la importación:
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckIcon color="success" />
              </ListItemIcon>
              <ListItemText 
                primary={`${importResult.matches_created} partidos creados`} 
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <CheckIcon color="success" />
              </ListItemIcon>
              <ListItemText 
                primary={`${importResult.calendar_entries_created} entradas de calendario creadas`} 
              />
            </ListItem>
            
            {importResult.errors && importResult.errors.length > 0 && (
              <>
                <ListItem 
                  button 
                  onClick={() => setErrorsExpanded(!errorsExpanded)}
                  sx={{ bgcolor: 'background.default' }}
                >
                  <ListItemIcon>
                    <ErrorIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={`${importResult.errors.length} errores durante la importación`} 
                  />
                  {errorsExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </ListItem>
                
                <Collapse in={errorsExpanded} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {importResult.errors.map((error, index) => (
                      <ListItem key={index} sx={{ pl: 4 }}>
                        <ListItemIcon>
                          <ErrorIcon color="error" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={error} 
                          primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </>
            )}
          </List>
        </Box>
      )}
    </Paper>
  );
};

export default CalendarImport;