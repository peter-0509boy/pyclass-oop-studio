import {useState} from 'react';
import {ConceptQuiz} from './components/ConceptQuiz';
import {ConceptVisualizer} from './components/ConceptVisualizer';
import {Navbar} from './components/Navbar';
import {PythonSandbox} from './components/PythonSandbox';
import {SyntaxInheritance} from './components/SyntaxInheritance';
import {ModuleId} from './types/oop';

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleId>('visualizer');

  return (
    <div className="min-h-screen bg-[#070B12] text-[#E2E8F0] flex flex-col">
      <Navbar
        activeModule={activeModule}
        onSelectModule={setActiveModule}
      />

      <main className="flex-1 w-full max-w-[1360px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {activeModule === 'visualizer' && <ConceptVisualizer />}
        {activeModule === 'syntax' && <SyntaxInheritance />}
        {activeModule === 'sandbox' && <PythonSandbox />}
        {activeModule === 'quiz' && <ConceptQuiz />}
      </main>

      <footer className="border-t border-[#1E293B] bg-[#070B12]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#64748B]">
          <span>
            PyClass Studio · Python 類別與物件（OOP）互動學習平台
          </span>
          <span className="text-[#94A3B8] font-medium tabular-nums">
            資訊科 徐得翔 (B11413001)
          </span>
        </div>
      </footer>
    </div>
  );
}
