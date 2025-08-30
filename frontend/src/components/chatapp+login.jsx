function useHashRoute() {
  const [route, setRoute] = React.useState(() => window.location.hash.replace('#', '') || '/');

  React.useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash.replace('#', '') || '/');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (to) => {
    if (!to.startsWith('#')) {
      window.location.hash = to;
    } else {
      window.location.hash = to.slice(1);
    }
  };

  return { route, navigate };
}

function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition ${
        isDark
          ? 'bg-transparent text-gray-300 border-gray-700 hover:text-white hover:border-gray-500'
          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
      }`}
      aria-label="Toggle theme"
    >
      {isDark ? <i className="fa-solid fa-moon" /> : <i className="fa-solid fa-sun" />}
      <span>{isDark ? 'Dark' : 'Light'}</span>
    </button>
  );
}

function LandingPage({ onGetStarted, theme, onToggleTheme }) {
  const isDark = theme === 'dark';
  const bg = isDark ? 'bg-black' : 'bg-white';
  const text = isDark ? 'text-gray-200' : 'text-gray-800';
  const subtext = isDark ? 'text-gray-400' : 'text-gray-600';
  const border = isDark ? 'border-gray-800' : 'border-gray-200';
  const cardBg = isDark ? 'bg-black/40' : 'bg-gray-50';
  const cardBorder = isDark ? 'border-gray-900' : 'border-gray-200';
  const heading = isDark ? 'text-white' : 'text-gray-900';
  const cta = isDark
    ? 'bg-blue-600 hover:bg-blue-700 text-white'
    : 'bg-blue-600 hover:bg-blue-700 text-white';
  const outlineBtn = isDark
    ? 'border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500'
    : 'border border-gray-300 text-gray-700 hover:text-gray-900 hover:border-gray-400';

  // Smooth scroll helper
  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={`min-h-screen ${bg} ${text}`}>
      {/* Navbar */}
      <header className={`border-b ${border} sticky top-0 z-50 backdrop-blur ${isDark ? 'bg-black/80' : 'bg-white/80'}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded grid place-items-center text-white font-bold ${
              isDark ? 'bg-blue-600' : 'bg-blue-600'
            }`}>T</div>
            <span className="text-lg font-semibold">Talkie</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <button 
              onClick={() => scrollToId('features')}
              className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Features
            </button>
            <button 
              onClick={() => scrollToId('gallery')}
              className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Gallery
            </button>
            <button 
              onClick={() => scrollToId('security')}
              className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Security
            </button>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <button onClick={onGetStarted} className={`ml-1 px-4 py-2 rounded-lg ${cta} text-sm`}>Log in</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className={`text-4xl md:text-5xl font-extrabold ${heading} leading-tight`}>
            Chat smarter. Connect faster.
          </h1>
          <p className={`mt-4 ${subtext} text-lg`}>
            Build a real‑time chat experience your users will love. Reliable, secure, and lightning fast — all in a sleek, modern interface.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button onClick={onGetStarted} className={`px-6 py-3 rounded-lg font-medium ${cta}`}>
              Let's get started
            </button>
            <button onClick={() => scrollToId('features')} className={`px-6 py-3 rounded-lg ${outlineBtn}`}>
              Learn more
            </button>
          </div>
          <div className={`mt-6 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>No credit card required</div>
        </div>
        <div className="grid gap-4">
          <img src="https://placehold.co/800x460/111/EEE?text=Chat+Dashboard+%E2%80%94+Talkie" alt="Chat dashboard preview" className={`rounded-xl border ${border}`} />
          <div className="grid grid-cols-2 gap-4">
            <img src={`https://placehold.co/600x400/${isDark ? '111/EEE' : 'f3f4f6/3b82f6'}?text=Conversation+Thread`} alt="Conversation thread" className={`rounded-xl border ${border}`} />
            <img src={`https://placehold.co/600x400/${isDark ? '111/EEE' : 'f3f4f6/10b981'}?text=Contacts+List`} alt="Contacts list" className={`rounded-xl border ${border}`} />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className={`${isDark ? 'bg-[#0b0b0b]' : 'bg-gray-50'} border-y ${border} scroll-mt-20`}>
        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-10">
          <div className={`${cardBg} border ${cardBorder} rounded-xl p-6`}>
            <div className="text-blue-500 text-xl mb-3"><i className="fa-solid fa-bolt"></i></div>
            <h3 className={`${heading} font-semibold text-lg`}>Real-time messaging</h3>
            <p className={`mt-2 ${subtext}`}>Instant delivery powered by websockets with offline fallback and retries.</p>
            <img src={`https://placehold.co/640x360/${isDark ? '0f0f0f/EEE' : 'ffffff/0f172a'}?text=Realtime+Message+Preview`} alt="Realtime preview" className={`mt-4 rounded-lg border ${border}`} />
          </div>
          <div className={`${cardBg} border ${cardBorder} rounded-xl p-6`}>
            <div className="text-green-500 text-xl mb-3"><i className="fa-solid fa-shield-halved"></i></div>
            <h3 className={`${heading} font-semibold text-lg`}>Encrypted & secure</h3>
            <p className={`mt-2 ${subtext}`}>Keep conversations private with end-to-end encryption options.</p>
            <img src={`https://placehold.co/640x360/${isDark ? '0f0f0f/EEE' : 'ffffff/0f172a'}?text=Encryption+Keys+Preview`} alt="Security preview" className={`mt-4 rounded-lg border ${border}`} />
          </div>
          <div className={`${cardBg} border ${cardBorder} rounded-xl p-6`}>
            <div className="text-purple-500 text-xl mb-3"><i className="fa-solid fa-wand-magic-sparkles"></i></div>
            <h3 className={`${heading} font-semibold text-lg`}>Modern UI/UX</h3>
            <p className={`mt-2 ${subtext}`}>Dark & light themes, responsive layouts, and accessible components.</p>
            <img src={`https://placehold.co/640x360/${isDark ? '0f0f0f/EEE' : 'ffffff/0f172a'}?text=UI+Components+Preview`} alt="UI components preview" className={`mt-4 rounded-lg border ${border}`} />
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="max-w-6xl mx-auto px-6 py-16 scroll-mt-20">
        <h2 className={`text-2xl font-bold ${heading}`}>In-app Screens</h2>
        <p className={`${subtext} mt-1`}>A glimpse of the interface you can ship.</p>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <figure className={`rounded-xl border ${border} overflow-hidden`}>
            <img src={`https://placehold.co/800x500/${isDark ? '161616/EEE' : 'eef2ff/0f172a'}?text=Group+Chat+Screen`} alt="Group chat" />
            <figcaption className={`p-3 text-sm ${subtext}`}>Group chat with typing indicators and reactions</figcaption>
          </figure>
          <figure className={`rounded-xl border ${border} overflow-hidden`}>
            <img src={`https://placehold.co/800x500/${isDark ? '161616/EEE' : 'ecfeff/0f172a'}?text=Voice+Notes+UI`} alt="Voice notes" />
            <figcaption className={`p-3 text-sm ${subtext}`}>Voice notes and waveforms</figcaption>
          </figure>
          <figure className={`rounded-xl border ${border} overflow-hidden`}>
            <img src={`https://placehold.co/800x500/${isDark ? '161616/EEE' : 'fff7ed/0f172a'}?text=Media+Sharing+UI`} alt="Media sharing" />
            <figcaption className={`p-3 text-sm ${subtext}`}>Media sharing with previews</figcaption>
          </figure>
        </div>
      </section>

      {/* Security callout */}
      <section id="security" className="max-w-6xl mx-auto px-6 pb-16 scroll-mt-20">
        <div className={`rounded-2xl p-8 md:p-10 border ${border} ${
          isDark
            ? 'bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10'
            : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
        }`}>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className={`text-2xl font-bold ${heading}`}>Security-first design</h3>
              <p className={`mt-2 ${subtext}`}>Role-based access, device verification, and audit trails to protect your community.</p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <img src={`https://placehold.co/300x180/${isDark ? '0b0b0b/EEE' : 'ffffff/0f172a'}?text=2FA`} alt="2FA" className={`rounded-lg border ${border}`} />
                <img src={`https://placehold.co/300x180/${isDark ? '0b0b0b/EEE' : 'ffffff/0f172a'}?text=Device+Trust`} alt="Device trust" className={`rounded-lg border ${border}`} />
                <img src={`https://placehold.co/300x180/${isDark ? '0b0b0b/EEE' : 'ffffff/0f172a'}?text=Audit+Logs`} alt="Audit logs" className={`rounded-lg border ${border}`} />
              </div>
            </div>
            <div className="flex md:justify-end">
              <button onClick={onGetStarted} className={`px-6 py-3 rounded-lg font-semibold ${
                isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
              }`}>
                Let's get started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t ${border}`}>
        <div className="max-w-6xl mx-auto px-6 py-8 text-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className={`${subtext}`}>© {new Date().getFullYear()} Talkie</div>
          <div className="flex items-center gap-4">
            <a href="#" className={`${isDark ? 'hover:text-gray-300 text-gray-500' : 'hover:text-gray-900 text-gray-500'}`}>Terms</a>
            <a href="#" className={`${isDark ? 'hover:text-gray-300 text-gray-500' : 'hover:text-gray-900 text-gray-500'}`}>Privacy</a>
            <a href="#" className={`${isDark ? 'hover:text-gray-300 text-gray-500' : 'hover:text-gray-900 text-gray-500'}`}>Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Login({ theme, onBack }) {
  const isDark = theme === 'dark';
  const bg = isDark ? 'bg-black' : 'bg-white';
  const heading = isDark ? 'text-white' : 'text-gray-900';
  const label = isDark ? 'text-gray-700' : 'text-gray-700';
  const text = isDark ? 'text-gray-300' : 'text-gray-700';
  const inputBg = isDark ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400';
  const ring = isDark ? 'focus:ring-blue-500 focus:border-transparent' : 'focus:ring-blue-500 focus:border-blue-300';
  const btn = 'bg-blue-600 hover:bg-blue-700 text-white';
  const border = isDark ? 'border-gray-800' : 'border-gray-200';

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
  };

  return (
    <div className={`min-h-screen ${bg} flex items-center justify-center px-4`}>
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 rounded bg-blue-600 grid place-items-center text-white font-bold">T</div>
            <span className={`text-lg font-semibold ${text.replace('text-', 'text-')}`}>Talkie</span>
          </div>
          <h1 className={`text-4xl font-bold mb-2 ${heading}`}>Let's get started</h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className={`block text-sm font-medium mb-2 ${label}`}>Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3 py-3 border rounded-lg ${inputBg} ${ring}`}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className={`block text-sm font-medium mb-2 ${label}`}>Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-3 py-3 border rounded-lg pr-10 ${inputBg} ${ring}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} absolute inset-y-0 right-0 pr-3 flex items-center`}
                >
                  {showPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className={`h-4 w-4 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'} rounded focus:ring-blue-500 text-blue-600`} />
              <label htmlFor="remember-me" className={`ml-2 block text-sm ${text}`}>Remember me</label>
            </div>
            <div className="text-sm">
              <a href="#" className={`hover:underline ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}>Forgot your password?</a>
            </div>
          </div>

          <div>
            <button type="submit" className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium ${btn}`}>
              Sign in
            </button>
          </div>

          <div className="text-center">
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Don't have an account? <a href="#" className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} font-medium`}>Sign up</a></p>
          </div>
        </form>

        <div className="text-center">
          <button onClick={onBack} className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} mt-2 text-sm`}>← Back</button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const { route, navigate } = useHashRoute();
  const [theme, setTheme] = React.useState('dark');

  // Persist theme across reloads
  React.useEffect(() => {
    const saved = localStorage.getItem('chatio-theme');
    if (saved) setTheme(saved);
  }, []);
  React.useEffect(() => {
    localStorage.setItem('chatio-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  if (route === '/login' || route === 'login') {
    return <Login theme={theme} onBack={() => navigate('/')} />;
  }

  return <LandingPage theme={theme} onToggleTheme={toggleTheme} onGetStarted={() => navigate('/login')} />;
}