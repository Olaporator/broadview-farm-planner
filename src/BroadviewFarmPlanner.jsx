import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";

// ─── Color Palette (Pacific NW feel) ───
const C = {
  bg: "#0f1419", bgCard: "#1a1f28", bgHover: "#242d39",
  border: "#2a3844", borderLight: "#3a4854",
  text: "#e6eef5", textMuted: "#8a9aae", textDim: "#5a6a7e",
  accent: "#5ab4d4", accentDark: "#2a7a9a", accentGlow: "#7ac4e4",
  water: "#4a8ab5", waterDim: "#2a5a7a",
  soil: "#8a6a3a", soilLight: "#a88a5a",
  hugel: "#6a5a3a", raised: "#5a7a3a", raisedBed: "#4a6a4a",
  dehydrator: "#9a7a4a", greenhouse: "#3a7a5a",
  warn: "#d4a44a", danger: "#c45a4a",
  spring: "#6abf4a", summer: "#d4a44a", fall: "#c47a3a", winter: "#5a7aaa",
  low: "#5a8a5a", med: "#b89a3a", high: "#c45a3a",
  infra: "#8a7a5a", land: "#1a2a32",
};

const VB = { w: 700, h: 1000 };

// ─── Area Data ───
const AREAS = [
  {
    id: "h1", name: "H1 — Front Yard Food Forest", acres: 0.04, sqft: 1800,
    desc: "Front yard food forest zone. Aged mulch 3ft high over tree roots. Mix of fruit trees, ground cover, and understory.",
    systems: ["Composting", "Soil Amendment"],
    generalCare: [
      { action: "Mulch", season: "Spring", freq: "Annual", notes: "Refresh 3-4\" aged mulch to suppress weeds and improve soil." },
      { action: "Prune", season: "Late Winter", freq: "Annual", notes: "Light structural pruning on fruit trees and shrubs." },
      { action: "Weed", season: "Spring–Fall", freq: "Monthly", notes: "Hand pull weeds around tree bases." },
      { action: "Water", season: "Summer", freq: "Bi-weekly", notes: "Deep soak during dry spells. Mulch helps retain moisture." },
    ],
  },
  {
    id: "h2", name: "H2 — Shaded Slope", acres: 0.02, sqft: 800,
    desc: "North-facing slope near shed. Heavy shade, 1-4 hrs sun. Shade-tolerant crops and perennials.",
    systems: ["Soil Amendment"],
    generalCare: [
      { action: "Weed", season: "Spring–Fall", freq: "Monthly", notes: "Hand pull carefully—shallow-rooted shade plants." },
      { action: "Mulch", season: "Spring", freq: "Annual", notes: "2-3\" mulch to protect shade-loving plants." },
      { action: "Nutrient", season: "Spring", freq: "Annual", notes: "Top-dress with compost for fertility." },
    ],
  },
  {
    id: "h3", name: "H3 — South Garden", acres: 0.01, sqft: 600,
    desc: "Main vegetable garden. South-facing, 4-6 hrs sun. Raised beds and in-ground plots with tomatoes, squash, herbs.",
    systems: ["Soil Amendment"],
    generalCare: [
      { action: "Sow", season: "Spring", freq: "As scheduled", notes: "Direct sow cool-season crops in March-April." },
      { action: "Water", season: "Summer", freq: "Weekly", notes: "Consistent moisture critical during fruiting." },
      { action: "Nutrient", season: "Spring", freq: "Annual", notes: "Amend raised beds with compost and bone meal." },
      { action: "Harvest", season: "Summer–Fall", freq: "As ready", notes: "Pick tomatoes ripe, squash before frost." },
    ],
  },
  {
    id: "h4", name: "H4 — Upper Beds & Trellis", acres: 0.01, sqft: 500,
    desc: "Raised beds near stairs and deck. Mix of vegetables, berries, herbs, and vine crops on trellis.",
    systems: ["Soil Amendment"],
    generalCare: [
      { action: "Sow", season: "Spring", freq: "As scheduled", notes: "Succession plant leafy greens every 2 weeks." },
      { action: "Water", season: "Summer", freq: "2-3x weekly", notes: "Raised beds dry faster—check soil moisture." },
      { action: "Prune", season: "Summer", freq: "Weekly", notes: "Train vines on trellis; trim excess growth." },
    ],
  },
  {
    id: "h5", name: "H5 — Deck Garden", acres: 0.005, sqft: 200,
    desc: "Container garden on long N-S deck. Sun varies 2-8 hrs depending on position. Herbs, greens, strawberries.",
    systems: ["Container Growing"],
    generalCare: [
      { action: "Water", season: "Summer", freq: "Daily", notes: "Containers dry quickly—water when top inch dry." },
      { action: "Nutrient", season: "Spring–Summer", freq: "Monthly", notes: "Feed with balanced liquid fertilizer monthly." },
      { action: "Harvest", season: "Spring–Fall", freq: "As ready", notes: "Pinch herbs regularly to encourage bushiness." },
    ],
  },
  {
    id: "h6", name: "H6 — Indoor Planters", acres: 0, sqft: 30,
    desc: "Indoor pots and bins. Year-round growing for peppers, citrus, root vegetables.",
    systems: ["Indoor Growing"],
    generalCare: [
      { action: "Water", season: "Year-round", freq: "2-3x weekly", notes: "Keep soil moist but not waterlogged." },
      { action: "Nutrient", season: "Spring–Summer", freq: "Every 2 weeks", notes: "Feed with balanced liquid fertilizer." },
      { action: "Light", season: "Year-round", freq: "Daily", notes: "Ensure 12-14 hrs artificial light daily." },
    ],
  },
];

// ─── Plot Data ───
const PLOTS = [
  { id: "h1a", area: "h1", name: "Mulch Mound & Cherry Tree", type: "Food Forest", sqft: 400, status: "Established", color: C.raised },
  { id: "h1b", area: "h1", name: "Graft Tree & Companions", type: "Food Forest", sqft: 600, status: "Established", color: C.raised },
  { id: "h1c", area: "h1", name: "Douglas Fir & Bay Laurel", type: "Food Forest", sqft: 800, status: "Established", color: C.raised },
  { id: "h2a", area: "h2", name: "Burdock Bed", type: "Perennial Bed", sqft: 100, status: "Active", color: C.raisedBed },
  { id: "h2c", area: "h2", name: "Blackberry & Huckleberry Row", type: "Perennial Bed", sqft: 400, status: "Established", color: C.raisedBed },
  { id: "h3a", area: "h3", name: "#2 Last Ditch Bed (Rhubarb)", type: "In-Ground", sqft: 80, status: "Struggling", color: C.soil },
  { id: "h3b", area: "h3", name: "#3 Hügel Raised Bed (Tomato/Squash/Basil)", type: "Hügelkultur", sqft: 100, status: "Active", color: C.spring },
  { id: "h3c", area: "h3", name: "#8 Sage Bed", type: "Raised Bed", sqft: 60, status: "Underperforming", color: C.spring },
  { id: "h3d", area: "h3", name: "#4 Buckwheat / #7 Beets", type: "In-Ground", sqft: 100, status: "Recovering", color: C.soil },
  { id: "h3e", area: "h3", name: "#1 Live Compost Battery", type: "Compost", sqft: 40, status: "Active", color: C.warn },
  { id: "h4a", area: "h4", name: "Pole Beans (top)", type: "Raised Bed", sqft: 80, status: "Active", color: C.raisedBed },
  { id: "h4b", area: "h4", name: "Raspberry (was mint)", type: "Raised Bed", sqft: 60, status: "Active", color: C.raisedBed },
  { id: "h4c", area: "h4", name: "Bed (lower same side)", type: "Raised Bed", sqft: 60, status: "Active", color: C.raisedBed },
  { id: "h4d", area: "h4", name: "2nd Lane Bed (other side stairs)", type: "Raised Bed", sqft: 50, status: "Active", color: C.raisedBed },
  { id: "h4e", area: "h4", name: "2nd Lane Bed (lower)", type: "Raised Bed", sqft: 50, status: "Active", color: C.raisedBed },
  { id: "h5a", area: "h5", name: "North Deck (Best Sun)", type: "Container", sqft: 80, status: "Active", color: C.dehydrator },
  { id: "h5b", area: "h5", name: "Mid Deck", type: "Container", sqft: 60, status: "Active", color: C.dehydrator },
  { id: "h5c", area: "h5", name: "South Deck (Most Sun)", type: "Container", sqft: 60, status: "Active", color: C.dehydrator },
  { id: "h6a", area: "h6", name: "Bitter Pepper Pot", type: "Indoor", sqft: 5, status: "Active", color: C.greenhouse },
  { id: "h6b", area: "h6", name: "Carrot & Onion Bin", type: "Indoor", sqft: 10, status: "Active", color: C.greenhouse },
  { id: "h6c", area: "h6", name: "Lemon Lime Area", type: "Indoor", sqft: 15, status: "Active", color: C.greenhouse },
];

// ─── SVG Map Layout ───
// Portrait view: Top=Street(east,300ft), Bottom=Food Forest(west,280ft)
// Left=North(H2 shade), Right=South(H4 beds/stairs)
// ViewBox: 700 x 1000
const ML = {
  street: { x: 65, y: 15, w: 575, h: 22 },          // 3rd Ave NW — horizontal at TOP
  h3Bounds: { x: 70, y: 42, w: 450, h: 125 },       // Garden beds (between street and garage)
  garage: { x: 75, y: 175, w: 190, h: 140 },         // Left side below H3
  driveway: { x: 265, y: 145, w: 280, h: 170 },      // L-shape: driveway digs into house rect
  house: { x: 90, y: 280, w: 460, h: 250 },           // MASSIVE — center, L-shape top-right cut
  h6Bounds: { x: 200, y: 535, w: 260, h: 18 },        // Indoor deck plant area
  deck: { x: 140, y: 558, w: 380, h: 18 },            // Horizontal deck below house
  h5Bounds: { x: 145, y: 560, w: 370, h: 14 },        // Containers ON the deck
  // Grape & Gooseberry sit at y~590
  h1Bounds: { x: 65, y: 630, w: 575, h: 120 },        // Food forest — BOTTOM (west, downhill)
  h2Bounds: { x: 15, y: 42, w: 50, h: 490 },          // Shade bed — LEFT (north) strip, flush with house bottom
  h4Bounds: { x: 620, y: 175, w: 55, h: 380 },        // Two lanes — RIGHT (south) strip
  stairs: { x: 640, y: 320, w: 12, h: 100 },           // Stairs between H4 lanes
};

const PLOT_POS = {
  // H1 — Food Forest (bottom, wide area). Douglas fir LEFT edge, Cherry RIGHT edge
  h1a: { x: 500, y: 645, w: 120, h: 90 },           // Cherry Tree (RIGHT/south edge of land)
  h1b: { x: 250, y: 650, w: 120, h: 85 },           // Graft Tree & Companions (center)
  h1c: { x: 80, y: 645, w: 120, h: 90 },            // Douglas Fir & Bay Laurel (LEFT/north edge)

  // H2 — Shade (left strip). h2a=burdock at bottom (flush w house), h2c=blackberry/huckleberry row above
  h2a: { x: 18, y: 420, w: 44, h: 80 },              // Burdock — at bottom, flush with house bottom
  h2c: { x: 18, y: 55, w: 44, h: 350 },              // Blackberry row + huckleberries — runs back fence line

  // H3 — Garden beds between street and garage (numbered areas 1-9)
  h3e: { x: 75, y: 48, w: 60, h: 45 },              // #1 Compost battery (top-left)
  h3a: { x: 75, y: 100, w: 80, h: 35 },             // #2 Last ditch / rhubarb
  h3b: { x: 180, y: 48, w: 100, h: 55 },            // #3 Hügel raised bed
  h3d: { x: 300, y: 55, w: 80, h: 50 },             // #4 Buckwheat + #7 Beets
  h3c: { x: 410, y: 48, w: 80, h: 55 },             // #8 Sage bed + others

  // H4 — Right (south) side. Lane 1 (left of stairs): h4a, h4b, h4c. Lane 2 (right): h4d, h4e
  h4a: { x: 622, y: 180, w: 18, h: 60 },             // Lane 1 top — pole beans
  h4b: { x: 622, y: 250, w: 18, h: 55 },             // Lane 1 mid — raspberry (was mint)
  h4c: { x: 622, y: 440, w: 18, h: 70 },             // Lane 1 bottom
  h4d: { x: 654, y: 180, w: 18, h: 60 },             // Lane 2 top (other side stairs)
  h4e: { x: 654, y: 250, w: 18, h: 55 },             // Lane 2 bottom

  // H5 — Deck containers (horizontal row on deck)
  h5a: { x: 155, y: 561, w: 80, h: 12 },
  h5b: { x: 250, y: 561, w: 80, h: 12 },
  h5c: { x: 345, y: 561, w: 80, h: 12 },

  // H6 — Indoor plant area (between house and deck)
  h6a: { x: 210, y: 537, w: 70, h: 14 },
  h6b: { x: 300, y: 537, w: 70, h: 14 },
  h6c: { x: 390, y: 537, w: 60, h: 14 },
};

const METHODS = {
  h1: [
    { name: "Hügelkultur Planting", system: "Buffer & Mounds", tasks: 12, hours: 16 },
    { name: "Comfrey Chop & Drop", system: "Fertilizer & Soil Amendment", tasks: 6, hours: 8 },
  ],
  h2: [
    { name: "Shade Garden Maintenance", system: "Fertilizer & Soil Amendment", tasks: 8, hours: 10 },
  ],
  h3: [
    { name: "Raised Bed Vegetable Growing", system: "Buffer & Mounds", tasks: 24, hours: 32 },
    { name: "Soil Amendment", system: "Fertilizer & Soil Amendment", tasks: 6, hours: 8 },
  ],
  h4: [
    { name: "Trellis & Berry Cultivation", system: "Buffer & Mounds", tasks: 14, hours: 18 },
  ],
  h5: [
    { name: "Container Growing", system: "Container Growing", tasks: 10, hours: 12 },
  ],
  h6: [
    { name: "Indoor Plant Growing", system: "Indoor Growing", tasks: 8, hours: 10 },
  ],
};

const NUTRIENTS = ["Alfalfa Meal", "Basalt/Lava Rock", "Compost", "Bone Meal", "Seaweed", "Mulch"];
const LEVEL_COLORS = { L: C.low, M: C.med, H: C.high };
const LEVEL_LABELS = { L: "Low", M: "Medium", H: "High" };
const SEASON_COLORS = { Spring: C.spring, Summer: C.summer, Fall: C.fall, Winter: C.winter };
const ACTION_ICONS = {
  Sow: "🌱", Harvest: "🥬", Prune: "✂️", Weed: "🌿",
  Water: "💧", Nutrient: "🧪", Protect: "🛡️", Light: "💡",
  Mulch: "🟫", Compost: "♻️",
};

// ─── Plant Data ───
const PLANTS = [
  { id: "cherry", name: "Cherry Tree", plot: "h1a", type: "Perennial Tree", count: "1 tree",
    maintenance: [
      { season: "Winter", action: "Prune", notes: "Light structural pruning while dormant." },
      { season: "Spring", action: "Protect", notes: "Remove bird netting; apply preventive spray if needed." },
      { season: "Summer", action: "Harvest", notes: "Pick when fully ripe; birds compete for harvest." },
    ]},
  { id: "wood_sorrel", name: "Wood Sorrel", plot: "h1a", type: "Perennial Ground Cover", count: "Ground cover",
    maintenance: [
      { season: "Spring", action: "Harvest", notes: "Young leaves tangy and edible—pinch regularly." },
      { season: "Summer", action: "Harvest", notes: "Continue harvesting for salads and garnish." },
    ]},
  { id: "ferns", name: "Ferns (edible fiddleheads)", plot: "h1a", type: "Perennial", count: "3-5 plants",
    maintenance: [
      { season: "Spring", action: "Harvest", notes: "Harvest fiddleheads when tightly coiled." },
      { season: "Fall", action: "Mulch", notes: "Add 2-3\" mulch around frond base." },
    ]},
  { id: "graft_tree", name: "Graft Tree (cherry/plum/nectarine)", plot: "h1b", type: "Perennial Tree", count: "1 tree",
    maintenance: [
      { season: "Winter", action: "Prune", notes: "Major structural pruning while dormant." },
      { season: "Spring", action: "Prune", notes: "Remove crossing branches; maintain open center." },
      { season: "Summer", action: "Harvest", notes: "Multiple harvests from different grafted varieties." },
    ]},
  { id: "banana", name: "Dwarf Banana Tree", plot: "h1b", type: "Perennial", count: "1 tree",
    maintenance: [
      { season: "Spring", action: "Nutrient", notes: "Heavy feeder—top-dress with compost." },
      { season: "Summer", action: "Water", notes: "Consistent moisture; mulch well." },
      { season: "Fall", action: "Protect", notes: "Wrap trunk before cold weather." },
    ]},
  { id: "comfrey_h1", name: "Comfrey", plot: "h1b", type: "Perennial", count: "2-3 plants",
    maintenance: [
      { season: "Spring", action: "Harvest", notes: "Harvest top 1/3 of plant for compost tea." },
      { season: "Summer", action: "Harvest", notes: "Multiple harvests for chop & drop." },
    ]},
  { id: "lavender", name: "Lavender", plot: "h1b", type: "Perennial Shrub", count: "2 plants",
    maintenance: [
      { season: "Spring", action: "Prune", notes: "Deadhead spent flowers; maintain rounded shape." },
      { season: "Summer", action: "Harvest", notes: "Cut flower spikes for drying." },
    ]},
  { id: "thyme_h1", name: "Thyme", plot: "h1b", type: "Perennial Herb", count: "3 plants",
    maintenance: [
      { season: "Spring", action: "Prune", notes: "Cut back 1/3 to encourage bushiness." },
      { season: "Summer", action: "Harvest", notes: "Pinch tips regularly for culinary use." },
    ]},
  { id: "blueberry", name: "Blueberry", plot: "h1c", type: "Perennial Shrub", count: "1 plant",
    maintenance: [
      { season: "Spring", action: "Prune", notes: "Remove thin/weak canes; maintain vase shape." },
      { season: "Summer", action: "Water", notes: "Consistent moisture; needs acidic soil." },
      { season: "Summer", action: "Harvest", notes: "Pick when fully blue and sweet." },
    ]},
  { id: "goosefoot", name: "Goosefoot", plot: "h1c", type: "Perennial Ground Cover", count: "Ground cover",
    maintenance: [
      { season: "Spring", action: "Harvest", notes: "Young leaves for salads and cooking." },
      { season: "Summer", action: "Weed", notes: "Manage spread—vigorous grower." },
    ]},
  { id: "sorrel", name: "Sorrel", plot: "h1c", type: "Perennial", count: "2-3 plants",
    maintenance: [
      { season: "Spring", action: "Harvest", notes: "Pick outer leaves for soups and salads." },
      { season: "Summer", action: "Harvest", notes: "Harvest before bolting in heat." },
    ]},
  { id: "burdock", name: "Burdock", plot: "h2a", type: "Perennial", count: "5-8 plants",
    maintenance: [
      { season: "Spring", action: "Weed", notes: "Keep weed-free; manage spread carefully." },
      { season: "Fall", action: "Harvest", notes: "Dig roots after first year." },
    ]},
  { id: "rhubarb", name: "Rhubarb", plot: "h3a", type: "Perennial", count: "1-2 clumps",
    maintenance: [
      { season: "Spring", action: "Harvest", notes: "Cut stalks (never leaf blades which are toxic)." },
      { season: "Fall", action: "Mulch", notes: "Top-dress with compost." },
    ]},
  { id: "blackberries", name: "Blackberries", plot: "h2c", type: "Perennial", count: "Row along back left fence line",
    maintenance: [
      { season: "Spring", action: "Prune", notes: "Remove dead canes; tie new growth to support." },
      { season: "Summer", action: "Harvest", notes: "Pick when fully black and soft. Multiple harvests." },
      { season: "Fall", action: "Prune", notes: "Cut spent floricanes to ground after fruiting." },
    ]},
  { id: "red_huckleberry", name: "Red Huckleberry", plot: "h2c", type: "Perennial Shrub", count: "1 plant",
    maintenance: [
      { season: "Spring", action: "Mulch", notes: "Acidic mulch around base; prefers shade." },
      { season: "Summer", action: "Harvest", notes: "Pick berries when fully red." },
    ]},
  { id: "black_huckleberry", name: "Black Huckleberry", plot: "h2c", type: "Perennial Shrub", count: "1 plant",
    maintenance: [
      { season: "Spring", action: "Mulch", notes: "Acidic mulch; partial shade ideal." },
      { season: "Summer", action: "Harvest", notes: "Pick when deep purple-black." },
    ]},
  { id: "chives", name: "Chives", plot: "h3a", type: "Perennial Herb", count: "1 clump",
    maintenance: [
      { season: "Spring", action: "Harvest", notes: "Cut leaves 1\" above ground regularly." },
      { season: "Summer", action: "Harvest", notes: "Pinch flowers for salads or allow to set seed." },
    ]},
  { id: "garlic", name: "Garlic", plot: "h3a", type: "Annual", count: "~20 cloves",
    maintenance: [
      { season: "Fall", action: "Sow", notes: "Plant cloves Oct-Nov, 6\" apart, 2\" deep." },
      { season: "Spring", action: "Nutrient", notes: "Top-dress with compost in early spring." },
      { season: "Spring", action: "Prune", notes: "Remove scapes when they curl (early June)." },
      { season: "Summer", action: "Harvest", notes: "Harvest when lower leaves brown (mid-July)." },
    ]},
  { id: "squash", name: "Winter Squash", plot: "h3b", type: "Annual", count: "3-4 plants",
    maintenance: [
      { season: "Spring", action: "Sow", notes: "Sow seeds after last frost, 4 ft apart." },
      { season: "Summer", action: "Water", notes: "Deep water weekly; mulch heavily." },
      { season: "Fall", action: "Harvest", notes: "Harvest when skin hard; cure 2 weeks." },
    ]},
  { id: "beans", name: "Bush Beans", plot: "h3b", type: "Annual", count: "~40 plants",
    maintenance: [
      { season: "Spring", action: "Sow", notes: "Direct sow after last frost, soil 60°F+." },
      { season: "Summer", action: "Harvest", notes: "Pick every 2-3 days for tender snap beans." },
      { season: "Fall", action: "Harvest", notes: "Leave mature pods to dry for dry beans." },
    ]},
  { id: "tomato_cherry", name: "Cherry Tomato (rotate)", plot: "h3c", type: "Annual", count: "2-3 plants",
    maintenance: [
      { season: "Spring", action: "Sow", notes: "Start indoors Feb-Mar; transplant after frost." },
      { season: "Summer", action: "Prune", notes: "Remove suckers; stake or cage." },
      { season: "Summer", action: "Harvest", notes: "Pick when fully red; produces until frost." },
    ]},
  { id: "tomato_roma", name: "Roma Tomato (rotate)", plot: "h3c", type: "Annual", count: "2-3 plants",
    maintenance: [
      { season: "Spring", action: "Sow", notes: "Start indoors; transplant in May." },
      { season: "Summer", action: "Water", notes: "1-2\" per week; avoid overhead watering." },
      { season: "Summer", action: "Harvest", notes: "Pick for canning when fully mature." },
    ]},
  { id: "basil", name: "Basil (companion)", plot: "h3c", type: "Annual Herb", count: "3-5 plants",
    maintenance: [
      { season: "Summer", action: "Harvest", notes: "Pinch tips regularly to encourage bushiness." },
      { season: "Summer", action: "Protect", notes: "Watch for pests attracted to tomatoes." },
    ]},
  { id: "sage", name: "Sage (2yr established)", plot: "h3c", type: "Perennial Herb", count: "1-2 plants",
    maintenance: [
      { season: "Spring", action: "Prune", notes: "Cut back 1/3 after winter." },
      { season: "Summer", action: "Harvest", notes: "Pinch leaves for culinary use." },
    ]},
  { id: "fig_tree", name: "Fig Tree (#5)", plot: "h3b", type: "Perennial Tree", count: "1 tree (1.5yr)",
    maintenance: [
      { season: "Winter", action: "Protect", notes: "Wrap or mulch heavily for PNW cold snaps." },
      { season: "Spring", action: "Prune", notes: "Light pruning; remove dead wood." },
      { season: "Summer", action: "Water", notes: "Deep soak weekly; figs need consistent moisture." },
      { season: "Fall", action: "Harvest", notes: "Pick figs when soft and drooping." },
    ]},
  { id: "mugwort", name: "Mugwort (unwanted)", plot: "h3d", type: "Perennial Weed", count: "Invasive patch",
    maintenance: [
      { season: "Spring", action: "Weed", notes: "Pull aggressively—sign of compacted/poor soil. Amend with compost." },
      { season: "Summer", action: "Weed", notes: "Continue pulling; smother with cardboard mulch if persistent." },
    ]},
  { id: "beets_h3", name: "Beets (leftover #6/#7)", plot: "h3d", type: "Biennial", count: "Scattered",
    maintenance: [
      { season: "Spring", action: "Harvest", notes: "Pull remaining overwintered beets." },
      { season: "Spring", action: "Sow", notes: "Direct sow new crop after clearing." },
    ]},
  { id: "arugula_h3", name: "Arugula (#9)", plot: "h3b", type: "Annual", count: "Small patch",
    maintenance: [
      { season: "Spring", action: "Sow", notes: "Self-seeded; thin as needed. Bed is shallow—add soil." },
      { season: "Summer", action: "Harvest", notes: "Harvest leaves young; bolts in heat." },
    ]},
  { id: "strawberry_h3", name: "Everbearing Strawberries (#9)", plot: "h3b", type: "Perennial", count: "A few plants",
    maintenance: [
      { season: "Spring", action: "Nutrient", notes: "Top dress with compost. Shallow dirt limits growth—consider deeper bed." },
      { season: "Summer", action: "Water", notes: "Under roof overhang = poor rain exposure. Hand water regularly." },
      { season: "Summer", action: "Harvest", notes: "Pick when fully red; a couple doing decent." },
    ]},
  { id: "volunteer_tomato", name: "Volunteer Tomato (#9)", plot: "h3b", type: "Annual", count: "1 plant",
    maintenance: [
      { season: "Summer", action: "Water", notes: "From previous year dropped seed. Stake if it grows large." },
    ]},
  { id: "thyme_h3", name: "Thyme (surviving)", plot: "h3b", type: "Perennial Herb", count: "1 plant",
    maintenance: [
      { season: "Spring", action: "Prune", notes: "Trim woody growth to encourage fresh shoots." },
    ]},
  { id: "buckwheat", name: "Buckwheat Cover Crop (#4)", plot: "h3d", type: "Annual Cover", count: "Broadcast",
    maintenance: [
      { season: "Spring", action: "Sow", notes: "Reseed for nitrogen fixing. Some regrew from prior year." },
      { season: "Summer", action: "Harvest", notes: "Chop and drop before flowering for green manure." },
    ]},
  { id: "kale", name: "Kale", plot: "h4a", type: "Annual/Biennial", count: "3-4 plants",
    maintenance: [
      { season: "Spring", action: "Sow", notes: "Transplant after last frost." },
      { season: "Summer", action: "Harvest", notes: "Pick lower leaves; leave growing tip." },
      { season: "Fall", action: "Harvest", notes: "Sweeter after frost; lasts into winter." },
    ]},
  { id: "spinach", name: "Spinach", plot: "h4a", type: "Annual", count: "~20 plants",
    maintenance: [
      { season: "Spring", action: "Sow", notes: "Direct sow as soon as soil workable." },
      { season: "Spring", action: "Harvest", notes: "Baby leaves at 3-4 weeks." },
      { season: "Fall", action: "Sow", notes: "Plant 6-8 weeks before first frost." },
    ]},
  { id: "lettuce", name: "Lettuce", plot: "h4a", type: "Annual", count: "~15 plants",
    maintenance: [
      { season: "Spring", action: "Sow", notes: "Direct sow or transplant; succession sow." },
      { season: "Summer", action: "Harvest", notes: "Cut-and-come-again outer leaves." },
      { season: "Fall", action: "Sow", notes: "Fall crop for cool weather." },
    ]},
  { id: "broccoli", name: "Broccoli", plot: "h4a", type: "Annual", count: "2-3 plants",
    maintenance: [
      { season: "Spring", action: "Sow", notes: "Transplant 2-4 weeks before last frost." },
      { season: "Summer", action: "Harvest", notes: "Cut main head; side shoots follow." },
    ]},
  { id: "radish", name: "Radish (rotate)", plot: "h4a", type: "Annual", count: "~20 seeds",
    maintenance: [
      { season: "Spring", action: "Sow", notes: "Direct sow; ready in 3-4 weeks." },
      { season: "Fall", action: "Sow", notes: "Spring and fall crops; skip summer heat." },
    ]},
  { id: "sunchokes", name: "Sunchokes", plot: "h4b", type: "Perennial", count: "8-10 tubers",
    maintenance: [
      { season: "Spring", action: "Nutrient", notes: "Minimal care; grows in poor soil." },
      { season: "Fall", action: "Harvest", notes: "Dig tubers after frost; sweeter then." },
    ]},
  { id: "raspberries", name: "Raspberries", plot: "h4b", type: "Perennial", count: "4-6 canes",
    maintenance: [
      { season: "Winter", action: "Prune", notes: "Cut back dead canes; thin dense growth." },
      { season: "Summer", action: "Harvest", notes: "Pick when fully ripe; soft and sweet." },
    ]},
  { id: "rosemary", name: "Rosemary", plot: "h4b", type: "Perennial Herb", count: "1-2 plants",
    maintenance: [
      { season: "Spring", action: "Prune", notes: "Shape and rejuvenate with light pruning." },
      { season: "Summer", action: "Harvest", notes: "Pinch sprigs for cooking." },
    ]},
  { id: "thyme_h4", name: "Thyme", plot: "h4b", type: "Perennial Herb", count: "2-3 plants",
    maintenance: [
      { season: "Spring", action: "Prune", notes: "Cut back 1/3 to refresh." },
      { season: "Summer", action: "Harvest", notes: "Pinch for culinary use." },
    ]},
  { id: "grapes", name: "Grapes", plot: "h4c", type: "Perennial Vine", count: "2-3 vines",
    maintenance: [
      { season: "Winter", action: "Prune", notes: "Major pruning while dormant; establish structure." },
      { season: "Summer", action: "Prune", notes: "Thin fruit clusters; train vines." },
      { season: "Fall", action: "Harvest", notes: "Pick when sweet; can eat fresh or ferment." },
    ]},
  { id: "kiwi", name: "Kiwi", plot: "h4c", type: "Perennial Vine", count: "2-3 vines",
    maintenance: [
      { season: "Winter", action: "Prune", notes: "Thin vines; maintain structure on trellis." },
      { season: "Fall", action: "Harvest", notes: "Harvest after frost for sweetness." },
    ]},
  { id: "pole_beans", name: "Pole Beans", plot: "h4a", type: "Annual", count: "~20 seeds",
    maintenance: [
      { season: "Spring", action: "Sow", notes: "Sow after last frost; train on trellis." },
      { season: "Summer", action: "Harvest", notes: "Pick every 2-3 days for tender beans." },
    ]},
  { id: "raspberry_h4", name: "Raspberry (replaced mint)", plot: "h4b", type: "Perennial", count: "4-6 canes",
    maintenance: [
      { season: "Spring", action: "Prune", notes: "Cut back hard; manage spread with container." },
      { season: "Summer", action: "Harvest", notes: "Harvest leaves regularly for tea/garnish." },
    ]},
  { id: "lemon_balm", name: "Lemon Balm", plot: "h4d", type: "Perennial Herb", count: "1-2 plants",
    maintenance: [
      { season: "Spring", action: "Prune", notes: "Cut back; manage spread." },
      { season: "Summer", action: "Harvest", notes: "Pinch leaves for tea and flavor." },
    ]},
  { id: "strawberry", name: "Everbearing Strawberries", plot: "h4e", type: "Perennial", count: "~15 plants",
    maintenance: [
      { season: "Spring", action: "Nutrient", notes: "Top-dress with compost." },
      { season: "Summer", action: "Harvest", notes: "Produces multiple flushes; pick regularly." },
      { season: "Fall", action: "Harvest", notes: "Final harvest before frost." },
    ]},
  { id: "deck_herbs", name: "Mixed Herbs (deck)", plot: "h5a", type: "Annual/Perennial Herb", count: "Multiple",
    maintenance: [
      { season: "Spring", action: "Sow", notes: "Plant basil, oregano, parsley, dill." },
      { season: "Summer", action: "Harvest", notes: "Pinch regularly for cooking." },
      { season: "Fall", action: "Protect", notes: "Move tender herbs indoors before frost." },
    ]},
  { id: "deck_greens", name: "Salad Greens (deck)", plot: "h5b", type: "Annual", count: "~10 containers",
    maintenance: [
      { season: "Spring", action: "Sow", notes: "Succession plant lettuce, arugula, mesclun." },
      { season: "Summer", action: "Harvest", notes: "Cut-and-come-again; re-sow every 2 weeks." },
    ]},
  { id: "pepper_indoor", name: "Bitter Pepper (indoor)", plot: "h6a", type: "Annual", count: "1-2 plants",
    maintenance: [
      { season: "Winter", action: "Sow", notes: "Start seeds indoors in January." },
      { season: "Spring", action: "Nutrient", notes: "Fertilize bi-weekly during growth." },
      { season: "Summer", action: "Harvest", notes: "Pick peppers for drying." },
    ]},
  { id: "citrus_lemon", name: "Lemon (indoor)", plot: "h6c", type: "Perennial Tree", count: "1 tree",
    maintenance: [
      { season: "Year-round", action: "Water", notes: "Keep soil evenly moist; well-drained." },
      { season: "Spring", action: "Nutrient", notes: "Feed monthly with citrus fertilizer." },
      { season: "Summer", action: "Harvest", notes: "Pick lemons as needed year-round." },
    ]},
  { id: "citrus_lime", name: "Lime (indoor)", plot: "h6c", type: "Perennial Tree", count: "1 tree",
    maintenance: [
      { season: "Year-round", action: "Water", notes: "Consistent moisture; avoid waterlogging." },
      { season: "Spring", action: "Nutrient", notes: "Feed monthly with citrus fertilizer." },
      { season: "Summer", action: "Harvest", notes: "Pick limes as they mature." },
    ]},
];

// ─── Helper Components ───
const Badge = ({ children, color = C.accent, small = false }) => (
  <span style={{ display: "inline-block", padding: small ? "1px 6px" : "2px 10px", borderRadius: 12,
    fontSize: small ? 10 : 11, fontWeight: 600, background: color + "22", color,
    border: `1px solid ${color}44`, letterSpacing: 0.3 }}>{children}</span>
);

const SeasonTag = ({ season }) => {
  const s = season.split("–")[0].split("/")[0].trim();
  return <Badge color={SEASON_COLORS[s] || C.textMuted} small>{season}</Badge>;
};

const PlantCard = ({ plant, onSelect }) => (
  <div onClick={() => onSelect(plant)} style={{ padding: "10px 12px", background: C.bgCard,
    border: `1px solid ${C.border}`, borderRadius: 8, cursor: "pointer", marginBottom: 6 }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.background = C.bgHover; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.bgCard; }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontWeight: 600, color: C.text, fontSize: 13 }}>{plant.name}</span>
      <Badge color={plant.type.includes("Perennial") ? C.spring : C.summer} small>{plant.type}</Badge>
    </div>
    {plant.count && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{plant.count}{plant.spacing ? ` · ${plant.spacing}` : ""}</div>}
  </div>
);

const MaintenanceMatrix = ({ plant }) => {
  const seasons = ["Spring", "Summer", "Fall", "Winter"];
  const actions = [...new Set(plant.maintenance.map(m => m.action))];
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>Maintenance Calendar</div>
      <div style={{ display: "grid", gridTemplateColumns: `90px repeat(${seasons.length}, 1fr)`, gap: 2 }}>
        <div />
        {seasons.map(s => (
          <div key={s} style={{ padding: "4px 6px", textAlign: "center", fontSize: 10, fontWeight: 700,
            color: SEASON_COLORS[s], background: SEASON_COLORS[s] + "15", borderRadius: 4 }}>{s}</div>
        ))}
        {actions.map(action => (
          <React.Fragment key={action}>
            <div style={{ padding: "6px 4px", fontSize: 11, fontWeight: 600, color: C.text, display: "flex", alignItems: "center", gap: 4 }}>
              <span>{ACTION_ICONS[action] || "·"}</span>{action}
            </div>
            {seasons.map(season => {
              const match = plant.maintenance.find(m => m.season.includes(season) && m.action === action);
              return (
                <div key={season} style={{ padding: 4, fontSize: 10, color: match ? C.text : C.textDim + "44",
                  background: match ? SEASON_COLORS[season] + "12" : "transparent", borderRadius: 4, lineHeight: 1.35,
                  border: match ? `1px solid ${SEASON_COLORS[season]}22` : "1px solid transparent" }}
                  title={match?.notes || ""}>
                  {match ? <span style={{ cursor: "help" }}>{match.notes.length > 60 ? match.notes.slice(0, 57) + "..." : match.notes}</span> : "—"}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// ─── Main App ───
export default function BroadviewFarmPlanner() {
  const [vb, setVb] = useState({ x: 0, y: 0, w: VB.w, h: VB.h });
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [view, setView] = useState("map");
  const [bottomTab, setBottomTab] = useState("areas");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ─── Airtable Live Data ───
  const [atTasks, setAtTasks] = useState([]);
  const [atMethods, setAtMethods] = useState([]);
  const [atAreas, setAtAreas] = useState([]);
  const [atPlots, setAtPlots] = useState([]);
  const [atPlantsDB, setAtPlants] = useState([]);
  const AT_TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN;
  const [atLoading, setAtLoading] = useState(false);
  const [atError, setAtError] = useState(null);

  const fetchAirtable = useCallback(async () => {
    setAtLoading(true); setAtError(null);
    const headers = { Authorization: `Bearer ${AT_TOKEN}`, "Content-Type": "application/json" };
    const base = "appQbfU2XIx0UEYIh";
    try {
      const fetchAll = async (tableId, filterFormula) => {
        let all = [], offset = null;
        do {
          let url = `https://api.airtable.com/v0/${base}/${tableId}?pageSize=100${offset ? `&offset=${offset}` : ""}`;
          if (filterFormula) url += `&filterByFormula=${encodeURIComponent(filterFormula)}`;
          const res = await fetch(url, { headers });
          if (!res.ok) throw new Error(`Airtable ${res.status}: ${res.statusText}`);
          const data = await res.json();
          all = all.concat(data.records);
          offset = data.offset;
        } while (offset);
        return all;
      };
      const [tasks, methods, areas, plots, plants] = await Promise.all([
        fetchAll("tblwxecwIEV6Ehu6F", 'FIND("rec2u6894MxSXKqlk",ARRAYJOIN({Project}))'),
        fetchAll("tblqZKea6J4Thvgtz"),
        fetchAll("tbl7ztPLlm7wevuh9"),
        fetchAll("tblrpebzWu7z2uwaX"),
        fetchAll("tblKRilYEwCOGAfPx"),
      ]);
      setAtTasks(tasks); setAtMethods(methods); setAtAreas(areas); setAtPlots(plots); setAtPlants(plants);
    } catch (err) { setAtError(err.message); }
    setAtLoading(false);
  }, []);

  useEffect(() => { fetchAirtable(); }, [fetchAirtable]);

  const updateTaskStatus = useCallback(async (taskId, newStatus) => {
    const headers = { Authorization: `Bearer ${AT_TOKEN}`, "Content-Type": "application/json" };
    try {
      await fetch(`https://api.airtable.com/v0/appQbfU2XIx0UEYIh/tblwxecwIEV6Ehu6F/${taskId}`, {
        method: "PATCH", headers, body: JSON.stringify({ fields: { Status: newStatus } }),
      });
      setAtTasks(prev => prev.map(t => t.id === taskId ? { ...t, fields: { ...t.fields, Status: newStatus } } : t));
    } catch (err) { console.error("Failed to update status:", err); }
  }, []);

  const resolveTaskPlants = useCallback((task) => {
    const plantLinks = task.fields["Plant(s)"];
    if (!Array.isArray(plantLinks) || plantLinks.length === 0) return [];
    return plantLinks.map(id => {
      const rec = atPlantsDB.find(p => p.id === id);
      return rec ? { id, name: rec.fields.Name || rec.fields["Plant Name"] || id, type: rec.fields.Type || rec.fields["Plant Type"] || "" } : { id, name: id, type: "" };
    });
  }, [atPlantsDB]);

  const resolveTaskDeps = useCallback((task) => {
    const depLinks = task.fields["Depends On"];
    if (!Array.isArray(depLinks) || depLinks.length === 0) return [];
    return depLinks.map(id => {
      const dep = atTasks.find(t => t.id === id);
      return dep ? { id: dep.id, name: dep.fields.Name || "Untitled", status: dep.fields.Status || "—", incomplete: dep.fields.Status !== "Complete" } : { id, name: id, status: "?", incomplete: true };
    });
  }, [atTasks]);

  const resolveTaskArea = useCallback((task) => {
    const areaLinks = task.fields["Area (Link)"];
    if (Array.isArray(areaLinks) && areaLinks.length > 0) {
      const a = atAreas.find(ar => ar.id === areaLinks[0]);
      if (a) return a.fields.Name || a.id;
    }
    const plotLinks = task.fields["Plot(s)"];
    if (Array.isArray(plotLinks) && plotLinks.length > 0) {
      const p = atPlots.find(pl => pl.id === plotLinks[0]);
      if (p) {
        const plotArea = p.fields.Area;
        if (Array.isArray(plotArea) && plotArea.length > 0) {
          const a = atAreas.find(ar => ar.id === plotArea[0]);
          if (a) return a.fields.Name || a.id;
        }
      }
    }
    const name = task.fields.Name || "";
    if (name.includes("[")) return name.match(/\[([^\]]+)\]/)?.[1] || "General";
    return "General";
  }, [atAreas, atPlots]);

  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const didPan = useRef(false);

  const area = useMemo(() => AREAS.find(a => a.id === selectedArea), [selectedArea]);
  const plot = useMemo(() => PLOTS.find(p => p.id === selectedPlot), [selectedPlot]);
  const plotPlants = useMemo(() => PLANTS.filter(p => p.plot === selectedPlot), [selectedPlot]);
  const areaPlots = useMemo(() => PLOTS.filter(p => p.area === selectedArea), [selectedArea]);
  const areaMethods = useMemo(() => METHODS[selectedArea] || [], [selectedArea]);
  const zoomLevel = useMemo(() => Math.round(VB.w / vb.w * 10) / 10, [vb.w]);

  // ─── Zoom (scroll wheel) ───
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const handleWheel = (e) => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 1.1 : 0.9;
      const rect = svg.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / rect.width;
      const my = (e.clientY - rect.top) / rect.height;
      setVb(prev => {
        const nw = Math.min(VB.w * 1.5, Math.max(120, prev.w * factor));
        const nh = nw * VB.h / VB.w;
        return { x: prev.x + (prev.w - nw) * mx, y: prev.y + (prev.h - nh) * my, w: nw, h: nh };
      });
    };
    svg.addEventListener("wheel", handleWheel, { passive: false });
    return () => svg.removeEventListener("wheel", handleWheel);
  }, []);

  // ─── Touch Support ───
  const touchState = useRef({ touches: [], lastDist: 0, lastCenter: { x: 0, y: 0 } });
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const handleTouchStart = (e) => {
      e.preventDefault();
      touchState.current.touches = Array.from(e.touches);
      if (e.touches.length === 1) {
        isPanning.current = true;
        didPan.current = false;
        panStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        isPanning.current = false;
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        touchState.current.lastDist = dist;
        touchState.current.lastCenter = {
          x: (t1.clientX + t2.clientX) / 2,
          y: (t1.clientY + t2.clientY) / 2
        };
      }
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      if (e.touches.length === 1 && isPanning.current) {
        const dx = e.touches[0].clientX - panStart.current.x;
        const dy = e.touches[0].clientY - panStart.current.y;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didPan.current = true;
        panStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        const rect = svg.getBoundingClientRect();
        setVb(prev => ({ ...prev, x: prev.x - dx * (prev.w / rect.width), y: prev.y - dy * (prev.h / rect.height) }));
      } else if (e.touches.length === 2) {
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const newDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const newCenter = { x: (t1.clientX + t2.clientX) / 2, y: (t1.clientY + t2.clientY) / 2 };
        if (touchState.current.lastDist > 0) {
          const factor = newDist / touchState.current.lastDist;
          const rect = svg.getBoundingClientRect();
          const mx = (newCenter.x - rect.left) / rect.width;
          const my = (newCenter.y - rect.top) / rect.height;
          setVb(prev => {
            const nw = Math.min(VB.w * 1.5, Math.max(120, prev.w / factor));
            const nh = nw * VB.h / VB.w;
            return { x: prev.x + (prev.w - nw) * mx, y: prev.y + (prev.h - nh) * my, w: nw, h: nh };
          });
        }
        touchState.current.lastDist = newDist;
        touchState.current.lastCenter = newCenter;
      }
    };

    const handleTouchEnd = (e) => {
      e.preventDefault();
      isPanning.current = false;
      touchState.current = { touches: [], lastDist: 0, lastCenter: { x: 0, y: 0 } };
    };

    svg.addEventListener("touchstart", handleTouchStart, { passive: false });
    svg.addEventListener("touchmove", handleTouchMove, { passive: false });
    svg.addEventListener("touchend", handleTouchEnd, { passive: false });
    return () => {
      svg.removeEventListener("touchstart", handleTouchStart);
      svg.removeEventListener("touchmove", handleTouchMove);
      svg.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  // ─── Pan (drag) ───
  const onMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    isPanning.current = true; didPan.current = false;
    panStart.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.style.cursor = "grabbing";
  }, []);
  const onMouseMove = useCallback((e) => {
    if (!isPanning.current) return;
    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didPan.current = true;
    panStart.current = { x: e.clientX, y: e.clientY };
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    setVb(prev => ({ ...prev, x: prev.x - dx * (prev.w / rect.width), y: prev.y - dy * (prev.h / rect.height) }));
  }, []);
  const onMouseUp = useCallback((e) => {
    isPanning.current = false;
    if (e.currentTarget) e.currentTarget.style.cursor = "grab";
  }, []);

  const onDoubleClick = useCallback((e) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width;
    const my = (e.clientY - rect.top) / rect.height;
    setVb(prev => {
      const nw = Math.max(120, prev.w * 0.5);
      const nh = nw * VB.h / VB.w;
      return { x: prev.x + (prev.w - nw) * mx, y: prev.y + (prev.h - nh) * my, w: nw, h: nh };
    });
  }, []);

  const zoomIn = useCallback(() => setVb(prev => {
    const nw = Math.max(120, prev.w * 0.7); const nh = nw * VB.h / VB.w;
    return { x: prev.x + (prev.w - nw) * 0.5, y: prev.y + (prev.h - nh) * 0.5, w: nw, h: nh };
  }), []);
  const zoomOut = useCallback(() => setVb(prev => {
    const nw = Math.min(VB.w * 1.5, prev.w * 1.4); const nh = nw * VB.h / VB.w;
    return { x: prev.x + (prev.w - nw) * 0.5, y: prev.y + (prev.h - nh) * 0.5, w: nw, h: nh };
  }), []);
  const resetZoom = useCallback(() => setVb({ x: 0, y: 0, w: VB.w, h: VB.h }), []);

  const zoomToRect = useCallback((rect, padding = 30) => {
    const tw = rect.w + padding * 2;
    const th = rect.h + padding * 2;
    const aspect = VB.w / VB.h;
    let fw = tw, fh = th;
    if (tw / th > aspect) fh = tw / aspect; else fw = th * aspect;
    setVb({ x: rect.x - padding - (fw - tw) / 2, y: rect.y - padding - (fh - th) / 2, w: fw, h: fh });
  }, []);

  const handleSelectArea = useCallback((id) => {
    if (didPan.current) return;
    setSelectedArea(id); setSelectedPlot(null); setSelectedPlant(null); setView("area");
  }, []);

  const handleSelectPlot = useCallback((id) => {
    if (didPan.current) return;
    const p = PLOTS.find(pp => pp.id === id);
    if (p) {
      setSelectedArea(p.area); setSelectedPlot(id); setSelectedPlant(null); setView("plot");
    }
  }, []);

  const handleSelectPlant = useCallback((plant) => {
    setSelectedPlant(plant); setView("plant");
  }, []);

  const handleBack = useCallback(() => {
    if (view === "plant") { setSelectedPlant(null); setView("plot"); }
    else if (view === "plot") { setSelectedPlot(null); setView("area"); }
    else if (view === "area") { setSelectedArea(null); setView("map"); resetZoom(); }
  }, [view, resetZoom]);

  const showTooltip = useCallback((e, text) => {
    const c = containerRef.current;
    if (!c) return;
    const cr = c.getBoundingClientRect();
    setTooltip({ text, x: e.clientX - cr.left + 12, y: e.clientY - cr.top - 20 });
  }, []);
  const hideTooltip = useCallback(() => setTooltip(null), []);

  const renderPlot = (plotId, label) => {
    const pos = PLOT_POS[plotId];
    const p = PLOTS.find(pp => pp.id === plotId);
    if (!pos || !p) return null;
    const active = selectedPlot === plotId;
    const isTiny = p.type === "Indoor" || p.type === "Container";
    return (
      <g key={plotId} onClick={e => { e.stopPropagation(); handleSelectPlot(plotId); }}
        style={{ cursor: "pointer" }}
        onMouseEnter={isTiny ? (e) => showTooltip(e, p.name) : undefined}
        onMouseLeave={isTiny ? hideTooltip : undefined}>
        <rect x={pos.x} y={pos.y} width={pos.w} height={pos.h} rx={isTiny ? 2 : 4}
          fill={p.color + (p.status === "Established" || p.status === "Done" ? "55" : "33")}
          stroke={active ? C.accentGlow : p.color} strokeWidth={active ? 2 : 1} />
        {!isTiny && <text x={pos.x + pos.w / 2} y={pos.y + pos.h / 2 + 3} textAnchor="middle"
          fill={C.text} fontSize={pos.w < 100 ? 6.5 : 7.5} fontWeight={600}>{label || p.name}</text>}
        {p.status === "Established" && !isTiny && <text x={pos.x + pos.w - 5} y={pos.y + 9}
          textAnchor="end" fill={C.accent} fontSize={7}>✓</text>}
      </g>
    );
  };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: C.bg, color: C.text, minHeight: "100vh", padding: isMobile ? 8 : 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
        <div>
          <h1 style={{ margin: 0, fontSize: isMobile ? 18 : 22, fontWeight: 800, color: C.accent, letterSpacing: -0.5 }}>Grolaporation</h1>
          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>10737 3rd Ave NW · Broadview Home Garden — 0.06 acres · 2026 Season</div>
        </div>
        <button onClick={() => { setSelectedArea(null); setSelectedPlot(null); setSelectedPlant(null); setView("map"); resetZoom(); }}
          style={{ padding: "4px 12px", borderRadius: 6, border: `1px solid ${C.accent}`, background: C.accent + "22", color: C.accent, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>🗺️ Reset View</button>
      </div>

      {view !== "map" && (
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 6, marginBottom: 12, fontSize: isMobile ? 14 : 12 }}>
          <span onClick={() => { setSelectedArea(null); setSelectedPlot(null); setSelectedPlant(null); setView("map"); resetZoom(); }} style={{ cursor: "pointer", color: C.accent }}>Grolaporation</span>
          <span style={{ color: C.textDim }}>/</span>
          <span style={{ cursor: "pointer", color: C.accent }}>10737 3rd Ave NW</span>
          <span style={{ color: C.textDim }}>/</span>
          <span style={{ cursor: "pointer", color: C.accent }}>Broadview Home Garden</span>
          {selectedArea && <><span style={{ color: C.textDim }}>›</span><span onClick={() => { setSelectedPlot(null); setSelectedPlant(null); setView("area"); }} style={{ cursor: "pointer", color: selectedPlot ? C.accent : C.text }}>{area?.name}</span></>}
          {selectedPlot && <><span style={{ color: C.textDim }}>›</span><span onClick={() => { setSelectedPlant(null); setView("plot"); }} style={{ cursor: "pointer", color: selectedPlant ? C.accent : C.text }}>{plot?.name}</span></>}
          {selectedPlant && <><span style={{ color: C.textDim }}>›</span><span style={{ color: C.text }}>{selectedPlant.name}</span></>}
          <button onClick={handleBack} style={{ marginLeft: "auto", padding: isMobile ? "6px 14px" : "2px 10px", borderRadius: 4, border: `1px solid ${C.border}`, background: "transparent", color: C.textMuted, fontSize: 11, cursor: "pointer" }}>← Back</button>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: view === "map" || isMobile ? "1fr" : "1fr 380px", gap: 16 }}>
        <div ref={containerRef} style={{ position: "relative" }}>
          <svg ref={svgRef} viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
            style={{ width: "100%", height: "auto", background: C.bg, borderRadius: 10, border: `1px solid ${C.border}`, cursor: "grab", userSelect: "none", touchAction: "none" }}
            onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp} onDoubleClick={onDoubleClick}>

            {/* Background lot */}
            <rect x={10} y={10} width={680} height={980} rx={8} fill={C.land} />
            <text x={350} y={8} textAnchor="middle" fill={C.textDim} fontSize={8}>10737 3rd Ave NW, Seattle WA 98177 — 6,500 sqft</text>

            {/* Property boundary */}
            <rect x={15} y={35} width={650} height={720} rx={4}
              fill="none" stroke={C.danger + "44"} strokeWidth={1.5} strokeDasharray="6 3" />

            {/* ═══ STREET — 3rd Ave NW — horizontal at TOP ═══ */}
            <rect x={ML.street.x} y={ML.street.y} width={ML.street.w} height={ML.street.h}
              fill={C.soil + "33"} stroke={C.soil + "55"} strokeWidth={0.5} rx={2} />
            <text x={ML.street.x + ML.street.w/2} y={ML.street.y + 15}
              textAnchor="middle" fill={C.soilLight} fontSize={7} fontWeight={700}>3rd Ave NW</text>

            {/* ═══ H3 — GARDEN (between street and garage, top area) ═══ */}
            <rect x={ML.h3Bounds.x} y={ML.h3Bounds.y} width={ML.h3Bounds.w} height={ML.h3Bounds.h}
              rx={4} fill={C.spring + "06"} stroke={selectedArea === "h3" ? C.accent : C.spring + "22"}
              strokeWidth={selectedArea === "h3" ? 2 : 1}
              onClick={() => handleSelectArea("h3")} style={{ cursor: "pointer" }} />
            <text x={ML.h3Bounds.x + 5} y={ML.h3Bounds.y + 15} fill={C.spring + "88"} fontSize={7} fontWeight={700}>H3 Garden</text>

            {/* Markers 1-5, 9 only (removed 6-8). Green=raised bed, Brown=dug dirt */}
            {[[95,60,"1",C.warn],[110,115,"2",C.soil],[230,70,"3",C.spring],[340,78,"4",C.soil],[500,60,"9",C.spring]].map(([cx,cy,n,clr]) => (
              <g key={`m${n}`}>
                <circle cx={cx} cy={cy} r={6} fill={clr + "55"} stroke={clr} strokeWidth={0.5} />
                <text x={cx} y={cy+3} textAnchor="middle" fill={C.text} fontSize={5} fontWeight={700}>{n}</text>
              </g>
            ))}

            {/* Fig tree — standalone between H3 and garage */}
            <circle cx={270} cy={155} r={8} fill={C.spring + "33"} stroke={C.spring} strokeWidth={1} />
            <text x={270} y={158} textAnchor="middle" fill={C.text} fontSize={5} fontWeight={700}>Fig</text>

            {/* Last ditch arrow pointing right toward garage */}
            <text x={ML.h3Bounds.x + 5} y={ML.h3Bounds.y + ML.h3Bounds.h - 5} fill={C.spring + "55"} fontSize={5}>Last Ditch Area →</text>

            {renderPlot("h3e", "h3e")}
            {renderPlot("h3a", "h3a")}
            {renderPlot("h3b", "h3b")}
            {renderPlot("h3d", "h3d")}
            {renderPlot("h3c", "h3c")}

            {/* ═══ GARAGE — left side below H3 ═══ */}
            <rect x={ML.garage.x} y={ML.garage.y} width={ML.garage.w} height={ML.garage.h} rx={3}
              fill="#1a1a22" stroke="#666" strokeWidth={1} />
            <text x={ML.garage.x + ML.garage.w/2} y={ML.garage.y + ML.garage.h/2 + 3}
              textAnchor="middle" fill={C.textDim} fontSize={9} fontWeight={600}
              transform={`rotate(-90,${ML.garage.x + ML.garage.w/2},${ML.garage.y + ML.garage.h/2})`}>Garage</text>

            {/* ═══ DRIVEWAY — L-shape: right of garage, digs into house rectangle ═══ */}
            <path d={`M ${ML.driveway.x} ${ML.driveway.y} h ${ML.driveway.w} v ${ML.driveway.h} h -${ML.driveway.w - 80} v -${ML.driveway.h - 50} h -80 Z`}
              fill={C.soil + "15"} stroke={C.soil + "33"} strokeWidth={0.5} />
            <text x={ML.driveway.x + 120} y={ML.driveway.y + 50}
              fill={C.soil + "77"} fontSize={6}>Driveway</text>

            {/* Arugula/strawberry bed — narrow, adjacent to left side of garage bottom AND house top-left */}
            <rect x={ML.garage.x} y={ML.garage.y + ML.garage.h} width={175} height={16} rx={2}
              fill={C.spring + "18"} stroke={C.spring + "44"} strokeWidth={0.5} />
            <text x={ML.garage.x + 88} y={ML.garage.y + ML.garage.h + 11}
              textAnchor="middle" fill={C.spring + "88"} fontSize={5}>Arugula &amp; Strawberry (#9)</text>

            {/* ═══ HOUSE — massive center, L-shape (top-right corner cut for driveway) ═══ */}
            <path d={`M ${ML.house.x} ${ML.house.y} h ${ML.house.w - 200} v ${-30} h 200 v ${ML.house.h + 30} h ${-ML.house.w} Z`}
              fill="#252530" stroke="#555" strokeWidth={1} />
            <text x={ML.house.x + 200} y={ML.house.y + ML.house.h/2}
              textAnchor="middle" fill={C.textMuted} fontSize={10} fontWeight={700}
              transform={`rotate(-90,${ML.house.x + 200},${ML.house.y + ML.house.h/2})`}>HOUSE</text>
            <text x={ML.house.x + ML.house.w/2 - 50} y={ML.house.y + ML.house.h/2 + 15}
              textAnchor="middle" fill={C.textDim} fontSize={6}>2,120 sqft</text>

            {/* ═══ H6 — Indoor deck plant area (between house bottom and deck) ═══ */}
            <rect x={ML.h6Bounds.x} y={ML.h6Bounds.y} width={ML.h6Bounds.w} height={ML.h6Bounds.h}
              rx={2} fill={C.greenhouse + "12"} stroke={selectedArea === "h6" ? C.accent : C.greenhouse + "33"}
              strokeWidth={selectedArea === "h6" ? 2 : 1}
              onClick={() => handleSelectArea("h6")} style={{ cursor: "pointer" }} />
            <text x={ML.h6Bounds.x + ML.h6Bounds.w/2} y={ML.h6Bounds.y + 12}
              textAnchor="middle" fill={C.greenhouse + "88"} fontSize={5}>Indoor Deck Plant Area (H6)</text>

            {renderPlot("h6a", "🪴")}
            {renderPlot("h6b", "🪴")}
            {renderPlot("h6c", "🪴")}

            {/* ═══ DECK — horizontal bar below house ═══ */}
            <rect x={ML.deck.x} y={ML.deck.y} width={ML.deck.w} height={ML.deck.h}
              fill={C.water + "15"} stroke={C.water + "44"} strokeWidth={0.5} rx={2} />
            <text x={ML.deck.x + ML.deck.w/2} y={ML.deck.y + 13}
              textAnchor="middle" fill={C.water} fontSize={7} fontWeight={700}>Deck</text>

            {/* H5 containers on deck */}
            <rect x={ML.h5Bounds.x} y={ML.h5Bounds.y} width={ML.h5Bounds.w} height={ML.h5Bounds.h}
              rx={1} fill={C.water + "06"} stroke={selectedArea === "h5" ? C.accent : C.water + "22"}
              strokeWidth={selectedArea === "h5" ? 2 : 1}
              onClick={() => handleSelectArea("h5")} style={{ cursor: "pointer" }} />

            {renderPlot("h5a", "🌿")}
            {renderPlot("h5b", "🌿")}
            {renderPlot("h5c", "🌿")}

            {/* ═══ GRAPE & GOOSEBERRY — below deck ═══ */}
            <circle cx={200} cy={598} r={10} fill={C.warn + "15"} stroke={C.warn + "44"} strokeWidth={1} />
            <text x={200} y={615} textAnchor="middle" fill={C.warn + "88"} fontSize={6} fontWeight={700}>Gooseberry</text>
            <circle cx={380} cy={598} r={10} fill={C.summer + "15"} stroke={C.summer + "44"} strokeWidth={1} />
            <text x={380} y={615} textAnchor="middle" fill={C.summer + "88"} fontSize={6} fontWeight={700}>Grape</text>

            {/* ═══ H1 — FOOD FOREST (bottom of lot, west/downhill) ═══ */}
            <rect x={ML.h1Bounds.x} y={ML.h1Bounds.y} width={ML.h1Bounds.w} height={ML.h1Bounds.h}
              rx={6} fill={C.raised + "08"} stroke={selectedArea === "h1" ? C.accent : C.raised + "22"}
              strokeWidth={selectedArea === "h1" ? 2 : 1}
              onClick={() => handleSelectArea("h1")} style={{ cursor: "pointer" }} />
            <text x={ML.h1Bounds.x + ML.h1Bounds.w/2} y={ML.h1Bounds.y + 15}
              textAnchor="middle" fill={C.raised + "aa"} fontSize={8} fontWeight={700}>H1 Food Forest</text>

            {/* Douglas Fir at LEFT (north) edge of land */}
            <circle cx={120} cy={690} r={30} fill={C.water + "08"} stroke={C.water + "33"} strokeWidth={1.5} />
            <text x={120} y={685} textAnchor="middle" fill={C.water} fontSize={14}>🌲</text>
            <text x={120} y={725} textAnchor="middle" fill={C.water + "66"} fontSize={5} fontWeight={700}>Douglas Fir</text>

            {/* Cherry at RIGHT (south) edge of land */}
            <circle cx={560} cy={690} r={28} fill={C.fall + "08"} stroke={C.fall + "33"} strokeWidth={1.5} />
            <text x={560} y={685} textAnchor="middle" fill={C.fall} fontSize={14}>🌳</text>
            <text x={560} y={722} textAnchor="middle" fill={C.fall + "66"} fontSize={5} fontWeight={700}>Cherry</text>

            {/* Graft tree center */}
            <circle cx={330} cy={695} r={22} fill={C.spring + "08"} stroke={C.spring + "33"} strokeWidth={1} />
            <text x={330} y={690} textAnchor="middle" fill={C.spring} fontSize={12}>🌳</text>
            <text x={330} y={722} textAnchor="middle" fill={C.spring + "66"} fontSize={5}>Graft</text>

            {renderPlot("h1a", "h1a")}
            {renderPlot("h1b", "h1b")}
            {renderPlot("h1c", "h1c")}

            {/* ═══ H2 — SHADE BED (entire left/north strip) ═══ */}
            <rect x={ML.h2Bounds.x} y={ML.h2Bounds.y} width={ML.h2Bounds.w} height={ML.h2Bounds.h}
              rx={3} fill={"#5a7a6a08"} stroke={selectedArea === "h2" ? C.accent : "#5a7a6a44"}
              strokeWidth={selectedArea === "h2" ? 2 : 1}
              onClick={() => handleSelectArea("h2")} style={{ cursor: "pointer" }} />
            <text x={ML.h2Bounds.x + ML.h2Bounds.w/2} y={400}
              textAnchor="middle" fill={"#7a9a7a"} fontSize={7} fontWeight={700}
              transform={`rotate(-90,${ML.h2Bounds.x + ML.h2Bounds.w/2},400)`}>H2 Shade Bed</text>

            {renderPlot("h2a", "h2a")}
            {renderPlot("h2c", "h2c")}

            {/* ═══ STAIRS — right side ═══ */}
            <g>
              {[...Array(10)].map((_, i) => (
                <line key={`st${i}`} x1={ML.stairs.x} y1={ML.stairs.y + i * 10}
                  x2={ML.stairs.x + ML.stairs.w} y2={ML.stairs.y + i * 10}
                  stroke={C.textDim + "44"} strokeWidth={1} />
              ))}
              <text x={ML.stairs.x + ML.stairs.w/2} y={ML.stairs.y + ML.stairs.h/2}
                textAnchor="middle" fill={C.textDim} fontSize={6}
                transform={`rotate(-90,${ML.stairs.x + ML.stairs.w/2},${ML.stairs.y + ML.stairs.h/2})`}>Stairs</text>
            </g>

            {/* ═══ H4 — BEDS (right/south strip) ═══ */}
            <rect x={ML.h4Bounds.x} y={ML.h4Bounds.y} width={ML.h4Bounds.w} height={ML.h4Bounds.h}
              rx={2} fill={C.summer + "06"} stroke={selectedArea === "h4" ? C.accent : C.summer + "22"}
              strokeWidth={selectedArea === "h4" ? 2 : 1}
              onClick={() => handleSelectArea("h4")} style={{ cursor: "pointer" }} />

            {renderPlot("h4a", "h4a")}
            {renderPlot("h4b", "h4b")}
            {renderPlot("h4c", "h4c")}
            {renderPlot("h4d", "h4d")}
            {renderPlot("h4e", "h4e")}

            {/* ═══ COMPASS (top-right) ═══ */}
            <g transform="translate(660, 30)">
              <text x={0} y={-8} textAnchor="middle" fill={C.accent} fontSize={6} fontWeight={700}>N</text>
              <text x={12} y={3} fill={C.accent + "88"} fontSize={5}>E</text>
              <text x={0} y={14} fill={C.accent + "88"} fontSize={5} textAnchor="middle">S</text>
              <text x={-12} y={3} fill={C.accent + "88"} fontSize={5} textAnchor="end">W</text>
              <line x1={0} y1={-5} x2={0} y2={8} stroke={C.accent + "44"} strokeWidth={0.5} />
              <line x1={-8} y1={0} x2={8} y2={0} stroke={C.accent + "44"} strokeWidth={0.5} />
            </g>

            {/* ═══ LEGEND (bottom-right) ═══ */}
            <g transform="translate(560, 790)">
              <rect x={-6} y={-10} width={95} height={100} rx={4} fill={C.bgCard + "dd"} stroke={C.border} strokeWidth={0.5} />
              <text x={0} y={0} fill={C.textDim} fontSize={7} fontWeight={700}>Legend</text>
              {[["Food Forest", C.raised], ["Shade", "#5a7a6a"], ["Garden", C.spring], ["Beds", C.summer], ["Deck", C.water], ["Indoor", C.greenhouse]].map(([label, color], i) => (
                <g key={label} transform={`translate(0, ${12 + i * 13})`}>
                  <rect x={0} y={0} width={7} height={7} rx={1.5} fill={color + "55"} stroke={color} strokeWidth={0.5} />
                  <text x={11} y={6} fill={C.textMuted} fontSize={5.5}>{label}</text>
                </g>
              ))}
            </g>

            {/* Elevation notes at bottom */}
            <text x={350} y={770} textAnchor="middle" fill={C.textDim} fontSize={6}>
              ↑ ~300ft (street) — slopes downhill — ~280ft (neighbor fence) ↓
            </text>

          </svg>

          <div style={{ position: "absolute", bottom: 12, right: 12, display: "flex", flexDirection: "column", gap: 4, background: C.bgCard + "ee", border: `1px solid ${C.border}`, borderRadius: 8, padding: 4 }}>
            <button onClick={zoomIn} style={{ width: isMobile ? 40 : 30, height: isMobile ? 38 : 28, border: `1px solid ${C.border}`, borderRadius: 4, background: C.bgHover, color: C.text, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
            <div style={{ textAlign: "center", fontSize: 9, color: C.textMuted, padding: "2px 0" }}>{zoomLevel}x</div>
            <button onClick={zoomOut} style={{ width: isMobile ? 40 : 30, height: isMobile ? 38 : 28, border: `1px solid ${C.border}`, borderRadius: 4, background: C.bgHover, color: C.text, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
            <button onClick={resetZoom} style={{ width: isMobile ? 40 : 30, height: isMobile ? 38 : 28, border: `1px solid ${C.border}`, borderRadius: 4, background: C.bgHover, color: C.textMuted, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>↺</button>
          </div>

          {tooltip && (
            <div style={{ position: "absolute", left: tooltip.x, top: tooltip.y, padding: "3px 8px",
              background: C.bgCard, border: `1px solid ${C.accent}44`, borderRadius: 6,
              fontSize: 11, color: C.text, pointerEvents: "none", zIndex: 20, whiteSpace: "nowrap",
              boxShadow: `0 2px 8px ${C.bg}88` }}>
              {tooltip.text}
            </div>
          )}

          <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
            {[
              { id: "timeline", label: "Timeline", icon: "📅", val: "2026" },
              { id: "areas", label: "Areas", icon: "📍", val: `${AREAS.length}`, color: C.accent },
              { id: "plots", label: "Plots", icon: "🌱", val: `${PLOTS.length}`, color: C.spring },
              { id: "plants", label: "Plants", icon: "🌿", val: `${PLANTS.length}`, color: C.summer },
              { id: "tasks", label: "Tasks", icon: "✅", val: atTasks.length > 0 ? `${atTasks.length}` : "—", color: C.warn },
            ].map(tab => (
              <div key={tab.id} onClick={() => setBottomTab(tab.id)}
                style={{
                  flex: isMobile ? "1 1 calc(50% - 6px)" : "1 1 0",
                  padding: "8px 10px", borderRadius: 8, textAlign: "center", cursor: "pointer",
                  background: bottomTab === tab.id ? (tab.color || C.accent) + "22" : C.bgCard,
                  border: `1px solid ${bottomTab === tab.id ? (tab.color || C.accent) : C.border}`,
                  transition: "all 0.15s ease",
                }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: tab.color || C.accent }}>
                  <span style={{ fontSize: 12, marginRight: 4 }}>{tab.icon}</span>{tab.val}
                </div>
                <div style={{ fontSize: 10, color: bottomTab === tab.id ? C.text : C.textMuted, marginTop: 2 }}>{tab.label}</div>
              </div>
            ))}
          </div>
        </div>

        {view !== "map" && (
          <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, maxHeight: isMobile ? "none" : "80vh", overflowY: "auto" }}>
            {view === "area" && area && (
              <div>
                <h2 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: C.accent }}>{area.name}</h2>
                <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 12 }}>{area.desc}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                  <Badge color={C.spring}>{area.acres} ac</Badge>
                  <Badge color={C.summer}>{area.sqft.toLocaleString()} sqft</Badge>
                  {area.systems.map(s => <Badge key={s} color={C.water}>{s}</Badge>)}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, marginBottom: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>General Care</div>
                {area.generalCare.map((c, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "70px 80px 1fr", gap: 6, padding: "6px 0", borderBottom: `1px solid ${C.border}22`, fontSize: 11 }}>
                    <span style={{ fontWeight: 600, color: C.text }}>{ACTION_ICONS[c.action] || "·"} {c.action}</span>
                    <SeasonTag season={c.season} />
                    <span style={{ color: C.textMuted }}>{c.notes}</span>
                  </div>
                ))}
                <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, margin: "16px 0 6px", letterSpacing: 0.5, textTransform: "uppercase" }}>Methods & Systems</div>
                {areaMethods.map((m, i) => (
                  <div key={i} style={{ padding: 8, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, marginBottom: 4 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 600, fontSize: 12, color: C.text }}>{m.name}</span>
                      <Badge color={C.water} small>{m.system}</Badge>
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                      <span style={{ fontSize: 10, color: C.accent }}>{m.tasks} tasks</span>
                      <span style={{ fontSize: 10, color: C.warn }}>{m.hours} hrs</span>
                    </div>
                  </div>
                ))}
                <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, margin: "16px 0 6px", letterSpacing: 0.5, textTransform: "uppercase" }}>Plots ({areaPlots.length})</div>
                {areaPlots.map(p => (
                  <div key={p.id} onClick={() => handleSelectPlot(p.id)}
                    style={{ padding: "8px 10px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, marginBottom: 4, cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = C.accent}
                    onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 600, fontSize: 12, color: C.text }}>{p.name}</span>
                      <Badge color={p.status === "Established" ? C.accent : p.status === "Active" ? C.spring : C.textMuted} small>{p.status}</Badge>
                    </div>
                    <div style={{ display: "flex", gap: 6, marginTop: 4, alignItems: "center" }}>
                      <Badge color={p.color} small>{p.type}</Badge>
                      <span style={{ fontSize: 10, color: C.textMuted }}>{p.sqft} sqft</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {view === "plot" && plot && (
              <div>
                <h2 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: C.accent }}>{plot.name}</h2>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                  <Badge color={plot.color}>{plot.type}</Badge>
                  <Badge color={plot.status === "Established" ? C.accent : C.textMuted}>{plot.status}</Badge>
                  <Badge color={C.summer}>{plot.sqft} sqft</Badge>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, margin: "12px 0 6px", letterSpacing: 0.5, textTransform: "uppercase" }}>Plants ({plotPlants.length})</div>
                {plotPlants.length > 0 ? plotPlants.map(p => <PlantCard key={p.id} plant={p} onSelect={handleSelectPlant} />) :
                  <div style={{ fontSize: 12, color: C.textDim, padding: 12, textAlign: "center" }}>No plants assigned to this plot</div>}
              </div>
            )}
            {view === "plant" && selectedPlant && (
              <div>
                <h2 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: C.accent }}>{selectedPlant.name}</h2>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                  <Badge color={selectedPlant.type.includes("Perennial") ? C.spring : C.summer}>{selectedPlant.type}</Badge>
                  {selectedPlant.count && <Badge color={C.textMuted}>{selectedPlant.count}</Badge>}
                </div>
                <MaintenanceMatrix plant={selectedPlant} />
                <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, margin: "16px 0 6px", letterSpacing: 0.5, textTransform: "uppercase" }}>Full Care Details</div>
                {selectedPlant.maintenance.map((m, i) => (
                  <div key={i} style={{ padding: "8px 10px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, marginBottom: 4 }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontSize: 14 }}>{ACTION_ICONS[m.action] || "·"}</span>
                      <span style={{ fontWeight: 600, fontSize: 12, color: C.text }}>{m.action}</span>
                      <SeasonTag season={m.season} />
                    </div>
                    <div style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.4 }}>{m.notes}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ marginTop: 16, padding: isMobile ? 10 : 16, background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, overflowX: isMobile ? "auto" : "visible" }}>
        {bottomTab === "timeline" && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, marginBottom: 10, letterSpacing: 0.5, textTransform: "uppercase" }}>2026 Seasonal Timeline</div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "90px repeat(12, 1fr)" : "120px repeat(12, 1fr)", gap: 2, minWidth: isMobile ? 600 : "auto" }}>
              <div />
              {["Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan"].map(m => (
                <div key={m} style={{ textAlign: "center", fontSize: 9, fontWeight: 600, color: C.textDim, padding: "2px 0" }}>{m}</div>
              ))}
              {[
                { label: "Garlic", start: 9, end: 2, color: C.raised },
                { label: "Tomatoes", start: 2, end: 8, color: C.hugel },
                { label: "Squash", start: 4, end: 8, color: C.hugel },
                { label: "Beans", start: 4, end: 7, color: C.raised },
                { label: "Leafy Greens", start: 2, end: 10, color: C.raisedBed },
                { label: "Berries", start: 5, end: 8, color: C.spring },
                { label: "Root Crops", start: 2, end: 9, color: C.soil },
                { label: "Herbs", start: 0, end: 11, color: C.accent },
                { label: "Fruit Trees", start: 1, end: 9, color: "#4a6a3a" },
              ].map(({ label, start, end, color }) => (
                <React.Fragment key={label}>
                  <div style={{ fontSize: 10, color: C.textMuted, display: "flex", alignItems: "center", paddingRight: 4 }}>{label}</div>
                  {Array.from({ length: 12 }, (_, i) => {
                    const inRange = start <= end ? (i >= start && i <= end) : (i >= start || i <= end);
                    return (
                      <div key={i} style={{ height: 16, borderRadius: 3, background: inRange ? color + "55" : "transparent", border: inRange ? `1px solid ${color}88` : "1px solid transparent" }} />
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {bottomTab === "areas" && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, marginBottom: 10, letterSpacing: 0.5, textTransform: "uppercase" }}>Garden Areas</div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 500 }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                    {["Area", "Description", "Acres", "Sq Ft", "Plots", "Systems"].map(h => (
                      <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: C.textMuted, fontWeight: 600, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {AREAS.map(a => {
                    const ap = PLOTS.filter(p => p.area === a.id);
                    return (
                      <tr key={a.id} onClick={() => handleSelectArea(a.id)}
                        style={{ borderBottom: `1px solid ${C.border}22`, cursor: "pointer", background: selectedArea === a.id ? C.accent + "15" : "transparent" }}
                        onMouseEnter={e => { if (selectedArea !== a.id) e.currentTarget.style.background = C.bgHover; }}
                        onMouseLeave={e => { if (selectedArea !== a.id) e.currentTarget.style.background = "transparent"; }}>
                        <td style={{ padding: "8px 10px", fontWeight: 600, color: C.text }}>{a.name}</td>
                        <td style={{ padding: "8px 10px", color: C.textMuted, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.desc}</td>
                        <td style={{ padding: "8px 10px", color: C.spring }}>{a.acres}</td>
                        <td style={{ padding: "8px 10px", color: C.textMuted }}>{a.sqft.toLocaleString()}</td>
                        <td style={{ padding: "8px 10px", color: C.accent }}>{ap.length}</td>
                        <td style={{ padding: "8px 10px" }}>
                          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                            {a.systems.map(s => (
                              <span key={s} style={{ padding: "1px 6px", borderRadius: 4, background: C.water + "22", border: `1px solid ${C.water}33`, fontSize: 9, color: C.water }}>{s}</span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {bottomTab === "plots" && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, marginBottom: 10, letterSpacing: 0.5, textTransform: "uppercase" }}>All Plots</div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 600 }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                    {["Plot", "Area", "Type", "Sq Ft", "Status", "Plants"].map(h => (
                      <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: C.textMuted, fontWeight: 600, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PLOTS.map(p => {
                    const pp = PLANTS.filter(pl => pl.plot === p.id);
                    const areaObj = AREAS.find(a => a.id === p.area);
                    return (
                      <tr key={p.id} onClick={() => handleSelectPlot(p.id)}
                        style={{ borderBottom: `1px solid ${C.border}22`, cursor: "pointer", background: selectedPlot === p.id ? C.accent + "15" : "transparent" }}
                        onMouseEnter={e => { if (selectedPlot !== p.id) e.currentTarget.style.background = C.bgHover; }}
                        onMouseLeave={e => { if (selectedPlot !== p.id) e.currentTarget.style.background = "transparent"; }}>
                        <td style={{ padding: "8px 10px", fontWeight: 600, color: C.text }}>{p.name}</td>
                        <td style={{ padding: "8px 10px", color: C.textMuted }}>{areaObj?.name || p.area}</td>
                        <td style={{ padding: "8px 10px" }}>
                          <span style={{ padding: "1px 6px", borderRadius: 4, background: p.color + "22", border: `1px solid ${p.color}44`, fontSize: 10, color: p.color }}>{p.type}</span>
                        </td>
                        <td style={{ padding: "8px 10px", color: C.textMuted }}>{p.sqft}</td>
                        <td style={{ padding: "8px 10px" }}>
                          <span style={{ padding: "1px 6px", borderRadius: 4, fontSize: 10, color: p.status === "Established" ? C.accent : p.status === "Active" ? C.spring : C.textMuted,
                            background: (p.status === "Established" ? C.accent : p.status === "Active" ? C.spring : C.textMuted) + "18" }}>{p.status}</span>
                        </td>
                        <td style={{ padding: "8px 10px", color: C.summer }}>{pp.length}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {bottomTab === "plants" && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, marginBottom: 10, letterSpacing: 0.5, textTransform: "uppercase" }}>All Plants</div>
            {(() => {
              const statusOrder = ["Perennial", "Annual", "Perennial Herb", "Companion"];
              const grouped = {};
              PLANTS.forEach(p => {
                const key = p.type || "Other";
                if (!grouped[key]) grouped[key] = [];
                grouped[key].push(p);
              });
              const sortedKeys = Object.keys(grouped).sort((a, b) => {
                const ai = statusOrder.indexOf(a), bi = statusOrder.indexOf(b);
                return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
              });
              return sortedKeys.map(status => (
                <div key={status} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, padding: "6px 0", borderBottom: `1px solid ${C.border}33`, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    {status} ({grouped[status].length})
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 400 }}>
                      <thead>
                        <tr>
                          {["Plant", "Plot", "Count", "Care Actions"].map(h => (
                            <th key={h} style={{ padding: "4px 10px", textAlign: "left", color: C.textDim, fontWeight: 600, fontSize: 9, textTransform: "uppercase" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {grouped[status].map(pl => {
                          const plotObj = PLOTS.find(p => p.id === pl.plot);
                          return (
                            <tr key={pl.id} onClick={() => { handleSelectPlant(pl); const po = PLOTS.find(p => p.id === pl.plot); if (po) { setSelectedArea(po.area); setSelectedPlot(po.id); } setView("plant"); }}
                              style={{ borderBottom: `1px solid ${C.border}11`, cursor: "pointer", background: selectedPlant?.id === pl.id ? C.accent + "15" : "transparent" }}
                              onMouseEnter={e => { if (selectedPlant?.id !== pl.id) e.currentTarget.style.background = C.bgHover; }}
                              onMouseLeave={e => { if (selectedPlant?.id !== pl.id) e.currentTarget.style.background = "transparent"; }}>
                              <td style={{ padding: "6px 10px", fontWeight: 600, color: C.text }}>{pl.name}</td>
                              <td style={{ padding: "6px 10px", color: C.textMuted, fontSize: 10 }}>{plotObj?.name || "—"}</td>
                              <td style={{ padding: "6px 10px", color: C.textMuted, fontSize: 10 }}>{pl.count || "—"}</td>
                              <td style={{ padding: "6px 10px", fontSize: 10 }}>
                                <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                                  {(pl.maintenance || []).map((m, i) => (
                                    <span key={i} style={{ fontSize: 12 }} title={`${m.action} — ${m.season}`}>{ACTION_ICONS[m.action] || "·"}</span>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ));
            })()}
          </div>
        )}

        {bottomTab === "tasks" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: 0.5, textTransform: "uppercase" }}>Broadview Tasks ({atTasks.length})</div>
              {atTasks.length > 0 && (
                <button onClick={fetchAirtable}
                  style={{ padding: "3px 10px", borderRadius: 4, border: `1px solid ${C.border}`, background: "transparent", color: C.textMuted, fontSize: 10, cursor: "pointer" }}>↻ Refresh</button>
              )}
            </div>

            {atLoading && <div style={{ padding: 20, textAlign: "center", color: C.textMuted, fontSize: 12 }}>Loading tasks from Airtable...</div>}
            {atError && <div style={{ padding: 8, color: C.danger, fontSize: 11 }}>{atError}</div>}

            {atTasks.length > 0 && !atLoading && (() => {
              const methodMap = {};
              atMethods.forEach(m => { methodMap[m.id] = m.fields["Method Name"] || m.fields.Name || m.id; });

              const statusColors = { Planned: C.warn, "In Progress": C.accent, Complete: C.spring, Recurring: C.water, "Seasonal Hold": C.textMuted, Blocked: C.danger, Backlog: C.textDim };
              const statusOrder = ["In Progress", "Planned", "Recurring", "Blocked", "Seasonal Hold", "Complete", "Backlog"];
              const statusOptions = ["Planned", "In Progress", "Complete", "Recurring", "Seasonal Hold", "Blocked", "Backlog"];

              const fmtDate = (d) => { if (!d) return "—"; const dt = new Date(d); return `${dt.getMonth()+1}/${dt.getDate()}`; };

              const byArea = {};
              atTasks.forEach(t => {
                const areaName = resolveTaskArea(t);
                if (!byArea[areaName]) byArea[areaName] = [];
                byArea[areaName].push(t);
              });

              return Object.entries(byArea).sort(([a], [b]) => a.localeCompare(b)).map(([areaName, areaTasks]) => {
                const byMethod = {};
                areaTasks.forEach(t => {
                  const ml = t.fields.Method || [];
                  const mn = Array.isArray(ml) && ml.length > 0 ? (methodMap[ml[0]] || "General") : "General";
                  if (!byMethod[mn]) byMethod[mn] = [];
                  byMethod[mn].push(t);
                });

                const planned = areaTasks.filter(t => t.fields.Status === "Planned").length;
                const inProg = areaTasks.filter(t => t.fields.Status === "In Progress").length;
                const done = areaTasks.filter(t => t.fields.Status === "Complete").length;

                return (
                  <details key={areaName} style={{ marginBottom: 8 }}>
                    <summary style={{ cursor: "pointer", padding: "10px 14px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12, fontWeight: 700, color: C.text, listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: C.accent }}>📍 {areaName}</span>
                      <div style={{ display: "flex", gap: 8, fontSize: 10 }}>
                        {inProg > 0 && <span style={{ color: C.accent }}>{inProg} active</span>}
                        <span style={{ color: C.warn }}>{planned} planned</span>
                        <span style={{ color: C.spring }}>{done} done</span>
                        <span style={{ color: C.textDim }}>{areaTasks.length} total</span>
                      </div>
                    </summary>
                    <div style={{ paddingLeft: 8, marginTop: 6 }}>
                      {Object.entries(byMethod).sort(([a], [b]) => a.localeCompare(b)).map(([methodName, mTasks]) => (
                        <details key={methodName} style={{ marginBottom: 6 }} open>
                          <summary style={{ cursor: "pointer", padding: "6px 10px", background: C.bgCard, border: `1px solid ${C.border}33`, borderRadius: 6, fontSize: 11, fontWeight: 600, color: C.textMuted, listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span>⚙ {methodName}</span>
                            <span style={{ fontSize: 10, color: C.textDim }}>{mTasks.length}</span>
                          </summary>
                          <div style={{ marginTop: 4, overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, minWidth: isMobile ? 700 : 600 }}>
                              <thead>
                                <tr style={{ borderBottom: `1px solid ${C.border}44` }}>
                                  {["Task", "Plants", "Start", "Due", "Hrs", "Depends On", "Status"].map(h => (
                                    <th key={h} style={{ padding: "4px 6px", textAlign: "left", color: C.textDim, fontWeight: 600, fontSize: 9, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {mTasks
                                  .sort((a, b) => statusOrder.indexOf(a.fields.Status || "") - statusOrder.indexOf(b.fields.Status || ""))
                                  .map(t => {
                                    const plants = resolveTaskPlants(t);
                                    const deps = resolveTaskDeps(t);
                                    const hasIncompleteDep = deps.some(d => d.incomplete);
                                    return (
                                      <tr key={t.id} style={{ borderBottom: `1px solid ${C.border}11`, background: hasIncompleteDep ? C.danger + "08" : "transparent" }}>
                                        <td style={{ padding: "6px 6px", fontWeight: 600, color: C.text, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                          {t.fields.Name || "Untitled"}
                                          {t.fields["Task Type"] && <span style={{ fontSize: 9, color: C.textDim, marginLeft: 4 }}>({t.fields["Task Type"]})</span>}
                                        </td>
                                        <td style={{ padding: "6px 6px", fontSize: 10, maxWidth: 120 }}>
                                          {plants.length > 0 ? (
                                            <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                                              {plants.map((p, i) => (
                                                <span key={i} title={`${p.name}${p.type ? ` (${p.type})` : ""}`}
                                                  style={{ padding: "1px 5px", borderRadius: 3, background: C.spring + "18", border: `1px solid ${C.spring}33`, fontSize: 9, color: C.spring, cursor: "default" }}>
                                                  {p.name?.length > 12 ? p.name.slice(0, 12) + "…" : p.name}
                                                </span>
                                              ))}
                                            </div>
                                          ) : <span style={{ color: C.textDim }}>—</span>}
                                        </td>
                                        <td style={{ padding: "6px 6px", color: C.textMuted, fontSize: 10, whiteSpace: "nowrap" }}>{fmtDate(t.fields["Start Date"])}</td>
                                        <td style={{ padding: "6px 6px", fontSize: 10, whiteSpace: "nowrap",
                                          color: t.fields["Due Date"] && new Date(t.fields["Due Date"]) < new Date() && t.fields.Status !== "Complete" ? C.danger : C.textMuted }}>
                                          {fmtDate(t.fields["Due Date"])}
                                        </td>
                                        <td style={{ padding: "6px 6px", color: C.textMuted, fontSize: 10, textAlign: "center" }}>{t.fields["Estimated Hours"] != null ? t.fields["Estimated Hours"] : "—"}</td>
                                        <td style={{ padding: "6px 6px", fontSize: 10, maxWidth: 140 }}>
                                          {deps.length > 0 ? (
                                            <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                                              {deps.map((d, i) => (
                                                <span key={i}
                                                  title={`${d.name} — ${d.status}${d.incomplete ? " ⚠ INCOMPLETE" : ""}`}
                                                  style={{
                                                    padding: "1px 5px", borderRadius: 3, fontSize: 9, cursor: "default",
                                                    background: d.incomplete ? C.danger + "22" : C.spring + "18",
                                                    border: `1px solid ${d.incomplete ? C.danger + "55" : C.spring + "33"}`,
                                                    color: d.incomplete ? C.danger : C.spring,
                                                  }}>
                                                  {d.name?.length > 14 ? d.name.slice(0, 14) + "…" : d.name}
                                                  {d.incomplete && " ⚠"}
                                                </span>
                                              ))}
                                            </div>
                                          ) : <span style={{ color: C.textDim }}>—</span>}
                                        </td>
                                        <td style={{ padding: "6px 6px" }}>
                                          <select
                                            value={t.fields.Status || "Planned"}
                                            onChange={e => updateTaskStatus(t.id, e.target.value)}
                                            style={{
                                              padding: "2px 4px", borderRadius: 4, fontSize: 9, fontWeight: 600, cursor: "pointer", border: `1px solid ${(statusColors[t.fields.Status] || C.textMuted) + "44"}`,
                                              background: (statusColors[t.fields.Status] || C.textMuted) + "18", color: statusColors[t.fields.Status] || C.textMuted,
                                              outline: "none", WebkitAppearance: "none", MozAppearance: "none", appearance: "none", paddingRight: 14,
                                              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5' viewBox='0 0 8 5'%3E%3Cpath fill='%238a9aae' d='M0 0l4 5 4-5z'/%3E%3C/svg%3E")`,
                                              backgroundRepeat: "no-repeat", backgroundPosition: "right 4px center",
                                            }}>
                                            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                          </select>
                                        </td>
                                      </tr>
                                    );
                                  })}
                              </tbody>
                            </table>
                          </div>
                        </details>
                      ))}
                    </div>
                  </details>
                );
              });
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
