##############################
### CLASS : ProjectManager ###
##############################

# Modules
import os
import json
from datetime import datetime

# Globals
DEFAULT_JSON = {}

# Handle data
class ProjectManager:
    def __init__(self, json_path):
        if not os.path.exists(json_path):
            # Create new JSON
            with open(json_path, 'w') as f:
                json.dump(DEFAULT_JSON, f)
                print('(PM] New JSON file created :', json_path)

        self.json_path = json_path
        self.json_content = None
        self.readJson()

        print('[PM] JSON Ready')

    def readJson(self):
        with open(self.json_path, 'rb') as f:
            try:
                data = json.load(f)
            except json.decoder.JSONDecodeError:
                # Empty data
                data = {}
        self.json_content = data

    def updateJson(self):
        # Updates JSON File based on self.json_content variable
        with open(self.json_path, "w") as f:
            json.dump(self.json_content, f)

    def genID(self, value:int, ids=[]) -> str:
        """
        Generates a unique ID\n
        Value:\n
            0 >> Project ID
            1 >> Category ID
            2 >> Task ID
        """

        if value == 0:
            keys = list(self.json_content.keys())
        
        elif value == 1:
            projectID = ids[0]
            keys = list(self.json_content[projectID]["categories"].keys())

        elif value == 2:
            projectID = ids[0]
            categoryID = ids[1]
            keys = list(self.json_content[projectID]["categories"][categoryID]["tasks"].keys())

        if len(keys) > 0:
            return str(int(keys[-1]) + 1)
        return "0"

    # Project
    def getProjects(self, reloadFile=False) -> tuple[list, list]:
        if reloadFile:
            self.readJson()

        projects = []

        ids = list(self.json_content.keys())
        for key in ids:
            projects.append(self.json_content[key])
        
        return (ids, projects)

    def getProject(self, project_id:str) -> list:
        return self.json_content.get(project_id, [])

    def addProject(self, project_name:str, project_description:str) -> str:
        """
        Returns ID of created project
        """
        # Generate ID
        pID = self.genID(0)
        project = {
            'name':         project_name,
            'created_on':   datetime.now().strftime("%d/%m/%Y"),
            "visible":      True,
            "categories":   {},
            'description':  project_description,
        }
        self.json_content[pID] = project
        
        # Update file
        self.updateJson()

        return pID

    def updateProject(self, project_id:str, project_name:str, project_description:str) -> bool:
        """
        Returns True if project has been modified
        """
        if not self.json_content.get(project_id, None):
            return False
        
        self.json_content[project_id]["name"] = project_name
        self.json_content[project_id]["description"] = project_description

        # Update file
        self.updateJson()

        return True

    def removeProject(self, project_id:str) -> bool:
        """
        Returns True if project has been deleted
        """
        if not self.json_content.pop(project_id, None):
            print(f'[PM] No such project id : {project_id}')
            return False
        
        self.updateJson()
        return True
    
    # Project > Category
    def getCategories(self, project_id:str) -> tuple[list, list]:
        categories = []
        project = self.json_content[project_id]
        keys = list(project['categories'].keys())
        for key in keys:
            categories.append(project['categories'][key])

        return (keys, categories)            

    def addCategory(self, project_id:str, category_name:str) -> str:
        """
        Returns ID of created category
        """
        categoryID = self.genID(1, ids=[project_id])
        category = {
            "name":     category_name,
            "tasks":    {}
        }
        self.json_content[project_id]["categories"][categoryID] = category
        self.updateJson()

        return categoryID

    def removeCategory(self, project_id:str, category_id:str) -> bool:
        """
        Returns True if category has been removed
        """
        if not self.json_content[project_id]["categories"].pop(category_id, None):
            print(f'[PM] No such category id : {project_id} >> {category_id}')
            return False
        
        self.updateJson()
        return True

    # Project > Category > Task
    def getTasks(self, project_id:str, category_id:str) -> tuple[list, list]:
        tasks = []
        keys = list(self.json_content[project_id]["categories"][category_id]["tasks"].keys())
        for key in keys:
            tasks.append(self.json_content[project_id]["categories"][category_id]["tasks"][key])
        
        return (keys, tasks)

    def addTask(self, project_id:str, category_id:str, task_name:str, task_description:str) -> str:
        """
        Returns ID of created task
        """
        taskID = self.genID(2, [project_id, category_id])
        task = {
            "name":         task_name,
            "description":  task_description,
        }

        self.json_content[project_id]["categories"][category_id]["tasks"][taskID] = task
        self.updateJson()

        return taskID

    def removeTask(self, project_id:str, category_id:str, task_id:str) -> bool:
        """
        Returns True is task has been removed
        """
        if not self.json_content[project_id]["categories"][category_id]["tasks"].pop(task_id, None):
            print(f'[PM] No such task id : {project_id} >> {category_id} >> {task_id}')
            return False
        
        self.updateJson()
        return True
