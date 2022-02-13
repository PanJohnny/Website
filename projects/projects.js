const express = require("express");
const router = express.Router();
const fs = require("fs");

if (!String.prototype.format) {
  String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
        ;
    });
  };
}


// GET /t-[tag]
router.get("/t-:tag", (req, res) => {
  const tag = req.params.tag;
  if (!tag) {
    res.status(400).send("No tag provided");
    return;
  }
  
  var html = createTagHTML(tag);
  if(html === null) {
    res.status(404).send("Tag not found");
    return;
  } else {
    res.send(html);
  }
});
// GET /p-[name]
router.get("/p-:name", (req, res) => {
  const name = req.params.name.replace(/-/g, " ").toLocaleLowerCase();
  if (!name) {
    res.status(400).send("No name provided");
    return;
  }
  if (doesProjectExist(name)) {
    res.send(createHTML(name));
  } else {
    res.status(404).send("Project not found");
  }
});

// GET / (only if no tag or project is provided)
router.get("/", (req, res) => {
  res.send(createIndexHTML());
});


function createHTML(name) {
  var project = getProjectByName(name);
  var projectJson = JSON.stringify(project);
  projectJson = projectJson.replace(/(\r\n|\n|\r)/gm, "");
  // read project.html sync
  const projectHtml = fs.readFileSync(__dirname + "/project.html");

  return projectHtml.toString().format(projectJson);
}

function getProjectsByTag(tag) {
  const projects = getProjects();
  const filteredProjects = projects.filter(project => project.tags.includes(tag));
  return filteredProjects;
}

function doesProjectExist(name) {
  return getProjectByName(name) !== undefined;
}

function getProjectByName(name) {
  return getProjects().find(project => project.name.toLocaleLowerCase() === name);
}

function getProjects() {
  const projects = fs.readdirSync(__dirname + "/projects");
  var projectJson = [];
  for (let index = 0; index < projects.length; index++) {
    const project = projects[index];
    if (!project.endsWith(".json") || project.startsWith("."))
      continue;
    // read file as json
    const json = fs.readFileSync(__dirname + "/projects/" + project);
    // parse json
    const projectJsonParsed = JSON.parse(json);
    projectJson.push(projectJsonParsed);
  }
  return projectJson;
}

function createTagHTML(tag) {
  const projects = getProjectsByTag(tag);
  if(projects.length < 1) {
    return null;
  }
  // read tag.html sync
  const tagHtml = fs.readFileSync(__dirname + "/tag.html");
  return tagHtml.toString().format(tag, JSON.stringify(projects));
}

function createIndexHTML() {
  const projects = getProjects();
  if(projects.length < 1) {
    return "No projects found";
  }
  const index = fs.readFileSync(__dirname + "/index.html");
  return index.toString().format(JSON.stringify(projects));
}

module.exports = router;