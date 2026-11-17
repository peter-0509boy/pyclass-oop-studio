export type ModuleId = 'visualizer' | 'syntax' | 'sandbox' | 'quiz';

export type HeroRole = 'Knight' | 'Mage' | 'Ranger';

export interface HeroRoleOption {
  id: HeroRole;
  label: string;
  titleZh: string;
  defaultHp: number;
  defaultAtk: number;
  skillName: string;
}

export interface HeroInstance {
  id: string;
  varName: string;
  memAddress: string;
  name: string;
  role: HeroRole;
  level: number;
  hp: number;
  maxHp: number;
  atk: number;
  lastAction: string;
  actionCount: number;
}

export interface ConceptNode {
  id: 'class' | 'init' | 'self' | 'attributes' | 'methods';
  keyword: string;
  titleZh: string;
  metaphor: string;
  explanation: string;
  codePreview: string;
}

export interface AnnotatedLine {
  lineNumber: number;
  code: string;
  note: string;
  conceptTag?: string;
}

export interface SyntaxLesson {
  id: 'basic' | 'encapsulation' | 'inheritance';
  title: string;
  subtitle: string;
  summary: string;
  lines: AnnotatedLine[];
}

export interface SandboxPreset {
  id: string;
  title: string;
  description: string;
  code: string;
}

export type PyodideEngineState = 'idle' | 'loading' | 'ready' | 'running' | 'error';

export interface ZhDebugHint {
  errorType: string;
  lineNumber: number | null;
  title: string;
  suggestion: string;
}

export interface PythonExecutionResult {
  success: boolean;
  stdout: string;
  stderr: string;
  zhHint: ZhDebugHint | null;
  durationMs: number;
}

export interface QuizQuestion {
  id: number;
  topic: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
