const express = require("express");
const cors = require("cors");

const cacheData = [
  { key: "user1", value: "Alice" },
  { key: "user2", value: "Bob" },
  { key: "sessionToken", value: "abcd1234" },
  { key: "theme", value: "dark" },
  { key: "language", value: "english" },
];

const app = express();

app.use(cors());
app.use(express.json());

app.post("/cache", (req, res) => {
  const data = req.body;
  const exists = cacheData.find((item) => item.key === data.key);
  if (exists) {
    return res.status(409).json({ error: "Key already exists." });
  }
  if (!data.key || !data.value) {
    res.status(400).json({ error: "key and value requird" });
  } else if (cacheData.length < 10) {
    cacheData.push(data);
    res.status(201).json({ message: "Data created successfully.", data: data });
  } else {
    res.status(400).json({
      error: "Cache data limit reached can't add more than 10 items!",
    });
  }
});

app.get("/cache/:key", (req, res) => {
  let dataKey = req.params.key;
  const data = cacheData.find((data) => data.key === dataKey);
  console.log(data);
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(404).json({ error: "key not found." });
  }
});

app.delete("/cache/:key", (req, res) => {
  let dataKey = req.params.key;
  const index = cacheData.findIndex((data) => data.key === dataKey);

  if (index !== -1) {
    const deletedData = cacheData.splice(index, 1)[0];
    res
      .status(200)
      .json({ message: "Data deleted successfully", data: deletedData });
  } else {
    res.status(404).json({ error: "Data not found" });
  }
});

app.get("/cache", (req, res) => {
  return res.json({ cacheData });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at port no. ${PORT}`);
});
