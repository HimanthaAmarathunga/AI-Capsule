export default function CapsuleCard({ capsule, onEdit, onDelete }) {
  const badge = (text, color) => text ? (
    <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>{text}</span>
  ) : null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-white font-semibold text-base">{capsule.prompt_title}</h3>
          <p className="text-gray-500 text-xs mt-0.5">{capsule.project_name} {capsule.prompt_version && `· ${capsule.prompt_version}`}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => onEdit(capsule)}
            className="text-xs bg-indigo-800 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg">Edit</button>
          <button onClick={() => onDelete(capsule.id)}
            className="text-xs bg-red-900 hover:bg-red-800 text-white px-3 py-1 rounded-lg">Delete</button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-3 text-gray-300 text-sm font-mono whitespace-pre-wrap break-words">
        {capsule.prompt_text}
      </div>

      {capsule.response_summary && (
        <div>
          <p className="text-gray-500 text-xs font-medium mb-1">Response Summary</p>
          <p className="text-gray-400 text-sm">{capsule.response_summary}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 items-center">
        {badge(capsule.category, 'bg-blue-900 text-blue-300')}
        {badge(capsule.usefulness, capsule.usefulness === 'Good' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300')}
        {capsule.reviewed ? badge('Reviewed', 'bg-purple-900 text-purple-300') : null}
        {capsule.improved ? badge('Improved', 'bg-teal-900 text-teal-300') : null}
      </div>

      {capsule.notes && <p className="text-gray-500 text-xs italic">{capsule.notes}</p>}
      {capsule.screenshot_url && (
        <a href={capsule.screenshot_url} target="_blank" rel="noreferrer"
          className="text-indigo-400 text-xs underline">View Screenshot</a>
      )}
      <p className="text-gray-700 text-xs">{new Date(capsule.created_at).toLocaleString()}</p>
    </div>
  );
}
