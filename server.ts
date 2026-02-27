import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";

const db = new Database("tiles.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS tiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    size TEXT NOT NULL,
    finish TEXT NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT
  )
`);

// Seed data if empty
const count = db.prepare("SELECT count(*) as count FROM tiles").get() as { count: number };
if (count.count === 0) {
  const insert = db.prepare(`
    INSERT INTO tiles (name, category, size, finish, image_url, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const sampleTiles = [
    ["Blue Marble Glossy", "Wall", "300x450mm", "Glossy", "https://picsum.photos/seed/blue-marble-tile/600/600", "Premium blue and white marble pattern glossy wall tiles."],
    ["Design 31096 Set", "Wall", "300x450mm", "Glossy", "https://picsum.photos/seed/marble-set-tile/600/600", "Elegant 3-piece wall tile set (31096 L, HL-1, D) with marble texture."],
    ["Design 113 (E)", "Marble", "600x1200mm", "Glossy", "https://picsum.photos/seed/large-marble-tile/600/600", "Large format premium glossy marble finish tiles (Design 113 E)."],
    ["Pearl-11211 Heavy Duty", "Parking", "400x400mm", "Punch", "https://picsum.photos/seed/pearl-11211/600/600", "Heavy-duty parking tiles with circular punch design, 11mm thickness."],
    ["Grey Grid Punch", "Parking", "500x500mm", "Punch", "https://picsum.photos/seed/grey-grid-tile/600/600", "Industrial grey punch finish parking tiles with grid pattern."],
    ["Grey Stone Waves", "Parking", "500x500mm", "Punch", "https://picsum.photos/seed/stone-waves-tile/600/600", "Natural grey and tan stone wave texture parking tiles."],
    ["Brown Textured Stone", "Parking", "500x500mm", "Punch", "https://picsum.photos/seed/brown-stone-tile/600/600", "Durable brown textured stone finish parking tiles."]
  ];

  for (const tile of sampleTiles) {
    insert.run(...tile);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/tiles", (req, res) => {
    const tiles = db.prepare("SELECT * FROM tiles").all();
    res.json(tiles);
  });

  app.get("/api/tiles/:id", (req, res) => {
    const tile = db.prepare("SELECT * FROM tiles WHERE id = ?").get(req.params.id);
    if (tile) {
      res.json(tile);
    } else {
      res.status(404).json({ error: "Tile not found" });
    }
  });

  app.post("/api/inquiry", (req, res) => {
    const { name, email, message, tileId } = req.body;
    console.log(`Inquiry received from ${name} (${email}) for tile ${tileId}: ${message}`);
    res.json({ success: true, message: "Inquiry sent successfully!" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
