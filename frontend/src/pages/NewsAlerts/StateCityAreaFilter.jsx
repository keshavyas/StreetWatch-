import React from 'react';
import { MapPin, ChevronDown } from 'lucide-react';

// Real hierarchy data
const LOCATION_DATA = {
    'Madhya Pradesh': {
        'Indore': ['Vijay Nagar', 'Sarafa', 'Palasia', 'AB Road', 'Rajwada', 'Sapna Sangeeta', 'Bhawarkuan', 'Geeta Bhawan', 'MG Road', 'Rau', 'Super Corridor', 'Scheme 78', 'Scheme 54', 'Aerodrome', 'Annapurna'],
        'Bhopal': ['New Market', 'MP Nagar', 'Habibganj', 'Arera Colony', 'Shahpura', 'Bairagarh', 'TT Nagar', 'Kolar'],
        'Gwalior': ['Lashkar', 'City Center', 'Morar', 'Thatipur'],
        'Jabalpur': ['Wright Town', 'Civil Lines', 'Napier Town', 'Vijay Nagar'],
    },
    'Uttar Pradesh': {
        'Lucknow': ['Hazratganj', 'Gomti Nagar', 'Aminabad', 'Alambagh', 'Charbagh', 'Indira Nagar'],
        'Kanpur': ['Civil Lines', 'Swaroop Nagar', 'Kidwai Nagar', 'Mall Road'],
        'Varanasi': ['Godowlia', 'Sigra', 'Lanka', 'Assi Ghat'],
    },
    'Gujarat': {
        'Ahmedabad': ['Manek Chowk', 'CG Road', 'SG Highway', 'Navrangpura', 'Satellite', 'Bopal'],
        'Surat': ['Ring Road', 'Athwa', 'Adajan', 'Varachha'],
        'Vadodara': ['Alkapuri', 'Sayajigunj', 'Fatehgunj', 'Race Course'],
    },
    'Rajasthan': {
        'Jaipur': ['MI Road', 'Vaishali Nagar', 'Malviya Nagar', 'C-Scheme'],
        'Udaipur': ['Hathi Pol', 'City Palace', 'Fateh Sagar'],
        'Jodhpur': ['Clock Tower', 'Sardarpura', 'Ratanada'],
    },
};

const STATES = Object.keys(LOCATION_DATA);

export const StateCityAreaFilter = ({ selectedState, selectedCity, selectedArea, onStateChange, onCityChange, onAreaChange }) => {
    const cities = selectedState ? Object.keys(LOCATION_DATA[selectedState] || {}) : [];
    const areas = (selectedState && selectedCity) ? (LOCATION_DATA[selectedState]?.[selectedCity] || []) : [];

    return (
        <div className="flex flex-col sm:flex-row gap-3 w-full">
            {/* State Dropdown */}
            <div className="relative flex-1 min-w-0">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">State</label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500 pointer-events-none" size={16} />
                    <select
                        value={selectedState}
                        onChange={(e) => onStateChange(e.target.value)}
                        className="w-full bg-slate-800/80 border border-slate-700 rounded-lg py-2.5 pl-9 pr-8 text-white text-sm appearance-none cursor-pointer focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors hover:border-slate-600"
                    >
                        <option value="">Select State</option>
                        {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
                </div>
            </div>

            {/* City Dropdown */}
            <div className="relative flex-1 min-w-0">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">City</label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" size={16} />
                    <select
                        value={selectedCity}
                        onChange={(e) => onCityChange(e.target.value)}
                        disabled={!selectedState}
                        className="w-full bg-slate-800/80 border border-slate-700 rounded-lg py-2.5 pl-9 pr-8 text-white text-sm appearance-none cursor-pointer focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors hover:border-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <option value="">{selectedState ? 'Select City' : '—'}</option>
                        {cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
                </div>
            </div>

            {/* Area Dropdown */}
            <div className="relative flex-1 min-w-0">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Area</label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none" size={16} />
                    <select
                        value={selectedArea}
                        onChange={(e) => onAreaChange(e.target.value)}
                        disabled={!selectedCity}
                        className="w-full bg-slate-800/80 border border-slate-700 rounded-lg py-2.5 pl-9 pr-8 text-white text-sm appearance-none cursor-pointer focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors hover:border-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <option value="">{selectedCity ? 'Select Area' : '—'}</option>
                        {areas.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
                </div>
            </div>
        </div>
    );
};
