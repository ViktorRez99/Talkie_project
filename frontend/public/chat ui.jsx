// Talkie Chat Interface with custom contacts + working search, emoji button (no action) and attachment button

function MessageBubble({ msg }) {
  const mine = msg.sender === 'me';
  return (
    <div className={`mb-4 flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${mine ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-white'}`}>
        <p>{msg.text}</p>
        <p className={`text-xs mt-1 ${mine ? 'text-cyan-100' : 'text-gray-400'}`}>{msg.time}</p>
      </div>
    </div>
  );
}
const MemoMessageBubble = React.memo(MessageBubble);

function MessageInput({ onSend, onAttach }) {
  const [value, setValue] = React.useState('');
  const inputRef = React.useRef(null);
  const fileRef = React.useRef(null);

  const handleChange = React.useCallback((e) => setValue(e.target.value), []);
  const handleSend = React.useCallback(() => {
    const text = value.trim();
    if (!text) return;
    onSend(text);
    setValue('');
    inputRef.current?.focus();
  }, [value, onSend]);
  const handleKeyDown = React.useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleAttachClick = () => fileRef.current?.click();
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onAttach(file);
      e.target.value = '';
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Emoji button only (no picker / no insertion) */}
      <button type="button" title="Emoji" aria-label="Emoji" className="bg-gray-700 hover:bg-gray-600 text-yellow-300 p-2 rounded-lg" onClick={() => {}}>
        😊
      </button>

      {/* Attachment button */}
      <button type="button" title="Attach" aria-label="Attach" onClick={handleAttachClick} className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg">
        📎
      </button>
      <input ref={fileRef} type="file" className="hidden" onChange={handleFileChange} />

      <input ref={inputRef} type="text" value={value} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="Type a message..." className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-cyan-500 focus:outline-none" autoComplete="off" autoCorrect="off" spellCheck={false} />
      <button type="button" onClick={handleSend} className="bg-cyan-500 hover:bg-cyan-600 text-white p-2 rounded-lg">➤</button>
    </div>
  );
}
const MemoMessageInput = React.memo(MessageInput);

function App() {
  const [currentView, setCurrentView] = React.useState('welcome');
  const [selectedId, setSelectedId] = React.useState(null);
  const [search, setSearch] = React.useState('');
  const [conversations, setConversations] = React.useState(() => {
    const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return [
      { id: 'piyali', name: 'Piyali Das', avatar: 'https://placehold.co/40x40/4A90E2/FFFFFF?text=PD', messages: [ { text: 'Hey, how are you doing today?', time: '2:30 PM', sender: 'other' }, { text: "I'm doing great! Thanks for asking. How about you?", time: '2:31 PM', sender: 'me' }, { text: "That's wonderful to hear! I'm doing well too.", time: '2:32 PM', sender: 'other' } ], unread: 2, time: '2:30 PM', lastMessage: 'Following up on the report...' },
      { id: 'sayan', name: 'Sayan Ghosh', avatar: 'https://placehold.co/40x40/E94B3C/FFFFFF?text=SG', messages: [ { text: 'Metrics are exceeding targets this week.', time: now(), sender: 'other' } ], unread: 1, time: '1:15 PM', lastMessage: 'Metrics are exceeding...' },
      { id: 'ankur', name: 'Ankur Barik', avatar: 'https://placehold.co/40x40/F39C12/FFFFFF?text=AB', messages: [ { text: 'Thanks for the code review feedback!', time: now(), sender: 'other' } ], unread: 0, time: '12:45 PM', lastMessage: 'Thanks for the review...' },
      { id: 'ayan', name: 'Ayan Bose', avatar: 'https://placehold.co/40x40/9B59B6/FFFFFF?text=AY', messages: [ { text: 'Deployment successful!', time: '11:30 AM', sender: 'other' } ], unread: 0, time: '11:30 AM', lastMessage: 'Deployment successful!' },
      { id: 'jaya', name: 'Jaya Mondal', avatar: 'https://placehold.co/40x40/1ABC9C/FFFFFF?text=JM', messages: [ { text: 'Meeting rescheduled to 3 PM today.', time: '10:15 AM', sender: 'other' } ], unread: 0, time: '10:15 AM', lastMessage: 'Meeting rescheduled...' },
      { id: 'megha', name: 'Megha Saha', avatar: 'https://placehold.co/40x40/2ECC71/FFFFFF?text=MS', messages: [ { text: 'Can we sync at 5 PM?', time: now(), sender: 'other' } ], unread: 0, time: now(), lastMessage: 'Can we sync at 5 PM?' },
      { id: 'lokesh', name: 'Lokesh C', avatar: 'https://placehold.co/40x40/34495E/FFFFFF?text=LC', messages: [ { text: 'Shared the latest build.', time: now(), sender: 'other' } ], unread: 0, time: now(), lastMessage: 'Shared the latest build.' }
    ];
  });

  const currentConv = React.useMemo(() => conversations.find(c => c.id === selectedId) || null, [conversations, selectedId]);

  const openConversation = (id) => {
    setSelectedId(id);
    setCurrentView('chat');
    setConversations(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
  };

  const goBackToWelcome = React.useCallback(() => {
    // Ensure back always returns to welcome and clears selection
    setSelectedId(null);
    setCurrentView('welcome');
  }, []);

  const handleSend = React.useCallback((text) => {
    setConversations(prev => prev.map(c => {
      if (c.id !== selectedId) return c;
      const newMsg = { text, sender: 'me', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      return { ...c, messages: [...c.messages, newMsg], lastMessage: text, time: newMsg.time };
    }));
  }, [selectedId]);

  const handleAttach = React.useCallback((file) => {
    if (!selectedId) return;
    const label = `[Attachment: ${file.name}]`;
    handleSend(label);
  }, [handleSend, selectedId]);

  const filteredConversations = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.lastMessage && c.lastMessage.toLowerCase().includes(q))
    );
  }, [conversations, search]);

  const ConversationItem = React.memo(function ConversationItem({ conversation, active }) {
    return (
      <div className={`flex items-center p-3 cursor-pointer border-b border-gray-700 ${active ? 'bg-gray-800' : 'hover:bg-gray-700'}`} onClick={() => openConversation(conversation.id)}>
        <img src={conversation.avatar} alt={conversation.name} className="w-12 h-12 rounded-full mr-3" />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <h3 className="text-white font-medium truncate">{conversation.name}</h3>
            <span className="text-gray-400 text-sm">{conversation.time}</span>
          </div>
          <p className="text-gray-400 text-sm truncate">{conversation.lastMessage}</p>
        </div>
        {conversation.unread > 0 && (
          <div className="bg-cyan-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center ml-2">{conversation.unread}</div>
        )}
      </div>
    );
  });

  const WelcomeView = React.memo(function WelcomeView() {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-800 text-center px-8">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mb-6 mx-auto">
            <div className="text-cyan-400 text-3xl">💬</div>
          </div>
        </div>
        <h1 className="text-5xl font-bold text-white mb-6">Welcome to <span className="text-cyan-400">Talkie</span></h1>
        <p className="text-gray-300 text-xl mb-12 max-w-2xl leading-relaxed">Experience seamless communication with our industry-leading chat platform designed for modern teams.</p>
        <div className="flex gap-4">
          <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors" onClick={() => setCurrentView('chat')}>
            <span className="text-xl">+</span>
            Start New Conversation
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors">
            <span className="text-lg">👥</span>
            Explore Contacts
          </button>
        </div>
      </div>
    );
  });

  const ChatView = React.memo(function ChatView({ conv }) {
    if (!conv) return null;
    return (
      <div className="flex-1 flex flex-col bg-gray-800">
        <div className="bg-gray-900 p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={goBackToWelcome} className="text-gray-400 hover:text-white mr-4" aria-label="Back">←</button>
            <img src={conv.avatar} alt={conv.name} className="w-10 h-10 rounded-full mr-3" />
            <div>
              <h3 className="text-white font-medium">{conv.name}</h3>
              <p className="text-cyan-400 text-sm">Online</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="bg-cyan-500 hover:bg-cyan-600 text-white p-2 rounded-lg">📞</button>
            <button className="bg-cyan-500 hover:bg-cyan-600 text-white p-2 rounded-lg">📹</button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg">ℹ️</button>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {conv.messages.map((msg, index) => (
            <MemoMessageBubble key={index} msg={msg} />
          ))}
        </div>

        <div className="p-4 border-t border-gray-700">
          <MemoMessageInput onSend={handleSend} onAttach={handleAttach} />
        </div>
      </div>
    );
  });

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-96 bg-gray-900 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center mb-4">
            <button className="bg-cyan-500 text-white p-2 rounded-lg mr-3">≡</button>
            <h1 className="text-xl font-bold text-white">Messages</h1>
          </div>
          <div className="relative">
            <input type="text" placeholder="Search conversations..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-gray-800 text-white px-4 py-2 pl-10 rounded-lg border border-gray-600 focus:border-cyan-500 focus:outline-none" />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length ? (
            filteredConversations.map((c) => (
              <ConversationItem key={c.id} conversation={c} active={c.id === selectedId} />
            ))
          ) : (
            <div className="text-gray-400 p-4">No conversations found</div>
          )}
        </div>
      </div>

      {/* Main Content */}
      {currentView === 'welcome' && !currentConv ? (
        <WelcomeView />
      ) : (
        <ChatView conv={currentConv || filteredConversations.find(c=>c.id===selectedId) || filteredConversations[0] || conversations[0]} />
      )}
    </div>
  );
}