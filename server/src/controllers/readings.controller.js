import { MAX_READINGS_PER_DAY } from "../constants.js";
import { validateReading } from "../helpers/reading.helper.js";
import { isValidDate } from "../helpers/date.helper.js";
import {
  getReadings,
  getReadingById,
  countReadingsOnDate,
  slotExists,
  createReading,
  updateReading,
  deleteReading,
} from "../services/reading.service.js";

const serverError = "Something went wrong. Please try again.";

export async function listReadings(req, res) {
  try {
    const { date } = req.query;
    if (date && !isValidDate(date)) {
      return res.status(400).json({ error: "Please select a valid date." });
    }
    const readings = await getReadings(req.userId, date);
    res.json({ readings });
  } catch (err) {
    console.error("listReadings error:", err.message);
    res.status(500).json({ error: serverError });
  }
}

export async function addReading(req, res) {
  try {
    const { reading_date, slot, value } = req.body;

    const error = validateReading(req.body);
    if (error) {
      return res.status(400).json({ error });
    }

    const count = await countReadingsOnDate(req.userId, reading_date);
    if (count >= MAX_READINGS_PER_DAY) {
      return res.status(400).json({ error: "You can add only 4 readings per day." });
    }

    if (await slotExists(req.userId, reading_date, slot)) {
      return res.status(400).json({ error: `You already have an ${slot} reading for this date.` });
    }

    const reading = await createReading(req.userId, reading_date, slot, Number(value));
    res.status(201).json({ reading });
  } catch (err) {
    console.error("addReading error:", err.message);
    res.status(500).json({ error: serverError });
  }
}

export async function editReading(req, res) {
  try {
    const id = Number(req.params.id);
    const { reading_date, slot, value } = req.body;

    const existing = Number.isInteger(id) ? await getReadingById(id, req.userId) : null;
    if (!existing) {
      return res.status(404).json({ error: "Reading not found." });
    }

    const error = validateReading(req.body);
    if (error) {
      return res.status(400).json({ error });
    }

    // moving to a different date: that day must have room
    if (reading_date !== existing.reading_date) {
      const count = await countReadingsOnDate(req.userId, reading_date);
      if (count >= MAX_READINGS_PER_DAY) {
        return res.status(400).json({ error: "You can add only 4 readings per day." });
      }
    }

    if (await slotExists(req.userId, reading_date, slot, id)) {
      return res.status(400).json({ error: `You already have an ${slot} reading for this date.` });
    }

    const reading = await updateReading(id, req.userId, reading_date, slot, Number(value));
    res.json({ reading });
  } catch (err) {
    console.error("editReading error:", err.message);
    res.status(500).json({ error: serverError });
  }
}

export async function removeReading(req, res) {
  try {
    const id = Number(req.params.id);
    const deleted = Number.isInteger(id) ? await deleteReading(id, req.userId) : false;
    if (!deleted) {
      return res.status(404).json({ error: "Reading not found." });
    }
    res.json({ message: "Reading deleted." });
  } catch (err) {
    console.error("removeReading error:", err.message);
    res.status(500).json({ error: serverError });
  }
}
