// JS - Handle Projects manager requests

function _getProjects () {
    return fetch('/getProjects', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
    }).then(
        ((res) => {
            return res.json()
        })
    )
}

function _getProject (project_id) {
    body = JSON.stringify({
        'project_id':project_id,
    })
    return fetch('/getProject', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: body
    }).then(
        ((res) => {
            return res.json()
        })
    )
}

function _addProject(project_name, project_description) {
    body = JSON.stringify({
        'project_name':project_name,
        'project_description':project_description
    })
    return fetch('/addProject', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: body
    }).then(
        ((res) => {
            return res.json()
        })
    )
}

function _removeProject (project_id) {
    body = JSON.stringify({
        'project_id':project_id
    })
    return fetch('/removeProject', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: body
    }).then(
        ((res) => {
            return res.json()
        })
    )
}

function _updateProject(project_id, project_name, project_description) {
    body = JSON.stringify({
        'project_id':project_id,
        'project_name':project_name,
        'project_description':project_description
    })
    return fetch('/updateProject', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: body
    }).then(
        ((res) => {
            return res.json()
        })
    )
}