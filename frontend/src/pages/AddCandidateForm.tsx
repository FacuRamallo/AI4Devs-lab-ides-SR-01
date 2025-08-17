import React, { useState } from 'react';
import { Box, Button, Grid, TextField, Typography, Snackbar, Alert } from '@mui/material';
import { addCandidate } from '../services/candidateService';

const AddCandidateForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | undefined>(undefined);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await addCandidate(formData);
      console.log('Candidate added successfully:', result);
      setSnackbarMessage('Candidato añadido con éxito');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Failed to add candidate:', error);
      setSnackbarMessage('Error al añadir candidato');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Añadir Nuevo Candidato
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size= {{xs: 12, sm: 6}}>
            <TextField
              fullWidth
              label="Nombre"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              aria-label="Nombre del candidato"
            />
          </Grid>
          <Grid size= {{xs: 12, sm: 6}}>
            <TextField
              fullWidth
              label="Apellidos"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              aria-label="Apellidos del candidato"
            />
          </Grid>
          <Grid size= {{xs: 12}}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              aria-label="Correo electrónico del candidato"
            />
          </Grid>
          <Grid size= {{xs: 12}}>
            <TextField
              fullWidth
              label="Teléfono"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              aria-label="Número de teléfono del candidato"
            />
          </Grid>
          <Grid size= {{xs: 12}}>
            <TextField
              fullWidth
              label="Dirección"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              aria-label="Dirección del candidato"
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 3 }}>
          <Button type="submit" variant="contained" color="primary">
            Guardar Candidato
          </Button>
        </Box>
      </form>
      <Snackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        autoHideDuration={6000}
        role="alert"
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddCandidateForm;
