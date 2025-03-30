const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT =  5000;

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://Cluster_project:Sathwik@clustercontactapp.s2da4.mongodb.net/?retryWrites=true&w=majority&appName=ClusterContactApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.error("MongoDB connection error:", error));

// Define a simple route to check if the server is working
// app.listen(5000,()=>{
//     console.log("THE port is listening at 5000");
// });
app.get("/tita", (req, res) => {
  res.json("Server is running at sathwik!");
});

app.listen(5000, () => console.log(`Server running on http://localhost:${PORT}`));
const contactSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    company: String,
    jobTitle: String,
  });
  
  const Contact = mongoose.model('Contact', contactSchema);
// Create a new contact
app.post('/contacts', async (req, res) => {
    try {
      const contact = new Contact(req.body);
      await contact.save();
      res.status(201).send(contact);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  });
  
  // Get all contacts
  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await Contact.find({phone:req.body.phone});
      res.json({phone: req.body.phone});
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });
  app.get('/all',async(req,res)=>{
          try{
                  const cont=await Contact.find();
                  res.json(cont);
          }
          catch(err)
          {
            res.status(400).json({error:"this is  a error"});
          }
  })
  
  // Update a contact by ID
  app.put('/contacts/:id', async (req, res) => {
    try {
      const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!contact) return res.status(404).send({ error: "Contact not found" });
      res.send(contact);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  });
  
 // Delete a contact by ID
  // app.delete('/contacts/:id', async (req, res) => {
  //   try {
  //     const contact = await Contact.findByIdAndDelete(req.params.id);
  //     if (!contact) return res.status(404).send({ error: "Contact not found" });
  //     res.send(contact);
  //   } catch (error) {
  //     res.status(500).send({ error: error.message });
  //   }
  // });/
  app.delete('/contacts/:id', async (req, res) => {
    try {
      const contact = await Contact.findByIdAndDelete(req.params.id);
      if (!contact) return res.status(404).send({ error: "Contact not found" });
      res.send(contact); // Send the deleted contact's data back, or just a success message
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });
  
