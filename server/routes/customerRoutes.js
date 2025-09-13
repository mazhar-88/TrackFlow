import express from 'express';
import {
    postCustomerController,
    getCustomerController,
    updateCustomerController,
    deleteCustomerController
} from '../controllers/customerController.js';

const customerRoutes = express.Router();

customerRoutes.post("/students", postCustomerController);
customerRoutes.get("/students", getCustomerController);
customerRoutes.put("/students/:id", updateCustomerController);
customerRoutes.delete("/students/:id", deleteCustomerController);

export default customerRoutes;