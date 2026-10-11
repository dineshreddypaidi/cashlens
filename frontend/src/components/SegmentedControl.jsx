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
    <div className="flex w-full sm:w-auto rounded-2xl bg-neutral-100 p-1 gap-1 border border-neutral-200" role="tablist" aria-label="View selector">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          role="tab"
          aria-selected={value === o.id}
          title={o.label}
          aria-label={o.label}
          className={`flex-1 sm:flex-none min-h-11 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition ${value === o.id ? 'bg-white shadow-sm border border-neutral-200' : 'hover:bg-neutral-50'}`}>
          <o.icon className="w-4 h-4 shrink-0"/>
          <span className="hidden sm:inline">{o.label}</span>
        </button>
      ))}
    </div>
  );
}
