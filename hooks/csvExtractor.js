import Fs from 'fs';
import CsvReadableStream from 'csv-reader';
import { db } from '../config/db.js';

export const csvExtractor = async (orgRandId, actRandId, path, type) => {

    let inputStream = Fs.createReadStream(path, 'utf8');
    let isFirstRow = true
    let headers = []
    let parsedMembers = []
    let message = ""

    const insertOrgMemberQuery = `
        INSERT INTO org_member (org_id, name, position, email, contactNumber, studentNumber) 
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
                const memberValues = [
                    orgRandId,
                    member.name,
                    member.position,
                    member.email,
                    member.contactNumber,
                    member.studentNumber
                ];
                db.query(insertOrgMemberQuery, memberValues);
            }
        }

        // if (type === "planActivities") {
        //     for (let activity of parsedPlanActivities) {
        //         const activityValues = [
        //             actRandId,
        //             activity.activity,
        //             activity.learningOutcome,
        //             activity.targetTime,
        //             activity.targetGroup,
        //             activity.personsInvolved
        //         ];
        //         db.query(insertActivityQuery, activityValues);
        //     }
        // }
        
        message = 'CSV processing completed.' 
    })
    .on('error', (error) => {
        message = 'Error reading CSV file:' + error
    });

    return message
}

