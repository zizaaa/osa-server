import { db } from "../config/db.js";

const createMemberTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS member (
            id INT AUTO_INCREMENT PRIMARY KEY,
            member_id VARCHAR(999), 
            name VARCHAR(999),
            position VARCHAR(999),
            email VARCHAR(999),
            contactNumber VARCHAR(999), 
            studentNumber VARCHAR(999)
        );
    `;

    try {
        await db.query(query);
        // console.log('Table "member" created successfully!');
    } catch (err) {
        console.error('Error creating table "member":', err);
    }
};

const createOfficerTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS officer (
            id INT AUTO_INCREMENT PRIMARY KEY,
            officer_id VARCHAR(999), 
            name VARCHAR(999),
            position VARCHAR(999),
            email VARCHAR(999),
            contactNumber VARCHAR(999), 
            studentNumber VARCHAR(999)
        );
    `;

    try {
        await db.query(query);
        // console.log('Table "officer" created successfully!');
    } catch (err) {
        console.error('Error creating table "officer":', err);
    }
};

const createActTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS activity (
            id INT AUTO_INCREMENT PRIMARY KEY,
            activity_id VARCHAR(999), 
            activity VARCHAR(999), 
            learningOutcomes VARCHAR(999), 
            targetTime VARCHAR(999), 
            targetGroup VARCHAR(999), 
            personsInvolved VARCHAR(999)
        );
    `;

    try {
        await db.query(query);
        // console.log('Table "activity" created successfully!');
    } catch (err) {
        console.error('Error creating table "activity":', err);
    }
};

const createAccreditationTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS accreditation (
            accreditation_id INT AUTO_INCREMENT PRIMARY KEY, 
            orgName VARCHAR(999), 
            type VARCHAR(999), 
            officer_id VARCHAR(999),
            member_id VARCHAR(999), 
            activity_id VARCHAR (999), 
            constitution VARCHAR(999), 
            letter VARCHAR(999),
            appendices VARCHAR(999),
            submitted_at DATE
        );
    `;

    try {
        await db.query(query);
        console.log('Table "accreditation" created successfully!');
    } catch (err) {
        console.error('Error creating table "accreditation":', err);
    }
};

const createReAccreditationTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS reAccreditation (
            reAccreditation_id INT AUTO_INCREMENT PRIMARY KEY, 
            member_id VARCHAR(999),
            officer_id VARCHAR (999),
            activity_id VARCHAR(999),
            finance_id VARCHAR (999),
            accomplishment_id VARCHAR (999),
            appendices VARCHAR(999),
            orgName VARCHAR(999),
            type VARCHAR(999),
            letter VARCHAR(999) 
        )
    `

    try {
        await db.query(query);
        console.log('Table "re-Accreditation" created successfully!');
    } catch (err) {
        console.error('Error creating table "Re-Accreditation":', err);
    }
}

const createFinanceTable = async () => {   
    const query = `
        CREATE TABLE IF NOT EXISTS finance (
            id INT AUTO_INCREMENT PRIMARY KEY,
            finance_id VARCHAR(999),
            title VARCHAR(999),
            date VARCHAR(999),
            totalBudget VARCHAR(999),
            source VARCHAR(999),
            particulars VARCHAR(999),
            item VARCHAR(999),
            quantity VARCHAR(999),
            unitPrice VARCHAR(999),
            amount VARCHAR(999),
            receipt VARCHAR(999)
        )
    `

    try {
        await db.query(query);
        // console.log('Table "Finance" created successfully!');
    } catch (err) {
        console.error('Error creating table "Finance":', err);
    }
}

const createAccomplishmentTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS accomplishment (
            id INT AUTO_INCREMENT PRIMARY KEY,
            accomplishment_id VARCHAR(999),
            title VARCHAR(999),
            date VARCHAR(999),
            venue VARCHAR(999),
            participants VARCHAR(999),
            speakers VARCHAR(999),
            body VARCHAR(999)
        )
    `

    try {
        await db.query(query);
        // console.log('Table "Accomplishment" created successfully!');
    } catch (err) {
        console.error('Error creating table "Accomplishment":', err);
    }
}

// Ensure tables are created in the correct order
export const initializeTables = async () => {
    await createMemberTable();
    await createOfficerTable();
    await createActTable();
    await createAccreditationTable();
    await createReAccreditationTable();
    await createFinanceTable();
    await createAccomplishmentTable();
};
