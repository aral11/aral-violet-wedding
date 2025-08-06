import { RequestHandler } from "express";
import { getDbConnection, sql } from "../config/database";

// Get current invitation
export const getInvitation: RequestHandler = async (req, res) => {
  try {
    const pool = await getDbConnection();
    const result = await pool.request().query(`
      SELECT TOP 1 id, pdf_data, filename, uploaded_at
      FROM wedding_invitation 
      ORDER BY uploaded_at DESC
    `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'No invitation found' });
    }

    const invitation = result.recordset[0];
    res.json({
      id: invitation.id,
      pdfData: invitation.pdf_data,
      filename: invitation.filename,
      uploadedAt: invitation.uploaded_at.toISOString()
    });
  } catch (error) {
    console.error('Error fetching invitation:', error);
    res.status(500).json({ error: 'Failed to fetch invitation' });
  }
};

// Upload new invitation
export const uploadInvitation: RequestHandler = async (req, res) => {
  try {
    const { pdfData, filename } = req.body;

    if (!pdfData) {
      return res.status(400).json({ error: 'PDF data is required' });
    }

    const pool = await getDbConnection();
    
    // Delete existing invitation first (only keep the latest)
    await pool.request().query('DELETE FROM wedding_invitation');
    
    // Insert new invitation
    const result = await pool.request()
      .input('pdf_data', sql.NVarChar, pdfData)
      .input('filename', sql.NVarChar, filename || 'wedding-invitation.pdf')
      .query(`
        INSERT INTO wedding_invitation (pdf_data, filename)
        OUTPUT INSERTED.id, INSERTED.uploaded_at
        VALUES (@pdf_data, @filename)
      `);

    const newInvitation = result.recordset[0];
    
    res.status(201).json({
      id: newInvitation.id,
      pdfData,
      filename: filename || 'wedding-invitation.pdf',
      uploadedAt: newInvitation.uploaded_at.toISOString()
    });
  } catch (error) {
    console.error('Error uploading invitation:', error);
    res.status(500).json({ error: 'Failed to upload invitation' });
  }
};

// Delete invitation
export const deleteInvitation: RequestHandler = async (req, res) => {
  try {
    const pool = await getDbConnection();
    
    const result = await pool.request()
      .query('DELETE FROM wedding_invitation');

    res.json({ message: 'Invitation deleted successfully' });
  } catch (error) {
    console.error('Error deleting invitation:', error);
    res.status(500).json({ error: 'Failed to delete invitation' });
  }
};
