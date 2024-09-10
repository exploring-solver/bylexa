const Command = require('../models/Command');

exports.createCommand = async (req, res) => {
  const { project, name, description, action } = req.body;
  try {
    const command = new Command({ project, name, description, action });
    await command.save();
    res.status(201).json(command);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getCommandsByProject = async (req, res) => {
  const { projectId } = req.params;
  try {
    const commands = await Command.find({ project: projectId });
    res.json(commands);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateCommand = async (req, res) => {
  const { commandId } = req.params;
  const { name, description, action } = req.body;
  try {
    const command = await Command.findByIdAndUpdate(
      commandId,
      { name, description, action },
      { new: true }
    );
    if (!command) {
      return res.status(404).json({ error: 'Command not found' });
    }
    res.json(command);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteCommand = async (req, res) => {
  const { commandId } = req.params;
  try {
    const command = await Command.findByIdAndDelete(commandId);
    if (!command) {
      return res.status(404).json({ error: 'Command not found' });
    }
    res.json({ message: 'Command deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};