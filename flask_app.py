# Libraries
from projectsManager import ProjectManager
from flask import (
    Flask,
    render_template,
    request,
    jsonify
)
from pathlib import Path

# App
JSON_PROJECTS_PATH = Path("data/projects.json")

app = Flask(__name__)
pManager = ProjectManager(JSON_PROJECTS_PATH)

# Functions
def verifyFields(received_data:dict, required_fields:list) -> bool:
    """
    Returns True if all required fields are present
    """
    for field in required_fields:
        if not field in received_data:
            return False
    return True

def makeResponse(content:str, kind:int, additional_data={}):
    """
    Returns jsonified response\n
    Kind :\n
        0 >> Info
        1 >> Error
        2 >> Warning
    """
    return jsonify({'kind':kind, 'msg':content}|additional_data)

# Routes
@app.route('/')
def home():
    return render_template("projectsView.html")

@app.route('/project')
def project():
    pID = request.args.get('id', type=str)

    pJSON = pManager.getProject(pID)
    
    return render_template('tasksView.html', project_id=pID, project_data=pJSON)

# Backend - DATA Routes
@app.route('/getProjects', methods=['GET'])
def getProjects():
    pID, pJSON = pManager.getProjects(reloadFile=True)

    return makeResponse("Success", 0, {
        "projects_ids":pID,
        "projects_json":pJSON
    })

@app.route('/getProject', methods=['POST'])
def getProject():
    data = request.get_json()

    if not verifyFields(
        data,
        ['project_id']
    ):
        return makeResponse("Missing field", 1)

    project = pManager.getProject(
        data['project_id']
    )
    return makeResponse("Success", 0, {
        "project":project
    })

@app.route('/addProject', methods=['POST'])
def addProject():
    data = request.get_json()

    if not verifyFields(
        data,
        ['project_name', 'project_description']
    ):
        return makeResponse("Missing field", 1)

    project_id = pManager.addProject(
        data['project_name'],
        data['project_description']
    )
    return makeResponse("Success", 0, {'project_id':project_id})

@app.route('/updateProject', methods=['POST'])
def updateProject():
    data = request.get_json()

    if not verifyFields(
        data,
        ['project_id', 'project_name', 'project_description']
    ):
        return makeResponse("Missing field", 1)

    if pManager.updateProject(
        data['project_id'],
        data['project_name'],
        data['project_description']
    ):    
        return makeResponse("Success", 0)
    
    return makeResponse("Project could not be modified", 2)

@app.route('/removeProject', methods=['POST'])
def removeProject():
    data = request.get_json()

    if not verifyFields(
        data,
        ['project_id']
    ):
        return makeResponse("Missing field", 1)

    if pManager.removeProject(data['project_id']):
        return makeResponse("Success", 0)
    return makeResponse("Project not deleted", 2)

@app.route('/getCategories', methods=['POST'])
def getCategories():
    data = request.get_json()

    if not verifyFields(
        data,
        ['project_id']
    ):
        return makeResponse('Missing field', 1)

    cID, cJSON = pManager.getCategories(data['project_id'])

    return makeResponse("Success", 0, {
        "categories_ids":cID,
        "categories_json":cJSON
    })

@app.route('/addCategory', methods=['POST'])
def addCategory():
    data = request.get_json()

    if not verifyFields(
        data,
        ['project_id', 'category_name']
    ):
        return makeResponse("Missing field", 1)

    category_id = pManager.addCategory(
        data['project_id'],
        data['category_name']
    )
    return makeResponse("Success", 0, {'category_id':category_id})

@app.route('/removeCategory', methods=['POST'])
def removeCategory():
    data = request.get_json()

    if verifyFields(
        data,
        ['project_id', 'category_id']
    ):
        return makeResponse("Missing field", 1)

    if pManager.removeCategory(data['project_id'], data['category_id']):
        return makeResponse("Success", 0)
    return makeResponse("Category not deleted", 2)

@app.route('/getTasks', methods=['POST'])
def getTasks():
    data = request.get_json()

    if not verifyFields(
        data,
        ['project_id', 'category_id']
    ):
        return makeResponse('Missing field', 1)

    tID, tJSON = pManager.getTasks(data['project_id'], data['category_id'])

    return makeResponse("Success", 0, {
        "tasks_ids":tID,
        "tasks_json":tJSON
    })

@app.route('/addTask', methods=['POST'])
def addTask():
    data = request.get_json()

    if not verifyFields(
        data,
        ['project_id', 'category_id', 'task_name', 'task_description']
    ):
        return makeResponse("Missing field", 1)

    task_id = pManager.addTask(
        data['project_id'],
        data['category_id'],
        data['task_name'],
        data['task_description']
    )
    return makeResponse("Success", 0, {'task_id':task_id})

@app.route('/removeTask', methods=['POST'])
def removeTask():
    data = request.get_json()

    if verifyFields(
        data,
        ['project_id', 'category_id', 'task_id']
    ):
        return makeResponse("Missing field", 1)

    if pManager.removeTask(data['project_id'], data['category_id'], data['task_id']):
        return makeResponse("Success", 0)
    return makeResponse("Task not deleted", 2)

# Run
if __name__ == "__main__":
    app.run(debug=False, port=8020)