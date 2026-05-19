// server/controllers/aiController.js | AI complaint analysis controller | Author: SmartComplain | Date: 2026-05-19
const axios = require('axios');
const Complaint = require('../models/Complaint');

const getRuleBasedAnalysis = (title, description, category) => {
  const text = `${title} ${description} ${category}`.toLowerCase();
  let department = 'General Administration';
  let urgency = 'Medium';

  if (text.includes('water') || text.includes('pipeline') || text.includes('leakage')) {
    department = 'Water Supply Department';
    urgency = 'High';
  } else if (text.includes('electric') || text.includes('power') || text.includes('light')) {
    department = 'Electricity Department';
    urgency = 'High';
  } else if (text.includes('garbage') || text.includes('waste') || text.includes('sanitation')) {
    department = 'Sanitation Department';
    urgency = 'Medium';
  } else if (text.includes('road') || text.includes('pothole') || text.includes('traffic')) {
    department = 'Public Works Department';
    urgency = 'Medium';
  } else if (text.includes('crime') || text.includes('theft') || text.includes('safety')) {
    department = 'Police / Public Safety';
    urgency = 'Critical';
  } else if (text.includes('hospital') || text.includes('health') || text.includes('medical')) {
    department = 'Health Department';
    urgency = 'High';
  }

  return {
    urgency,
    department,
    autoResponse: `Dear citizen, your complaint regarding "${title}" has been received and forwarded to the ${department}. Our team will investigate and take necessary action within 3-5 working days. Thank you for helping us improve public services.`,
    summary: `Complaint about ${category.toLowerCase()} issue reported at the specified location.`,
    priorityScore: urgency === 'Critical' ? 9 : urgency === 'High' ? 7 : urgency === 'Medium' ? 5 : 3
  };
};

const analyzeComplaint = async (req, res) => {
  try {
    const { complaintId } = req.body;

    if (!complaintId) {
      return res.status(400).json({ success: false, message: 'complaintId is required' });
    }

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const prompt = `You are an AI assistant for a government complaint management system in India.
Analyze the following citizen complaint carefully and respond ONLY with a valid JSON object.
Do NOT include markdown, code blocks, backticks, or any explanation outside the JSON.

Complaint Title: ${complaint.title}
Category: ${complaint.category}
Description: ${complaint.description}
Location: ${complaint.location}

Respond with ONLY this exact JSON structure:
{
  "urgency": "Low or Medium or High or Critical",
  "department": "full name of the responsible government department",
  "autoResponse": "a professional, empathetic 2-3 sentence response addressed to the citizen",
  "summary": "one clear concise sentence summarizing the core complaint",
  "priorityScore": a number between 1 and 10
}`;

    const response = await axios.post(
      `${process.env.OPENROUTER_BASE_URL}/chat/completions`,
      {
        model: process.env.OPENROUTER_MODEL || 'mistralai/mistral-7b-instruct',
        messages: [
          {
            role: 'system',
            content: 'You are a government complaint analysis AI. Always respond with pure valid JSON only. No markdown. No explanation.'
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.3
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:5173',
          'X-Title': 'SmartComplain'
        }
      }
    );

    const rawText = response.data.choices[0].message.content.trim();
    const cleanText = rawText.replace(/```json|```/gi, '').trim();

    let analysis;
    try {
      analysis = JSON.parse(cleanText);
    } catch (parseErr) {
      analysis = getRuleBasedAnalysis(complaint.title, complaint.description, complaint.category);
    }

    const priorityMap = {
      Low: 'Low',
      Medium: 'Medium',
      High: 'High',
      Critical: 'Critical'
    };

    complaint.aiAnalysis = {
      urgency: analysis.urgency || 'Medium',
      department: analysis.department || 'General Administration',
      autoResponse: analysis.autoResponse || '',
      summary: analysis.summary || '',
      priorityScore: analysis.priorityScore || 5,
      analyzedAt: new Date()
    };
    complaint.priority = priorityMap[analysis.urgency] || 'Medium';
    await complaint.save();

    return res.status(200).json({
      success: true,
      message: 'Complaint analyzed successfully',
      analysis: complaint.aiAnalysis,
      priority: complaint.priority
    });
  } catch (error) {
    try {
      const complaint = await Complaint.findById(req.body.complaintId);
      if (complaint) {
        const fallback = getRuleBasedAnalysis(complaint.title, complaint.description, complaint.category);
        complaint.aiAnalysis = { ...fallback, analyzedAt: new Date() };
        complaint.priority = fallback.urgency;
        await complaint.save();

        return res.status(200).json({
          success: true,
          message: 'Analyzed using fallback rules (AI unavailable)',
          analysis: complaint.aiAnalysis,
          priority: complaint.priority,
          fallback: true
        });
      }
    } catch (fallbackErr) {
      console.error(`Fallback failed: ${fallbackErr.message}`);
    }

    return res.status(500).json({
      success: false,
      message: 'AI analysis failed',
      error: error?.response?.data?.error?.message || error.message
    });
  }
};

module.exports = { analyzeComplaint };