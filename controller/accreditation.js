import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/db.js';

export const addAccreditation = async (req, res) => {
    const orgRandId = uuidv4();
    const actRandId = uuidv4();

    // Access uploaded files by field name
    const { constitution, letter, appendices } = req.files; // Each field returns an array of files

    if (!constitution || !letter || !appendices) {
        return res.status(400).json({ message: 'Required files are missing' });
    }

    const insertOrgMemberQuery = `
        INSERT INTO org_member (org_id, name, position, contactNumber, studentNumber) 
        VALUES (?, ?, ?, ?, ?);
    `;
    const insertActivityQuery = `
        INSERT INTO activity (act_id, activity, learningOutcomes, targetTime, targetGroup, personsInvolved) 
        VALUES (?, ?, ?, ?, ?, ?);
    `;
    const insertAccreditationQuery = `
        INSERT INTO accreditation (org_id, act_id, appendices, constitution, orgName, type, letter) 
        VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

    const { orgName, type, members, planActivities } = req.body;

    try {
        // Parse members and planActivities
        const parsedMembers = JSON.parse(members);
        const parsedPlanActivities = JSON.parse(planActivities);

        // Validate that members and planActivities are arrays
        if (!Array.isArray(parsedMembers) || !Array.isArray(parsedPlanActivities)) {
            return res.status(400).json({ message: 'Invalid input: members and planActivities should be arrays' });
        }

        // Insert members into org_member table
        for (let member of parsedMembers) {
            const memberValues = [
                orgRandId,
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
                actRandId,
                activity.activity,
                activity.learningOutcome,
                activity.targetTime,
                activity.targetGroup,
                activity.personsInvolved
            ];
            await db.query(insertActivityQuery, activityValues);
        }
        console.log(appendices)
        console.log(constitution)
        console.log(letter)
        // Insert accreditation data into accreditation table
        const accreditationValues = [
            orgRandId,
            actRandId,
            appendices[0].path,
            constitution[0].path,
            orgName,
            type,
            letter[0].path
        ];
        const [accreditationResult] = await db.query(insertAccreditationQuery, accreditationValues);

        // Respond with success
        res.status(201).json({
            message: 'Accreditation added successfully!',
            accreditationId: accreditationResult.insertId
        });

    } catch (err) {
        console.error('Error adding accreditation:', err);
        res.status(500).json({ error: 'Failed to add accreditation', details: err.message });
    }
};


export const getAccreditation = async (req,res) =>{
    try {
        // SQL query to join the tables and fetch relevant data
        const query = `
            SELECT 
                accre.accre_id,
                accre.org_id,
                accre.act_id,
                accre.appendices,
                accre.constitution,
                accre.orgName,
                accre.type,
                accre.letter,
                org.name AS member_name,
                org.position AS member_position,
                org.contactNumber AS member_contactNumber,
                org.studentNumber AS member_studentNumber,
                activity.activity AS plan_activity,
                activity.learningOutcomes AS plan_learningOutcomes,
                activity.targetTime AS plan_targetTime,
                activity.targetGroup AS plan_targetGroup,
                activity.personsInvolved AS plan_personsInvolved
            FROM accreditation accre
            LEFT JOIN org_member org ON accre.org_id = org.org_id
            LEFT JOIN activity activity ON accre.act_id = activity.act_id;
        `;
        
        // Fetch the data from the database
        const [rows] = await db.query(query);
        
        // Transform the data into the structure expected by the frontend
        const result = rows.reduce((acc, row) => {
            // Find the existing accreditation entry in the accumulator or create one
            let accreditation = acc.find(acc => acc.accre_id === row.accre_id);
            if (!accreditation) {
                accreditation = {
                    accre_id: row.accre_id,
                    org_id: row.org_id,
                    act_id: row.act_id,
                    appendices: row.appendices,
                    constitution: row.constitution,
                    orgName: row.orgName,
                    type: row.type,
                    letter: row.letter,
                    members: [],
                    planActivities: []
                };
                acc.push(accreditation);
            }
            
            // Push the member and activity data into the appropriate arrays
            if (row.member_name) {
                accreditation.members.push({
                    name: row.member_name,
                    position: row.member_position,
                    contactNumber: row.member_contactNumber,
                    studentNumber: row.member_studentNumber
                });
            }
            
            if (row.plan_activity) {
                accreditation.planActivities.push({
                    activity: row.plan_activity,
                    learningOutcomes: row.plan_learningOutcomes,
                    targetTime: row.plan_targetTime,
                    targetGroup: row.plan_targetGroup,
                    personsInvolved: row.plan_personsInvolved
                });
            }
            
            return acc;
        }, []);
        
        // Send the formatted data to the frontend
        res.json(result);
    } catch (err) {
        console.error('Error fetching accreditation data:', err);
        res.status(500).json({ error: 'Failed to fetch accreditation data' });
    }
}