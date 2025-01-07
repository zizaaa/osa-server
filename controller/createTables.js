import { db } from "../config/db.js";

const createMemberTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS org_member (
            id INT AUTO_INCREMENT PRIMARY KEY,
            org_id VARCHAR(999), 
            name VARCHAR(999), 
            position VARCHAR(999), 
            contactNumber VARCHAR(999), 
            studentNumber VARCHAR(999)
        );
    `;

    try {
        await db.query(query);
        console.log('Table "org_member" created successfully!');
    } catch (err) {
        console.error('Error creating table "org_member":', err);
    }
};

const createActTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS activity (
            id INT AUTO_INCREMENT PRIMARY KEY,
            act_id VARCHAR(999), 
            activity VARCHAR(999), 
            learningOutcomes VARCHAR(999), 
            targetTime VARCHAR(999), 
            targetGroup VARCHAR(999), 
            personsInvolved VARCHAR(999)
        );
    `;

    try {
        await db.query(query);
        console.log('Table "activity" created successfully!');
    } catch (err) {
        console.error('Error creating table "activity":', err);
    }
};

const createAccreditationTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS accreditation (
            accre_id INT AUTO_INCREMENT PRIMARY KEY, 
            org_id VARCHAR(999), 
            act_id VARCHAR(999), 
            appendices VARCHAR(999), 
            constitution VARCHAR(999), 
            orgName VARCHAR(999), 
            type VARCHAR(999), 
            letter VARCHAR(999)
        );
    `;

    try {
        await db.query(query);
        console.log('Table "accreditation" created successfully!');
    } catch (err) {
        console.error('Error creating table "accreditation":', err);
    }
};

// Ensure tables are created in the correct order
export const initializeTables = async () => {
    await createMemberTable();
    await createActTable();
    await createAccreditationTable();
};
