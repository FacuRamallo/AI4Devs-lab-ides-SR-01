import React, { useState } from 'react';
import { Box, Button, Grid, TextField, Typography, Snackbar, Alert } from '@mui/material';
import { addCandidate, uploadCandidateCv } from '../services/candidateService';

const AddCandidateForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | undefined>(undefined);
  const [uploadSnackbarOpen, setUploadSnackbarOpen] = useState(false);
  const [uploadSnackbarMessage, setUploadSnackbarMessage] = useState('');
  const [uploadSnackbarSeverity, setUploadSnackbarSeverity] = useState<'success' | 'error' | undefined>(undefined);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

      if (!allowedTypes.includes(file.type)) {
        setSnackbarMessage('Tipo de archivo no permitido. Solo se aceptan PDF o DOCX.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const candidateId = await addCandidate(formData);
      console.log('Candidate added successfully:', candidateId.id);

      if (selectedFile) {
        const fileData = new FormData();
        fileData.append('file', selectedFile);
        console.log('Uploading CV for candidate:', candidateId.id);
        const response = await uploadCandidateCv(candidateId.id, fileData);

        if (!response.ok) {
          throw new Error('Error al subir el archivo del CV');
        }

        const result = await addCandidate({ ...formData, cvUrl: response.url });
        console.log('Candidate added successfully:', result);
        setSnackbarMessage('Candidato añadido con éxito');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage('Es necesario subir su Cv');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Failed to add candidate or upload CV:', error);
      setSnackbarMessage('Error al añadir candidato');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);

      if (selectedFile) {
        setUploadSnackbarMessage('Error al subir el CV');
        setUploadSnackbarSeverity('error');
        setUploadSnackbarOpen(true);
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleUploadSnackbarClose = () => {
    setUploadSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Añadir Nuevo Candidato
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
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
          <Grid size={{ xs: 12, sm: 6 }}>
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
          <Grid size={{ xs: 12 }}>
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
          <Grid size={{ xs: 12 }}>
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
          <Grid size={{ xs: 12 }}>
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
          <Grid size={{ xs: 12 }}>
            <Button
              variant="contained"
              component="label"
              color="secondary"
              aria-label="Seleccionar archivo de CV"
            >
              Seleccionar Archivo
              <input
                type="file"
                hidden
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
            </Button>
            {selectedFile && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Archivo seleccionado: {selectedFile.name}
              </Typography>
            )}
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
      <Snackbar
        open={uploadSnackbarOpen}
        onClose={handleUploadSnackbarClose}
        autoHideDuration={6000}
        role="alert"
      >
        <Alert onClose={handleUploadSnackbarClose} severity={uploadSnackbarSeverity} sx={{ width: '100%' }}>
          {uploadSnackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddCandidateForm;
