// Service Categories for HyperLSP
export const SERVICE_CATEGORIES = [
    { id: 'plumbing', name: 'Plumbing', icon: '🔧', description: 'Pipe repair, tap installation, leakage fix' },
    { id: 'electrical', name: 'Electrical', icon: '⚡', description: 'Wiring, switch repair, fan installation' },
    { id: 'cleaning', name: 'Cleaning', icon: '🧹', description: 'Home cleaning, deep cleaning, sanitization' },
    { id: 'carpentry', name: 'Carpentry', icon: '🪚', description: 'Furniture repair, assembly, woodwork' },
    { id: 'painting', name: 'Painting', icon: '🎨', description: 'Wall painting, waterproofing, polish' },
    { id: 'ac_appliance', name: 'AC & Appliance', icon: '❄️', description: 'AC service, washing machine, refrigerator' },
    { id: 'pest_control', name: 'Pest Control', icon: '🐜', description: 'Cockroach, termite, mosquito control' },
    { id: 'beauty_spa', name: 'Beauty & Spa', icon: '💅', description: 'Haircut, makeup, massage, grooming' },
    { id: 'home_repair', name: 'Home Repair', icon: '🏠', description: 'General repairs, fixtures, maintenance' },
    { id: 'moving_packing', name: 'Moving & Packing', icon: '📦', description: 'Packers, movers, transportation' },
    { id: 'other', name: 'Other', icon: '📋', description: 'Other services' }
];

// Category names for validation
export const CATEGORY_NAMES = SERVICE_CATEGORIES.map(cat => cat.name);

export default SERVICE_CATEGORIES;
