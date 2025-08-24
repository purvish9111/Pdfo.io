
interface ToolsToggleProps {
  activeTab: 'pdf' | 'other';
  onTabChange: (tab: 'pdf' | 'other') => void;
}

export function ToolsToggle({ activeTab, onTabChange }: ToolsToggleProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="relative bg-gray-100 dark:bg-gray-800 rounded-full p-1 w-80 mx-auto">
        {/* Sliding Background */}
        <div
          className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-gray-700 rounded-full shadow-md transition-transform duration-300 ease-out ${
            activeTab === 'pdf' ? 'translate-x-0' : 'translate-x-[calc(100%+8px)]'
          }`}
        />
        
        {/* Toggle Buttons */}
        <div className="relative flex">
          <button
            onClick={() => onTabChange('pdf')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors duration-200 rounded-full relative z-10 ${
              activeTab === 'pdf'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <i className="fas fa-file-pdf text-lg"></i>
              PDF Tools
            </span>
          </button>
          
          <button
            onClick={() => onTabChange('other')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors duration-200 rounded-full relative z-10 ${
              activeTab === 'other'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <i className="fas fa-tools text-lg"></i>
              Other Tools
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}