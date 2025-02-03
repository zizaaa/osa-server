import Fs from 'fs';
import CsvReadableStream from 'csv-reader';
import { db } from '../config/db.js';

export const csvOfficer = async (officerRandomId, path, type) => {

    let inputStream = Fs.createReadStream(path, 'utf8');
    let isFirstRow = true
    let headers = []
    let parsedOfficers = []
    let message = ""

const insertOfficerQuery = `
    INSERT INTO officer(officer_id, name, position, email, contactNumber, studentNumber) 
    VALUES (?, ?, ?, ?, ?, ?);
`;

// offiers
inputStream
.pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
.on('data', (row) => {
    if (isFirstRow) {
        headers = row; // Store the first row as headers
        isFirstRow = false; // Skip this row from future processing
    } else {
        // Create an object where keys are headers and values are from the row
        const rowObject = headers.reduce((acc, header, index) => {
            acc[header] = row[index]; // Assign value from row to corresponding header
            return acc;
        }, {});
        parsedOfficers.push(rowObject); // Add the object to the rows array
    }
})
.on('end', () => {

    if (type === "officers") {
        for (let officers of parsedOfficers) {
            const officersValues = [
                officerRandomId,
                officers.name,
                officers.position,
                officers.email,
                officers.contactNumber,
                officers.studentNumber
            ];
            db.query(insertOfficerQuery, officersValues);
        }
    }
    
    message = 'CSV processing completed.' 
})
.on('error', (error) => {
    message = 'Error reading CSV file:' + error
});

    return message 
}