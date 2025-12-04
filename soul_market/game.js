/* Faustian Exchange Terminal - Game Logic */

// ============================================================================
// STATE DEFINITIONS
// ============================================================================

const STATES = {
    WELCOME: 'welcome',
    DESIRE_SELECT: 'desire_select',
    MARKET_SELECT: 'market_select',
    MINIGAME: 'minigame',
    OFFER_DECISION: 'offer_decision',
    FINAL_OUTCOME: 'final_outcome'
};

// ============================================================================
// GAME STATE
// ============================================================================

let gameState = {
    currentState: STATES.WELCOME,
    selectedDesire: null,
    selectedMarket: null,
    currentRound: 0,
    baseOffer: null,
    currentOffer: null,
    performanceHistory: [],
    hitsThisRound: 0,
    settled: false
};

// ============================================================================
// DOM REFERENCES
// ============================================================================

const DOM = {
    terminal: null,
    terminalContent: null,
    buttonContainer: null,
    soulBoxContainer: null,
    soulBox: null,
    soulHeart: null,
    hitsCounter: null,
    brokerAscii: null,
    roundCounter: null,
    roundNumber: null
};

// ============================================================================
// BROKER ASCII ART BY STAGE
// ============================================================================

const BROKER_STAGES = {
    1: `
    :)
    `,
    2: `
    :}
    `,
    3: `
   :]>
    `,
    4: `
  }:->
    `,
    5: `
 ψ(｀∇´)ψ
    `
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function clearTerminal() {
    DOM.terminalContent.innerHTML = '';
}

function writeTerminal(html) {
    DOM.terminalContent.innerHTML = html;
}

function appendTerminal(html) {
    DOM.terminalContent.innerHTML += html;
}

function clearButtons() {
    DOM.buttonContainer.innerHTML = '';
}

function createButton(text, onClick, className = '') {
    const button = document.createElement('button');
    button.className = `game-button ${className}`;
    button.textContent = text;
    button.addEventListener('click', onClick);
    DOM.buttonContainer.appendChild(button);
    return button;
}

function updateBroker() {
    const stage = Math.min(gameState.currentRound + 1, 5);
    DOM.brokerAscii.textContent = BROKER_STAGES[stage];
    DOM.brokerAscii.className = `broker-ascii stage-${stage}`;
}

function showRoundCounter() {
    DOM.roundCounter.style.display = 'block';
    DOM.roundNumber.textContent = gameState.currentRound + 1;
}

function hideRoundCounter() {
    DOM.roundCounter.style.display = 'none';
}

// ============================================================================
// STATE RENDERING FUNCTIONS
// ============================================================================

function renderWelcome() {
    console.log('Rendering welcome screen...');
    clearTerminal();
    clearButtons();
    hideRoundCounter();
    showBackground(); // Show background ONLY on welcome screen

    // Show logos, hide broker
    document.getElementById('welcomeLogos').style.display = 'flex';
    document.getElementById('brokerArea').style.display = 'none';

    writeTerminal(`
        <p style="text-align: center; line-height: 1.8;">
            This game is my final project for GERMAN 280: Faust and the Faustian in German Culture.
            You'll explore five different versions of the Faust legend—from Marlowe's damnation to Goethe's redemption,
            from Murnau's visual darkness to DC's Felix Faust and "The Devil Went Down to Georgia."
            Each deal reflects how different eras priced ambition, knowledge, and salvation.
        </p>
    `);

    // Add password section
    const passwordSection = document.createElement('div');
    passwordSection.className = 'password-section';
    passwordSection.innerHTML = `
        <input type="password" class="password-input" id="gamePassword" placeholder="ENTER ACCESS CODE">
        <div class="password-error" id="passwordError"></div>
    `;
    DOM.buttonContainer.appendChild(passwordSection);

    console.log('Creating BEGIN GAME button...');
    createButton('BEGIN GAME!', attemptGameStart, 'white');
    console.log('Welcome screen rendered');
}

function attemptGameStart() {
    const passwordInput = document.getElementById('gamePassword');
    const errorDiv = document.getElementById('passwordError');
    const password = passwordInput.value.trim();

    if (password === '') {
        errorDiv.textContent = 'ACCESS CODE REQUIRED';
        passwordInput.style.borderColor = '#ff0000';
        setTimeout(() => {
            passwordInput.style.borderColor = '#cccccc';
        }, 500);
    } else {
        errorDiv.textContent = 'ACCESS DENIED - INVALID CODE';
        passwordInput.style.borderColor = '#ff0000';
        passwordInput.value = '';
        setTimeout(() => {
            passwordInput.style.borderColor = '#cccccc';
            errorDiv.textContent = '';
        }, 2000);
    }
}

function renderDesireSelect() {
    clearTerminal();
    clearButtons();
    hideBackground(); // Hide background after welcome screen

    // Hide logos, show broker
    document.getElementById('welcomeLogos').style.display = 'none';
    document.getElementById('brokerArea').style.display = 'flex';

    writeTerminal(`
        <h1>SELECT YOUR DESIRE</h1>
        <p>What do you seek? Choose wisely—this cannot be changed.</p>
    `);

    // Create desire cards
    const cardGrid = document.createElement('div');
    cardGrid.className = 'card-grid';

    DESIRES.forEach(desire => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-title">${desire.label}</div>
        `;
        card.addEventListener('click', () => selectDesire(desire));
        cardGrid.appendChild(card);
    });

    DOM.buttonContainer.appendChild(cardGrid);
}

function renderMarketSelect() {
    clearTerminal();
    clearButtons();

    const desireText = gameState.selectedDesire.label;

    writeTerminal(`
        <h1>CHOOSE YOUR TERMS</h1>
        <p>You seek: <span class="highlight">${desireText}</span></p>
        <p>Five brokers offer their contracts. Each operates by different rules.</p>
        <p style="color: #ffff00;">Choose carefully—you may only deal with one.</p>
    `);

    // Create market cards
    const cardGrid = document.createElement('div');
    cardGrid.className = 'card-grid';

    Object.keys(MARKETS).forEach(marketId => {
        const market = MARKETS[marketId];
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-title">${market.name}</div>
            <div class="card-description">${market.description}</div>
        `;
        card.addEventListener('click', () => selectMarket(marketId));
        cardGrid.appendChild(card);
    });

    DOM.buttonContainer.appendChild(cardGrid);
}

function renderOfferDecision() {
    clearTerminal();
    clearButtons();
    showRoundCounter();

    const offer = gameState.currentOffer;
    const performance = getPerformanceGrade(gameState.hitsThisRound);

    let performanceText = '';
    if (gameState.currentRound > 0) {
        performanceText = `<p>Performance: <span style="color: ${performance.color};">${performance.label}</span></p>`;
    }

    writeTerminal(`
        <h1>CURRENT OFFER - ROUND ${gameState.currentRound + 1}</h1>
        ${performanceText}
        <div class="offer-display">
            <h2>THE TERMS</h2>
            <p class="offer-gain">► GAIN: ${offer.gain}</p>
            <p class="offer-cost">► COST: ${offer.cost}</p>
        </div>
        <p style="color: #ffff00;">You may SETTLE and accept these terms, or PUSH YOUR LUCK for better conditions.</p>
        <p style="color: #ff0000;">Warning: Each trial grows harder. Failure worsens the deal.</p>
    `);

    createButton('SETTLE', () => settle(), 'primary');

    if (gameState.currentRound < 4) {
        createButton('PUSH YOUR LUCK', () => transitionTo(STATES.MINIGAME), 'danger');
    }
}

function renderFinalOutcome() {
    clearTerminal();
    clearButtons();
    hideRoundCounter();

    const market = MARKETS[gameState.selectedMarket];
    const vignette = market.generateVignette(gameState.selectedDesire, gameState.currentOffer);

    writeTerminal(`
        <h1>THE CONTRACT IS SEALED</h1>
        <br>
        <div style="background: rgba(50, 0, 0, 0.3); padding: 1rem; border: 2px solid #ff0000;">
            ${vignette}
        </div>
        <br>
        <p style="text-align: center; color: #888;">The Broker smiles.</p>
        <p style="text-align: center; color: #888;">Another soul accounted for.</p>
    `);

    createButton('CLOSE SESSION', () => location.reload(), '');
}

// ============================================================================
// STATE TRANSITION FUNCTIONS
// ============================================================================

function transitionTo(newState) {
    gameState.currentState = newState;
    render();
}

function selectDesire(desire) {
    gameState.selectedDesire = desire;
    transitionTo(STATES.MARKET_SELECT);
}

function selectMarket(marketId) {
    gameState.selectedMarket = marketId;
    const market = MARKETS[marketId];

    // Generate base offer
    gameState.baseOffer = market.generateBaseOffer(gameState.selectedDesire);
    gameState.currentOffer = { ...gameState.baseOffer };

    // Start first round
    gameState.currentRound = 0;
    updateBroker();
    transitionTo(STATES.OFFER_DECISION);
}

function settle() {
    gameState.settled = true;
    transitionTo(STATES.FINAL_OUTCOME);
}

// ============================================================================
// MINIGAME LOGIC
// ============================================================================

let minigame = {
    active: false,
    duration: 12000, // 12 seconds
    startTime: 0,
    attacks: [],
    heartPos: { x: 190, y: 190 },
    keys: {},
    animationFrame: null
};

function startMinigame() {
    gameState.hitsThisRound = 0;
    DOM.terminal.style.display = 'none';
    DOM.buttonContainer.style.display = 'none';
    DOM.soulBoxContainer.style.display = 'block';
    DOM.hitsCounter.textContent = 'HITS: 0';

    showRoundCounter();

    minigame.active = true;
    minigame.startTime = Date.now();
    minigame.attacks = [];
    minigame.heartPos = { x: 190, y: 190 };
    minigame.keys = {};

    // Clear previous attacks
    const oldAttacks = DOM.soulBox.querySelectorAll('.attack');
    oldAttacks.forEach(a => a.remove());

    // Position heart
    updateHeartPosition();

    // Spawn attacks
    spawnAttacks();

    // Start game loop
    minigame.animationFrame = requestAnimationFrame(minigameLoop);

    // Keyboard listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
}

function handleKeyDown(e) {
    const key = e.key.toLowerCase();
    if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        e.preventDefault();
        minigame.keys[key] = true;
    }
}

function handleKeyUp(e) {
    const key = e.key.toLowerCase();
    minigame.keys[key] = false;
}

function updateHeartPosition() {
    DOM.soulHeart.style.left = minigame.heartPos.x + 'px';
    DOM.soulHeart.style.top = minigame.heartPos.y + 'px';
}

function spawnAttacks() {
    const market = MARKETS[gameState.selectedMarket];
    const difficulty = getDifficulty(gameState.currentRound);

    for (let i = 0; i < difficulty.count; i++) {
        setTimeout(() => {
            if (!minigame.active) return;
            createAttack(market.minigameTheme, difficulty.speed);
        }, i * difficulty.spawnDelay);
    }
}

function getDifficulty(round) {
    const difficulties = [
        { count: 5, speed: 2, spawnDelay: 2000 },   // Round 1
        { count: 8, speed: 3, spawnDelay: 1500 },   // Round 2
        { count: 12, speed: 4, spawnDelay: 1200 },  // Round 3
        { count: 15, speed: 5, spawnDelay: 1000 },  // Round 4
        { count: 20, speed: 6, spawnDelay: 800 }    // Round 5
    ];
    return difficulties[round] || difficulties[0];
}

function createAttack(theme, speed) {
    const attack = document.createElement('div');
    attack.className = `attack ${theme.attackClass}`;

    // Random starting position (edge of box)
    const side = Math.floor(Math.random() * 4);
    let startX, startY, velocityX, velocityY;

    switch (side) {
        case 0: // Top
            startX = Math.random() * 370;
            startY = 0;
            velocityX = (Math.random() - 0.5) * speed;
            velocityY = speed;
            break;
        case 1: // Right
            startX = 370;
            startY = Math.random() * 370;
            velocityX = -speed;
            velocityY = (Math.random() - 0.5) * speed;
            break;
        case 2: // Bottom
            startX = Math.random() * 370;
            startY = 370;
            velocityX = (Math.random() - 0.5) * speed;
            velocityY = -speed;
            break;
        case 3: // Left
            startX = 0;
            startY = Math.random() * 370;
            velocityX = speed;
            velocityY = (Math.random() - 0.5) * speed;
            break;
    }

    attack.style.left = startX + 'px';
    attack.style.top = startY + 'px';
    attack.style.backgroundColor = theme.color;

    attack.dataset.x = startX;
    attack.dataset.y = startY;
    attack.dataset.vx = velocityX;
    attack.dataset.vy = velocityY;

    DOM.soulBox.appendChild(attack);
    minigame.attacks.push(attack);
}

function minigameLoop() {
    if (!minigame.active) return;

    const elapsed = Date.now() - minigame.startTime;

    // Check if time is up
    if (elapsed >= minigame.duration) {
        endMinigame();
        return;
    }

    // Update heart position based on keys
    const speed = 3;
    if (minigame.keys['w'] || minigame.keys['arrowup']) {
        minigame.heartPos.y = Math.max(10, minigame.heartPos.y - speed);
    }
    if (minigame.keys['s'] || minigame.keys['arrowdown']) {
        minigame.heartPos.y = Math.min(370, minigame.heartPos.y + speed);
    }
    if (minigame.keys['a'] || minigame.keys['arrowleft']) {
        minigame.heartPos.x = Math.max(10, minigame.heartPos.x - speed);
    }
    if (minigame.keys['d'] || minigame.keys['arrowright']) {
        minigame.heartPos.x = Math.min(370, minigame.heartPos.x + speed);
    }

    updateHeartPosition();

    // Update attacks
    minigame.attacks.forEach(attack => {
        let x = parseFloat(attack.dataset.x);
        let y = parseFloat(attack.dataset.y);
        const vx = parseFloat(attack.dataset.vx);
        const vy = parseFloat(attack.dataset.vy);

        x += vx;
        y += vy;

        attack.dataset.x = x;
        attack.dataset.y = y;
        attack.style.left = x + 'px';
        attack.style.top = y + 'px';

        // Check collision with heart
        if (checkCollision(minigame.heartPos, { x, y, width: 30, height: 30 })) {
            if (!attack.dataset.hit) {
                attack.dataset.hit = 'true';
                gameState.hitsThisRound++;
                DOM.hitsCounter.textContent = `HITS: ${gameState.hitsThisRound}`;
                // Visual feedback
                DOM.soulHeart.style.filter = 'brightness(2)';
                setTimeout(() => {
                    DOM.soulHeart.style.filter = '';
                }, 100);
            }
        }
    });

    minigame.animationFrame = requestAnimationFrame(minigameLoop);
}

function checkCollision(heart, attack) {
    const heartSize = 20;
    return !(
        heart.x + heartSize < attack.x ||
        heart.x > attack.x + attack.width ||
        heart.y + heartSize < attack.y ||
        heart.y > attack.y + attack.height
    );
}

function endMinigame() {
    minigame.active = false;
    cancelAnimationFrame(minigame.animationFrame);

    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);

    // Clear attacks
    minigame.attacks.forEach(a => a.remove());
    minigame.attacks = [];

    // Hide soul box
    DOM.soulBoxContainer.style.display = 'none';
    DOM.terminal.style.display = 'block';
    DOM.buttonContainer.style.display = 'flex';

    // Record performance
    gameState.performanceHistory.push(gameState.hitsThisRound);

    // Modify offer based on performance
    const market = MARKETS[gameState.selectedMarket];
    gameState.currentOffer = market.modifyOffer(
        gameState.currentOffer,
        gameState.hitsThisRound,
        gameState.currentRound
    );

    // Advance round
    gameState.currentRound++;
    updateBroker();

    // Show updated offer
    transitionTo(STATES.OFFER_DECISION);
}

function getPerformanceGrade(hits) {
    if (hits === 0) return { label: 'EXCELLENT', color: '#00ff00' };
    if (hits <= 2) return { label: 'GOOD', color: '#88ff00' };
    if (hits <= 4) return { label: 'OKAY', color: '#ffff00' };
    return { label: 'POOR', color: '#ff0000' };
}

// ============================================================================
// MAIN RENDER FUNCTION
// ============================================================================

function render() {
    switch (gameState.currentState) {
        case STATES.WELCOME:
            renderWelcome();
            break;
        case STATES.DESIRE_SELECT:
            renderDesireSelect();
            break;
        case STATES.MARKET_SELECT:
            renderMarketSelect();
            break;
        case STATES.MINIGAME:
            startMinigame();
            break;
        case STATES.OFFER_DECISION:
            renderOfferDecision();
            break;
        case STATES.FINAL_OUTCOME:
            renderFinalOutcome();
            break;
    }
}

// ============================================================================
// BACKGROUND CONTROL
// ============================================================================

function showBackground() {
    const bg = document.getElementById('animatedBg');
    if (bg) bg.style.display = 'block';
}

function hideBackground() {
    const bg = document.getElementById('animatedBg');
    if (bg) bg.style.display = 'none';
}

// ============================================================================
// INITIALIZATION
// ============================================================================

function init() {
    // Get DOM references
    DOM.terminal = document.getElementById('terminal');
    DOM.terminalContent = document.getElementById('terminalContent');
    DOM.buttonContainer = document.getElementById('buttonContainer');
    DOM.soulBoxContainer = document.getElementById('soulBoxContainer');
    DOM.soulBox = document.getElementById('soulBox');
    DOM.soulHeart = document.getElementById('soulHeart');
    DOM.hitsCounter = document.getElementById('hitsCounter');
    DOM.brokerAscii = document.getElementById('brokerAscii');
    DOM.roundCounter = document.getElementById('roundCounter');
    DOM.roundNumber = document.getElementById('roundNumber');

    // Start game
    render();
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
