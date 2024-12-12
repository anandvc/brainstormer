// Initialize the Millis client with the public key
import Millis from '@millisai/web-sdk';

const msClient = Millis.createClient({
    publicKey: 'Qbh4QJJqS81XzziPb3n13DcguVVo3T9G',
});

// Function to start the assistant creation wizard
function startAssistantWizard() {
    const wizardState = {
        name: '',
        prompt: "You're a helpful assistant.",
        voiceProvider: 'elevenlabs',
        voiceId: '',
        language: '',
    };

    // Ask questions one at a time
    function askQuestion(step) {
        switch (step) {
            case 1:
                wizardState.name = prompt("What is the name of your assistant?");
                break;
            case 2:
                wizardState.prompt = prompt("What should the personality or prompt for the assistant be?", "You're a helpful assistant.");
                break;
            case 3:
                wizardState.voiceProvider = prompt("Which voice provider do you want to use?", "elevenlabs");
                wizardState.voiceId = prompt("Enter the voice ID:");
                break;
            case 4:
                wizardState.language = prompt("Enter the language code (e.g., en for English):", "en");
                break;
            default:
                console.log("Invalid step");
        }
    }

    // Iterate through the steps
    for (let step = 1; step <= 4; step++) {
        askQuestion(step);
    }

    // Start the assistant with the collected configuration
    msClient.start({
        agent: {
            agent_config: {
                prompt: wizardState.prompt,
                voice: {
                    provider: wizardState.voiceProvider,
                    voice_id: wizardState.voiceId,
                },
                language: wizardState.language,
            },
        },
    });

    // Embed the assistant iframe
    const iframeCode = `<iframe src="https://app.millis.ai/agents/embedded?id=-OD8dpmWclouYTt3eaEm&k=Qbh4QJJqS81XzziPb3n13DcguVVo3T9G" width="100%" height="100%" allow="microphone"></iframe>`;
    document.getElementById('assistant-container').innerHTML = iframeCode;

    // Add controls for editing the assistant properties
    createEditControls(wizardState);
}

// Function to create edit controls for the assistant
function createEditControls(wizardState) {
    const controlsContainer = document.getElementById('edit-controls');
    controlsContainer.innerHTML = '';

    const properties = ['name', 'prompt', 'voiceProvider', 'voiceId', 'language'];
    properties.forEach(property => {
        const label = document.createElement('label');
        label.textContent = `Edit ${property}:`;

        const input = document.createElement('input');
        input.type = 'text';
        input.value = wizardState[property];
        input.addEventListener('change', (e) => {
            wizardState[property] = e.target.value;
        });

        controlsContainer.appendChild(label);
        controlsContainer.appendChild(input);
    });

    const updateButton = document.createElement('button');
    updateButton.textContent = 'Update Assistant';
    updateButton.addEventListener('click', () => {
        msClient.start({
            agent: {
                agent_config: {
                    prompt: wizardState.prompt,
                    voice: {
                        provider: wizardState.voiceProvider,
                        voice_id: wizardState.voiceId,
                    },
                    language: wizardState.language,
                },
            },
        });
    });

    controlsContainer.appendChild(updateButton);
}

// Start the wizard when the page loads
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-wizard').addEventListener('click', startAssistantWizard);
});
