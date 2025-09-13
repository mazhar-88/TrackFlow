import { dbInstance } from "../config/db.js";
import { ObjectId } from "mongodb";

const collectionName = "sessions";

// create session
export const createSessionController = async (req, res) => {
  let db = dbInstance();
  try {
    const sessionCode = Math.random().toString(36).substring(2, 9);

    const sessionObj = {
      code: sessionCode,
      createdBy: req.user.id,
      participants: [
        {
          userId: req.user.id,
          name: req.user.email, // frontend se naam bhi bhejna better hai
          role: req.user.role,
          status: "host"
        }
      ],
      createdAt: new Date(),
    };

    const result = await db.collection(collectionName).insertOne(sessionObj);

    res.status(201).json({
      message: "Session created successfully",
      code: sessionCode,
      id: result.insertedId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// join session
export const joinSessionController = async (req, res) => {
  let db = dbInstance();
  try {
    const { code } = req.params;

    const session = await db.collection(collectionName).findOne({ code });
    if (!session) return res.status(404).json({ message: "Session not found" });

    // check if already participant
    const exists = session.participants.find(p => p.userId.toString() === req.user.id.toString());
    if (exists) {
      return res.json({ message: "Already joined", session });
    }

    const participant = {
      userId: req.user.id,
      name: req.user.email,
      role: req.user.role,
      status: "connected"
    };

    await db.collection(collectionName).updateOne(
      { code },
      { $push: { participants: participant } }
    );

    res.json({ message: "Joined session", participant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get session details
export const getSessionController = async (req, res) => {
  let db = dbInstance();
  try {
    const { code } = req.params;
    const session = await db.collection(collectionName).findOne({ code });
    if (!session) return res.status(404).json({ message: "Session not found" });

    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// leave session
export const leaveSessionController = async (req, res) => {
  let db = dbInstance();
  try {
    const { code } = req.params;

    await db.collection(collectionName).updateOne(
      { code },
      { $pull: { participants: { userId: req.user.id } } }
    );

    res.json({ message: "Left session" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
