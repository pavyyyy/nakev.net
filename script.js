let buttonStates = Array(20).fill("stopped");

function expandButton(button, buttonIndex) {
    button.classList.toggle('expanded');

    if (!button.querySelector('.inner-content')) {
        const innerContent = document.createElement('div');
        innerContent.className = 'inner-content';

        innerContent.innerHTML = `
            <div class="inner-buttons">
                <button class="start" onclick="startFunction(event, ${buttonIndex})">Start</button>
                <button class="stop" onclick="stopFunction(event, ${buttonIndex})" disabled>Stop</button>
            </div>
            <textarea class="inner-textarea" rows="5" placeholder="Enter comment"></textarea>
            <button class="btn submit" onclick="submitFunction(event, ${buttonIndex})">Submit</button>
        `;

        // Add event listener to stop propagation
        innerContent.addEventListener('click', function(event) {
            event.stopPropagation();
        });

        // Add event listener to stop keydown propagation for textarea
        innerContent.querySelector('.inner-textarea').addEventListener('keydown', function(event) {
            event.stopPropagation();
        });

        button.appendChild(innerContent);
    }
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
