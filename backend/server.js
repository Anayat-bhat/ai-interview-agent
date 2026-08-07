const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Single standardized HTTP Endpoint from technical-spec.md
app.post('/api/interview', (req, res) => {
  const { sessionId, candidate, message, endSession } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: 'sessionId is required' });
  }

  // End Interview Turn
  if (endSession) {
    return res.json({
      reply: 'Interview completed.',
      done: true,
      feedback: {
        summary:
          'Candidate demonstrated strong technical knowledge and communicated effectively throughout the interview.',
        strengths: [
          'Strong React & Data Engineering fundamentals',
          'Clear technical communication',
          'Methodical problem-solving approach',
        ],
        gaps: [
          'Advanced performance tuning',
          'Testing strategies',
          'System design knowledge',
        ],
        next: [
          'Practice performance optimization',
          'Build full-stack architectural projects',
          'Learn caching techniques',
        ],
      },
    });
  }

  // Start Interview Turn
  if (candidate) {
    const candidateName = candidate.name || candidate.member?.name || 'Candidate';
    return res.json({
      reply: `Welcome ${candidateName}. Let's begin your interview.`,
      done: false,
    });
  }

  // Conversation Turn
  if (message) {
    return res.json({
      reply: `Thank you for your answer. Let's proceed to the next technical topic.`,
      done: false,
    });
  }

  return res.json({
    reply: "Welcome. Let's begin your interview.",
    done: false,
  });
});

app.listen(PORT, () => {
  console.log(`AI Interview Agent backend running on http://localhost:${PORT}`);
});
