import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TablePagination } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

const ContactsTable = ({ onContactAddedOrUpdated }) => {
  const [contacts, setContacts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    axios.get('http://localhost:5000/all')
      .then(response => {
        setContacts(response.data); // Ensure the response includes the _id field
      })
      .catch(error => console.error('Error fetching contacts:', error));
  }, [onContactAddedOrUpdated]);

  const handleDelete = (id) => {
    // Check if id is valid
    if (!id) {
      console.error('Invalid ID for deletion');
      return;
    }

    // Optimistic UI update: remove contact from the state immediately
    const updatedContacts = contacts.filter(contact => contact._id !== id);
    setContacts(updatedContacts);

    // Send delete request to the backend
    axios.delete(`http://localhost:5000/contacts/${id}`)
      .then((response) => {
        console.log('Contact deleted from database:', response.data);
        alert('Contact deleted successfully!');
      })
      .catch((error) => {
        console.error('Error deleting contact:', error);
        // If there's an error, restore the contact back to state
        setContacts(prevContacts => [...prevContacts, contacts.find(contact => contact._id === id)]);
        alert('Error deleting contact, please try again.');
      });
  };

  const handleEdit = (id) => {
    // Pass the contactId to the parent component for editing
    onContactAddedOrUpdated(id);
  };

  const handleChangePage = (event, newPage) => {
    //alert('The data is updated');
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-labelledby="tableTitle">
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Job Title</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((contact) => (
              <TableRow hover key={contact._id}>
                <TableCell>{contact.firstName}</TableCell>
                <TableCell>{contact.lastName}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.phone}</TableCell>
                <TableCell>{contact.company}</TableCell>
                <TableCell>{contact.jobTitle}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(contact._id)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(contact._id)} color="secondary">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={contacts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default ContactsTable;
