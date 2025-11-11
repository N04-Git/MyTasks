// JS - Designed for tasks page

// Elements
const buttons_panel = document.querySelector('#wrapper > div#buttons');
const categories_container = document.querySelector('#wrapper > #categories');
const new_category_card = document.querySelector('#new-category-card');
const new_task_card = document.querySelector('#new-task-card');

let current_menu_open = null;
let current_card_open = null;
let last_category_item = null;

// Functions
function closeCard() {
    if (current_card_open) {
        hideNode(current_card_open);
        current_card_open = null;
    }
}

function appendCategory(data, input_data) {
    category_name = input_data.category_name;
    category_id = data.category_id;

    // Create new element
    const item = document.createElement('div');
    categories_container.appendChild(item);
    item.classList.add('item');
    item.setAttribute('data-id', category_id);

    item.innerHTML = `
    <div class="info">
        <h4 id="title">${category_name}</h4>
        <button id="new-task">New Task</button>
        <button id="option">=</button>
        <div id="option-menu">
            <button id="edit">Edit</button>
            <button id="delete">Delete</button>
        </div>
    </div>
    
    <div class="container">
    </div>`;

    handleCategoryItem(item);
    
}

function deleteCategory(data, category_item) {
    // Remove node
    category_item.remove();
}

function deleteTask(data, task_item) {
    // Remove node
    task_item.remove();
}

function appendTask(data, input_data) {
    const task_id = data.task_id;
    const name = input_data.name;
    const description = input_data.description;
    const category_container = last_category_item.querySelector('.container')
    const item = document.createElement('div');
    item.classList.add('item');
    item.setAttribute('data-id', task_id);
    item.innerHTML = `      <h5 id="title">${name}</h5>
                            <p id="description">
                                ${description}
                            </p>
                            <button id="complete">Completed</button>
                            <button id="option">=</button>
                            <div id="option-menu">
                                <button id="edit">Edit</button>
                                <button id="delete">Delete</button>
                            </div>`
    category_container.appendChild(item);
    // Handle new task events
    handleTaskItem(item);
}

function hideNode (node, isMenu=false) {
    if (isMenu) {
        current_menu_open = null;
    }
    node.classList.remove('visible');
}

function displayNode (node, isMenu=false) {
    if (isMenu) {
        if (current_menu_open) {
            // Hide last menu
            hideNode(current_menu_open, true);
        }
        current_menu_open = node;
    }

    node.classList.add('visible');
}

function handleCategoryItem (category_item) {
    // Handle option menu
    handleCategoryOptionMenu(
        category_item.querySelector('.info #option'),
        category_item.querySelector('.info #option-menu'),
        category_item
    );

    // Handle new task button
    handleNewTaskButton(
        category_item.querySelector('#new-task'),
        category_item
    );

    // Handle tasks
    Array.from(category_item.querySelector('.container').children).forEach( (task_item) => {
        handleTaskItem(task_item);
    })

}

function handleTaskCompleted(task_item) {
    task_item.querySelector('#complete').addEventListener('click', () => {
        // Send query
        const category_id = task_item.parentElement.parentElement.getAttribute('data-id');
        const task_id = task_item.getAttribute('data-id');
        _completeTask(PROJECT_ID, category_id, task_id).then(
            (response) => {
                handleResponse(response, deleteTask, task_item);
            }
        )
    })
};

function handleTaskItem(item) {
    // For each item, handle its menu
    handleTaskOptionMenu(
        item.querySelector('#option'),
        item.querySelector('#option-menu'),
        item
    );

    // Handle completed button
    handleTaskCompleted(
        item
    );
}

function handleNewTaskButton (new_task_button, category_item) {
    // Show card
    new_task_button.addEventListener('click', () => {
        displayNode(new_task_card);
        current_card_open = new_task_card;
        last_category_item = category_item;
    })
}

// Categories' options
function handleCategoryOptionMenu (option_button_node, option_menu_node, category_item) {
    // Switch visibility of display button
    let visible = false;
    option_button_node.addEventListener('click', () => {
        visible = option_menu_node.classList.contains('visible');
        if (visible) {
            // Hide
            hideNode(option_menu_node, true)

        } else {
            // Display
            displayNode(option_menu_node, true)
        }
    });

    // Handle menu's options (Edit, Delete, ...)
    option_menu_node.querySelector('#edit').addEventListener('click', () => {
        console.log('editing the category : ', category_item);

    });

    option_menu_node.querySelector('#delete').addEventListener('click', () => {
        const category_id = category_item.getAttribute('data-id');
        _removeCategory(PROJECT_ID, category_id).then(
            (response) => {
                handleResponse(response, deleteCategory, category_item);
            }
        )
    });

}

// Tasks' options
function handleTaskOptionMenu (option_button_node, option_menu_node, task_item) {
    // Task options menu
    let visible = false;
    option_button_node.addEventListener('click', () => {
        visible = option_menu_node.classList.contains('visible');
        if (visible) {
            hideNode(option_menu_node, true);
        } else {
            displayNode(option_menu_node, true);
        }
    });

    // Handle task options
    task_item.querySelector('#edit').addEventListener('click', () => {

    });

    task_item.querySelector('#delete').addEventListener('click', () => {
        const category_id = task_item.parentElement.parentElement.getAttribute('data-id');
        const task_id = task_item.getAttribute('data-id');
        _removeTask(PROJECT_ID, category_id, task_id).then(
            (response) => {
                handleResponse(response, deleteTask, task_item);
            }
        )
    });

}

function handleResponse(response_data, success_func=null, input_data=null) {
    // Check response type
    const kind = response_data.kind;
    const msg = response_data.msg;

    if (kind === 0 || kind === 3) {
    // Handle function
        if (success_func) {
            if (input_data) {
                success_func(response_data, input_data);
            } else {
                success_func(response_data);
            }
        }
        if (kind === 3) {
            showMessage(0, msg)
        }

    } else {
        showMessage(kind, msg);
    }
}

// Init new category button
buttons_panel.querySelector('#add-category').addEventListener('click', () => {
    // Display card
    displayNode(new_category_card);
    current_card_open = new_category_card;
});

// Init Categories
Array.from(categories_container.children).forEach(
    (category_item) => {
        handleCategoryItem(category_item);
    }
)

// HTML predefined functions
function addCategory() {
    // Get fields
    const category_name = new_category_card.querySelector('#name > input').value;

    // Send query
    _addCategory(PROJECT_ID, category_name).then( (response) => {
        handleResponse(response, appendCategory, {'project_id':PROJECT_ID, 'category_name':category_name});
    })

    // Hide card
    hideNode(new_category_card);

}

function addTask () {
    // Get fields
    const category_id = last_category_item.getAttribute('data-id');
    const name = new_task_card.querySelector('#name > input').value;
    const desc = new_task_card.querySelector('#description > textarea').value;

    // Send query
    _addTask(PROJECT_ID, category_id, name, desc).then( response => {
        handleResponse(response, appendTask, {'name':name, 'description':desc});
    })

    // Hide card
    hideNode(new_task_card);
}