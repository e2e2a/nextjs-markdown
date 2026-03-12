'use client';
import { useState, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { markdownLivePreviewField } from '@/features/editor/plugins';

export default function SimpleEditorPage() {
  const [value, setValue] = useState('# Debug Mode\nClick around to test latency.');
  console.log('rerendering');
  const onChange = useCallback((val: string) => {
    setValue(val);
  }, []);

  return (
    <div className="p-10 bg-[#191d24] min-h-screen text-white">
      <div className="mb-4 space-y-2">
        <h1 className="text-2xl font-bold">Isolation Test</h1>
        <p className="text-sm text-gray-400">
          If this is fast, the issue is in your <b>Yjs provider</b>, <b>StateFields</b>, or <b>Zustand</b> sync logic.
        </p>
      </div>

      <div className="border border-white/10 rounded-lg overflow-hidden">
        <CodeMirror
          value={value}
          height="400px"
          theme="dark"
          extensions={[
            markdownLivePreviewField,
            markdown({
              base: markdownLanguage,
              codeLanguages: languages,
            }),
          ]}
          onChange={onChange}
          // Using basicSetup to see if standard features cause lag
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
            bracketMatching: true,
          }}
        />
      </div>

      <div className="mt-10 p-4 bg-black/20 rounded">
        <h2 className="text-sm font-mono mb-2 text-blue-400">Diagnostic Steps:</h2>
        <ul className="list-disc ml-5 text-sm space-y-1 text-gray-300">
          <li>Open Chrome DevTools {'>'} Performance tab.</li>
          <li>Click the editor. If the yellow block is tiny, the lag is gone.</li>
          <li>
            If it still lags here, the problem is likely your <b>Next.js layout</b> or a global <b>CSS filter/blur</b> (backdrop-blur-sm can be a killer).
          </li>
        </ul>
      </div>
    </div>
  );
}
