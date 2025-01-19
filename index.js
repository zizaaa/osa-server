import express from 'express';
import cors from 'cors';

import accreditationRoutes from "./routes/accreditationRoutes.js";
import reAccreditationRoutes from './routes/reAccreditationRoutes.js'
import { initializeTables } from './controller/createTables.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use('/uploads', express.static('uploads'));

// routes
    app.get('/', (req, res) => {
        res.json('Hello backend');
    });

    app.use(accreditationRoutes);
    app.use(reAccreditationRoutes)

// create table
    initializeTables();


app.listen(8800, () => {
    console.log('Server is running on http://localhost:8800');
});