import { v4 as uuidv4, validate } from 'uuid';
import { db } from '../config/db.js';

export const addReAccreditation = async (req, res) => {
    const financeRandId = uuidv4();
    const accompRandId = uuidv4();

    // Access uploaded files by field name
    // const { letter, appendices } = req.files; // Each field returns an array of files


    // if (!letter || !appendices) {
    //     return res.status(400).json({ message: 'Required files are missing' });
    // }

    const insertReAccreditationQuery = `
        INSERT INTO reAccreditation (org_id, act_id, finance_id, accomp_id, appendices, orgName, type, letter) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const insertOrgMemberQuery = `
        INSERT INTO org_member (org_id, name, position, contactNumber, studentNumber) 
        VALUES (?, ?, ?, ?, ?);
    `;
    const insertActivityQuery = `
        INSERT INTO activity (act_id, activity, learningOutcomes, targetTime, targetGroup, personsInvolved) 
        VALUES (?, ?, ?, ?, ?, ?);
    `;
    const insertFinancialQuery = `
        INSERT INTO finance (finance_id, title, date, totalBudget, particulars, source, item, quantity, unitPrice, amount, receipt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const insertAccomplishmentQuery = `
        INSERT INTO accomplishment (accomp_id, title, date, venue, participants, speakers, body)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const { orgName, type, members, planActivities, finance, accomplishment, letter, appendices } = req.body;

    try {
        // Parse members and planActivities
        const parsedMembers = members;
        const parsedPlanActivities = planActivities;
        const parsedAccomplishment = accomplishment;
        const parsedFinance = finance;
    

        // Validate that members and planActivities are arrays
        if (!Array.isArray(parsedMembers) || !Array.isArray(parsedPlanActivities)) {
            return res.status(400).json({ message: 'Invalid input: members and planActivities should be arrays' });
        }

        // Check if the name already exists
        const checkQuery = "SELECT * FROM org_member WHERE name = ? ";
        const [results] = await db.query(checkQuery, [members[0].name], (err, results) => {
            if (err) {
                console.error("Error checking name:", err.message);
                return res.status(500).json({ message: "Server error." });
            }
        });

        if (results.length > 0) {
            return res.status(400).json({ message: `The members already exists.` });
        }

        // csv reader

        // const [results] = await db.query(
        //     'SELECT * FROM `org_member` WHERE `name` = ? ',
        //     [members[0].name]
        //   );
        //   if (results.length > 0) {
        //         return res.status(400).json({ message: `The members already exists.` });
        //     }

        // console.log(results)

        // Insert members into org_member table
        for (let member of parsedMembers) {
            const memberValues = [
                member.org_id,
                member.name,
                member.position,
                member.contactNumber,
                member.studentNumber
            ];
            await db.query(insertOrgMemberQuery, memberValues);
        }

        // Insert activities into activity table
        for (let activity of parsedPlanActivities) {
            const activityValues = [
                activity.act_id,
                activity.activity,
                activity.learningOutcome,
                activity.targetTime,
                activity.targetGroup,
                activity.personsInvolved
            ];
            await db.query(insertActivityQuery, activityValues);
        }

        // Insert finance into finance table 
        for (let finance of parsedFinance) {
            const financeValues = [
                financeRandId,
                finance.title, 
                finance.date,
                finance.totaBudget,
                finance.particulars,
                finance.source,
                finance.item,
                finance.quantity,
                finance.unitPrice,
                finance.amount,
                finance.receipt
            ];
            await db.query(insertFinancialQuery, financeValues)
        }

        // Insert accomplishment into accomplishment table
        for (let accomplishment of parsedAccomplishment) {
            const accomplishmentValues = [
                accompRandId, 
                accomplishment.title,
                accomplishment.date,
                accomplishment.venue, 
                accomplishment.participants,
                accomplishment.speakers,
                accomplishment.body
            ]
            await db.query(insertAccomplishmentQuery, accomplishmentValues)
        }

        // console.log(appendices)
        // console.log(letter)

        // Insert Re-Accreditation data into Re-Accreditation table
        const ReAccreditationValues = [
            members[0].org_id,
            planActivities[0].act_id,
            financeRandId,
            accompRandId,
            orgName,
            type,
            appendices,
            letter
        ];
        const [ReAccreditationResult] = await db.query(insertReAccreditationQuery, ReAccreditationValues);

        // Respond with success
        res.status(201).json({
            message: 'ReAccreditation added successfully!',
            accreditationId: ReAccreditationResult.insertId
        });

    } catch (err) {
        console.error('Error adding ReAccreditation:', err);
        res.status(500).json({ error: 'Failed to add ReAccreditation', details: err.message });
    }
};

export const getReAccreditation = async (req, res) =>{
    try {
        // SQL query to join the tables and fetch relevant data
        const query = `
            SELECT 
                reAccre.reAccre_id,
                reAccre.org_id,
                reAccre.act_id,
                reAccre.appendices,
                reAccre.orgName,
                reAccre.type,
                reAccre.letter,
                org.name AS member_name,
                org.position AS member_position,
                org.contactNumber AS member_contactNumber,
                org.studentNumber AS member_studentNumber,
                activity.activity AS plan_activity,
                activity.learningOutcomes AS plan_learningOutcomes,
                activity.targetTime AS plan_targetTime,
                activity.targetGroup AS plan_targetGroup,
                activity.personsInvolved AS plan_personsInvolved,
                fin.title AS finance_title,
                fin.date AS finance_date,
                fin.totalBudget AS finance_totalBudget,
                fin.source AS finance_source,
                fin.item AS finance_item,
                fin.quantity AS finance_quantity,
                fin.unitPrice AS finance_unitPrice,
                fin.receipt AS finance_receipt,
                accom.title AS accomplishment_title,
                accom.date AS accomplishment_date,
                accom.venue AS accomplishment_venue,
                accom.participants AS accomplishment_participants,
                accom.speakers AS accomplishment_speakers,
                accom.body AS accomplishment_body

            FROM reAccreditation reAccre
            LEFT JOIN org_member org ON reAccre.org_id = org.org_id
            LEFT JOIN activity activity ON reAccre.act_id = activity.act_id
            LEFT JOIN finance fin ON reAccre.finance_id = fin.finance_id
            LEFT JOIN accomplishment accom ON reAccre.accomp_id = accom.accomp_id;
        `;
        
        // Fetch the data from the database
        const [rows] = await db.query(query);
        
        // Transform the data into the structure expected by the frontend
        const result = rows.reduce((acc, row) => {
            // Find the existing accreditation entry in the accumulator or create one
            let ReAccreditation = acc.find(acc => acc.accre_id === row.accre_id);
            if (!ReAccreditation) {
                ReAccreditation = {
                    accre_id: row.accre_id,
                    org_id: row.org_id,
                    act_id: row.act_id,
                    finance_id: row.finanice_id,
                    accomp_id: row.accomp_id,
                    appendices: row.appendices,
                    orgName: row.orgName,
                    type: row.type,
                    letter: row.letter,
                    members: [],
                    planActivities: []
                };
                acc.push(ReAccreditation);
            }
            
            // Push the member and activity data into the appropriate arrays
            if (row.member_name) {
                ReAccreditation.members.push({
                    name: row.member_name,
                    position: row.member_position,
                    contactNumber: row.member_contactNumber,
                    studentNumber: row.member_studentNumber
                });
            }
            
            if (row.plan_activity) {
                ReAccreditation.planActivities.push({
                    activity: row.plan_activity,
                    learningOutcomes: row.plan_learningOutcomes,
                    targetTime: row.plan_targetTime,
                    targetGroup: row.plan_targetGroup,
                    personsInvolved: row.plan_personsInvolved
                });
            }

            if (row.finance_title) {
                ReAccreditation.finance.push({
                    title: row.finance_title,
                    date: row.finance_date,
                    totalBudget: row.finance_totalBudget,
                    source: row.finance_source,
                    particulars: row.finance_particulars,
                    item: row.finance_item,
                    quantity: row.finance_unitPrice,
                    amount: row.finance_amount,
                    receipt: row.finance_receipt
                });
            }

            if (row.accomplishment_title) {
                ReAccreditation.accomplishment.push({
                    title: row.accomplishment_title,
                    date: row.accomplishment_date,
                    venue: row.accomplishment_venue,
                    participants: row.accomplishment_participants,
                    speakers: row.accomplishment_speakers,
                    body: row.accomplishment_body,
                });
            }
            
            return acc;
        }, []);
        
        // Send the formatted data to the frontend
        res.json(result);
    } catch (err) {
        console.error('Error fetching ReAccreditation data:', err);
        res.status(500).json({ error: 'Failed to fetch ReAccreditation data' });
    }
}