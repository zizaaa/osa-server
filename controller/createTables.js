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

const createReAccreditationTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS reAccreditation (
            reAccre_id INT AUTO_INCREMENT PRIMARY KEY, 
            org_id VARCHAR(999),
            act_id VARCHAR(999),
            finance_id VARCHAR (999),
            accomp_id VARCHAR (999),
            appendices VARCHAR(999),
            constitution VARCHAR(999),
            orgName VARCHAR(999),
            type VARCHAR(999),
            letter VARCHAR(999) 
        )
    `

    try {
        await db.query(query);
        console.log('Table "Re-Accreditation" created successfully!');
    } catch (err) {
        console.error('Error creating table "Re-Accreditation":', err);
    }
}

const createFinanceTable = async () => {   
    const query = `
        CREATE TABLE IF NOT EXISTS finance (
            finance_id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(999),
            date VARCHAR(999),
            totalBudget VARCHAR(999),
            source VARCHAR(999),
            particulars VARCHAR(999),
            item VARCHAR(999),
            quantity VARCHAR(999),
            unitPrice VACHAR(999),
            amount VARCHAR(999),
            receipt VARCHAR(999)
        )
    `

    try {
        await db.query(query);
        console.log('Table "Finance" created successfully!');
    } catch (err) {
        console.error('Error creating table "Finance":', err);
    }
}

const createAccomplishmentTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS accomplishment (
            accomp_id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(999),
            date VARCHAR(999),
            venue VARCHAR(999),
            participants VARCHAR(999),
            speakers VARCHAR(999),
            body VARCHAR(MAX)
        )
    `

    try {
        await db.query(query);
        console.log('Table "Accomplishment" created successfully!');
    } catch (err) {
        console.error('Error creating table "Accomplishment":', err);
    }
}

// Ensure tables are created in the correct order
export const initializeTables = async () => {
    await createMemberTable();
    await createActTable();
    await createAccreditationTable();
    await createReAccreditationTable();
    await createFinanceTable();
    await createAccomplishmentTable();
};
