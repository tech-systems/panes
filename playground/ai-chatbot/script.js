// Theme management
function initializeTheme() {
  // Check for saved theme preference or default to 'dark'
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon();
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon();
  
  // Add a subtle animation effect
  const themeButton = document.getElementById('themeToggle');
  if (themeButton) {
    themeButton.style.transform = 'scale(1.2)';
    setTimeout(() => {
      themeButton.style.transform = '';
    }, 150);
  }
}

function updateThemeIcon() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const themeIcon = document.getElementById('themeIcon');
  
  if (themeIcon) {
    // The CSS will handle the icon content based on the data-theme attribute
    themeIcon.setAttribute('aria-label', currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
}

// Function to determine if horizontal mode should be enabled
function shouldEnableHorizontal() {
  const screenWidth = window.innerWidth;
  const paneWidth = 380; // max-width of pane
  const minRequiredWidth = paneWidth * 2; // Need at least 2x pane width
  
  return screenWidth >= minRequiredWidth;
}

// Function to detect mobile device
function isMobile() {
  return window.innerWidth <= 768;
}

// Function to get responsive pane configuration
function getPaneConfig() {
  const isHorizontal = shouldEnableHorizontal();
  const mobile = isMobile();
  
  const config = {
    horizontal: isHorizontal,
    horizontalOffset: isHorizontal ? 20 : 0,
    initialBreak: isHorizontal ? 'top right' : 'top',
    fitHeight: true,
    backdrop: false,
    bottomClose: false,
    buttonDestroy: false,
    showDraggable: true,
    upperThanTop: true,
    bottomOffset: mobile ? 10 : 30, // Reduced bottom offset for mobile
    clickBottomOpen: false,
    topperOverflow: true,
    topperOverflowOffset: 10,
    scrollZeroDragBottom: false, // Disable drag when scroll is at 0 for better UX in chatbot
    breaks: {
      top: { enabled: true, height: window.innerHeight - 10 },
      middle: { enabled: false, height: window.innerHeight * 0.6 },
      bottom: { enabled: false, height: 200 }
    },
    events: {}
  };
  
  return config;
}

document.querySelector('.pane-header-btn.pane-minimize-btn').addEventListener('click', async () => {
  const pane = document.querySelector('.pane');
  const maximizeIcon = document.getElementById('maximizeIcon');
  const chatContainer = document.querySelector('.chat-container');

  if (!isMobile() && isMaximized) {
    // If desktop maximized, minimize first, then hide on next frame for smoothness
    toggleDesktopMaximize(pane, maximizeIcon, chatContainer);
    await new Promise(resolve => requestAnimationFrame(resolve));
    await chatPane.hide();
  } else {
    await collapseChat();
  }
});

// Initialize pane with responsive configuration
let chatPane = new CupertinoPane('chat-pane', getPaneConfig());

// Assistant profiles with tied emojis and names
const assistants = [
  { emoji: '🚀', name: 'Elon' },
  { emoji: '🗿', name: 'Bill' },
  { emoji: '🍎', name: 'Steve' },
  { emoji: '🤖', name: 'Sam' },
  { emoji: '🤓', name: 'Mark' }
];

let currentAssistantIndex = 0;

const aiResponses = [
  "That's a great question! Cupertino Panes provides smooth, native-like modals and sheets for web applications.",
  "🚀 Cupertino Panes supports multiple breakpoints, making it perfect for mobile-first design!",
  "The library is lightweight at just 12kb and has no dependencies. Pretty amazing, right?",
  "You can customize everything - from animations to touch gestures. The possibilities are endless!",
  "💡 Did you know you can stack multiple panes using the Z-Stack feature?",
  "The touch technologies in Cupertino Panes make interactions feel incredibly natural.",
  "I'm here to help! Feel free to ask me about features, implementation, or anything else.",
  "🎨 The backdrop and blur effects create beautiful, modern interfaces.",
  "Hardware acceleration ensures smooth 60fps animations on all devices.",
  "You can even integrate it with frameworks like Ionic, React, or Vue!"
];

let messageCount = 0;

// UI sounds: only hover and final-message (local preferred with remote fallback)
const SOUND_SOURCES = {
  hover: {
    local: 'sounds/ui-hover.mp3',
    remote: 'https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3'
  },
  final: {
    local: 'sounds/ui-final-message.mp3',
    remote: 'https://assets.mixkit.co/sfx/preview/mixkit-long-pop-2358.mp3'
  }
};

let hoverSound = null;
let finalSound = null;

function createAudioWithFallback(source, volume = 0.26) {
  const audio = new Audio();
  audio.preload = 'auto';
  audio.volume = volume;
  audio.src = source.local;
  audio.onerror = () => {
    audio.src = source.remote;
    audio.load();
  };
  return audio;
}

function initUiSounds() {
  hoverSound = createAudioWithFallback(SOUND_SOURCES.hover, 0.18);
  finalSound = createAudioWithFallback(SOUND_SOURCES.final, 0.24);

  // Unlock audio on first user interaction (Safari/iOS policies)
  const unlock = () => {
    [hoverSound, finalSound].forEach(a => {
      try {
        a.play().then(() => { a.pause(); a.currentTime = 0; }).catch(() => {});
      } catch (e) {}
    });
    window.removeEventListener('touchstart', unlock);
    window.removeEventListener('click', unlock, true);
  };
  window.addEventListener('touchstart', unlock, { once: true, passive: true });
  window.addEventListener('click', unlock, { once: true, capture: true });
}

function playSound(audio) {
  if (!audio) return;
  try {
    audio.currentTime = 0;
    audio.play();
  } catch (e) {}
}

// Function to get current assistant
function getCurrentAssistant() {
  return assistants[currentAssistantIndex];
}

// Function to change assistant (cycle through list)
function changeAssistant() {
  currentAssistantIndex = (currentAssistantIndex + 1) % assistants.length;
  updateAssistantDisplay();
}

// Function to set random assistant
function setRandomAssistant() {
  currentAssistantIndex = Math.floor(Math.random() * assistants.length);
  updateAssistantDisplay();
}

// Function to update assistant display in all locations
function updateAssistantDisplay() {
  const assistant = getCurrentAssistant();
  
  // Keep robot button icon managed by chat state (do not override here)
  
  // Update chat header title
  const chatHeaderTitle = document.querySelector('.chat-header h1');
  if (chatHeaderTitle) {
    chatHeaderTitle.textContent = assistant.name;
  }
  
  // Update AI avatar (emoji)
  const aiAvatar = document.querySelector('.ai-avatar');
  if (aiAvatar) {
    aiAvatar.textContent = assistant.emoji;
  }
  
  // Update initial message
  const initialMessage = document.getElementById('initialMessage');
  if (initialMessage) {
    initialMessage.textContent = `👋 Hello! I'm ${assistant.name}, your AI assistant. I can help you learn about Cupertino Panes, answer questions, or just have a chat. What would you like to know?`;
  }
}

// Voice recording variables
let isRecording = false;
let isVoiceMessage = false;
let recognition = null;
let voiceButton = null;
let voiceIcon = null;
let voiceStatus = null;
let recordingOverlay = null;
let voiceRecordingOverlay = null;
let messageInput = null;

window.onload = async function () {
  // Initialize theme before anything else
  initializeTheme();
  
  // Set random assistant on load
  setRandomAssistant();
  
  await chatPane.present({animate: true});
  
  // Initialize voice recording
  initVoiceRecording();

  // Initialize UI sounds and bind events
  initUiSounds();
  const sendBtn = document.querySelector('.send-button');
  if (sendBtn) {
    sendBtn.addEventListener('mouseenter', () => playSound(hoverSound));
    sendBtn.addEventListener('touchstart', () => playSound(hoverSound), { passive: true });
  }
  
  // Add click listener to AI avatar
  const aiAvatar = document.querySelector('.ai-avatar');
  if (aiAvatar) {
    aiAvatar.style.cursor = 'pointer';
    aiAvatar.addEventListener('click', onAvatarClick);
  }

  // Position robot button based on current horizontal break and show with fade-in
  positionRobotButton();

  // Ensure correct icon at startup (pane is presented on load)
  updateRobotIcon();

  // Handle window resize for mobile/desktop mode switching
  window.addEventListener('resize', handleWindowResize);
}

// Helper: sync library caches and DOM transform
function setPaneTransform(x, y) {
  if (!chatPane) return;
  chatPane.currentTranslateX = x;
  chatPane.currentTranslateY = y;
  const el = chatPane.paneEl;
  if (el) {
    el.style.transform = `translateY(${y}px) translateX(${x}px) translateZ(0px)`;
  }
}

function handleWindowResize() {
  const pane = document.querySelector('.pane');
  if (!pane) return;
  
  // If we're in mobile fullscreen mode but no longer on mobile, exit fullscreen
  if (isMobileMaximized && !isMobile()) {
    pane.classList.remove('mobile-fullscreen');
    isMobileMaximized = false;
    
    // Clear any active transitions
    pane.style.removeProperty('transition');
    
    // Clear stored dimensions
    originalMobileDimensions = null;
    
    // Re-enable drag events when exiting mobile fullscreen
    chatPane.enableDrag();
    
    // Reset mobile-specific styles
    pane.style.removeProperty('max-width');
    pane.style.removeProperty('width');
    pane.style.removeProperty('height');
    pane.style.removeProperty('top');
    pane.style.removeProperty('left');
    pane.style.removeProperty('right');
    pane.style.removeProperty('bottom');
    
    // Reset pane positioning and caches
    setPaneTransform(0, chatPane.getPanelTransformY());
    
    // Update maximize icon
    const maximizeIcon = document.getElementById('maximizeIcon');
    if (maximizeIcon) {
      maximizeIcon.setAttribute('name', 'expand-outline');
    }
    
    // Recalculate pane positioning
    chatPane.calcFitHeight(false);
  }
  
  // If we're in desktop maximized mode but now on mobile, exit desktop maximized
  if (isMaximized && isMobile()) {
    const chatContainer = document.querySelector('.chat-container');
    if (chatContainer) {
      chatContainer.classList.remove('desktop-maximized');
    }
    isMaximized = false;
    
    // Clear any active transitions
    pane.style.removeProperty('transition');
    
    // Reset desktop-specific styles
    pane.style.removeProperty('max-width');
    pane.style.removeProperty('width');
    
    // Reset pane positioning and caches
    setPaneTransform(0, chatPane.getPanelTransformY());
    
    // Update maximize icon
    const maximizeIcon = document.getElementById('maximizeIcon');
    if (maximizeIcon) {
      maximizeIcon.setAttribute('name', 'expand-outline');
    }
    
    // Recalculate pane positioning
    chatPane.calcFitHeight(false);
  }
}

function initVoiceRecording() {
  voiceButton = document.getElementById('voiceButton');
  voiceIcon = document.getElementById('voiceIcon');
  voiceStatus = document.getElementById('voiceStatus');
  recordingOverlay = document.getElementById('recordingOverlay');
  voiceRecordingOverlay = document.getElementById('voiceRecordingOverlay');
  messageInput = document.getElementById('messageInput');

  // Check if speech recognition is supported
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = function() {
      isRecording = true;
      voiceButton.classList.add('recording');
      voiceIcon.setAttribute('name', 'stop-outline');
      showVoiceStatus('Listening...');
      
      // Show full recording overlay and hide input
      showRecordingOverlay();
      messageInput.classList.add('recording');
    };

    recognition.onresult = function(event) {
      // Only update if not already set by manual stop
      if (!isVoiceMessage) {
        showVoiceRecordingOverlay();
        isVoiceMessage = true;
        
        showVoiceStatus('Voice recording ready - click send to post');
        setTimeout(() => hideVoiceStatus(), 3000);
      }
    };

    recognition.onerror = function(event) {
      console.error('Speech recognition error:', event.error);
      let errorMessage = 'Voice recognition failed';
      
      switch(event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected';
          break;
        case 'audio-capture':
          errorMessage = 'No microphone found';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone access denied';
          break;
        case 'network':
          errorMessage = 'Network error';
          break;
      }
      
      showVoiceStatus(errorMessage);
      setTimeout(() => hideVoiceStatus(), 3000);
      
      // Reset UI state
      hideRecordingOverlay();
      messageInput.classList.remove('recording');
      resetVoiceButton();
    };

    recognition.onend = function() {
      // Clean up any remaining UI state
      hideRecordingOverlay();
      messageInput.classList.remove('recording');
      resetVoiceButton();
      
      // Only show error message if no voice was captured at all
      if (!isVoiceMessage && !messageInput.value.includes('🎤')) {
        showVoiceStatus('No voice detected - try again');
        setTimeout(() => hideVoiceStatus(), 2000);
      }
    };
  } else {
    // Hide voice button if not supported
    voiceButton.style.display = 'none';
    console.warn('Speech recognition not supported in this browser');
  }
}

function toggleVoiceRecording() {
  if (!recognition) {
    showVoiceStatus('Voice recording not supported');
    setTimeout(() => hideVoiceStatus(), 3000);
    return;
  }

  if (isRecording) {
    // Stop recording immediately and reset UI
    isRecording = false;
    voiceButton.classList.remove('recording');
    voiceIcon.setAttribute('name', 'mic-outline');
    hideRecordingOverlay();
    messageInput.classList.remove('recording');
    
    // Show voice recording overlay instead of setting input text
    showVoiceRecordingOverlay();
    isVoiceMessage = true;
    
    showVoiceStatus('Voice recording ready - click send to post');
    setTimeout(() => hideVoiceStatus(), 3000);
    
    recognition.stop();
  } else {
    // Clear any existing voice recording overlay
    hideVoiceRecordingOverlay();
    isVoiceMessage = false;
    
    // Request microphone permission and start recording
    try {
      recognition.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      showVoiceStatus('Could not start voice recording');
      setTimeout(() => hideVoiceStatus(), 3000);
    }
  }
}

function resetVoiceButton() {
  isRecording = false;
  voiceButton.classList.remove('recording');
  voiceIcon.setAttribute('name', 'mic-outline');
}

function showVoiceStatus(message) {
  voiceStatus.textContent = message;
  voiceStatus.classList.add('show');
}

function hideVoiceStatus() {
  voiceStatus.classList.remove('show');
}

function showRecordingOverlay() {
  recordingOverlay.classList.add('show');
}

function hideRecordingOverlay() {
  recordingOverlay.classList.remove('show');
  // Reset recording text
  const recordingText = document.getElementById('recordingText');
  if (recordingText) {
    recordingText.innerHTML = `
      <div class="recording-dot"></div>
      Recording...
    `;
  }
}

function showVoiceRecordingOverlay() {
  voiceRecordingOverlay.classList.add('show');
  messageInput.classList.add('voice-captured');
}

function hideVoiceRecordingOverlay() {
  voiceRecordingOverlay.classList.remove('show');
  messageInput.classList.remove('voice-captured');
}

function clearVoiceRecording() {
  hideVoiceRecordingOverlay();
  isVoiceMessage = false;
}

function handleKeyPress(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
  
  // If user starts typing and there's a voice message, clear it
  if (isVoiceMessage && event.key !== 'Enter') {
    clearVoiceRecording();
  }
}

async function sendMessage() {
  const input = document.getElementById('messageInput');
  const message = input.value.trim();
  
  if (!message && !isVoiceMessage) return;

  // Determine message type and content
  let displayMessage = message;
  let messageType = 'text';
  
  if (isVoiceMessage) {
    displayMessage = '🎤 Voice recording';
    messageType = 'voice';
    
    // Hide voice recording overlay
    hideVoiceRecordingOverlay();
    isVoiceMessage = false;
  }

  // Add user message
  addMessage(displayMessage, 'user', messageType);
  input.value = '';

  // Start agentic workflow
  await executeAgenticWorkflow(message, messageType);
}

function addMessage(text, sender, messageType = 'text', isAgentWorkflow = false) {
  const messagesContainer = document.getElementById('chatMessages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}`;
  
  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = 'message-bubble';
  
  if (isAgentWorkflow) {
    // Special styling for agent workflow messages
    bubbleDiv.classList.add('agent-workflow');
    // Text already contains the icon and formatted content
    bubbleDiv.innerHTML = text;
  } else if (messageType === 'voice' && sender === 'user') {
    // Style voice messages with enhanced design
    bubbleDiv.classList.add('voice-message-bubble');
    bubbleDiv.innerHTML = `
      <div class="voice-message-content">
        <div class="voice-message-icon">🎤</div>
        <div class="voice-message-text">
          <div class="voice-message-title">Voice Recording</div>
          <div class="voice-message-subtitle">Audio message sent</div>
        </div>
        <div class="voice-message-waveform">
          <div class="voice-wave-bar"></div>
          <div class="voice-wave-bar"></div>
          <div class="voice-wave-bar"></div>
          <div class="voice-wave-bar"></div>
          <div class="voice-wave-bar"></div>
          <div class="voice-wave-bar"></div>
        </div>
      </div>
    `;
  } else {
    bubbleDiv.textContent = text;
  }
  
  messageDiv.appendChild(bubbleDiv);
  messagesContainer.appendChild(messageDiv);
  
  // Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  // Play final message feedback when assistant posts the final response
  // (Skip workflow steps; they set isAgentWorkflow=true)
  if (sender === 'ai' && !isAgentWorkflow) {
    playSound(finalSound);
  }
  
  if (!isAgentWorkflow) {
    messageCount++;
  }
  
  // Recalculate pane height (skip if mobile is maximized)
  if (!isMobileMaximized) {
    setTimeout(() => chatPane.calcFitHeight(), 100);
  }
}

async function executeAgenticWorkflow(userMessage, messageType) {
  // Step 1: Search Agent
  await new Promise(resolve => {
    setTimeout(() => {
      const message = '<span class="agent-icon">🔍</span><span class="agent-text">SEARCH_AGENT: Scanning knowledge base...</span>';
      addMessage(message, 'ai', 'text', true);
      resolve();
    }, 500);
  });

  // Step 2: Vector Database
  await new Promise(resolve => {
    setTimeout(() => {
      const message = '<span class="agent-icon">🗄️</span><span class="agent-text">VECTOR_DB: Retrieving relevant context...</span>';
      addMessage(message, 'ai', 'text', true);
      resolve();
    }, 900);
  });

  // Step 3: Processing and Analysis
  await new Promise(resolve => {
    setTimeout(() => {
      const message = '<span class="agent-icon">🔧</span><span class="agent-text">ANALYZER: Processing and generating response...</span>';
      addMessage(message, 'ai', 'text', true);
      resolve();
    }, 800);
  });

  // Step 4: Final Response
  setTimeout(async () => {
    const response = getAIResponse(userMessage, messageType);
    addMessage(response, 'ai');
    
    // Auto-expand pane for longer conversations
    if (messageCount > 3) {
      chatPane.moveToBreak('top');
    }

    // Ensure height fits after the last message in sequence
    chatPane.calcFitHeight(false);
  }, 700);
}

function getAIResponse(userMessage, messageType = 'text') {
  // Handle voice messages
  if (messageType === 'voice') {
    const voiceResponses = [
      "🎤 I received your voice recording! Unfortunately, I don't have access to a Whisper model yet to decode it. Please type your message and I'll be happy to help!",
      "🗣️ Thanks for the voice recording! I can't process audio without Whisper integration. Could you type what you'd like to ask?",
      "🎙️ Your voice recording came through! I don't have speech-to-text capabilities yet - Whisper model access is planned for soon. What can I help you with in text?",
      "🔊 I see your voice recording! Without Whisper model access, I can't understand audio yet. Feel free to type your question!",
      "🎵 Voice recording received! I'm waiting for Whisper model integration to decode audio. In the meantime, how can I assist you via text?"
    ];
    return voiceResponses[Math.floor(Math.random() * voiceResponses.length)];
  }
  
  // Simple keyword-based responses for text
  const message = userMessage.toLowerCase();
  
  if (message.includes('hello') || message.includes('hi')) {
    return "Hello there! 👋 Great to meet you! What brings you to explore Cupertino Panes today?";
  }
  if (message.includes('how') || message.includes('what')) {
    return "🤔 That's a thoughtful question! Cupertino Panes makes it easy to create iOS-style modals and sheets with smooth gestures and animations.";
  }
  if (message.includes('mobile')) {
    return "📱 Cupertino Panes is perfect for mobile! It supports touch gestures, responsive breakpoints, and feels native on iOS and Android.";
  }
  if (message.includes('thank')) {
    return "You're very welcome! 😊 I'm happy to help you discover what makes Cupertino Panes so special.";
  }
  
  // Random response for other messages
  return aiResponses[Math.floor(Math.random() * aiResponses.length)];
}

function showTypingIndicator() {
  const messagesContainer = document.getElementById('chatMessages');
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message ai typing-message';
  typingDiv.id = 'typingIndicator';
  
  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = 'typing-indicator';
  bubbleDiv.innerHTML = `
    <div class="typing-dots">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
  
  typingDiv.appendChild(bubbleDiv);
  messagesContainer.appendChild(typingDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
  const typing = document.getElementById('typingIndicator');
  if (typing) typing.remove();
}

function clearChat() {
  const messagesContainer = document.getElementById('chatMessages');
  const assistant = getCurrentAssistant();
  messagesContainer.innerHTML = `
    <div class="message ai">
      <div class="message-bubble">
        👋 Hello! I'm ${assistant.name}, your AI assistant. I can help you learn about Cupertino Panes, answer questions, or just have a chat. What would you like to know?
      </div>
    </div>
  `;
  messageCount = 0;
  
  // Recalculate pane height (skip if mobile is maximized)
  if (!isMobileMaximized) {
    chatPane.calcFitHeight();
  }
}

let isCollapsed = false;
let isMaximized = false;
let isMobileMaximized = false;
let isAnimating = false;
let originalMobileDimensions = null; // Store original dimensions before maximizing
const robotCollapsed = document.getElementById('robotCollapsed');

// Icons for robot button states
const ROBOT_ICON_MINIMIZED = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><g transform="translate(24, 0) scale(-1, 1)"><path fill-rule="evenodd" d="M5.337 21.718a6.707 6.707 0 01-.533-.074.75.75 0 01-.44-1.223 3.73 3.73 0 00.814-1.686c.023-.115-.022-.317-.254-.543C3.274 16.587 2.25 14.41 2.25 12c0-5.03 4.428-9 9.75-9s9.75 3.97 9.75 9c0 5.03-4.428 9-9.75 9-.833 0-1.643-.097-2.417-.279a6.721 6.721 0 01-4.246.997z" clip-rule="evenodd"></path></g></svg>
`;
const ROBOT_ICON_MAXIMIZED = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"></path></svg>
`;

function updateRobotIcon() {
  if (!robotCollapsed) return;
  // Keep a single bubble icon and avoid swapping to preserve CSS transitions
  if (!robotCollapsed.dataset.iconInitialized) {
    robotCollapsed.innerHTML = `<span>${ROBOT_ICON_MINIMIZED}</span>`;
    robotCollapsed.dataset.iconInitialized = 'true';
  }
  // Toggle state classes for styling adjustments
  robotCollapsed.classList.toggle('minimized', isCollapsed);
  robotCollapsed.classList.toggle('maximized', !isCollapsed);
}

async function toggleRobotButton() {
  if (isCollapsed) {
    expandChat();
  } else {
    await collapseChat();
  }
}

function toggleMaximize() {
  // Prevent overlapping operations
  if (isAnimating) {
    return;
  }
  
  isAnimating = true;
  
  const pane = document.querySelector('.pane');
  const maximizeIcon = document.getElementById('maximizeIcon');
  const chatContainer = document.querySelector('.chat-container');
  
  if (!pane || !maximizeIcon || !chatContainer) {
    isAnimating = false;
    return;
  }

  // Handle mobile differently
  if (isMobile()) {
    toggleMobileMaximize(pane, maximizeIcon, chatContainer);
  } else {
    toggleDesktopMaximize(pane, maximizeIcon, chatContainer);
  }
  
  // Reset animation state
  isAnimating = false;
}

function toggleMobileMaximize(pane, maximizeIcon, chatContainer) {
  // Get transition settings from Cupertino Pane (same as breakpoint transitions)
  const animationDuration = chatPane.settings.animationDuration || 300;
  const animationType = chatPane.settings.animationType || 'ease';
  const transitionValue = `all ${animationDuration}ms ${animationType}`;
  
  if (isMobileMaximized) {
    // Exit mobile fullscreen with transition back to original dimensions
    pane.style.setProperty('transition', transitionValue);
    
    // Remove mobile fullscreen class
    pane.classList.remove('mobile-fullscreen');
    maximizeIcon.setAttribute('name', 'expand-outline');
    chatContainer.classList.remove('maximized');
    isMobileMaximized = false;
    
    // Restore original dimensions if we have them stored
    if (originalMobileDimensions) {
      // Animate back to original dimensions
      pane.style.setProperty('max-width', originalMobileDimensions.maxWidth, 'important');
      pane.style.setProperty('width', originalMobileDimensions.width, 'important');
      pane.style.setProperty('height', originalMobileDimensions.height, 'important');
      pane.style.setProperty('top', originalMobileDimensions.top, 'important');
      pane.style.setProperty('left', originalMobileDimensions.left, 'important');
      pane.style.setProperty('right', originalMobileDimensions.right, 'important');
      pane.style.setProperty('bottom', originalMobileDimensions.bottom, 'important');
      
      // Restore original transform and sync caches
      const paneElement = chatPane.paneEl;
      if (paneElement && originalMobileDimensions.transform) {
        setPaneTransform(
          originalMobileDimensions.originalX ?? chatPane.getPanelTransformX(),
          originalMobileDimensions.originalY ?? chatPane.getPanelTransformY()
        );
      }
    } else {
      // Fallback: remove properties if no original dimensions stored
      pane.style.removeProperty('max-width');
      pane.style.removeProperty('width');
      pane.style.removeProperty('height');
      pane.style.removeProperty('top');
      pane.style.removeProperty('left');
      pane.style.removeProperty('right');
      pane.style.removeProperty('bottom');
      
      const paneElement = chatPane.paneEl;
      if (paneElement) {
        paneElement.style.transform = '';
      }
    }
    
          // Clear transition and call calcFitHeight ONLY after exit animation completes
      setTimeout(() => {
        pane.style.removeProperty('transition');
        
        // Clean up stored dimensions and remove inline styles to return to CSS defaults
        if (originalMobileDimensions) {
          pane.style.removeProperty('max-width');
          pane.style.removeProperty('width');
          pane.style.removeProperty('height');
          pane.style.removeProperty('top');
          pane.style.removeProperty('left');
          pane.style.removeProperty('right');
          pane.style.removeProperty('bottom');
          
          const paneElement = chatPane.paneEl;
          if (paneElement) {
            if (originalMobileDimensions.transform) {
              setPaneTransform(
                originalMobileDimensions.originalX ?? chatPane.getPanelTransformX(),
                originalMobileDimensions.originalY ?? chatPane.getPanelTransformY()
              );
            } else {
              paneElement.style.transform = '';
            }
          }
          
          originalMobileDimensions = null; // Clear stored dimensions
        }
        
        // Re-enable drag events after exiting maximized mode
        chatPane.enableDrag();
        
        // Call calcFitHeight only after transition completes
        chatPane.calcFitHeight(false);
      }, animationDuration);
    
  } else {
    // Store current dimensions before maximizing
    const computedStyle = window.getComputedStyle(pane);
    const paneElement = chatPane.paneEl;
    
    originalMobileDimensions = {
      maxWidth: pane.style.maxWidth || computedStyle.maxWidth,
      width: pane.style.width || computedStyle.width,
      height: pane.style.height || computedStyle.height,
      top: pane.style.top || computedStyle.top,
      left: pane.style.left || computedStyle.left,
      right: pane.style.right || computedStyle.right,
      bottom: pane.style.bottom || computedStyle.bottom,
      transform: paneElement ? paneElement.style.transform : '',
      originalX: chatPane.getPanelTransformX(),
      originalY: chatPane.getPanelTransformY()
    };
    
    // Enter mobile fullscreen with transition
    pane.style.setProperty('transition', transitionValue);
    
    // Add mobile fullscreen class and set styles
    pane.classList.add('mobile-fullscreen');
    maximizeIcon.setAttribute('name', 'contract-outline');
    chatContainer.classList.add('maximized');
    isMobileMaximized = true;
    
    // Disable drag events when maximized
    chatPane.disableDrag();
    
    // Set full screen dimensions and position
    pane.style.setProperty('max-width', '100vw', 'important');
    pane.style.setProperty('width', '100vw', 'important');
    pane.style.setProperty('height', '100vh', 'important');
    pane.style.setProperty('top', '0', 'important');
    pane.style.setProperty('left', '0', 'important');
    pane.style.setProperty('right', '0', 'important');
    pane.style.setProperty('bottom', '0', 'important');
    
    // Position the pane element to cover full screen
    if (paneElement) {
      setPaneTransform(0, 0);
    }
    
    // Clear transition after maximize animation completes
    setTimeout(() => {
      pane.style.removeProperty('transition');
    }, animationDuration);
  }
}

function toggleDesktopMaximize(pane, maximizeIcon, chatContainer) {
  // DESKTOP: Remove any active transitions for instant maximize/minimize behavior
  pane.style.removeProperty('transition');
  pane.style.removeProperty('-webkit-transition');
  pane.style.removeProperty('transform-transition');
  
  // Get current transform values and computed width
  const currentX = chatPane.getPanelTransformX();
  const currentY = chatPane.getPanelTransformY();
  const currentWidth = parseInt(window.getComputedStyle(pane).width);
  
  // Get the original pane width from the rendered element (could be set by CSS, React, etc.)
  // Respect current responsive max-width from CSS (420px desktop), fallback to 380
  const computed = window.getComputedStyle(pane);
  const maxWidthCss = parseInt(computed.maxWidth);
  const originalPaneWidth = (Number.isFinite(maxWidthCss) && maxWidthCss > 0) ? maxWidthCss : 380;
  
  let targetWidth, widthDifference;
  
  if (isMaximized) {
    // Minimize back to original width from rendered element
    targetWidth = originalPaneWidth / 2;
    widthDifference = targetWidth - currentWidth; // negative value
    
    maximizeIcon.setAttribute('name', 'expand-outline');
    chatContainer.classList.remove('desktop-maximized');
    isMaximized = false;
  } else {
    // Maximize to double width, but respect viewport constraints
    const viewportWidth = window.innerWidth;
    const maxAllowedWidth = viewportWidth - 40; // 20px margin on each side
    const doubleWidth = originalPaneWidth * 2; // Double the original width
    targetWidth = Math.min(doubleWidth, maxAllowedWidth);
    widthDifference = targetWidth - currentWidth; // positive value
    
    maximizeIcon.setAttribute('name', 'contract-outline');
    chatContainer.classList.add('desktop-maximized');
    isMaximized = true;
  }

  // For 'left' breakpoint: move in opposite direction (+)
  // For 'right' breakpoint: move in normal direction (-)
  const currentBreakpoint = chatPane.modules.horizontal.getCurrentHorizontalBreak();
  const compensationDirection = currentBreakpoint === 'left' ? 1 : -1;
  const newTransformX = currentX + (compensationDirection * (widthDifference / 2));
  
  // Apply width changes instantly
  pane.style.setProperty('max-width', targetWidth + 'px', 'important');
  pane.style.setProperty('width', isMaximized ? targetWidth + 'px' : 'auto', 'important');
  
  // Apply position changes instantly if needed
  if (Math.abs(widthDifference) > 0 && chatPane.modules.horizontal) {
    // Instant positioning: sync caches and DOM
    setPaneTransform(newTransformX, currentY);
  }
  
  // Trigger resize event to recalculate all positioning after width change
  chatPane.calcFitHeight(false);
}

function expandChat() {
  if (isCollapsed) {
    // Hide robot button immediately when expanding
    hideRobotButton();
    chatPane.present({animate: true});
    isCollapsed = false;
    updateRobotIcon();
  }
}

// Function to handle avatar click (change assistant when chat is open)
function onAvatarClick() {
  changeAssistant();
}

function positionRobotButton() {
  const robotCollapsedEl = document.getElementById('robotCollapsed');
  if (!robotCollapsedEl) return;

  // Always pin to right corner (no visibility changes here)
  robotCollapsedEl.classList.remove('left-corner');
  robotCollapsedEl.classList.add('right-corner');
}

function showRobotButton() {
  const btn = document.getElementById('robotCollapsed');
  if (!btn) return;
  positionRobotButton();
  btn.style.display = 'flex';
  btn.classList.remove('hidden');
  // Force reflow to ensure transition triggers
  void btn.offsetWidth;
  btn.classList.add('show');
}

function hideRobotButton() {
  const btn = document.getElementById('robotCollapsed');
  if (!btn) return;
  btn.classList.remove('show');
  btn.classList.add('hidden');
  // Immediate hide
  btn.style.display = 'none';
}

async function collapseChat() {
  await hideChatPaneSmoothly();
}

// Initial state: keep hidden while pane is presented on load
robotCollapsed.classList.add('right-corner');
hideRobotButton();
updateRobotIcon();

// Listen to pane transitions to toggle robot button strictly after animations
chatPane.on('onTransitionEnd', (ev) => {
  if (ev?.type === 'hide') {
    isCollapsed = true;
    updateRobotIcon();
    showRobotButton();
  }
  if (ev?.type === 'present') {
    isCollapsed = false;
    updateRobotIcon();
    hideRobotButton();
  }
});

// Unified smooth hide routine used by both header minimize and robot toggle
async function hideChatPaneSmoothly() {
  const pane = document.querySelector('.pane');
  const maximizeIcon = document.getElementById('maximizeIcon');
  const chatContainer = document.querySelector('.chat-container');

  if (!pane) {
    await chatPane.hide();
    isCollapsed = true;
    updateRobotIcon();
    showRobotButton();
    return;
  }

  // If maximized, restore to normal first, then hide
  if (isMobile() && isMobileMaximized) {
    toggleMobileMaximize(pane, maximizeIcon, chatContainer);
    await chatPane.hide();
    isCollapsed = true;
    updateRobotIcon();
    showRobotButton();
    return;
  }

  if (!isMobile() && isMaximized) {
    toggleDesktopMaximize(pane, maximizeIcon, chatContainer);
    // Give layout a moment to apply width/transform reset
    await new Promise(resolve => requestAnimationFrame(resolve));
    await new Promise(resolve => requestAnimationFrame(resolve));
    await chatPane.hide();
    isCollapsed = true;
    updateRobotIcon();
    showRobotButton();
    return;
  }

  // Default: hide immediately with library animation
  await chatPane.hide();
  isCollapsed = true;
  updateRobotIcon();
  showRobotButton();
}