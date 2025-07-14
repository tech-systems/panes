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
    draggableOver: true,
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
  
  // Update robot collapsed icon
  const robotCollapsed = document.getElementById('robotCollapsed');
  if (robotCollapsed) {
    robotCollapsed.innerHTML = `<span>${assistant.emoji}</span>`;
  }
  
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
  await document.querySelector('ion-app').componentOnReady();
  
  // Set random assistant on load
  setRandomAssistant();
  
  await chatPane.present({animate: true});
  
  // Initialize voice recording
  initVoiceRecording();
  
  // Add click listener to AI avatar
  const aiAvatar = document.querySelector('.ai-avatar');
  if (aiAvatar) {
    aiAvatar.style.cursor = 'pointer';
    aiAvatar.addEventListener('click', onAvatarClick);
  }

  // Position robot button based on current horizontal break and show with fade-in
  positionRobotButton();

  // Handle window resize for mobile/desktop mode switching
  window.addEventListener('resize', handleWindowResize);
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
    
    // Reset pane positioning
    const paneElement = chatPane.paneEl;
    if (paneElement) {
      paneElement.style.transform = '';
    }
    
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
    
    // Reset pane positioning
    const paneElement = chatPane.paneEl;
    if (paneElement) {
      paneElement.style.transform = '';
    }
    
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
  setTimeout(() => {
    const response = getAIResponse(userMessage, messageType);
    addMessage(response, 'ai');
    
    // Auto-expand pane for longer conversations
    if (messageCount > 3) {
      chatPane.moveToBreak('top');
    }
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
      
      // Restore original transform
      const paneElement = chatPane.paneEl;
      if (paneElement && originalMobileDimensions.transform) {
        paneElement.style.transform = originalMobileDimensions.transform;
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
            paneElement.style.transform = originalMobileDimensions.transform || '';
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
      transform: paneElement ? paneElement.style.transform : ''
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
      paneElement.style.transform = 'translateX(0px) translateY(0px)';
    }
    
    // Clear transition after maximize animation completes
    setTimeout(() => {
      pane.style.removeProperty('transition');
    }, animationDuration);
  }
}

function toggleDesktopMaximize(pane, maximizeIcon, chatContainer) {
  // Get current transform values and computed width
  const currentX = chatPane.getPanelTransformX();
  const currentY = chatPane.getPanelTransformY();
  const currentWidth = parseInt(window.getComputedStyle(pane).width);
  
  // Get the original pane width from the rendered element (could be set by CSS, React, etc.)
  const originalPaneWidth = parseInt(window.getComputedStyle(pane).maxWidth) || 380;
  
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
    // Use direct transform for instant positioning
    const paneElement = chatPane.paneEl;
    if (paneElement) {
      paneElement.style.transform = `translateX(${newTransformX}px) translateY(${currentY}px)`;
    }
  }
  
  // Trigger resize event to recalculate all positioning after width change
  chatPane.calcFitHeight(false);
}

function expandChat() {
  if (isCollapsed) {
    // Fade out the button
    robotCollapsed.classList.remove('show');
    
    // Wait for fade-out animation, then present pane
    setTimeout(() => {
      chatPane.present({animate: true});
      robotCollapsed.style.display = 'none';
      robotCollapsed.classList.add('hidden');
      isCollapsed = false;
    }, 150);
  }
}

// Function to handle avatar click (change assistant when chat is open)
function onAvatarClick() {
  changeAssistant();
}

function positionRobotButton() {
  const robotCollapsed = document.getElementById('robotCollapsed');
  if (!robotCollapsed) return;

  // Check if horizontal mode is enabled
  if (shouldEnableHorizontal() && chatPane.modules && chatPane.modules.horizontal) {
    const currentBreak = chatPane.modules.horizontal.getCurrentHorizontalBreak();
    
    // Remove existing corner classes
    robotCollapsed.classList.remove('left-corner', 'right-corner');
    
    // Add appropriate corner class
    if (currentBreak === 'left') {
      robotCollapsed.classList.add('left-corner');
    } else {
      robotCollapsed.classList.add('right-corner');
    }
  }

  // Show with fade-in transition
  setTimeout(() => {
    robotCollapsed.classList.add('show');
  }, 100);
}

function collapseChat() {
  chatPane.hide();
  robotCollapsed.style.display = 'flex';
  robotCollapsed.classList.remove('hidden');
  isCollapsed = true;
  
  // Position and show with fade-in
  positionRobotButton();
}

// Set initial state
robotCollapsed.style.display = 'none';
robotCollapsed.classList.remove('show');

// Configure pane events directly
document.addEventListener('cupertinoPanelDidDismiss', function() {
  robotCollapsed.style.display = 'flex';
  isCollapsed = true;
  positionRobotButton();
});

document.addEventListener('cupertinoPanelWillPresent', function() {
  robotCollapsed.style.display = 'none';
  isCollapsed = false;
});

// Listen for horizontal break changes
document.addEventListener('cupertinoPanelBreakpointChange', function() {
  if (isCollapsed) {
    positionRobotButton();
  }
}); 