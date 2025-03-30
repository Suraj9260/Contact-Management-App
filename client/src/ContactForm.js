import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Box, CircularProgress, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const ContactForm = ({ contactId, onContactAddedOrUpdated }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (contactId) {
      axios
        .get(`http://localhost:5000/contacts/${contactId}`)
        .then((response) => setFormData(response.data))
        .catch((error) => console.error('Error fetching contact:', error));
    }
  }, [contactId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email) {
      setErrorMessage('First Name and Email are required.');
      return;
    }

    setLoading(true);
    try {
      if (contactId) {
        const updatedContact = await axios.put(`http://localhost:5000/contacts/${contactId}`, formData);
        alert("The data is updated");
        onContactAddedOrUpdated(updatedContact.data);  // Optimistic update
      } else {
        const newContact = await axios.post('http://localhost:5000/contacts', formData);
        alert("The data is entered");
        onContactAddedOrUpdated(newContact.data);  // Optimistic update
      }
      setFormData({ firstName: '', lastName: '', email: '', phone: '', company: '', jobTitle: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage('Failed to save the contact. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setErrorMessage('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Grid container spacing={2}>
        {Object.keys(formData).map((field) => (
          <Grid item xs={6} key={field}>
            <TextField
              label={field.replace(/^\w/, (c) => c.toUpperCase())}
              variant="outlined"
              fullWidth
              name={field}
              value={formData[field]}
              onChange={handleChange}
            />
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : contactId ? 'Update Contact' : 'Add Contact'}
          </Button>
        </Grid>
      </Grid>

      {/* Snackbar for Error Messages */}
      <Snackbar
        open={Boolean(errorMessage)}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactForm;
