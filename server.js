const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;

const FormSchema = new mongoose.Schema({
  name: String,
  babyGender: String,
});

const FormModel = mongoose.model("Form", FormSchema);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Serve the HTML form
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Handle form submission
app.post("/submit", async (req, res) => {
  const { name, babyGender } = req.body;
  const formData = new FormModel({ name, babyGender });
  try {
    await formData.save();
    res.redirect("/thankyou.html"); // Redirect to thank you page
  } catch (error) {
    console.error("Error saving form data:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Serve the admin page
app.get("/admin", (req, res) => {
  res.sendFile(__dirname + "/public/admin.html");
});

// API endpoint to get survey data
app.get("/api/surveys", async (req, res) => {
  try {
    const surveys = await FormModel.find();
    res.json(surveys);
  } catch (error) {
    console.error("Error fetching surveys:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://admin:admin@cluster0.2sucg.mongodb.net/visupriya", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    // Start the server only after successful connection
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
