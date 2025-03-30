import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import axios from 'axios';
import { db } from './firebase.js'; // Ensure firebase.js is in the root directory (or adjust the path as needed)
import { doc, setDoc } from 'firebase/firestore';

const app = express();
const PORT = 3001;

const SECRET_KEY = process.env.SECRET_KEY; // Must be defined in your .env file
const CLERK_API_URL = "https://api.clerk.com/v1/users";

app.get('/api/syncUsers', async (req, res) => {
  try {
    let allUsers = [];
    const limit = 100;
    let offset = 0;

    // Fetch users with pagination
    while (true) {
      const response = await axios.get(CLERK_API_URL, {
        headers: {
          "Authorization": `Bearer ${SECRET_KEY}`,
          "Content-Type": "application/json"
        },
        params: { limit, offset }
      });
      
      const users = response.data;
      if (!users || users.length === 0) break;

      allUsers = allUsers.concat(users);
      offset += limit;
    }

    // Prepare the synced users list in the shape of your UserData interface:
    // { id: string, name: string | null, email: string | null }
    const syncedUsers = [];

    for (const user of allUsers) {
      const firstName = user.first_name || "";
      const lastName = user.last_name || "";
      const name = (firstName + " " + lastName).trim() || null;
      // Assume primary email is the first email in the array if available
      const email = (user.email_addresses && user.email_addresses.length > 0)
        ? user.email_addresses[0].email_address
        : null;

      const userData = {
        id: user.id,
        name,
        email,
      };

      // Update Firestore "users" collection (using user id as document id)
      await setDoc(doc(db, "users", user.id), userData, { merge: true });
      syncedUsers.push(userData);
    }

    res.json(syncedUsers);
  } catch (error) {
    console.error("Error syncing users:", error.message);
    res.status(500).json({ error: "Failed to sync users" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
