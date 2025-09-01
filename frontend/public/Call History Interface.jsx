function App() {
  const [activeTab, setActiveTab] = React.useState('history');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [dialNumber, setDialNumber] = React.useState('');
  const [showAppSelector, setShowAppSelector] = React.useState(false);
  const [groupSelection, setGroupSelection] = React.useState([]);
  const [callHistory, setCallHistory] = React.useState([
    { id: 1, name: 'Megha Saha', date: '31/08/2024', time: '10:30 AM' },
    { id: 2, name: 'Ankur Barik', date: '30/08/2024', time: '2:15 PM' },
    { id: 3, name: 'Sayan Ghosh', date: '29/08/2024', time: '9:45 AM' },
    { id: 4, name: 'Piyali Das', date: '28/08/2024', time: '4:20 PM' },
    { id: 5, name: 'Jaya Mondal', date: '27/08/2024', time: '11:00 AM' },
    { id: 6, name: 'Barna Ghosh', date: '26/08/2024', time: '3:30 PM' }
  ]);

  const filteredHistory = React.useMemo(() => 
    callHistory.filter(contact =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    ), [callHistory, searchQuery]
  );

  const handleDelete = React.useCallback((id) => {
    setCallHistory(prev => prev.filter(contact => contact.id !== id));
    setGroupSelection(prev => prev.filter(sel => sel !== id));
  }, []);

  const handleCall = React.useCallback((isGroup = false) => {
    setShowAppSelector(true);
  }, []);

  const toggleGroupSelect = React.useCallback((id) => {
    setGroupSelection(prev =>
      prev.includes(id) ? prev.filter(sel => sel !== id) : [...prev, id]
    );
  }, []);

  const selectAllContacts = React.useCallback(() => {
    if (groupSelection.length === filteredHistory.length) {
      setGroupSelection([]);
    } else {
      setGroupSelection(filteredHistory.map(contact => contact.id));
    }
  }, [groupSelection.length, filteredHistory]);

  const handleSearchChange = React.useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleDialChange = React.useCallback((e) => {
    setDialNumber(e.target.value);
  }, []);

  const addToDialNumber = React.useCallback((num) => {
    setDialNumber(prev => prev + num);
  }, []);

  const clearDialNumber = React.useCallback(() => {
    setDialNumber('');
  }, []);

  const closeModal = React.useCallback(() => {
    setShowAppSelector(false);
    setGroupSelection([]);
  }, []);

  return (
    <div className="max-w-md mx-auto bg-gray-900 min-h-screen text-white">
      {/* Header - keeping blue as requested */}
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-semibold">Call History</h1>
      </div>
      
      {/* Tab Navigation - keeping blue as requested */}
      <div className="flex bg-gray-800 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('history')}
          className={"flex-1 p-4 text-center font-medium " + (activeTab === 'history' ? 'text-blue-400 border-b-2 border-blue-500' : 'text-gray-400')}
        >
          📋 History
        </button>
        <button
          onClick={() => setActiveTab('keypad')}
          className={"flex-1 p-4 text-center font-medium " + (activeTab === 'keypad' ? 'text-blue-400 border-b-2 border-blue-500' : 'text-gray-400')}
        >
          🔢 Keypad
        </button>
      </div>
      
      {/* Content */}
      {activeTab === 'history' ? (
        <div className="p-4">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>

          {/* Group Call Controls */}
          <div className="mb-4 flex justify-between items-center">
            <button
              onClick={selectAllContacts}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm"
            >
              {groupSelection.length === filteredHistory.length ? 'Deselect All' : 'Select All'}
            </button>
            
            {groupSelection.length >= 2 && (
              <button
                onClick={() => handleCall(true)}
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
              >
                👥 Group Call ({groupSelection.length})
              </button>
            )}
          </div>
          
          <div className="space-y-2">
            {filteredHistory.map(contact => (
              <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-750">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={groupSelection.includes(contact.id)} 
                    onChange={() => toggleGroupSelect(contact.id)} 
                    className="mr-3 w-4 h-4 accent-blue-500"
                  />
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                    {contact.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{contact.name}</div>
                    <div className="text-sm text-gray-400">{contact.date} • {contact.time}</div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleCall()}
                    className="p-2 text-green-400 hover:bg-gray-700 rounded-full"
                    title="Voice Call"
                  >
                    📞
                  </button>
                  <button 
                    onClick={() => handleCall()}
                    className="p-2 text-blue-400 hover:bg-gray-700 rounded-full"
                    title="Video Call"
                  >
                    📹
                  </button>
                  <button 
                    onClick={() => handleDelete(contact.id)}
                    className="p-2 text-red-400 hover:bg-gray-700 rounded-full"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {searchQuery && filteredHistory.length === 0 && (
            <div className="text-center text-gray-400 mt-8">
              No contacts found matching "{searchQuery}"
            </div>
          )}
        </div>
      ) : (
        <div className="p-4">
          <div className="mb-6">
            <input
              type="text"
              value={dialNumber}
              onChange={handleDialChange}
              placeholder="Enter number"
              className="w-full p-4 text-center text-2xl border border-gray-600 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[1,2,3,4,5,6,7,8,9,'*',0,'#'].map(num => (
              <button
                key={num}
                onClick={() => addToDialNumber(num)}
                className="h-16 text-2xl font-semibold bg-gray-800 border border-gray-600 text-white rounded-lg hover:bg-gray-700 active:bg-gray-600"
              >
                {num}
              </button>
            ))}
          </div>
          
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => handleCall()}
              className="px-8 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 flex items-center"
            >
              📞 Call
            </button>
            <button 
              onClick={clearDialNumber}
              className="px-8 py-3 bg-gray-600 text-white rounded-full hover:bg-gray-700"
            >
              Clear
            </button>
          </div>
        </div>
      )}
      
      {/* App Selector Modal */}
      {showAppSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-80 border border-gray-600">
            <h3 className="text-lg font-semibold mb-4 text-white">
              {groupSelection.length > 1 ? "Start group call with " + groupSelection.length + " people" : 'Select an app to open the "tel" link'}
            </h3>
            <div className="space-y-2">
              {['Google Chrome', 'Microsoft Edge', 'Microsoft Teams', 'Phone Link', 'WhatsApp'].map(app => (
                <div key={app} className="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer">
                  <div className="w-8 h-8 bg-blue-500 rounded mr-3"></div>
                  <span className="text-white">{app}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button 
                onClick={() => setShowAppSelector(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button 
                onClick={closeModal}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}