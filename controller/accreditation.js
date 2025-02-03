import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/db.js';
import { csvExtractor } from '../hooks/csvExtractor.js';
import { csvOfficer } from '../hooks/csvOfficer.js';

export const addAccreditation = async (req, res) => {

    // const organizationRandomId = uuidv4();
    const memberRandomId = uuidv4();
    const officerRandomId = uuidv4();
    const activityRandomId = uuidv4();

    // Access uploaded files by field name
    const { membersFile, officersFile, planFile, constitution, letter, appendices } = req.files; // Each field returns an array of files

    if (!constitution || !letter || !appendices) {
        return res.status(400).json({ message: 'Required files are missing' });
    }

    if (membersFile) {
        const path = membersFile[0].path
        const csv = await csvExtractor(path, "members")
    }

    if (officersFile) {
        const path = officersFile[0].path
        const csv = await csvOfficer(officerRandomId, path, "officers")
    }

    // if (planFile) {
    //     const fileName = req.files['planFile'].filename
    //     const csv = await csvExtractor(orgRandId, actRandId, fileName, "planActivities" ,)
    // }

    const insertAccreditationQuery = `
        INSERT INTO accreditation (orgName, type, officer_id, member_id, activity_id, constitution, letter, appendices, submitted_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW());
    `;

    const insertMemberQuery = `
        INSERT INTO member (member_id, name, position, email, contactNumber, studentNumber) 
        VALUES (?, ?, ?, ?, ?, ?);
    `;

    const insertOfficerQuery = `
        INSERT INTO officer(officer_id, name, position, email, contactNumber, studentNumber) 
        VALUES (?, ?, ?, ?, ?, ?);
    `;

    const insertActivityQuery = `
        INSERT INTO activity (activity_id, activity, learningOutcomes, targetTime, targetGroup, personsInvolved) 
        VALUES (?, ?, ?, ?, ?, ?);
    `;

    // const insertOrganizationQuery = ` 
    //     INSERT INTO organization (organization_id, member_id, officer_id, activity_id, name, type)
    //     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    // `;

    const { type, orgName, organizations, officers,  members, planActivities, } = req.body;

    try {
        // Parse members and planActivities
        const parsedMembers = JSON.parse(members);
        const parsedOfficers = JSON.parse(officers)
        const parsedPlanActivities = JSON.parse(planActivities);
        // const parsedOrganization = JSON.parse(organizations)

        // Validate that members and planActivities are arrays
        if (!Array.isArray(parsedMembers) || !Array.isArray(parsedPlanActivities) || !Array.isArray(parsedOfficers)) {
            return res.status(400).json({ message: 'Invalid input: members and planActivities should be arrays' });
        }
        // Insert Organization
        // for (let organization of parsedOrganization) {
        //     const organizationValues = [
        //         organizationRandomId,
        //         memberRandomId,
        //         officerRandomId,
        //         activityRandomId,
        //         organization.name,
        //         organization.type,
        //     ];
        //     db.query(insertOrganizationQuery, organizationValues);
        // } 
        // Insert Member
        for (let member of parsedMembers) {
            const memberValues = [
                memberRandomId,
                member.name,
                member.position,
                member.email,
                member.contactNumber,
                member.studentNumber
            ];
            db.query(insertMemberQuery, memberValues);
        } 
        // Insert Officer
        for (let officer of parsedOfficers) {
            const officerValues = [
                officerRandomId,
                officer.name,
                officer.position,
                officer.email,
                officer.contactNumber,
                officer.studentNumber
            ];
            db.query(insertOfficerQuery, officerValues);
        } 
        // Insert Activity
        for (let activity of parsedPlanActivities) {
            const activityValues = [
                activityRandomId,
                activity.activity,
                activity.learningOutcome,
                activity.targetTime,
                activity.targetGroup,
                activity.personsInvolved
            ];
            db.query(insertActivityQuery, activityValues);
        }

        // Insert accreditation data into accreditation table
        const accreditationValues = [
            orgName,
            type,
            officerRandomId,
            memberRandomId,
            activityRandomId,
            constitution[0].path,
            letter[0].path,
            appendices[0].path
        ];

        const [accreditationResult] = await db.query(insertAccreditationQuery, accreditationValues);
        console.log(accreditationValues) // here
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
                accreditation.accreditation_id,
                accreditation.member_id,
                accreditation.officer_id,
                accreditation.activity_id,
                accreditation.appendices,
                accreditation.constitution,
                accreditation.orgName,
                accreditation.type,
                accreditation.letter,
                accreditation.submitted_at,
                members.name AS member_name,
                members.position AS member_position,
                members.contactNumber AS member_contactNumber,
                members.studentNumber AS member_studentNumber,
                activity.activity AS plan_activity,
                activity.learningOutcomes AS plan_learningOutcomes,
                activity.targetTime AS plan_targetTime,
                activity.targetGroup AS plan_targetGroup,
                activity.personsInvolved AS plan_personsInvolved
            FROM accreditation accreditation
            LEFT JOIN member members ON accreditation.member_id = members.member_id
            LEFT JOIN activity activity ON accreditation.activity_id = activity.activity_id;
        `;
        
        // Fetch the data from the database
        const [rows] = await db.query(query);
        
        // Transform the data into the structure expected by the frontend
        const result = rows.reduce((acc, row) => {
            // Find the existing accreditation entry in the accumulator or create one
            let accreditation = acc.find(acc => acc.accreditation_id === row.accreditation_id);
            if (!accreditation) {
                accreditation = {
                    accreditation_id: row.accreditation_id,
                    org_id: row.member_id,
                    act_id: row.activity_id,
                    appendices: row.appendices,
                    constitution: row.constitution,
                    orgName: row.orgName,
                    submitted_at: row.submitted_at,
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
                    email: row.member_email,
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
