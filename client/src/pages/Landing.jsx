export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold mb-4 text-indigo-400">🧠 AI Capsule</h1>
        <p className="text-gray-300 text-lg mb-2">
          Your private prompt library. Save, organise and improve the AI prompts that actually work.
        </p>
        <p className="text-gray-500 text-sm mb-10">
          Never lose a great prompt again. Sign in with GitHub to get started.
        </p>
        <a
          href="/auth/github"
          className="inline-flex items-center gap-3 bg-white text-gray-900 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition text-lg"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.7 2.6 1.2 3.2.9.1-.7.4-1.2.7-1.5-2.5-.3-5.2-1.3-5.2-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.2 5.7.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6C20.2 21.4 23.5 17.1 23.5 12 23.5 5.65 18.35.5 12 .5z"/>
          </svg>
          Sign in with GitHub
        </a>
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          {[
            { icon: '💾', title: 'Save Prompts', desc: 'Store prompts with version, category, and project tags.' },
            { icon: '✏️', title: 'Edit & Improve', desc: 'Update prompts as you refine them over time.' },
            { icon: '🔒', title: 'Private & Secure', desc: 'Only you can see your own prompts. OAuth + JWT protected.' },
          ].map(f => (
            <div key={f.title} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
              <div className="text-3xl mb-2">{f.icon}</div>
              <h3 className="font-semibold text-white mb-1">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
