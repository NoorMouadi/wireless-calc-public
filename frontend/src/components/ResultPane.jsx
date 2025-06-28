import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

export default function ResultPane({ result }) {
  if (!result) return null;

  const explanationLines = result.explanation
    .split(/\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  return (
    <div className="mt-8 space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Raw Results</h3>
        <pre className="bg-gray-50 p-4 rounded overflow-x-auto text-sm">
          {JSON.stringify(result.numbers, null, 2)}
        </pre>
      </div>

      <div>
        <h3 className="text-lg font-semibold">AI Explanation</h3>
        <div className="bg-white p-4 rounded shadow text-sm leading-relaxed space-y-3">
          {explanationLines.map((line, idx) => {
            if (line.startsWith("\\[") && line.endsWith("\\]")) {
              const mathContent = line.slice(2, -2).trim(); // Remove \[ and \]
              return <BlockMath key={idx} math={mathContent} />;
            } else {
              return <p key={idx}>{line}</p>;
            }
          })}
        </div>
      </div>
    </div>
  );
}
