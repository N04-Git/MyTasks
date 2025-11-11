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

function _addCategory(project_id, category_name) {
    body = JSON.stringify({
        'project_id':project_id,
        'category_name':category_name,
    })
    return fetch('/addCategory', {
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

function _removeCategory (project_id, category_id) {
    body = JSON.stringify({
        'project_id':project_id,
        'category_id':category_id
    })
    return fetch('/removeCategory', {
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

function _addTask(project_id, category_id, task_name, task_description) {
    body = JSON.stringify({
        'project_id':project_id,
        'category_id':category_id,
        'task_name':task_name,
        'task_description':task_description
    })
    return fetch('/addTask', {
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

function _removeTask (project_id, category_id, task_id) {
    body = JSON.stringify({
        'project_id':project_id,
        'category_id':category_id,
        'task_id':task_id
    })
    return fetch('/removeTask', {
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

function _completeTask (project_id, category_id, task_id) {
    body = JSON.stringify({
        'project_id':project_id,
        'category_id':category_id,
        'task_id':task_id
    })
    return fetch('/completeTask', {
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
