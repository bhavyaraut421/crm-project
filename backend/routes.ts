import { Router, Request, Response } from "express";
import { Lead } from "../database/Lead";

const router = Router();

/* ---------------- CREATE LEAD ---------------- */
router.post("/", async (req: Request, res: Response): Promise<void> => {
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
      notes,
    });

    const saved = await lead.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create lead" });
  }
});

/* ---------------- GET LEADS (PAGINATION FIXED) ---------------- */
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const search = (req.query.search as string) || "";
    const status = (req.query.status as string) || "";
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const order = (req.query.order as string) || "desc";

    // ✅ FIX: proper safe number conversion
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit as string) || 10, 1);

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      query.status = status;
    }

    const sort: any = {};
    sort[sortBy] = order === "asc" ? 1 : -1;

    const skip = (page - 1) * limit;

    const [leads, total] = await Promise.all([
      Lead.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit),

      Lead.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      leads,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch leads" });
  }
});

/* ---------------- UPDATE LEAD ---------------- */
router.put("/:id", async (req: Request, res: Response): Promise<void> => {
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

/* ---------------- DELETE LEAD ---------------- */
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete lead" });
  }
});

/* ---------------- STATS ---------------- */
router.get("/stats", async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await Lead.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const result: any = {
      New: 0,
      Qualified: 0,
      Contacted: 0,
      Converted: 0,
      Lost: 0,
    };

    data.forEach((d) => {
      result[d._id] = d.count;
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;