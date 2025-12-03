/* Faustian Exchange Terminal - Data */

// ============================================================================
// DESIRES
// ============================================================================

const DESIRES = [
    { id: 'gpa', label: '4.0 GPA next semester', archetype: 'KNOWLEDGE' },
    { id: 'internship', label: 'Internship at Google/NVIDIA', archetype: 'POWER' },
    { id: 'followers', label: '100k followers on TikTok', archetype: 'FAME' },
    { id: 'love', label: 'True love', archetype: 'LOVE' }
];

// ============================================================================
// MARKETS (Faust Adaptations)
// ============================================================================

const MARKETS = {
    // ========================================================================
    // MARLOWE'S DOCTOR FAUSTUS (1592)
    // Classical 24-year contract. Fixed damnation. No escape.
    // ========================================================================
    marlowe: {
        name: "Marlowe's Bargain",
        description: "Classic 24-year deal. Fixed damnation, no escape.",

        minigameTheme: {
            attackClass: 'chain',
            color: '#8B0000'
        },

        generateBaseOffer: function(desire) {
            return {
                gain: `24 years of ${desire.label.toLowerCase()}`,
                cost: 'Your soul, damned to hell for eternity',
                duration: 24,
                severity: 10,
                damnation: 'absolute'
            };
        },

        modifyOffer: function(offer, hits, round) {
            const newOffer = { ...offer };

            if (hits === 0) {
                // EXCELLENT: Reduce years of servitude, but damnation is fixed
                newOffer.duration = Math.max(18, offer.duration - 2);
                newOffer.cost = `Your soul, damned for eternity (but ${newOffer.duration} years of pleasure first)`;
            } else if (hits <= 2) {
                // GOOD: Slight reduction
                newOffer.duration = Math.max(20, offer.duration - 1);
            } else if (hits > 4) {
                // POOR: Reduce pleasure years, emphasize torment
                newOffer.duration = Math.max(12, offer.duration - 3);
                newOffer.cost = `Your soul, with only ${newOffer.duration} years of joy before eternal damnation`;
            }

            return newOffer;
        },

        generateVignette: function(desire, offer) {
            return `
                <p>For ${offer.duration} years, you possess ${desire.label.toLowerCase()}. The world bends to your will.</p>
                <p>But the clock ticks. Each passing year brings you closer to the inevitable.</p>
                <p>When your time expires, devils come to collect. You are dragged to hell, screaming.</p>
                <p style="color: #ff0000; text-align: center; margin-top: 1rem;">
                    There is no reprieve. No redemption. Only damnation everlasting.
                </p>
            `;
        }
    },

    // ========================================================================
    // GOETHE'S FAUST PART I (1808)
    // Endless striving. Moral ambiguity. Collateral damage. Redemption possible.
    // ========================================================================
    goethe: {
        name: "Goethe's Striving",
        description: "Long-term moral ambiguity. Collateral damage, but redemption possible.",

        minigameTheme: {
            attackClass: 'shadow',
            color: '#444444'
        },

        generateBaseOffer: function(desire) {
            return {
                gain: `Endless pursuit of ${desire.label.toLowerCase()}`,
                cost: 'Those closest to you will suffer. Your soul hangs in balance.',
                duration: 'indefinite',
                severity: 7,
                collateral: 'high'
            };
        },

        modifyOffer: function(offer, hits, round) {
            const newOffer = { ...offer };

            if (hits === 0) {
                // EXCELLENT: Reduce collateral damage
                newOffer.cost = 'Minor inconvenience to others. Your soul may yet be saved through striving.';
                newOffer.severity = Math.max(4, offer.severity - 1);
            } else if (hits <= 2) {
                // GOOD: Moderate damage
                newOffer.cost = 'Some harm to loved ones. Redemption remains possible if you never stop striving.';
                newOffer.severity = Math.max(5, offer.severity - 0.5);
            } else if (hits > 4) {
                // POOR: Catastrophic collateral
                newOffer.cost = 'Innocents destroyed in your wake. Redemption grows distant but not impossible.';
                newOffer.severity = Math.min(9, offer.severity + 1);
            }

            return newOffer;
        },

        generateVignette: function(desire, offer) {
            const severity = offer.severity;

            if (severity <= 5) {
                return `
                    <p>You achieve ${desire.label.toLowerCase()}, but the price is subtle.</p>
                    <p>Friends drift away. Opportunities close for others. You barely notice.</p>
                    <p>Yet you keep striving, keep moving forward. In this, there is grace.</p>
                    <p style="color: #88ff88; text-align: center; margin-top: 1rem;">
                        Your soul is not yet lost. Redemption waits for those who never cease their striving.
                    </p>
                `;
            } else if (severity <= 7) {
                return `
                    <p>You gain ${desire.label.toLowerCase()}, but someone you love pays the cost.</p>
                    <p>A friend's dream is crushed. A family member suffers. You tell yourself it's worth it.</p>
                    <p>You continue to strive, hoping that action alone will redeem you.</p>
                    <p style="color: #ffff00; text-align: center; margin-top: 1rem;">
                        Your soul hangs in the balance. Only eternal striving can save you now.
                    </p>
                `;
            } else {
                return `
                    <p>You obtain ${desire.label.toLowerCase()}, but innocents are destroyed.</p>
                    <p>Those who trusted you are ruined. Those who loved you are broken.</p>
                    <p>Yet you press onward, believing that ceaseless striving might still bring salvation.</p>
                    <p style="color: #ff8800; text-align: center; margin-top: 1rem;">
                        Redemption is distant, but Goethe suggests: so long as man strives, he errs—and may yet be saved.
                    </p>
                `;
            }
        }
    },

    // ========================================================================
    // MURNAU'S FAUST (1926)
    // Immediate relief from plague/suffering. World literally darkens. Shadow deepens.
    // ========================================================================
    murnau: {
        name: "Murnau's Shadow",
        description: "Immediate relief from suffering, but the world darkens with each deal.",

        minigameTheme: {
            attackClass: 'shadow',
            color: '#222222'
        },

        generateBaseOffer: function(desire) {
            return {
                gain: `Instant achievement of ${desire.label.toLowerCase()}`,
                cost: 'The world darkens. Light fades from your life. Plague spreads in your wake.',
                duration: 'immediate',
                severity: 8,
                darkness: 'moderate'
            };
        },

        modifyOffer: function(offer, hits, round) {
            const newOffer = { ...offer };

            if (hits === 0) {
                // EXCELLENT: Less darkness
                newOffer.cost = 'The world dims slightly. A tolerable shadow falls over your days.';
                newOffer.darkness = 'minor';
            } else if (hits <= 2) {
                // GOOD: Moderate darkness
                newOffer.cost = 'Shadows lengthen. Joy becomes harder to find.';
            } else if (hits > 4) {
                // POOR: Oppressive darkness
                newOffer.cost = 'Darkness engulfs you. Everything you touch withers. Others flee your presence.';
                newOffer.darkness = 'total';
            }

            return newOffer;
        },

        generateVignette: function(desire, offer) {
            const darkness = offer.darkness;

            if (darkness === 'minor') {
                return `
                    <p>You receive ${desire.label.toLowerCase()} instantly. The relief is immediate.</p>
                    <p>But the world seems a bit grayer now. Colors are less vibrant. Laughter sounds hollow.</p>
                    <p>You live under a thin veil of shadow, tolerable but ever-present.</p>
                    <p style="color: #888888; text-align: center; margin-top: 1rem;">
                        The plague has passed, but the light never fully returns.
                    </p>
                `;
            } else if (darkness === 'moderate') {
                return `
                    <p>${desire.label} is yours, granted in an instant. The suffering ends.</p>
                    <p>But shadows creep into every corner of your life. The sun seems dimmer. Nights stretch longer.</p>
                    <p>You walk through a world that grows darker with each passing day.</p>
                    <p style="color: #666666; text-align: center; margin-top: 1rem;">
                        The plague is gone, but darkness has taken its place.
                    </p>
                `;
            } else {
                return `
                    <p>You gain ${desire.label.toLowerCase()} immediately, but at catastrophic cost.</p>
                    <p>Darkness engulfs everything. Light dies wherever you walk. Others sicken in your presence.</p>
                    <p>You are a walking plague, a shadow that devours joy.</p>
                    <p style="color: #000000; background: #330000; padding: 0.5rem; text-align: center; margin-top: 1rem;">
                        You have become the very plague you sought to escape.
                    </p>
                `;
            }
        }
    },

    // ========================================================================
    // FELIX FAUST (DC Comics)
    // Magical power. Reality glitches. Unintended collateral. Addiction to next spell.
    // ========================================================================
    felix: {
        name: "Felix's Gambit",
        description: "Supernatural success, but reality destabilizes. Magic has consequences.",

        minigameTheme: {
            attackClass: 'sigil',
            color: '#ff00ff'
        },

        generateBaseOffer: function(desire) {
            return {
                gain: `Supernatural aid to achieve ${desire.label.toLowerCase()}`,
                cost: 'Reality glitches around you. Magic warps probability. Unintended consequences cascade.',
                duration: 'until achieved',
                severity: 6,
                chaos: 'moderate'
            };
        },

        modifyOffer: function(offer, hits, round) {
            const newOffer = { ...offer };

            if (hits === 0) {
                // EXCELLENT: Controlled magic
                newOffer.cost = 'Minor reality fluctuations. Controllable side effects.';
                newOffer.chaos = 'low';
            } else if (hits <= 2) {
                // GOOD: Manageable chaos
                newOffer.cost = 'Probability bends. Small glitches in reality. Mostly containable.';
            } else if (hits > 4) {
                // POOR: Reality breakdown
                newOffer.cost = 'Reality fractures. Cities glitch. Friends erased from existence. Chaos spreads exponentially.';
                newOffer.chaos = 'catastrophic';
            }

            return newOffer;
        },

        generateVignette: function(desire, offer) {
            const chaos = offer.chaos;

            if (chaos === 'low') {
                return `
                    <p>Magic grants you ${desire.label.toLowerCase()}. The spell is nearly perfect.</p>
                    <p>Occasionally, small things go wrong: a stranger forgets your name, a text message never sends.</p>
                    <p>These are acceptable prices for supernatural success.</p>
                    <p style="color: #ff88ff; text-align: center; margin-top: 1rem;">
                        You've controlled the magic. For now.
                    </p>
                `;
            } else if (chaos === 'moderate') {
                return `
                    <p>Supernatural forces deliver ${desire.label.toLowerCase()}. Reality bends to accommodate.</p>
                    <p>But probability warps around you. Coincidences pile up. People remember things that never happened.</p>
                    <p>You're addicted to the magic now. You'll need it again. And again.</p>
                    <p style="color: #ff00ff; text-align: center; margin-top: 1rem;">
                        Felix Faust warns: every spell has a price, and the bill compounds.
                    </p>
                `;
            } else {
                return `
                    <p>Magic grants ${desire.label.toLowerCase()}, but reality collapses in your wake.</p>
                    <p>Friends cease to exist. Buildings flicker between dimensions. Entire city blocks glitch out of reality.</p>
                    <p>You've become a walking paradox, a source of chaos that spreads exponentially.</p>
                    <p style="color: #ff0000; text-align: center; margin-top: 1rem;">
                        The multiverse itself recoils from your presence. You've broken too many laws.
                    </p>
                `;
            }
        }
    },

    // ========================================================================
    // THE DEVIL WENT DOWN TO GEORGIA (Charlie Daniels Band, 1979)
    // Pure skill contest. Win = keep soul + prize. Lose = forfeit everything.
    // ========================================================================
    georgia: {
        name: "Georgia's Wager",
        description: "A pure test of skill. Win, keep your soul and prize. Lose, forfeit everything.",

        minigameTheme: {
            attackClass: 'note',
            color: '#ffaa00'
        },

        generateBaseOffer: function(desire) {
            return {
                gain: `${desire.label} + your soul intact`,
                cost: 'Nothing—IF you win the trial. Everything—if you lose.',
                duration: 'one contest',
                severity: 0, // Starts at 0 risk if you're skilled
                skillBased: true
            };
        },

        modifyOffer: function(offer, hits, round) {
            const newOffer = { ...offer };

            if (hits === 0) {
                // EXCELLENT: You're clearly outperforming
                newOffer.gain = `${newOffer.gain} + bragging rights + the Devil's grudging respect`;
                newOffer.cost = 'Nothing. You\'re too skilled to lose.';
            } else if (hits <= 2) {
                // GOOD: Competitive
                newOffer.cost = 'Your pride if you lose, but you\'re holding your own.';
            } else if (hits > 4) {
                // POOR: You're losing
                newOffer.cost = 'Your soul, your goal, and your dignity. The Devil is winning.';
                newOffer.severity = 10;
            }

            return newOffer;
        },

        generateVignette: function(desire, offer) {
            const severity = offer.severity;

            if (severity === 0) {
                return `
                    <p>You face the Devil in a contest of skill. The trial is fierce, but you prevail.</p>
                    <p>You gain ${desire.label.toLowerCase()} through your own merit. No soul surrendered.</p>
                    <p>The Devil scowls but honors the wager. You've earned his grudging respect.</p>
                    <p style="color: #ffaa00; text-align: center; margin-top: 1rem;">
                        "Boy, you're good, but you ain't better than me." — But today, you were.
                    </p>
                `;
            } else if (severity <= 5) {
                return `
                    <p>The contest is close. You give it everything, but it's not quite enough.</p>
                    <p>The Devil grins. "${desire.label}? Not today, friend."</p>
                    <p>You walk away with your soul intact but your pride bruised. The goal remains out of reach.</p>
                    <p style="color: #ff8800; text-align: center; margin-top: 1rem;">
                        At least you didn't sign anything. Try again when you're better.
                    </p>
                `;
            } else {
                return `
                    <p>You face the Devil and lose spectacularly. There's no contest.</p>
                    <p>He takes ${desire.label.toLowerCase()} and your soul. You wagered everything and lost.</p>
                    <p>The Devil's fiddle screams in triumph as you're dragged below.</p>
                    <p style="color: #ff0000; text-align: center; margin-top: 1rem;">
                        "I done told you once, you son of a gun, I'm the best that's ever been."
                    </p>
                `;
            }
        }
    }
};
