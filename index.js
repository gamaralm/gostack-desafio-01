const express = require('express');

const server = express();

server.use(express.json());

let requestsCount = 0;
const projects = [];

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if(!project) {
    return res.status(400).json({ error: 'Project does not exists' });
  }

  return next();
}

function increaseRequestsCount(req, res, next) {
  requestsCount++;

  console.log(`Requisições: ${requestsCount}`);

  return next();
}

server.use(increaseRequestsCount);

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.get('/projects/:id', (req, res) => {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  return res.json(project);
});

server.post('/projects', (req, res) => {
  const { id, title } = req.body;
  const project = { id, title, "tasks": [] };

  projects.push(project);

  return res.json(project);
});

server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex(p => p.id == id);

  projects.splice(index, 1);

  return res.send();
});

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.send(project);
});

server.listen(3000);