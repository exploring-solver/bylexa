const Project = require('../models/Project');
const Command = require('../models/Command');
const aiService = require('../services/aiService');

exports.createProject = async (req, res) => {
  const { name, description } = req.body;
  try {
    const project = new Project({ name, description });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
exports.parseCode = async (req, res) => {
  const { projectId } = req.params;
  const { code } = req.body;

  try {
    // This is a simple parser. You may need to adjust it based on your specific code structure.
    const commandRegex = /void\s+(\w+)\s*\(\s*\)\s*{/g;
    let match;
    const commands = [];

    while ((match = commandRegex.exec(code)) !== null) {
      const commandName = match[1];
      commands.push({
        project: projectId,
        name: commandName,
        description: `Executes the ${commandName} function`,
        action: commandName
      });
    }

    // Save the commands to the database
    await Command.insertMany(commands);

    res.json({ message: 'Commands parsed and saved successfully', commandsCount: commands.length });
  } catch (error) {
    console.error('Error parsing code:', error);
    res.status(500).json({ error: 'Failed to parse code and create commands' });
  }
};
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getProject = async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateProject = async (req, res) => {
  const { projectId } = req.params;
  const { name, description } = req.body;
  try {
    const project = await Project.findByIdAndUpdate(
      projectId,
      { name, description },
      { new: true }
    );
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteProject = async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await Project.findByIdAndDelete(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    // Also delete all commands associated with this project
    await Command.deleteMany({ project: projectId });
    res.json({ message: 'Project and associated commands deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.executeCommand = async (req, res) => {
  const { projectId } = req.params;
  const { command } = req.body;
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const availableCommands = await Command.find({ project: projectId });
    const commandNames = availableCommands.map(cmd => cmd.name);
    
    const interpretedCommand = await aiService.interpretCommand(command, commandNames);
    
    if (interpretedCommand) {
      const matchedCommand = availableCommands.find(cmd => cmd.name === interpretedCommand);
      if (matchedCommand) {
        // Update the current command for the project
        project.currentCommand = matchedCommand.action;
        await project.save();
        
        res.json({ status: 'Command executed', action: matchedCommand.action });
      } else {
        res.status(400).json({ error: 'Interpreted command not found in available commands' });
      }
    } else {
      res.status(400).json({ error: 'Unable to interpret command' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to execute command' });
  }
};

exports.getCurrentCommand = async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    if (project.currentCommand) {
      res.json({ command: project.currentCommand });
    } else {
      res.status(400).json({ error: 'No command available' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};