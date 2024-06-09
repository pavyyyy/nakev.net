let buttonStates = Array(20).fill("stopped");

document.addEventListener("DOMContentLoaded", function() {
    // Initialize all button states at the beginning
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach((button, index) => {
        updateButtonState(button, index + 1);
    });
});

function expandButton(button, buttonIndex) {
    button.classList.toggle('expanded');

    if (!button.querySelector('.inner-content')) {
        const innerContent = document.createElement('div');
        innerContent.className = 'inner-content';

        innerContent.innerHTML = `
            <div class="inner-buttons">
                <button class="start" onclick="startFunction(event, ${buttonIndex})">Start</button>
                <button class="stop active" onclick="stopFunction(event, ${buttonIndex})" disabled>Stop</button>
            </div>
            <textarea class="inner-textarea" rows="5" placeholder="Enter comment"></textarea>
            <button class="btn submit" onclick="submitFunction(event, ${buttonIndex})">Submit</button>
        `;

        // Add event listener to stop propagation and prevent default for textarea keydown event
        const textarea = innerContent.querySelector('.inner-textarea');
        textarea.addEventListener('keydown', function(event) {
            event.stopPropagation();
        });

        textarea.addEventListener('keyup', function(event) {
            event.stopPropagation();
        });

        // Prevent click events on inner content from affecting the outer button
        innerContent.addEventListener('click', function(event) {
            event.stopPropagation();
        });

        button.appendChild(innerContent);
    }

    updateButtonState(button, buttonIndex);
}

function startFunction(event, buttonIndex) {
    event.stopPropagation(); // Prevent the outer button from closing
    const button = event.target;
    const parent = button.closest('.inner-buttons');
    const stopButton = parent.querySelector('.stop');

    button.classList.add('active');
    stopButton.classList.remove('active');
    button.disabled = true;
    stopButton.disabled = false;

    buttonStates[buttonIndex - 1] = "started";
    updateButtonState(button.closest('.btn'), buttonIndex);
}

function stopFunction(event, buttonIndex) {
    event.stopPropagation(); // Prevent the outer button from closing
    const button = event.target;
    const parent = button.closest('.inner-buttons');
    const startButton = parent.querySelector('.start');

    button.classList.add('active');
    startButton.classList.remove('active');
    button.disabled = true;
    startButton.disabled = false;

    buttonStates[buttonIndex - 1] = "stopped";
    updateButtonState(button.closest('.btn'), buttonIndex);
}

function submitFunction(event, buttonIndex) {
    event.stopPropagation(); // Prevent the outer button from closing
    const button = event.target;
    const container = button.closest('.inner-content');
    const startButton = container.querySelector('.start');
    const stopButton = container.querySelector('.stop');
    const textarea = container.querySelector('.inner-textarea');

    const selectedAction = startButton.disabled ? 'Start' : (stopButton.disabled ? 'Stop' : 'None');
    const comment = textarea.value;

    alert(`Button ${buttonIndex} - Selected Action: ${selectedAction}\nComment: ${comment}\nState: ${buttonStates[buttonIndex - 1]}`);
}

function updateButtonState(button, buttonIndex) {
    const state = buttonStates[buttonIndex - 1];
    const rightIndicator = document.createElement('div');
    rightIndicator.className = 'right-indicator';
    if (state === 'started') {
        rightIndicator.style.backgroundColor = 'green';
    } else {
        rightIndicator.style.backgroundColor = 'red';
    }
    if (!button.querySelector('.right-indicator')) {
        button.appendChild(rightIndicator);
    } else {
        button.querySelector('.right-indicator').style.backgroundColor = rightIndicator.style.backgroundColor;
    }
}
