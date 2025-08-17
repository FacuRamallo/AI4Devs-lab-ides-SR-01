import React from 'react';
import { Button, Container, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleAddCandidate = () => {
    navigate('/candidates/new');
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAddCandidate}
      >
        Añadir Candidato
      </Button>
    </Container>
  );
};

export default Dashboard;
