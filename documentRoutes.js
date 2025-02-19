const express = require('express');
const Document = require('../models/Document');

const router = express.Router();

// Get the document content
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    let doc = await Document.findById(id);
    if (!doc) {
      doc = new Document({ _id: id });
      await doc.save();
    }
    res.json({ content: doc.content });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Save the document content
router.post('/:id', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  try {
    let doc = await Document.findById(id);
    if (!doc) {
      doc = new Document({ _id: id, content });
    } else {
      doc.content = content;
    }
    await doc.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;