const express = require('express');
const mongoose = require("mongoose");
const path = require('path');

const mongoDbUrl = 'mongodb://root:example@database:27017/docker_learn_db?authSource=admin';

mongoose.connect(mongoDbUrl)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  name: String
});

const User = mongoose.model('User', userSchema);

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/users', async (req, res) => {
  const userName = req.body.name;

  try {
    const newUser = new User({ name: userName });

    await newUser.save();

    res.send(`<h1>User "${userName}" created successfully!</h1><a href="/users">View all users</a>`);
  } catch (err) {
    
    res.status(500).send(`Error saving user to the database. Check server logs for details. Error: ${err.message}`);
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    
    let userListHtml = '<h1>All Users</h1><ul>';
    users.forEach(user => {
      userListHtml += `<li>${user.name}</li>`;
    });
    userListHtml += '</ul><a href="/">Create another user</a>';

    res.send(userListHtml);

  } catch (err) {

    res.status(500).send('Error fetching users from the database.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});