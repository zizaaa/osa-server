import Fs from 'fs';
import CsvReadableStream from 'csv-reader';
import { db } from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

export const csvExtractor = async (path, type) => {

    let inputStream = Fs.createReadStream(path, 'utf8');
    let isFirstRow = true
    let headers = []
    let parsedMembers = []
    let message = ""
    
    const insertMemberQuery = `
        INSERT INTO member (member_id, name, position, email, contactNumber, studentNumber) 
        VALUES (?, ?, ?, ?, ?, ?);
    `;

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
            parsedMembers.push(rowObject); // Add the object to the rows array
        }
    })
    .on('end', () => {
        if (type === "members") {
            for (let member of parsedMembers) {
                let memberRandomId = uuidv4();
                const memberValues = [
                    memberRandomId,
                    member.name,
                    member.position,
                    member.email,
                    member.contactNumber,
                    member.studentNumber
                ];
                db.query(insertMemberQuery, memberValues);
                console.log(memberRandomId)
            }
        }

        message = 'CSV processing completed.' 
    })
    .on('error', (error) => {
        message = 'Error reading CSV file:' + error
    });

    return message
}

