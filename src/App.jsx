import { useState, useEffect } from 'react';
import { evaluate } from 'mathjs';
import './App.css';

function App() {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState([]);
  const [memory, setMemory] = useState(0);
  const [darkMode, setDarkMode] = useState(true);
  const [scientificMode, setScientificMode] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key >= '0' && e.key <= '9') handleInput(e.key);
      else if (['+', '-', '*', '/'].includes(e.key)) handleInput(e.key);
      else if (e.key === 'Enter') calculate();
      else if (e.key === 'Backspace') backspace();
      else if (e.key === 'Escape') clear();
      else if (e.key === '.') handleInput('.');
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [display]);

  const handleInput = (value) => {
    if (display === '0' || display === 'Error') {
      setDisplay(value);
    } else {
      setDisplay(display + value);
    }
  };

  const calculate = () => {
    try {
      const result = evaluate(display);
      const calculation = `${display} = ${result}`;
      setHistory([calculation, ...history.slice(0, 9)]);
      setDisplay(result.toString());
    } catch {
      setDisplay('Error');
    }
  };

  const clear = () => setDisplay('0');
  
  const backspace = () => {
    setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
  };

  const handleScientific = (func) => {
    try {
      let result;
      const num = parseFloat(display);
      switch(func) {
        case 'sqrt': result = Math.sqrt(num); break;
        case 'square': result = num * num; break;
        case 'sin': result = Math.sin(num * Math.PI / 180); break;
        case 'cos': result = Math.cos(num * Math.PI / 180); break;
        case 'tan': result = Math.tan(num * Math.PI / 180); break;
        case 'log': result = Math.log10(num); break;
        case 'ln': result = Math.log(num); break;
        case '1/x': result = 1 / num; break;
        default: return;
      }
      setDisplay(result.toString());
    } catch {
      setDisplay('Error');
    }
  };

  const memoryAdd = () => setMemory(memory + parseFloat(display));
  const memorySubtract = () => setMemory(memory - parseFloat(display));
  const memoryRecall = () => setDisplay(memory.toString());
  const memoryClear = () => setMemory(0);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(display);
    alert('Copied to clipboard!');
  };

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <div className="calculator">
        <div className="header">
          <h1>Smart Calculator</h1>
          <div className="controls">
            <button onClick={() => setDarkMode(!darkMode)} className="theme-btn">
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={() => setScientificMode(!scientificMode)} className="mode-btn">
              {scientificMode ? 'Basic' : 'Scientific'}
            </button>
            <button onClick={() => setShowHistory(!showHistory)} className="history-btn">
              📜
            </button>
          </div>
        </div>

        <div className="display" onClick={copyToClipboard} title="Click to copy">
          {display}
        </div>

        <div className="memory-indicator">
          {memory !== 0 && <span>M: {memory}</span>}
        </div>

        {showHistory && (
          <div className="history-panel">
            <h3>History</h3>
            {history.length === 0 ? (
              <p>No history yet</p>
            ) : (
              history.map((item, index) => (
                <div key={index} className="history-item" onClick={() => setDisplay(item.split('=')[0].trim())}>
                  {item}
                </div>
              ))
            )}
          </div>
        )}

        <div className={`buttons ${scientificMode ? 'scientific' : ''}`}>
          {scientificMode && (
            <>
              <button onClick={() => handleScientific('sin')} className="scientific">sin</button>
              <button onClick={() => handleScientific('cos')} className="scientific">cos</button>
              <button onClick={() => handleScientific('tan')} className="scientific">tan</button>
              <button onClick={() => handleScientific('log')} className="scientific">log</button>
              <button onClick={() => handleScientific('ln')} className="scientific">ln</button>
              <button onClick={() => handleScientific('sqrt')} className="scientific">√</button>
              <button onClick={() => handleScientific('square')} className="scientific">x²</button>
              <button onClick={() => handleScientific('1/x')} className="scientific">1/x</button>
              <button onClick={() => handleInput('(')} className="scientific">(</button>
              <button onClick={() => handleInput(')')} className="scientific">)</button>
              <button onClick={() => handleInput('^')} className="scientific">^</button>
              <button onClick={() => handleInput('%')} className="scientific">%</button>
            </>
          )}

          <button onClick={memoryClear} className="memory">MC</button>
          <button onClick={memoryRecall} className="memory">MR</button>
          <button onClick={memoryAdd} className="memory">M+</button>
          <button onClick={memorySubtract} className="memory">M-</button>

          <button onClick={clear} className="operator">C</button>
          <button onClick={backspace} className="operator">⌫</button>
          <button onClick={() => handleInput('/')} className="operator">÷</button>
          <button onClick={() => handleInput('*')} className="operator">×</button>

          <button onClick={() => handleInput('7')}>7</button>
          <button onClick={() => handleInput('8')}>8</button>
          <button onClick={() => handleInput('9')}>9</button>
          <button onClick={() => handleInput('-')} className="operator">−</button>

          <button onClick={() => handleInput('4')}>4</button>
          <button onClick={() => handleInput('5')}>5</button>
          <button onClick={() => handleInput('6')}>6</button>
          <button onClick={() => handleInput('+')} className="operator">+</button>

          <button onClick={() => handleInput('1')}>1</button>
          <button onClick={() => handleInput('2')}>2</button>
          <button onClick={() => handleInput('3')}>3</button>
          <button onClick={calculate} className="equals" style={{gridRow: 'span 2'}}>=</button>

          <button onClick={() => handleInput('0')} style={{gridColumn: 'span 2'}}>0</button>
          <button onClick={() => handleInput('.')}>.</button>
        </div>
      </div>
    </div>
  );
}

export default App;
