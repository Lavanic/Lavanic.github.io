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
    1: null, // Will be loaded from file
    2: null,
    3: null,
    4: null,
    5: null
};

// Load broker ASCII art from files
const brokerFiles = [
    'assets/images/broker1.txt',
    'assets/images/broker2.txt',
    'assets/images/broker3.txt',
    'assets/images/broker4.txt'
];

// Load each broker stage
Promise.all(brokerFiles.map((file, index) =>
    fetch(file)
        .then(response => response.text())
        .then(text => {
            BROKER_STAGES[index + 1] = text;
        })
        .catch(error => {
            console.error(`Failed to load ${file}:`, error);
            // Fallback to simple text
            const fallbacks = [':)', ':}', ':]>', '}:->'];
            BROKER_STAGES[index + 1] = fallbacks[index] || ':)';
        })
)).then(() => {
    // Use broker4 for stage 5 as well
    BROKER_STAGES[5] = BROKER_STAGES[4];
});

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
    const stage = Math.min(Math.max(gameState.currentRound + 1, 1), 5);
    // Wait for broker ASCII to load if not yet available
    if (BROKER_STAGES[stage]) {
        DOM.brokerAscii.textContent = BROKER_STAGES[stage];
    } else {
        // Retry after a short delay if not loaded yet
        setTimeout(() => {
            if (BROKER_STAGES[stage]) {
                DOM.brokerAscii.textContent = BROKER_STAGES[stage];
            }
        }, 100);
    }
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
    showBackground(false); // Show RED background on welcome screen

    // Show logos, hide broker
    document.getElementById('welcomeLogos').style.display = 'flex';
    document.getElementById('brokerArea').style.display = 'none';

    writeTerminal(`
        <p style="text-align: center; line-height: 2; font-size: 1.2rem;">
            This game is my final project for GERMAN 280: Faust and the Faustian in German Culture.
            You'll explore five different versions of the Faust legend—from Marlowe's damnation to Goethe's redemption,
            from Murnau's visual darkness to DC's Felix Faust and "The Devil Went Down to Georgia."
            Each deal reflects how different eras priced ambition, knowledge, and salvation.
        </p>
    `);

    console.log('Creating BEGIN GAME button...');
    createButton('BEGIN GAME!', () => transitionTo(STATES.DESIRE_SELECT), 'white');
    console.log('Welcome screen rendered');
}

function renderDesireSelect() {
    clearTerminal();
    clearButtons();
    showBackground(); // Show background after welcome screen

    // Hide logos, show broker
    document.getElementById('welcomeLogos').style.display = 'none';
    document.getElementById('brokerArea').style.display = 'flex';
    updateBroker(); // Update to show broker1 ASCII art

    writeTerminal(`
        <h1>SELECT YOUR DESIRE</h1>
        <p>What do you seek? Choose wisely—this cannot be changed.</p>
    `);

    // Create desire cards with flip animation
    const cardGrid = document.createElement('div');
    cardGrid.className = 'card-grid';

    DESIRES.forEach((desire, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-face card-back"></div>
                <div class="card-face card-front">
                    <div class="card-title">${desire.label}</div>
                </div>
            </div>
        `;
        card.addEventListener('click', () => selectDesire(desire));
        cardGrid.appendChild(card);

        // Trigger flip animation with staggered delay (left to right)
        setTimeout(() => {
            card.classList.add('flipped');
        }, 300 + (index * 200));
    });

    DOM.buttonContainer.appendChild(cardGrid);
}

function renderMarketSelect() {
    clearTerminal();
    clearButtons();
    showBackground();

    const desireText = gameState.selectedDesire.label;

    writeTerminal(`
        <h1>CHOOSE YOUR TERMS</h1>
        <p>You seek: <span class="highlight">${desireText}</span></p>
        <p>Five brokers offer their contracts. Each operates by different rules.</p>
        <p style="color: #ffff00;">Choose carefully—you may only deal with one.</p>
    `);

    // Create market cards with flip animation
    const cardGrid = document.createElement('div');
    cardGrid.className = 'card-grid';

    Object.keys(MARKETS).forEach((marketId, index) => {
        const market = MARKETS[marketId];
        const card = document.createElement('div');
        card.className = 'card';

        // Generate dynamic description based on selected desire
        let description = market.description;
        if (marketId === 'goethe') {
            description = `You get ${desireText.toLowerCase()} in exchange for 1 loved one quietly paying the price.`;
        } else if (marketId === 'murnau') {
            description = `You get ${desireText.toLowerCase()} in exchange for 1,000 strangers falling into sickness and despair.`;
        } else if (marketId === 'felix') {
            description = `You get ${desireText.toLowerCase()} through dark magic in exchange for your body beginning to rot.`;
        } else if (marketId === 'marlowe') {
            description = `You get ${desireText.toLowerCase()} for 24 years in exchange for your soul being damned to hell for eternity.`;
        } else if (marketId === 'georgia') {
            description = `You get ${desireText.toLowerCase()} and keep your soul if you win. Lose and forfeit everything.`;
        }

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-face card-back"></div>
                <div class="card-face card-front">
                    <div class="card-title">${market.name}</div>
                    <div class="card-description">${description}</div>
                </div>
            </div>
        `;
        card.addEventListener('click', () => selectMarket(marketId));
        cardGrid.appendChild(card);

        // Trigger flip animation with staggered delay (left to right)
        setTimeout(() => {
            card.classList.add('flipped');
        }, 300 + (index * 200));
    });

    DOM.buttonContainer.appendChild(cardGrid);
}

function renderOfferDecision() {
    clearTerminal();
    clearButtons();
    showRoundCounter();
    showBackground();

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
    showBackground();

    const market = MARKETS[gameState.selectedMarket];
    const vignette = market.generateVignette(gameState.selectedDesire, gameState.currentOffer);

    writeTerminal(`
        <h1>THE CONTRACT IS SEALED</h1>
        <br>
        <div style="background: rgba(50, 0, 0, 0.3); padding: 1rem; border: 2px solid #ff0000;">
            ${vignette}
        </div>
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
    duration: 15000, // 15 seconds
    startTime: 0,
    attacks: [],
    warnings: [],
    heartPos: { x: 190, y: 190 },
    keys: {},
    animationFrame: null,
    patternCounter: 0
};

function startMinigame() {
    gameState.hitsThisRound = 0;
    DOM.terminal.style.display = 'none';
    DOM.buttonContainer.style.display = 'none';
    DOM.soulBoxContainer.style.display = 'block';
    DOM.hitsCounter.textContent = 'HITS: 0';

    showRoundCounter();
    showBackground();

    minigame.active = true;
    minigame.startTime = Date.now();
    minigame.attacks = [];
    minigame.warnings = [];
    minigame.heartPos = { x: 190, y: 190 };
    minigame.keys = {};
    minigame.patternCounter = 0;

    // Clear previous attacks and warnings
    const oldAttacks = DOM.soulBox.querySelectorAll('.attack, .warning');
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
    const marketId = gameState.selectedMarket;
    const difficulty = getDifficulty(gameState.currentRound);

    // Spawn attacks based on market type
    for (let i = 0; i < difficulty.count; i++) {
        setTimeout(() => {
            if (!minigame.active) return;

            // Mix of attack types based on difficulty
            const rand = Math.random();
            if (rand < difficulty.homingChance) {
                createHomingAttack(market.minigameTheme, difficulty.speed);
            } else if (rand < difficulty.homingChance + 0.15 && marketId === 'georgia') {
                createRhythmPattern(market.minigameTheme, difficulty.speed);
            } else if (rand < difficulty.homingChance + 0.2 && marketId === 'felix') {
                createSpiralAttack(market.minigameTheme, difficulty.speed);
            } else if (rand < difficulty.homingChance + 0.25 && marketId === 'murnau') {
                createSpreadPattern(market.minigameTheme, difficulty.speed);
            } else {
                createAttack(market.minigameTheme, difficulty.speed);
            }
        }, i * difficulty.spawnDelay);
    }

    // Add timed pattern attacks
    if (difficulty.patterns) {
        setTimeout(() => {
            if (!minigame.active) return;
            if (marketId === 'marlowe') createCrossPattern(market.minigameTheme, difficulty.speed);
            else if (marketId === 'goethe') createWavePattern(market.minigameTheme, difficulty.speed);
        }, 5000);
    }
}

function getDifficulty(round) {
    const difficulties = [
        { count: 8, speed: 2.5, spawnDelay: 1500, homingChance: 0.2, patterns: false },   // Round 1
        { count: 12, speed: 3, spawnDelay: 1200, homingChance: 0.35, patterns: true },    // Round 2
        { count: 16, speed: 3.5, spawnDelay: 1000, homingChance: 0.5, patterns: true },   // Round 3
        { count: 20, speed: 4, spawnDelay: 800, homingChance: 0.65, patterns: true },     // Round 4
        { count: 25, speed: 4.5, spawnDelay: 600, homingChance: 0.8, patterns: true }     // Round 5
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
    attack.textContent = theme.emoji;
    attack.style.fontSize = '28px';
    attack.style.display = 'flex';
    attack.style.alignItems = 'center';
    attack.style.justifyContent = 'center';
    attack.style.filter = `drop-shadow(0 0 8px ${theme.color})`;

    attack.dataset.x = startX;
    attack.dataset.y = startY;
    attack.dataset.vx = velocityX;
    attack.dataset.vy = velocityY;

    DOM.soulBox.appendChild(attack);
    minigame.attacks.push({ element: attack, type: 'straight' });
}

// HOMING ATTACK - Tracks player position
function createHomingAttack(theme, speed) {
    // Show warning first
    const warningDuration = 800;
    const warning = document.createElement('div');
    warning.className = 'warning';
    warning.style.position = 'absolute';
    warning.style.left = minigame.heartPos.x + 'px';
    warning.style.top = minigame.heartPos.y + 'px';
    warning.style.width = '40px';
    warning.style.height = '40px';
    warning.style.border = '2px solid red';
    warning.style.borderRadius = '50%';
    warning.style.opacity = '0.5';
    warning.style.animation = 'pulse 0.3s infinite';
    DOM.soulBox.appendChild(warning);
    minigame.warnings.push(warning);

    setTimeout(() => {
        if (!minigame.active) return;
        warning.remove();

        const attack = document.createElement('div');
        attack.className = `attack ${theme.attackClass}`;

        // Spawn from random edge
        const side = Math.floor(Math.random() * 4);
        let startX, startY;
        switch (side) {
            case 0: startX = Math.random() * 370; startY = 0; break;
            case 1: startX = 370; startY = Math.random() * 370; break;
            case 2: startX = Math.random() * 370; startY = 370; break;
            case 3: startX = 0; startY = Math.random() * 370; break;
        }

        attack.style.left = startX + 'px';
        attack.style.top = startY + 'px';
        attack.textContent = theme.emoji;
        attack.style.fontSize = '32px';
        attack.style.display = 'flex';
        attack.style.alignItems = 'center';
        attack.style.justifyContent = 'center';
        attack.style.filter = `drop-shadow(0 0 15px ${theme.color})`;

        attack.dataset.x = startX;
        attack.dataset.y = startY;

        DOM.soulBox.appendChild(attack);
        minigame.attacks.push({ element: attack, type: 'homing', speed: speed * 0.8 });
    }, warningDuration);
}

// SPIRAL ATTACK - Moves in spiral pattern
function createSpiralAttack(theme, speed) {
    const attack = document.createElement('div');
    attack.className = `attack ${theme.attackClass}`;

    const centerX = 185;
    const centerY = 185;
    const startAngle = Math.random() * Math.PI * 2;

    attack.textContent = theme.emoji;
    attack.style.fontSize = '28px';
    attack.style.display = 'flex';
    attack.style.alignItems = 'center';
    attack.style.justifyContent = 'center';
    attack.style.filter = `drop-shadow(0 0 10px ${theme.color})`;

    attack.dataset.x = centerX;
    attack.dataset.y = centerY;
    attack.dataset.angle = startAngle;
    attack.dataset.radius = 50;

    DOM.soulBox.appendChild(attack);
    minigame.attacks.push({ element: attack, type: 'spiral', speed: speed });
}

// RHYTHM PATTERN - Musical notes in rhythm (Georgia)
function createRhythmPattern(theme, speed) {
    const beatInterval = 400;
    for (let i = 0; i < 4; i++) {
        setTimeout(() => {
            if (!minigame.active) return;
            const attack = document.createElement('div');
            attack.className = `attack ${theme.attackClass}`;

            const startX = 185;
            const startY = 0;
            const angle = (Math.PI / 6) * (i - 1.5); // Spread pattern

            attack.style.left = startX + 'px';
            attack.style.top = startY + 'px';
            attack.textContent = theme.emoji;
            attack.style.fontSize = '28px';
            attack.style.display = 'flex';
            attack.style.alignItems = 'center';
            attack.style.justifyContent = 'center';
            attack.style.filter = `drop-shadow(0 0 8px ${theme.color})`;

            attack.dataset.x = startX;
            attack.dataset.y = startY;
            attack.dataset.vx = Math.sin(angle) * speed * 1.5;
            attack.dataset.vy = Math.cos(angle) * speed * 1.5;

            DOM.soulBox.appendChild(attack);
            minigame.attacks.push({ element: attack, type: 'straight' });
        }, i * beatInterval);
    }
}

// SPREAD PATTERN - Plague spreading (Murnau)
function createSpreadPattern(theme, speed) {
    const centerX = Math.random() * 300 + 35;
    const centerY = Math.random() * 300 + 35;

    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
        const attack = document.createElement('div');
        attack.className = `attack ${theme.attackClass}`;

        attack.style.left = centerX + 'px';
        attack.style.top = centerY + 'px';
        attack.textContent = theme.emoji;
        attack.style.fontSize = '28px';
        attack.style.display = 'flex';
        attack.style.alignItems = 'center';
        attack.style.justifyContent = 'center';
        attack.style.filter = `drop-shadow(0 0 10px ${theme.color})`;
        attack.style.opacity = '0.9';

        attack.dataset.x = centerX;
        attack.dataset.y = centerY;
        attack.dataset.vx = Math.cos(angle) * speed;
        attack.dataset.vy = Math.sin(angle) * speed;

        DOM.soulBox.appendChild(attack);
        minigame.attacks.push({ element: attack, type: 'straight' });
    }
}

// CROSS PATTERN - Four directions (Marlowe)
function createCrossPattern(theme, speed) {
    const directions = [
        { x: 0, y: 185, vx: 1, vy: 0 },
        { x: 370, y: 185, vx: -1, vy: 0 },
        { x: 185, y: 0, vx: 0, vy: 1 },
        { x: 185, y: 370, vx: 0, vy: -1 }
    ];

    directions.forEach(dir => {
        const attack = document.createElement('div');
        attack.className = `attack ${theme.attackClass}`;

        attack.style.left = dir.x + 'px';
        attack.style.top = dir.y + 'px';
        attack.textContent = theme.emoji;
        attack.style.fontSize = '32px';
        attack.style.display = 'flex';
        attack.style.alignItems = 'center';
        attack.style.justifyContent = 'center';
        attack.style.filter = `drop-shadow(0 0 12px ${theme.color})`;

        attack.dataset.x = dir.x;
        attack.dataset.y = dir.y;
        attack.dataset.vx = dir.vx * speed * 1.2;
        attack.dataset.vy = dir.vy * speed * 1.2;

        DOM.soulBox.appendChild(attack);
        minigame.attacks.push({ element: attack, type: 'straight' });
    });
}

// WAVE PATTERN - Sine wave (Goethe)
function createWavePattern(theme, speed) {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            if (!minigame.active) return;
            const attack = document.createElement('div');
            attack.className = `attack ${theme.attackClass}`;

            const side = Math.random() < 0.5 ? 0 : 370;
            const startY = (i / 5) * 370;

            attack.style.left = side + 'px';
            attack.style.top = startY + 'px';
            attack.textContent = theme.emoji;
            attack.style.fontSize = '28px';
            attack.style.display = 'flex';
            attack.style.alignItems = 'center';
            attack.style.justifyContent = 'center';
            attack.style.filter = `drop-shadow(0 0 8px ${theme.color})`;

            attack.dataset.x = side;
            attack.dataset.y = startY;
            attack.dataset.waveOffset = i * 50;
            attack.dataset.direction = side === 0 ? 1 : -1;

            DOM.soulBox.appendChild(attack);
            minigame.attacks.push({ element: attack, type: 'wave', speed: speed });
        }, i * 200);
    }
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

    // Update attacks based on type
    minigame.attacks = minigame.attacks.filter(attackObj => {
        const attack = attackObj.element;
        let x = parseFloat(attack.dataset.x);
        let y = parseFloat(attack.dataset.y);

        // Skip if already hit (for homing attacks)
        if (attack.dataset.hit === 'true' && attackObj.type === 'homing') {
            attack.remove();
            return false;
        }

        if (attackObj.type === 'straight') {
            // Original straight-line movement
            const vx = parseFloat(attack.dataset.vx);
            const vy = parseFloat(attack.dataset.vy);
            x += vx;
            y += vy;
        } else if (attackObj.type === 'homing') {
            // Track toward player position only if not hit
            if (attack.dataset.hit !== 'true') {
                const dx = minigame.heartPos.x - x;
                const dy = minigame.heartPos.y - y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > 0 && dist > 5) { // Stop tracking if very close
                    const speed = attackObj.speed || 2;
                    x += (dx / dist) * speed;
                    y += (dy / dist) * speed;
                }
            }
        } else if (attackObj.type === 'spiral') {
            // Spiral outward
            let angle = parseFloat(attack.dataset.angle);
            let radius = parseFloat(attack.dataset.radius);

            angle += 0.08;
            radius += attackObj.speed * 0.5;

            x = 185 + Math.cos(angle) * radius;
            y = 185 + Math.sin(angle) * radius;

            attack.dataset.angle = angle;
            attack.dataset.radius = radius;
        } else if (attackObj.type === 'wave') {
            // Sine wave movement
            const direction = parseFloat(attack.dataset.direction);
            const waveOffset = parseFloat(attack.dataset.waveOffset);

            x += direction * attackObj.speed;
            y = parseFloat(attack.dataset.y) + Math.sin((x + waveOffset) / 30) * 50;
        }

        attack.dataset.x = x;
        attack.dataset.y = y;
        attack.style.left = x + 'px';
        attack.style.top = y + 'px';

        // Check collision with heart
        const attackSize = attackObj.type === 'homing' ? 35 : 30;
        if (checkCollision(minigame.heartPos, { x, y, width: attackSize, height: attackSize })) {
            if (!attack.dataset.hit) {
                attack.dataset.hit = 'true';
                gameState.hitsThisRound++;
                DOM.hitsCounter.textContent = `HITS: ${gameState.hitsThisRound}`;
                // Enhanced visual feedback
                DOM.soulHeart.style.filter = 'brightness(2)';
                DOM.soulHeart.style.transform = 'translate(-50%, -50%) rotate(45deg) scale(1.3)';
                setTimeout(() => {
                    DOM.soulHeart.style.filter = '';
                    DOM.soulHeart.style.transform = 'translate(-50%, -50%) rotate(45deg)';
                }, 150);

                // Remove homing attacks immediately after hit
                if (attackObj.type === 'homing') {
                    attack.remove();
                    return false; // Remove from array immediately
                }
            }
        }

        // Remove attacks that go off screen
        if (x < -50 || x > 420 || y < -50 || y > 420) {
            attack.remove();
            return false;
        }

        return true;
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

    // Clear attacks and warnings
    minigame.attacks.forEach(a => a.element.remove());
    minigame.attacks = [];
    minigame.warnings.forEach(w => w.remove());
    minigame.warnings = [];

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

function showBackground(isPurple = true) {
    const bg = document.getElementById('animatedBg');
    if (bg) {
        // Change to purple for non-welcome screens
        if (isPurple && !window.balatroPurpleInitialized) {
            import('./balatro.js').then(module => {
                // Clear the old canvas
                const canvas = bg.querySelector('canvas');
                if (canvas) canvas.remove();

                // Reinitialize with purple
                window.balatroBg = module.initBalatro({
                    color1: '#613583',
                    color2: '#241F31',
                    color3: '#000000',
                    isRotate: false,
                    mouseInteraction: true,
                    pixelFilter: 700
                });
                window.balatroPurpleInitialized = true;
            });
        }
        bg.style.display = 'block';
        // Trigger resize to ensure proper rendering
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 50);
    }
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
