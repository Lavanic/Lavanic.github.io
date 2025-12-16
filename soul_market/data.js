/* Faustian Exchange Terminal - Data */

// ============================================================================
// DESIRES
// ============================================================================

const DESIRES = [
    { id: 'gpa', label: '4.0 GPA next semester', archetype: 'KNOWLEDGE' },
    { id: 'internship', label: 'Internship at Google', archetype: 'POWER' },
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
        name: "Marlowe's Offer",
        description: "Classic 24-year deal. Fixed damnation, no escape.",

        minigameTheme: {
            attackClass: 'chain',
            color: '#8B0000',
            emoji: '⛓️'
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
        name: "Goethe's Offer",
        description: "Get your desire, but 1 loved one quietly pays the price.",

        minigameTheme: {
            attackClass: 'shadow',
            color: '#444444',
            emoji: '💔'
        },

        generateBaseOffer: function(desire) {
            return {
                gain: desire.label,
                lovedOnesHurt: 1,
                cost: '1 loved one quietly pays the price.',
                redemptionPossible: true
            };
        },

        modifyOffer: function(offer, hits, round) {
            const newOffer = { ...offer };

            if (hits === 0) {
                // EXCELLENT: Reduce collateral damage
                newOffer.lovedOnesHurt = Math.max(0, offer.lovedOnesHurt - 1);
                if (newOffer.lovedOnesHurt === 0) {
                    newOffer.cost = 'Minor inconvenience to others. Your soul may yet be saved through striving.';
                } else {
                    newOffer.cost = `${newOffer.lovedOnesHurt} loved one suffers quietly for your ambition.`;
                }
            } else if (hits <= 2) {
                // GOOD: Keep current level
                newOffer.cost = `${newOffer.lovedOnesHurt} loved one pays the cost for your desire.`;
            } else if (hits > 4) {
                // POOR: Increase collateral
                newOffer.lovedOnesHurt = offer.lovedOnesHurt + 2;
                const plural = newOffer.lovedOnesHurt > 1 ? 'loved ones are' : 'loved one is';
                newOffer.cost = `${newOffer.lovedOnesHurt} ${plural} destroyed in your wake.`;
            }

            return newOffer;
        },

        generateVignette: function(desire, offer) {
            const lovedOnesHurt = offer.lovedOnesHurt;

            if (lovedOnesHurt === 0) {
                return `
                    <p>You achieve ${desire.label.toLowerCase()}, but the price is subtle.</p>
                    <p>Friends drift away. Opportunities close for others. You barely notice.</p>
                    <p>Yet you keep striving, keep moving forward. In this, there is grace.</p>
                    <p style="color: #88ff88; text-align: center; margin-top: 1rem;">
                        Your soul is not yet lost. Redemption waits for those who never cease their striving.
                    </p>
                `;
            } else if (lovedOnesHurt <= 2) {
                const plural = lovedOnesHurt > 1 ? 'people you love pay' : 'person you love pays';
                return `
                    <p>You gain ${desire.label.toLowerCase()}, but ${lovedOnesHurt} ${plural} the cost.</p>
                    <p>A friend's dream is crushed. A family member suffers. You tell yourself it's worth it.</p>
                    <p>You continue to strive, hoping that action alone will redeem you.</p>
                    <p style="color: #ffff00; text-align: center; margin-top: 1rem;">
                        Your soul hangs in the balance. Only eternal striving can save you now.
                    </p>
                `;
            } else {
                return `
                    <p>You obtain ${desire.label.toLowerCase()}, but ${lovedOnesHurt} loved ones are destroyed.</p>
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
    // Immediate relief from plague/suffering. Strangers suffer instead.
    // ========================================================================
    murnau: {
        name: "Murnau's Offer",
        description: "Get your desire, but 1,000 strangers fall into sickness and despair.",

        minigameTheme: {
            attackClass: 'shadow',
            color: '#222222',
            emoji: '☠️'
        },

        generateBaseOffer: function(desire) {
            return {
                gain: desire.label,
                livesLost: 1000,
                cost: '1,000 lives are darkened by plague and misfortune.'
            };
        },

        modifyOffer: function(offer, hits, round) {
            const newOffer = { ...offer };

            if (hits === 0) {
                // EXCELLENT: Decrease lives lost
                newOffer.livesLost = Math.max(100, offer.livesLost - 300);
            } else if (hits > 4) {
                // POOR: Increase lives lost
                newOffer.livesLost = offer.livesLost + 1000;
            }

            newOffer.cost = `${newOffer.livesLost.toLocaleString()} strangers suffer so your wish can stand.`;

            return newOffer;
        },

        generateVignette: function(desire, offer) {
            const livesLost = offer.livesLost;

            if (livesLost <= 200) {
                return `
                    <p>You receive ${desire.label.toLowerCase()} instantly. The relief is immediate.</p>
                    <p>Far away, ${livesLost.toLocaleString()} strangers fall ill. You'll never see them, never know their names.</p>
                    <p>Your world stays bright while theirs darkens. The plague has been transferred.</p>
                    <p style="color: #888888; text-align: center; margin-top: 1rem;">
                        Out of sight, out of mind. They suffer so you don't have to.
                    </p>
                `;
            } else if (livesLost <= 1500) {
                return `
                    <p>${desire.label} is yours, granted in an instant. Your suffering ends.</p>
                    <p>But ${livesLost.toLocaleString()} distant strangers collapse into sickness and despair.</p>
                    <p>You walk through sunlight while their world grows darker with plague.</p>
                    <p style="color: #666666; text-align: center; margin-top: 1rem;">
                        The suffering was redistributed. You are saved. They are not.
                    </p>
                `;
            } else {
                return `
                    <p>You gain ${desire.label.toLowerCase()} immediately, but at catastrophic human cost.</p>
                    <p>${livesLost.toLocaleString()} people—entire neighborhoods, whole towns—fall into plague and misery.</p>
                    <p>Your world remains pristine while thousands suffer unseen in the distance.</p>
                    <p style="color: #000000; background: #330000; padding: 0.5rem; text-align: center; margin-top: 1rem;">
                        You have become the plague itself, spreading misery to spare yourself.
                    </p>
                `;
            }
        }
    },

    // ========================================================================
    // FELIX FAUST (DC Comics)
    // Dark magic power. Your body begins to rot.
    // ========================================================================
    felix: {
        name: "Felix's Offer",
        description: "Get your desire through dark magic, but your body begins to rot.",

        minigameTheme: {
            attackClass: 'sigil',
            color: '#ff00ff',
            emoji: '✨'
        },

        generateBaseOffer: function(desire) {
            return {
                gain: `${desire.label} powered by forbidden magic`,
                rotLevel: 1,
                cost: 'Your skin goes pale and your teeth begin to rot.'
            };
        },

        modifyOffer: function(offer, hits, round) {
            const newOffer = { ...offer };

            if (hits === 0) {
                // EXCELLENT: Reduce rot
                newOffer.rotLevel = Math.max(0, offer.rotLevel - 1);
            } else if (hits > 4) {
                // POOR: Increase rot
                newOffer.rotLevel = offer.rotLevel + 1;
            } else {
                newOffer.rotLevel = offer.rotLevel;
            }

            // Map rotLevel to description
            const rotDescriptions = {
                0: 'You look almost normal, but something feels wrong under the skin.',
                1: 'Your face grows gaunt. Your teeth yellow and chip.',
                2: 'Your skin loses all color. Dark circles sink around your eyes.',
                3: 'Patches of skin crack and flake. You look half-dead.',
                4: 'Your body is ghoulish and emaciated. You resemble a walking corpse.'
            };

            newOffer.cost = rotDescriptions[Math.min(newOffer.rotLevel, 4)] || rotDescriptions[4];

            return newOffer;
        },

        generateVignette: function(desire, offer) {
            const rotLevel = offer.rotLevel;

            if (rotLevel === 0) {
                return `
                    <p>Dark magic grants you ${desire.label.toLowerCase()}. The spell is nearly clean.</p>
                    <p>You look almost normal in the mirror, though something feels wrong beneath your skin.</p>
                    <p>The price was paid, but barely visible. You got away with it. Almost.</p>
                    <p style="color: #ff88ff; text-align: center; margin-top: 1rem;">
                        The rot is minimal. You can still pass for human.
                    </p>
                `;
            } else if (rotLevel === 1) {
                return `
                    <p>Forbidden magic delivers ${desire.label.toLowerCase()}. The power courses through you.</p>
                    <p>But your face grows gaunt. Your teeth yellow and chip when you smile.</p>
                    <p>People notice. They step back when you enter a room.</p>
                    <p style="color: #cc88ff; text-align: center; margin-top: 1rem;">
                        The magic is rotting you from within. Slowly, but undeniably.
                    </p>
                `;
            } else if (rotLevel === 2) {
                return `
                    <p>Dark sorcery grants ${desire.label.toLowerCase()}, but the cost is written on your flesh.</p>
                    <p>Your skin loses all color. Dark circles sink around your eyes like bruises.</p>
                    <p>Children stare. Adults look away. You are becoming something else.</p>
                    <p style="color: #aa66ff; text-align: center; margin-top: 1rem;">
                        The rot spreads. You look like death wearing a human face.
                    </p>
                `;
            } else if (rotLevel === 3) {
                return `
                    <p>Magic grants ${desire.label.toLowerCase()}, but you are decaying visibly.</p>
                    <p>Patches of skin crack and flake away. You look half-dead, a corpse in motion.</p>
                    <p>People flee your presence. Mirrors become unbearable.</p>
                    <p style="color: #8844ff; text-align: center; margin-top: 1rem;">
                        You are rotting alive. The magic is consuming you.
                    </p>
                `;
            } else {
                return `
                    <p>Dark magic delivers ${desire.label.toLowerCase()}, but you are barely human anymore.</p>
                    <p>Your body is ghoulish and emaciated. You resemble a walking corpse, animated by forbidden power.</p>
                    <p>You have your desire, but you've become a monster to obtain it.</p>
                    <p style="color: #ff0000; text-align: center; margin-top: 1rem;">
                        Felix Faust's bargain complete: power granted, humanity forfeit.
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
        name: "Georgia's Offer",
        description: "A pure test of skill. Win, keep your soul and prize. Lose, forfeit everything.",

        minigameTheme: {
            attackClass: 'note',
            color: '#ffaa00',
            emoji: '🎵'
        },

        generateBaseOffer: function(desire) {
            return {
                gain: `${desire.label} + your soul intact`,
                cost: 'Nothing—IF you win the trial. Everything—if you lose.',
                duration: 'one contest',
                totalHits: 0,
                lost: false,
                skillBased: true
            };
        },

        modifyOffer: function(offer, hits, round) {
            const newOffer = { ...offer };
            newOffer.totalHits = (offer.totalHits || 0) + hits;

            // If hit even once, you lose immediately
            if (hits > 0) {
                newOffer.lost = true;
                newOffer.cost = 'Your soul is forfeit. The Devil has won.';
                newOffer.gain = 'Nothing. You lost the wager.';
            } else {
                // Still perfect - enhance the gain
                newOffer.cost = 'Nothing. You\'re outplaying the Devil.';
                if (!newOffer.gain.includes('bragging rights')) {
                    newOffer.gain = `${newOffer.gain} + bragging rights`;
                }
            }

            return newOffer;
        },

        generateVignette: function(desire, offer) {
            const lost = offer.lost;

            if (!lost) {
                return `
                    <p>You face the Devil in a contest of skill. The trial is fierce, but you never falter.</p>
                    <p>You gain ${desire.label.toLowerCase()} through your own merit. No soul surrendered.</p>
                    <p>The Devil scowls but honors the wager. You've earned his grudging respect.</p>
                    <p style="color: #ffaa00; text-align: center; margin-top: 1rem;">
                        "Boy, you're good, but you ain't better than me." — But today, you were.
                    </p>
                `;
            } else {
                return `
                    <p>You face the Devil in a contest of skill, but you stumble. Just once. That's all it takes.</p>
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
