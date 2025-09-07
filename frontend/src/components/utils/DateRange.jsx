import React from 'react';


export default function DateRange({ start, end, onChange }) {
return (
<div className="flex items-center gap-2">
<input type="date" value={start} onChange={(e) => onChange({ start: e.target.value, end })} className="bg-white border border-neutral-200 rounded-xl px-3 py-2 text-sm" />
<span className="text-neutral-500">—</span>
<input type="date" value={end} onChange={(e) => onChange({ start, end: e.target.value })} className="bg-white border border-neutral-200 rounded-xl px-3 py-2 text-sm" />
</div>
);
}