//Initialise SpeechSynth API
const synth = window.speechSynthesis;

// DOM elements
const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
const body = document.querySelector('body');

// Init voices array
let voices = [];

const getVoices = () => {
  voices = synth.getVoices();

  // Loop through voices and create an option for each one
  voices.forEach((voice) => {
    // Create an option element
    const option = document.createElement('option');
    // Fill option with voice and language
    option.textContent = voice.name + '(' + voice.lang + ')';
    console.log(voice.name);

    //Set needed option attributes
    option.setAttribute('data-lang', voice.lang);
    option.setAttribute('data-name', voice.name);
    voiceSelect.appendChild(option);
  });
};
getVoices();
// https://stackoverflow.com/questions/21513706/getting-the-list-of-voices-in-speechsynthesis-web-speech-api
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}

// Speak
const speak = () => {
  // Check if speaking
  if (synth.speaking) {
    console.error('Already speaking...');
    return;
  }
  if (textInput.value !== '') {
    // Add background animated (gif)
    body.style.background = '#141414 url(img/wave.gif)';
    body.style.backgroundRepeat = 'repeat-x';
    body.style.backgroundSize = '100% 100%';
    // Get speak text
    const speakText = new SpeechSynthesisUtterance(textInput.value);
    // Speak end
    speakText.onend = (e) => {
      console.log('Done speaking...');
      body.style.background = '#141414';
    };
    // Speak error
    speakText.onerror = (e) => {
      console.error('Something went wrong');
    };
    // Selected voice
    const selectedVoice = voiceSelect.selectedOptions[0].getAttribute(
      'data-name'
    );
    // Loop through voices
    voices.forEach((voice) => {
      if (voice.name === selectedVoice) {
        speakText.voice = voice;
      }
    });

    // Set pitch and rate
    speakText.rate = rate.value;
    speakText.pitch = pitch.value;
    // Speak
    synth.speak(speakText);
  }
};

// Event listeners here below

// Text form submit
textForm.addEventListener('submit', (e) => {
  e.preventDefault();
  speak();
  textInput.blur();
});

// Rate value change
rate.addEventListener('change', (e) => (rateValue.textContent = rate.value));

// Pitch value change
pitch.addEventListener('change', (e) => (pitchValue.textContent = pitch.value));

// Voice select to speak as soon as I change the voice selection
voiceSelect.addEventListener('change', (e) => speak());
