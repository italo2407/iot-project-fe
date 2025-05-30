// LogViewer.tsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

export interface LogItem {
  _id: string;
  createdAt: string;
  type: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  payload?: any;
  device_id: string;
  topic: string;
}

interface Props {
  logs: LogItem[];
  lastLogRef?: (node: HTMLDivElement | null) => void;
}

const LogViewer: React.FC<Props> = ({ logs, lastLogRef }) => {
  const [expandedLogId, setExpandedLogId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  const typeColors: Record<string, string> = {
    INFO: 'text-gray-600',
    WARNING: 'text-yellow-600',
    ERROR: 'text-red-600',
  };

  return (
    <div className="mt-4">
      {logs.map((log, idx) => (
        <div
          ref={lastLogRef && idx === logs.length - 1 ? lastLogRef : null}
          key={idx}
          className="border border-slate-200 rounded-lg px-4 py-3 bg-white text-sm">
          <div
            className={`cursor-pointer font-mono flex justify-between items-center ${typeColors[log.type]}`}
            onClick={() => toggleExpand(idx)}>
            <div>
              [{log.type}] {new Date(log.createdAt).toLocaleString()} →{' '}
              {log.message}
            </div>
            {log.payload && (
              <button className="text-sm text-gray-600 hover:underline">
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`transition-transform duration-200 ${
                    expandedLogId === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
            )}
          </div>

          {expandedLogId === idx && log.payload && (
            <div
              className={`mt-4 bg-gray-50 rounded-md p-4 origin-top transition-all duration-300 ease-in-out
      ${expandedLogId === idx ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-0 pointer-events-none'}
    `}
              style={{ transformOrigin: 'top' }}>
              <pre className="whitespace-pre-wrap text-xs text-gray-800">
                {JSON.stringify({ ...log.payload, topic: log.topic }, null, 2)}
              </pre>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LogViewer;
