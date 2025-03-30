import React, { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import ContactForm from './ContactForm';
import ContactsTable from './ContactsTable';

function App() {
  const [contactId, setContactId] = useState(null);

  const handleContactAddedOrUpdated = (id) => {
    if (id) {
      setContactId(id); // Edit mode
    } else {
      setContactId(null); // Add mode
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Contact Management
      </Typography>
      <Box mb={3}>
        <ContactForm contactId={contactId} onContactAddedOrUpdated={handleContactAddedOrUpdated} />
      </Box>
      <ContactsTable onContactAddedOrUpdated={handleContactAddedOrUpdated} />
    </Container>
  );
}

export default App;
