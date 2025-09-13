import { MongoClient, ObjectId } from 'mongodb';
import { dbInstance } from "../config/db.js";

const collectionName = "customers-room";

export const postCustomerController = async (req, res) => {
    let db = dbInstance();
    try {
        const { fullName, email, phone, address } = req.body;
        const image = req?.file?.filename;

        // Required fields list
        const requiredFields = { fullName,email, phone, address, image };
        const missingFields = [];

        for (let key in requiredFields) {
            if (!requiredFields[key]) {
                missingFields.push(key);
            }
        }

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required field(s): ${missingFields.join(", ")}`
            });
        }

        const existingStudent = await db.collection(collectionName).findOne({ email });
        if (existingStudent) {
            return res.status(409).json({
                success: false,
                message: "A student with this email already exists."
            });
        }

        const requestObj = {
            fullName,
            email,
            phone,
            address,
            image,
        };

        let result = await db.collection(collectionName).insertOne(requestObj);

        if (result.acknowledged) {
            res.status(201).json({
                success: true,
                message: "Student created successfully.",
                id: result.insertedId
            });
        } else {
            res.status(500).json({
                success: false,
                message: "Failed to insert student."
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

export const getCustomerController = async (req, res) => {
    let db = dbInstance();
    try {
        // pagination
        const page = parseInt(req?.query?.page) || 1;
        const limit = parseInt(req?.query?.limit) || 5;
        const skip = (page - 1) * limit;

        // 🔹 search filter
        const search = req.query.search || "";
        let filter = {};
        if (search) {
            filter = {
                $or: [
                    { fullName: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } }
                ]
            };
        }

        const totalCount = await db.collection(collectionName).countDocuments(filter);

        let result = await db
            .collection(collectionName)
            .find(filter)
            .skip(skip)
            .limit(limit)
            .toArray();

        res.status(200).json({
            message: "Data fetched successfully",
            count: result.length,
            data: result,
            total: totalCount,
            page,
            limit
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};


export const updateCustomerController = async (req, res) => {
    let db = dbInstance();
    try {
        const id = req.params.id;
        const objForUpdate = {
            fullName: req?.body?.fullName || "John",
            email: req?.body?.email || "john@gmail.com",
            phone: req?.body?.age || 92333478797,
            address: req?.body?.address || "abc",
            image: req?.file?.filename || "static",
        };
        let result = await db.collection(collectionName).updateOne(
            { _id: new ObjectId(id) },
            { $set: objForUpdate }
        );
        if (result.modifiedCount) {
            res.status(201).json({
                message: "Student updated successfully.",
                result
            });
        } else {
            res.status(500).json({
                message: "server error"
            });
        }
    } catch (error) {
        console.log(error);
    }
};

export const deleteCustomerController = async (req, res) => {
    let db = dbInstance();
    try {
        const id = req.params.id;
        let result = await db.collection(collectionName).deleteOne({ _id: new ObjectId(id) });
        console.log(result);
        if (result.acknowledged) {
            res.status(200).json({
                message: "Student deleted successfully.",
                result
            });
        } else {
            res.status(500).json({
                message: "server error"
            });
        }
    } catch (error) {
        console.log(error);
    }

};