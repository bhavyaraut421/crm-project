var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// backend/server.ts
var import_express2 = __toESM(require("express"));
var import_cors = __toESM(require("cors"));
var import_dotenv2 = __toESM(require("dotenv"));

// database/db.ts
var import_mongoose = __toESM(require("mongoose"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI missing in .env");
  }
  await import_mongoose.default.connect(uri);
  console.log("Connected to MongoDB Atlas \u{1F680}");
};

// backend/routes.ts
var import_express = require("express");

// database/Lead.ts
var import_mongoose2 = __toESM(require("mongoose"), 1);
var leadSchema = new import_mongoose2.default.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String, required: true },
  status: { type: String, default: "New" },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});
var Lead = import_mongoose2.default.models.Lead || import_mongoose2.default.model("Lead", leadSchema);

// backend/routes.ts
var router = (0, import_express.Router)();
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, company, status, notes } = req.body;
    if (!name || !email || !phone || !company) {
      res.status(400).json({ error: "All required fields are missing" });
      return;
    }
    const lead = new Lead({
      name,
      email,
      phone,
      company,
      status,
      notes
    });
    const saved = await lead.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create lead" });
  }
});
router.get("/", async (req, res) => {
  try {
    const search = req.query.search || "";
    const status = req.query.status || "";
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order || "desc";
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } }
      ];
    }
    if (status) {
      query.status = status;
    }
    const sort = {};
    sort[sortBy] = order === "asc" ? 1 : -1;
    const skip = (page - 1) * limit;
    const [leads, total] = await Promise.all([
      Lead.find(query).sort(sort).skip(skip).limit(limit),
      Lead.countDocuments(query)
    ]);
    const totalPages = Math.ceil(total / limit);
    res.json({
      leads,
      total,
      page,
      limit,
      totalPages
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch leads" });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const updated = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) {
      res.status(404).json({ error: "Lead not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update lead" });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete lead" });
  }
});
router.get("/stats", async (_req, res) => {
  try {
    const data = await Lead.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);
    const result = {
      New: 0,
      Qualified: 0,
      Contacted: 0,
      Converted: 0,
      Lost: 0
    };
    data.forEach((d) => {
      result[d._id] = d.count;
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});
var routes_default = router;

// backend/server.ts
import_dotenv2.default.config();
var app = (0, import_express2.default)();
var PORT = process.env.PORT || 3e3;
app.use((0, import_cors.default)({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));
app.use(import_express2.default.json());
app.get("/", (req, res) => {
  res.json({ message: "CRM API Running \u{1F680}" });
});
app.use("/api/leads", routes_default);
var startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Server failed to start:", err);
  }
};
startServer();
//# sourceMappingURL=server.cjs.map
