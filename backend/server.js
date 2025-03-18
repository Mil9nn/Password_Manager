import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors';

const app = express()
const port = 3000

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://Milan:<db_password>@passwordmanager.xdcds.mongodb.net/?retryWrites=true&w=majority&appName=PasswordManager')
  .then(() => { console.log("MongoDB connected successfully") })
  .catch((err) => { console.error("Failed to connect", err) });

// Schema and Model
const websiteSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Store the UUID from frontend
  siteText: String, 
  userText: String, 
  passwordText: String
});

const Website = mongoose.model("Website", websiteSchema);

app.post('/api/entries/', async (req, res) => {
  try {
    // Create a new entry with the UUID from frontend
    const newEntry = new Website({
      id: req.body.id,
      siteText: req.body.siteText,
      userText: req.body.userText,
      passwordText: req.body.passwordText
    });

    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
  } catch (error) {
    res.status(500).json({ message: "Failed to save entry", error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/api/entries', async (req, res) => {
  try {
    const entries = await Website.find();
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch websites" });
  }
});

// Use the UUID for delete operations
app.delete('/api/entries/:id', async (req, res) => {
  try {
    const deletedEntry = await Website.findOneAndDelete({ id: req.params.id });
    if (!deletedEntry) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.json({ message: "Entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete entry", error: error.message });
  }
});

// Use the UUID for update operations
app.put('/api/entries/:id', async (req, res) => {
  try {
    const updatedEntry = await Website.findOneAndUpdate(
      { id: req.params.id },
      {
        siteText: req.body.siteText,
        userText: req.body.userText,
        passwordText: req.body.passwordText
      },
      { new: true }
    );
    
    if (!updatedEntry) {
      return res.status(404).json({ message: "Entry not found" });
    }
    
    res.json(updatedEntry);
  } catch (error) {
    res.status(500).json({ message: "Failed to update entry", error: error.message });
  }
});

app.listen(port, () => {
  console.log(`http://localhost:${port}/`)
});