
// JS - Send message to UI

// Elements
const messageBoxDiv = document.querySelector('#message-box');
const titleH2 = messageBoxDiv.querySelector('#title');
const contentP = messageBoxDiv.querySelector('#content');

// Functions
function hideMessage() {
    messageBoxDiv.classList.remove('visible');
}

function showMessage(kind, content) {
    let className = "visible";
    let title = "";
    switch (kind) {
        case 0:
            className += " info";
            title = "Information"
            break;
        case 1:
            className += " warning";
            title = "Warning"
            break;
        default:
            className += " default";
            title = "Undefined"
    }

    // Update texts
    titleH2.innerText = title;
    contentP.innerText = content;

    // Set class
    messageBoxDiv.className = className;

    // Remove after delay
    setTimeout(hideMessage, 3000);
}