import {ModuleId} from '../types/oop';

interface NavbarProps {
  activeModule: ModuleId;
  onSelectModule: (moduleId: ModuleId) => void;
}

const NAV_ITEMS: {id: ModuleId; label: string}[] = [
  {id: 'visualizer', label: '藍圖與實體'},
  {id: 'syntax', label: '語法與繼承'},
  {id: 'sandbox', label: '程式沙盒'},
  {id: 'quiz', label: '觀念測驗'},
];

export function Navbar({activeModule, onSelectModule}: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#1E293B] bg-[#070B12]/90 backdrop-blur-md">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <button
          type="button"
          onClick={() => onSelectModule('visualizer')}
          className="font-display text-lg font-bold tracking-tight text-white hover:text-[#38BDF8] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] rounded"
        >
          PyClass Studio
        </button>

        {/* Zone 2: Four concise single-line module navigation tabs */}
        <nav
          aria-label="學習模組導覽"
          className="flex items-center gap-1 sm:gap-6 overflow-x-auto no-scrollbar"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectModule(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative py-2 px-2.5 sm:px-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] rounded ${
                  isActive
                    ? 'text-[#38BDF8]'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-[13px] h-0.5 bg-[#38BDF8]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Creator Attribution (Clean unboxed typography) */}
        <div className="hidden md:block text-xs font-medium text-[#94A3B8] whitespace-nowrap shrink-0 tabular-nums">
          資訊科 徐得翔 (B11413001)
        </div>
      </div>
    </header>
  );
}
