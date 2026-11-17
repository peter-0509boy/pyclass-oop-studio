import {PythonExecutionResult, ZhDebugHint} from '../types/oop';

interface PyodideInstance {
  runPythonAsync: (code: string) => Promise<unknown>;
  globals: {
    set: (key: string, value: unknown) => void;
    get: (key: string) => unknown;
  };
}

declare global {
  interface Window {
    loadPyodide?: (options?: {indexURL?: string}) => Promise<PyodideInstance>;
  }
}

const PYODIDE_VERSION = 'v0.29.3';
const PYODIDE_BASE_URL = `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/`;
const PYODIDE_SCRIPT_URL = `${PYODIDE_BASE_URL}pyodide.js`;

let pyodidePromise: Promise<PyodideInstance> | null = null;
let pyodideReadyInstance: PyodideInstance | null = null;

function injectPyodideScript(): Promise<void> {
  if (typeof window.loadPyodide === 'function') {
    return Promise.resolve();
  }

  const existing = document.querySelector<HTMLScriptElement>(
    `script[src="${PYODIDE_SCRIPT_URL}"]`
  );
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve(), {once: true});
      existing.addEventListener(
        'error',
        () => reject(new Error('無法載入 Pyodide CDN 腳本')),
        {once: true}
      );
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = PYODIDE_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error('無法連線至 Pyodide WebAssembly 伺服器，請檢查網路狀態。'));
    document.head.appendChild(script);
  });
}

export function isPyodideLoaded(): boolean {
  return pyodideReadyInstance !== null;
}

export async function getPyodide(): Promise<PyodideInstance> {
  if (pyodideReadyInstance) {
    return pyodideReadyInstance;
  }

  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      await injectPyodideScript();
      if (typeof window.loadPyodide !== 'function') {
        throw new Error('Pyodide 初始化函式不存在');
      }
      const instance = await window.loadPyodide({
        indexURL: PYODIDE_BASE_URL,
      });
      pyodideReadyInstance = instance;
      return instance;
    })().catch((err) => {
      pyodidePromise = null;
      throw err;
    });
  }

  return pyodidePromise;
}

export function translatePythonErrorToZh(
  rawTraceback: string,
  userCode: string
): ZhDebugHint {
  const lineMatches = [...rawTraceback.matchAll(/File "<exec>", line (\d+)/g)];
  const lastMatch = lineMatches[lineMatches.length - 1];
  const lineNumber = lastMatch ? Number.parseInt(lastMatch[1], 10) : null;

  const lines = userCode.split('\n');
  const offendingLine =
    lineNumber && lineNumber >= 1 && lineNumber <= lines.length
      ? lines[lineNumber - 1].trim()
      : '';

  if (rawTraceback.includes('IndentationError')) {
    return {
      errorType: 'IndentationError（縮排錯誤）',
      lineNumber,
      title: '縮排空格數不一致或缺少縮排',
      suggestion:
        'Python 嚴格依賴縮排來分辨程式區塊！請檢查 class 內的方法是否統一縮排 4 個空白鍵，且方法內部的程式碼是否再多縮排一層。',
    };
  }

  if (rawTraceback.includes('SyntaxError')) {
    const missingColon =
      offendingLine.startsWith('class ') ||
      offendingLine.startsWith('def ') ||
      offendingLine.startsWith('if ') ||
      offendingLine.startsWith('else') ||
      offendingLine.startsWith('elif ') ||
      offendingLine.startsWith('for ');

    return {
      errorType: 'SyntaxError（語法錯誤）',
      lineNumber,
      title: missingColon && !offendingLine.endsWith(':')
        ? '行尾似乎忘記加上冒號「:」'
        : '程式碼寫法不符合 Python 語法規則',
      suggestion:
        missingColon && !offendingLine.endsWith(':')
          ? `第 ${lineNumber ?? ''} 行的 class、def 或 if 結尾通常需要加上英文冒號「:」，請檢查是否漏掉或誤打了全形符號。`
          : '請檢查是否使用到全形括號/引號（如（）、＂＂），或檢查括號與引號是否成對閉合。',
    };
  }

  if (rawTraceback.includes('TypeError')) {
    if (
      rawTraceback.includes('takes') &&
      rawTraceback.includes('positional argument')
    ) {
      return {
        errorType: 'TypeError（參數數量不符）',
        lineNumber,
        title: '方法定義可能忘記寫 self，或傳入參數數量有誤',
        suggestion:
          '在 class 的方法裡（例如 def greet(self):），第一個參數必須保留給 self！呼叫物件方法時 Python 會自動多傳一個物件本身進來，如果漏寫 self 就會出現「給了太多參數」的錯誤。',
      };
    }

    return {
      errorType: 'TypeError（型別不相容）',
      lineNumber,
      title: '不同資料型別無法直接進行運算，或建構子參數不對',
      suggestion:
        '請確認呼叫 Hero(...) 建立實體時傳入的參數個數是否與 __init__ 一致，或是檢查是否將文字 (str) 與數字 (int) 直接相加。',
    };
  }

  if (rawTraceback.includes('NameError')) {
    const nameMatch = rawTraceback.match(/name '([^']+)' is not defined/);
    const missingName = nameMatch ? nameMatch[1] : '';
    return {
      errorType: 'NameError（找不到名稱）',
      lineNumber,
      title: missingName
        ? `找不到變數或類別「${missingName}」`
        : '使用了尚未定義的變數或類別名稱',
      suggestion:
        missingName === 'self'
          ? '這裡找不到 self！請確認該方法的第一個參數是否有寫上 (self)，或該行程式碼是否正確寫在 class 縮排裡面。'
          : `請檢查「${missingName || '該名稱'}」是否拼字大小寫有誤（Python 區分大小寫），或還沒建立變數就直接呼叫它。`,
    };
  }

  if (rawTraceback.includes('AttributeError')) {
    const attrMatch = rawTraceback.match(/has no attribute '([^']+)'/);
    const attrName = attrMatch ? attrMatch[1] : '';
    return {
      errorType: 'AttributeError（找不到屬性或方法）',
      lineNumber,
      title: attrName
        ? `物件沒有「.${attrName}」這個屬性或方法`
        : '物件沒有這個屬性或方法',
      suggestion:
        '請確認這個屬性是否有在 __init__ 裡透過 self.xxx = ... 建立起來，或者檢查呼叫的方法名稱有沒有拼錯。',
    };
  }

  if (rawTraceback.includes('ZeroDivisionError')) {
    return {
      errorType: 'ZeroDivisionError（除以零錯誤）',
      lineNumber,
      title: '數學運算的除數不可為 0',
      suggestion: '請檢查計算公式中的分母或除數是否變成了 0。',
    };
  }

  return {
    errorType: 'RuntimeError（執行期錯誤）',
    lineNumber,
    title: '程式執行過程中發生未預期錯誤',
    suggestion:
      '請參考上方終端機指出的行號與錯誤類型，確認物件屬性名稱、縮排與括號是否正確。',
  };
}

export async function executePythonCode(
  code: string
): Promise<PythonExecutionResult> {
  const start = performance.now();
  const pyodide = await getPyodide();

  // Pass user code safely into Python namespace and capture stdout + traceback
  pyodide.globals.set('__user_code__', code);

  const wrapperScript = `
import sys, io, traceback, json

_stdout_buf = io.StringIO()
_stderr_buf = io.StringIO()
_old_stdout, _old_stderr = sys.stdout, sys.stderr
sys.stdout, sys.stderr = _stdout_buf, _stderr_buf

_ok = True
_err_text = ""
_exec_ns = {"__name__": "__main__"}

try:
    _compiled = compile(__user_code__, "<exec>", "exec")
    exec(_compiled, _exec_ns)
except Exception:
    _ok = False
    _err_text = traceback.format_exc()
finally:
    sys.stdout, sys.stderr = _old_stdout, _old_stderr

json.dumps({
    "ok": _ok,
    "stdout": _stdout_buf.getvalue(),
    "stderr": _stderr_buf.getvalue() + _err_text
})
`;

  try {
    const rawJson = await pyodide.runPythonAsync(wrapperScript);
    const parsed = JSON.parse(String(rawJson)) as {
      ok: boolean;
      stdout: string;
      stderr: string;
    };
    const durationMs = Math.round(performance.now() - start);

    return {
      success: parsed.ok,
      stdout: parsed.stdout,
      stderr: parsed.stderr,
      zhHint: parsed.ok ? null : translatePythonErrorToZh(parsed.stderr, code),
      durationMs,
    };
  } catch (err) {
    const durationMs = Math.round(performance.now() - start);
    const errMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      stdout: '',
      stderr: errMsg,
      zhHint: translatePythonErrorToZh(errMsg, code),
      durationMs,
    };
  }
}
