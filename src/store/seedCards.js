// Seed Card System — Pokemon-style cards with stats, rarity, and traits

export const RARITY = {
  common:    { name: 'Common',    color: '#9e9e9e', border: '#bbb',    multiplier: 1.0,  hybridChance: 0.6 },
  rare:      { name: 'Rare',      color: '#2196f3', border: '#42a5f5', multiplier: 1.5,  hybridChance: 0.35 },
  epic:      { name: 'Epic',      color: '#9c27b0', border: '#ba68c8', multiplier: 2.5,  hybridChance: 0.04 },
  legendary: { name: 'Legendary', color: '#ff9800', border: '#ffb74d', multiplier: 5.0,  hybridChance: 0.01 },
}

// Base strains — the 4 original plants become "strains"
export const BASE_STRAINS = {
  tomato:  { name: 'Red Pulse',     element: 'fire',  baseYield: 25, baseGrowth: 30, color: '#e74c3c' },
  corn:    { name: 'Golden Tower',  element: 'earth', baseYield: 40, baseGrowth: 45, color: '#f39c12' },
  carrot:  { name: 'Deep Root',     element: 'earth', baseYield: 12, baseGrowth: 20, color: '#e67e22' },
  lettuce: { name: 'Green Wave',    element: 'water', baseYield: 18, baseGrowth: 25, color: '#27ae60' },
}

// Trait pool for hybrids
export const TRAITS = {
  // Positive
  fastGrow:     { name: 'Crecimiento Rapido', desc: 'Crece 30% mas rapido',     icon: '⚡', effect: { growthMod: 0.7 } },
  highYield:    { name: 'Alto Rendimiento',   desc: '+40% SEED al cosechar',    icon: '💰', effect: { yieldMod: 1.4 } },
  resilient:    { name: 'Resistente',         desc: 'Resiste plagas (50% menos daño)', icon: '🛡️', effect: { pestResist: 0.5 } },
  allWeather:   { name: 'Todoclima',          desc: 'No afectada por el clima',  icon: '🌤️', effect: { weatherImmune: true } },
  doubleHarvest:{ name: 'Doble Cosecha',      desc: '25% chance de 2x cosecha',  icon: '🎰', effect: { doubleChance: 0.25 } },
  glowing:      { name: 'Bioluminiscente',    desc: 'Brilla en la noche (+visual)', icon: '✨', effect: { glow: true } },
  // Negative (keeps balance)
  fragile:      { name: 'Fragil',             desc: 'Recibe 2x daño de plagas',  icon: '💔', effect: { pestResist: 2.0 } },
  slowGrow:     { name: 'Lenta',              desc: 'Crece 50% mas lento',       icon: '🐌', effect: { growthMod: 1.5 } },
}

// Hybrid name generator
const PREFIXES = ['Cyber', 'Neon', 'Shadow', 'Crystal', 'Void', 'Solar', 'Frost', 'Toxic', 'Phantom', 'Quantum', 'Bio', 'Zen']
const SUFFIXES = ['Haze', 'Kush', 'Dream', 'Burst', 'Nova', 'Bloom', 'Spark', 'Venom', 'Mist', 'Core', 'Flux', 'Daze']

let seedCardId = 0

// Generate a seed card
export function generateSeedCard(strainKey, rarity = 'common') {
  const strain = BASE_STRAINS[strainKey]
  const rarityConfig = RARITY[rarity]

  const card = {
    id: ++seedCardId,
    strainKey,
    name: strain.name,
    element: strain.element,
    rarity,
    color: strain.color,
    isHybrid: false,
    traits: [],
    stats: {
      yield: Math.round(strain.baseYield * rarityConfig.multiplier),
      growthTime: Math.round(strain.baseGrowth / rarityConfig.multiplier),
      resilience: rarity === 'legendary' ? 90 : rarity === 'epic' ? 70 : rarity === 'rare' ? 50 : 30,
      potency: Math.round(Math.random() * 30 + rarityConfig.multiplier * 20),
    },
    stakingYield: rarity === 'legendary' ? 0.05 : rarity === 'epic' ? 0.03 : rarity === 'rare' ? 0.01 : 0,
    createdAt: Date.now(),
  }

  return card
}

// Hybridize two seed cards to create a new one
export function hybridize(cardA, cardB) {
  // Determine result rarity
  const rarityRoll = Math.random()
  let newRarity = 'common'
  if (rarityRoll < 0.01) newRarity = 'legendary'
  else if (rarityRoll < 0.05) newRarity = 'epic'
  else if (rarityRoll < 0.25) newRarity = 'rare'

  // Boost rarity chance based on parent rarity
  const parentBoost = (RARITY[cardA.rarity].multiplier + RARITY[cardB.rarity].multiplier) / 10
  if (Math.random() < parentBoost) {
    const upgrades = { common: 'rare', rare: 'epic', epic: 'legendary', legendary: 'legendary' }
    newRarity = upgrades[newRarity]
  }

  const rarityConfig = RARITY[newRarity]

  // Generate hybrid name
  const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)]
  const suffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)]
  const hybridName = `${prefix} ${suffix}`

  // Mix colors
  const mixColor = blendColors(cardA.color, cardB.color)

  // Assign random traits (1-3 based on rarity)
  const traitCount = newRarity === 'legendary' ? 3 : newRarity === 'epic' ? 2 : newRarity === 'rare' ? 2 : 1
  const traitKeys = Object.keys(TRAITS)
  const selectedTraits = []
  const usedKeys = new Set()
  for (let i = 0; i < traitCount; i++) {
    let key
    do {
      key = traitKeys[Math.floor(Math.random() * traitKeys.length)]
    } while (usedKeys.has(key))
    usedKeys.add(key)
    selectedTraits.push(key)
  }

  // Mix stats from parents
  const avgYield = (cardA.stats.yield + cardB.stats.yield) / 2
  const avgGrowth = (cardA.stats.growthTime + cardB.stats.growthTime) / 2
  const avgRes = (cardA.stats.resilience + cardB.stats.resilience) / 2

  const card = {
    id: ++seedCardId,
    strainKey: `hybrid_${cardA.strainKey}_${cardB.strainKey}`,
    name: hybridName,
    element: Math.random() > 0.5 ? cardA.element : cardB.element,
    rarity: newRarity,
    color: mixColor,
    isHybrid: true,
    parentA: cardA.name,
    parentB: cardB.name,
    traits: selectedTraits,
    stats: {
      yield: Math.round(avgYield * rarityConfig.multiplier * (0.8 + Math.random() * 0.4)),
      growthTime: Math.max(8, Math.round(avgGrowth / rarityConfig.multiplier * (0.8 + Math.random() * 0.4))),
      resilience: Math.min(100, Math.round(avgRes * (1 + rarityConfig.multiplier * 0.2))),
      potency: Math.round(Math.random() * 40 + rarityConfig.multiplier * 25),
    },
    stakingYield: newRarity === 'legendary' ? 0.05 : newRarity === 'epic' ? 0.03 : newRarity === 'rare' ? 0.01 : 0,
    createdAt: Date.now(),
  }

  return card
}

// Color blending helper
function blendColors(colorA, colorB) {
  const parseHex = (hex) => {
    const h = hex.replace('#', '')
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
  }
  const [r1, g1, b1] = parseHex(colorA)
  const [r2, g2, b2] = parseHex(colorB)
  const mix = (a, b) => Math.round((a + b) / 2)
  const toHex = (n) => n.toString(16).padStart(2, '0')
  return `#${toHex(mix(r1, r2))}${toHex(mix(g1, g2))}${toHex(mix(b1, b2))}`
}

// Get cost to hybridize based on parent rarities
export function getHybridCost(cardA, cardB) {
  const base = 20
  const mult = (RARITY[cardA.rarity].multiplier + RARITY[cardB.rarity].multiplier) / 2
  return Math.round(base * mult)
}
