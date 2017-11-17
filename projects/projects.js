if ('content' in document.createElement('template')) {
  console.log('Templates are supported');
new WOW().init();
// List of all projects and related data
var projects = [
  {'location': 'thumbs/demo.jpeg', 'title': 'DoData', 'body': 'Making knowledge available on the internet accessible to the underprivileged', 'target': '/projects/dodata/', 'tags':['UI Design','Visual Identity']},
  {'location': 'thumbs/demo.jpeg', 'title': 'Card title', 'body': 'Some quick example content.', 'target': 'https://google.com', 'tags':['a','b','c']},
  {'location': 'thumbs/demo.jpeg', 'title': 'Card title', 'body': 'Some quick example content.', 'target': 'https://google.com', 'tags':['a','b','c']},
  {'location': 'thumbs/demo.jpeg', 'title': 'Card title', 'body': 'Some quick example content.', 'target': 'https://google.com', 'tags':['a','b','c']},
  {'location': 'thumbs/demo.jpeg', 'title': 'Card title', 'body': 'Some quick example content.', 'target': 'https://google.com', 'tags':['a','b','c']},
  {'location': 'thumbs/demo.jpeg', 'title': 'Card title', 'body': 'Some quick example content.', 'target': 'https://google.com', 'tags':['a','b','c']},
  {'location': 'thumbs/demo.jpeg', 'title': 'Card title', 'body': 'Some quick example content.', 'target': 'https://google.com', 'tags':['a','b','c']}
 // {'location': 'thumbs/demo.jpeg', 'title': 'Card title', 'body': 'Some quick example content.', 'target': 'https://google.com', 'tags':['a','b','c']}
];
console.log(projects);
// Get a reference to the comments list in the main DOM.
var projectsList = document.getElementById('projects');

// Loop through each of the projects and add them to the projects list.
for (var i = 0; i < projects.length; i++) {
  var project = projects[i];
  var tmpl = document.getElementById('card-template').content.cloneNode(true);
  tmpl.querySelector('.img-fluid').src = project.location;
  tmpl.querySelector('.card-title').innerText = project.title;
  tmpl.querySelector('.card-text').innerText = project.body;
  tmpl.querySelector('.target').href = project.target;
  for (var t=0; t < project.tags.length; t++) 
  {
  	var tag = document.createElement('span');
  	tag.innerText = project.tags[t];
  	tag.setAttribute('class','tags text-font');
  	tmpl.querySelector('.tags-row').appendChild(tag);
  }
  projectsList.appendChild(tmpl);
}
} 
else {
  console.log('Templates are not supported');
}

