import React from 'react';
import { List, BarChart2, Activity, Scale} from 'lucide-react';

export default function SegmentedControl({ value, onChange}) {
  const options = [
    { id: 'transactions', label: 'Transactions', icon: List },
    { id: 'charts', label: 'Charts', icon: BarChart2 },
    { id: 'metrics', label: 'Metrics', icon: Activity },
    { id: 'my_rule', label: 'My Rule', icon: Scale},
  ];

  return (
    <div className="inline-flex rounded-2xl bg-neutral-100 p-1 gap-1 border border-neutral-200" role="tablist" aria-label="View selector">
      <div>
        {options.map((o) => (
          <button
            key={o.id} 
            onClick={() => onChange(o.id)}
            role="tab"
            aria-selected={value === o.label}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition ${value === o.id ? 'bg-white shadow-sm p-1 gap-1 border border-neutral-200' : 'hover:bg-neutral-50'}`}>
            <o.icon className="w-4 h-4"/>
            <span className="hidden sm:inline">{o.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
