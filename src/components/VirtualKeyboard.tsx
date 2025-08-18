import React from 'react';

interface VirtualKeyboardProps {
  onLetterClick: (letter: string) => void;
  usedLetters: string[];
  disabled?: boolean;
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onLetterClick,
  usedLetters,
  disabled = false,
}) => {
  const keyboardLayout = [
    ['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P', 'Ü'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ö', 'Ä'],
    ['Y', 'X', 'C', 'V', 'B', 'N', 'M'],
  ];

  const handleLetterClick = (letter: string) => {
    if (disabled) return;
    onLetterClick(letter);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    // Prevent zoom on double tap
    e.preventDefault();
  };

  const isLetterUsed = (letter: string): boolean => {
    return usedLetters.includes(letter.toLowerCase());
  };

  return (
    <div className="virtual-keyboard">
      {keyboardLayout.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="keyboard-row"
          style={{ gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))` }}
        >
          {row.map((letter) => (
            <button
              key={letter}
              className={`keyboard-button ${isLetterUsed(letter) ? 'used' : ''}`}
              onClick={() => handleLetterClick(letter)}
              onTouchStart={handleTouchStart}
              disabled={disabled || isLetterUsed(letter)}
              aria-label={`Buchstabe ${letter}`}
            >
              {letter}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default VirtualKeyboard;
