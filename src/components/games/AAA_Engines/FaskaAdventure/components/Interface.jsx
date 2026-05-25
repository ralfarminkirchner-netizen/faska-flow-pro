import React from 'react';
import useAdventureStore from '../store/adventureStore';

export default function Interface() {
  const {
    activeVerb,
    setActiveVerb,
    inventory,
    selectedItem,
    setSelectedItem,
    message
  } = useAdventureStore();

  const verbs = [
    'WALK TO', 'LOOK AT', 'USE',
    'TALK TO', 'TAKE', 'OPEN',
    'CLOSE', 'PUSH', 'PULL'
  ];

  const handleVerbClick = (verb) => {
    setActiveVerb(verb);
    setSelectedItem(null);
  };

  const handleInventoryClick = (item) => {
    if (activeVerb === 'USE' && !selectedItem) {
      setSelectedItem(item);
    } else {
      setSelectedItem(item);
    }
  };

  // Determine what string to show when hovering over an object or just generally
  const displayMessage = message || `${activeVerb}${selectedItem ? ` ${selectedItem.name} WITH` : ''}`;

  return (
    <div className="fixed bottom-0 left-0 w-full h-[30vh] bg-black text-[#55ff55] font-mono border-t-4 border-[#55ff55] select-none flex flex-col z-50">
      {/* Message Bar */}
      <div className="h-[20%] flex items-center justify-center text-xl md:text-2xl tracking-widest px-4 truncate">
        {displayMessage}
      </div>

      {/* Main UI Area */}
      <div className="h-[80%] flex w-full">
        {/* Left: Verbs Grid */}
        <div className="w-1/2 p-2 sm:p-4 grid grid-cols-3 grid-rows-3 gap-1 sm:gap-2">
          {verbs.map((verb) => (
            <button
              key={verb}
              onClick={() => handleVerbClick(verb)}
              className={`flex items-center justify-center text-sm sm:text-lg md:text-xl hover:text-white transition-colors uppercase ${
                activeVerb === verb ? 'text-white font-bold' : 'text-[#55ff55]'
              }`}
            >
              {verb}
            </button>
          ))}
        </div>

        {/* Right: Inventory Grid */}
        <div className="w-1/2 p-2 sm:p-4 flex flex-wrap gap-2 md:gap-4 overflow-y-auto border-l-4 border-[#55ff55]">
          {inventory.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center opacity-50 italic text-sm md:text-lg">
              Inventory Empty
            </div>
          ) : (
            inventory.map((item) => (
              <button
                key={item.id}
                onClick={() => handleInventoryClick(item)}
                className={`p-2 h-fit border-2 flex items-center justify-center ${
                  selectedItem?.id === item.id
                    ? 'border-white text-white bg-white/10'
                    : 'border-transparent text-[#55ff55] hover:border-[#55ff55]/50'
                }`}
                title={item.name}
              >
                {/* Fallback to text if item has no icon, otherwise you can render item.icon here */}
                {item.icon ? (
                  <span className="text-3xl">{item.icon}</span>
                ) : (
                  <span className="text-sm md:text-base uppercase">{item.name}</span>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
