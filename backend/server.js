require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.get("/", (req, res) => {
  res.send("Backend działa z Supabase!");
});

app.post("/patients", async (req, res) => {
  try {
    console.log("PRZYSZŁY DANE:", req.body);

    const {
      first_name,
      last_name,
      age,
      email,
      verification_code,
      temporary_password
    } = req.body;

    const { data, error } = await supabase
      .from("patients")
      .insert([
        {
          first_name,
          last_name,
          age,
          email,
          verification_code,
          temporary_password
        }
      ])
      .select();

    if (error) {
      console.error("SUPABASE ERROR:", error);
      return res.status(400).json({ message: error.message });
    }

    console.log("DODANO PACJENTA:", data);

    return res.status(201).json({
      message: "Pacjent zapisany w Supabase",
      patient: data[0]
    });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ message: err.message });
}
});

app.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});