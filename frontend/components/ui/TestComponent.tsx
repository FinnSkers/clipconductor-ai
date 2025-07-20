import React from 'react';

// Test component to verify basic React functionality without external imports
interface TestComponentProps {
  title: string;
  description?: string;
}

const TestComponent: React.FC<TestComponentProps> = ({ title, description }) => {
  const [count, setCount] = React.useState(0);

  return (
    <div className="p-4 bg-dark-100 rounded-lg border border-dark-200">
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      {description && (
        <p className="text-dark-400 text-sm mb-4">{description}</p>
      )}
      <div className="space-y-2">
        <p className="text-white">Count: {count}</p>
        <div className="space-x-2">
          <button
            onClick={() => setCount(count + 1)}
            className="px-3 py-1 bg-gaming-400 text-white rounded hover:bg-gaming-500 transition-colors"
          >
            Increment
          </button>
          <button
            onClick={() => setCount(0)}
            className="px-3 py-1 bg-dark-200 text-white rounded hover:bg-dark-300 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestComponent;
