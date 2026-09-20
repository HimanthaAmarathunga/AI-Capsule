import { useState } from 'react';

const EMPTY = {
  project_name: '', prompt_title: '', prompt_version: '',
  prompt_text: '', response_summary: '', category: '',
  usefulness: '', reviewed: false, improved: false,
  screenshot_url: '', notes: ''
};

export default function CapsuleForm({ initial = EMPTY, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(initial);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handle = e => {
    e.preventDefault();
    onSubmit(form);
  };

  const inputCls = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500";
  const labelCls = "block text-gray-400 text-xs font-medium mb-1";

  return (
    <form onSubmit={handle} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Project Name *</label>
          <input className={inputCls} value={form.project_name} onChange={e => set('project_name', e.target.value)} required />
        </div>
        <div>
          <label className={labelCls}>Prompt Title *</label>
          <input className={inputCls} value={form.prompt_title} onChange={e => set('prompt_title', e.target.value)} required />
        </div>
        <div>
          <label className={labelCls}>Version</label>
          <input className={inputCls} placeholder="v1, v2, v3..." value={form.prompt_version} onChange={e => set('prompt_version', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Category</label>
          <select className={inputCls} value={form.category} onChange={e => set('category', e.target.value)}>
            <option value="">Select...</option>
            {['Coding', 'Writing', 'Research', 'Debugging', 'Study', 'Other'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelCls}>Prompt Text *</label>
        <textarea className={inputCls} rows={4} value={form.prompt_text} onChange={e => set('prompt_text', e.target.value)} required />
      </div>

      <div>
        <label className={labelCls}>Response Summary</label>
        <textarea className={inputCls} rows={2} value={form.response_summary} onChange={e => set('response_summary', e.target.value)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Usefulness</label>
          <select className={inputCls} value={form.usefulness} onChange={e => set('usefulness', e.target.value)}>
            <option value="">Select...</option>
            <option value="Good">Good</option>
            <option value="Needs Improvement">Needs Improvement</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Screenshot URL</label>
          <input className={inputCls} placeholder="https://..." value={form.screenshot_url} onChange={e => set('screenshot_url', e.target.value)} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Notes</label>
        <textarea className={inputCls} rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
          <input type="checkbox" checked={form.reviewed} onChange={e => set('reviewed', e.target.checked)} className="accent-indigo-500" />
          Reviewed
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
          <input type="checkbox" checked={form.improved} onChange={e => set('improved', e.target.checked)} className="accent-indigo-500" />
          Improved
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium text-sm disabled:opacity-50">
          {loading ? 'Saving...' : 'Save Capsule'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium text-sm">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
