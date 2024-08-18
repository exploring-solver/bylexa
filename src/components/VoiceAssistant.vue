<template>
    <div class="voice-assistant">
        <h1>Voice Assistant</h1>
        <div class="assistant-face" :class="{ speaking: isSpeaking }">
            <div class="eye left"></div>
            <div class="eye right"></div>
            <div class="mouth"></div>
        </div>
        <button @click="toggleListening" :disabled="isProcessing">
            {{ isListening ? 'Stop Listening' : 'Start Listening' }}
        </button>
        <p v-if="isListening">Listening...</p>
        <p v-if="isProcessing">Processing...</p>
        <p v-if="error">{{ error }}</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { sendSpeechToServer } from '../services/ApiService';

const isListening = ref(false);
const isProcessing = ref(false);
const isSpeaking = ref(false);
const error = ref(null);

let recognition = null;
let speechSynthesis = window.speechSynthesis;

onMounted(() => {
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = async (event) => {
            const last = event.results.length - 1;
            const transcript = event.results[last][0].transcript;
            await processSpeed(transcript);  // Corrected function name
        };

        recognition.onerror = (event) => {
            error.value = 'Speech recognition error: ' + event.error;
            isListening.value = false;
        };
    } else {
        error.value = 'Speech recognition not supported in this browser.';
    }
});

const toggleListening = () => {
    if (isListening.value) {
        recognition.stop();
    } else {
        error.value = null;
        recognition.start();
    }
    isListening.value = !isListening.value;
};

const processSpeed = async (transcript) => { 
    isProcessing.value = true;
    try {
        const response = await sendSpeechToServer(transcript);
        speakResponse(response);
    } catch (err) {
        error.value = 'Error processing your request. Please try again.';
        console.error('Error:', err);
    } finally {
        isProcessing.value = false;
    }
};

const speakResponse = (text) => {
    isSpeaking.value = true;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
        isSpeaking.value = false;
    };
    speechSynthesis.speak(utterance);
};
</script>

<style scoped>
.voice-assistant {
    text-align: center;
    font-family: Arial, sans-serif;
}

.assistant-face {
    width: 200px;
    height: 200px;
    background-color: #f0f0f0;
    border-radius: 50%;
    margin: 20px auto;
    position: relative;
}

.eye {
    width: 30px;
    height: 30px;
    background-color: #333;
    border-radius: 50%;
    position: absolute;
    top: 50px;
}

.eye.left {
    left: 50px;
}

.eye.right {
    right: 50px;
}

.mouth {
    width: 80px;
    height: 20px;
    background-color: #333;
    border-radius: 0 0 40px 40px;
    position: absolute;
    bottom: 50px;
    left: 60px;
    transition: height 0.2s;
}

.speaking .mouth {
    height: 30px;
    animation: speak 0.5s infinite alternate;
}

@keyframes speak {
    from {
        height: 20px;
    }

    to {
        height: 30px;
    }
}

button {
    font-size: 1.2em;
    padding: 10px 20px;
    margin: 10px;
}
</style>