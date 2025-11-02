// JS - Designed for projects page


// Globals
let pendingOperation = null;
let currentProjectID = null;
let newProjectStatus = null;
let editProjectStatus = null;

// Elements
const projectsWrapper = document.querySelector('#projects-list #wrapper');
const projectInfo = document.querySelector('#project-info');
const newProjectPanel = document.querySelector('#projects-list #new-project-panel')
const newBtn = document.querySelector('#new-project-container');
const editBtn = document.querySelector('#project-info #edit-btn');
const deleteBtn = document.querySelector('#project-info #delete-btn');
const confirmBox = document.querySelector('#confirm-box');
const main = document.querySelector('main');

// Functions
/**
 * @returns {HTMLElement} The created project item div
 */
function createProjectItem(project_id, project_name) {
    const div = document.createElement('div');
    div.classList.add('item');
    div.setAttribute('data-id', project_id);
    const h3 = document.createElement('h3');
    h3.innerText = project_name;
    div.appendChild(h3);

    return div;
}

function removeProjectItem(project_id) {
    Array.from(projectsWrapper.querySelectorAll('.item')).forEach( (project) => {
        if (project.getAttribute('data-id') === project_id) {
            // Remove
            project.remove();
            return
        }
    })
}

function addProject(pID, pJSON) {
    const pDIV = createProjectItem(pID, pJSON.name);

    // Event listener
    pDIV.addEventListener('click', () => {
        // Set ID
        currentProjectID = pID;

        // Make visible
        projectInfo.classList.add('visible');

        // Update fields
        projectInfo.querySelector('#title').innerText = pJSON.name;
        projectInfo.querySelector('#description').innerText = pJSON.description;
        projectInfo.querySelector('#created').innerText = `Created on ${pJSON.created_on}`;
        projectInfo.querySelector('#remaining').innerText = `Remaining tasks : `;
        projectInfo.querySelector('#completed').innerText = `Completed tasks : `;
    });

    pDIV.addEventListener('dblclick', (ev) => {
        // Open tasks view
        window.location.href = `/project?id=${pID}`;
    });

    projectsWrapper.appendChild(pDIV);
}

function addProjects(projects_ids, projects_json) {
    for (let i=0; i<projects_ids.length; i++) {
        const pID = projects_ids[i];
        const pJSON = projects_json[i];
        addProject(pID, pJSON);
    }
}

function handleReqData(data) {
    // Check response type
    const kind = data.kind;
    const msg = data.msg;
    
    if (kind === 0) {
        // Handle projects data
        addProjects(
            data.projects_ids,
            data.projects_json,
        );
    } else {
        showMessage(kind, msg);
    }
}

// Init
_getProjects().then( (data) => {
    handleReqData(data);
});

// Project - New, Edit, Delete
newBtn.addEventListener('click', function () {
    if (newProjectStatus === null) {
        // Display card
        newProjectStatus = 1;
        newProjectPanel.classList.add('visible');
    } else if (newProjectStatus === 1) {
        // Send request
        const pName = newProjectPanel.querySelector('#name').value;
        const pDesc = newProjectPanel.querySelector('#description').value;
        _addProject(pName, pDesc).then( (data) => {
            showMessage(data.kind, data.msg);
            if (data.kind === 0) {
                _getProject(data.project_id).then( (response) => {
                    const project_json = response.project;
                    addProject(data.project_id, project_json);
                })
            }
        })

        // Hide panel
        newProjectPanel.classList.remove('visible');
        newProjectStatus = null;
    }
});

editBtn.addEventListener('click', function() {
    if (editProjectStatus === null) {
        editProjectStatus = 1;

        // Make fields editable
        projectInfo.querySelector('#title').contentEditable = 'plaintext-only';
        projectInfo.querySelector('#description').contentEditable = 'plaintext-only';
        
        // Update edit btn text
        editBtn.innerText = 'Save changes';

    } else if (editProjectStatus) {
        // Make fields uneditable
        projectInfo.querySelector('#title').contentEditable = 'false';
        projectInfo.querySelector('#description').contentEditable = 'false';

        // Update edit btn text
        editBtn.innerText = 'Edit';

        // Send request
        _updateProject(currentProjectID,
            projectInfo.querySelector('#title').innerText,
            projectInfo.querySelector('#description').innerText
        ).then( (response) => {
            showMessage(response.kind, response.msg);
        })

    }

});

deleteBtn.addEventListener('click', function() {
    // Ask confirmation
    confirmBox.classList.add('visible');
    main.classList.add('blurry');

    // Set pending operation
    pendingOperation = () => { 
        _removeProject(currentProjectID).then( (data) => {
            showMessage(data.kind, data.msg);
            if (data.kind === 0) {
                // Remove item
                removeProjectItem(currentProjectID);
                currentProjectID = null;
                
                // Hide project info
                projectInfo.classList.remove('visible');
            }
        });
        
    }

});

// Confirm Box
confirmBox.querySelector('#yes').addEventListener('click', () => {
    // Unblur
    main.classList.remove('blurry');

    // Remove box
    confirmBox.classList.remove('visible');

    // Execute pending operation
    if (pendingOperation) { pendingOperation(); }
    pendingOperation = null;
});

confirmBox.querySelector('#no').addEventListener('click', () => {
    // Unblur
    main.classList.remove('blurry');

    // Remove box
    confirmBox.classList.remove('visible');
    pendingOperation = null;
});

document.addEventListener('click', (event) => {
    if (newProjectStatus === 1) {
        // If click was out of panel AND not on new btn
        if ((!newProjectPanel.contains(event.target)) && (!newBtn.contains(event.target))) {
            // Hide pannel
            newProjectPanel.classList.remove('visible');
            newProjectStatus = null;
        }
    }
})