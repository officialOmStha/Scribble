import { useState, useEffect, useRef } from 'react';

const Scribble = () => {
    const [board, setBoard] = useState(
        Array(6).fill(null).map(() => Array(5).fill(''))
    );
    const [rowI, setRowI] = useState(0);
    const [colI, setColI] = useState(0);

    const words = [
        'hello', 'paint', 'react', 'north', 'plant',
        'apple', 'grape', 'flame', 'brush', 'clock',
        'drift', 'eagle', 'frost', 'glove', 'heart',
        'jelly', 'knife', 'lemon', 'magic', 'noble',
        'ocean', 'piano', 'queen', 'raven', 'stone',
        'tiger', 'unity', 'vigor', 'whale', 'yacht',
        'zebra', 'bloom', 'crown', 'delta', 'exile',
        'fable', 'gamer', 'haunt', 'ideal', 'jolly',
        'karma', 'latch', 'mango', 'nerve', 'orbit',
        'pride', 'quiet', 'rally', 'saint', 'trend',
        'ultra', 'vivid', 'woven', 'xerox', 'yield',
        'zesty', 'bland', 'chant', 'diner', 'envoy',
        'flint', 'giant', 'honey', 'ivory', 'joker',
        'kneel', 'lunar', 'mirth', 'nasal', 'optic',
        'prism', 'quest', 'river', 'sheep', 'tight',
        'union', 'vapor', 'waltz', 'xerus', 'yearn',
        'adobe', 'basil', 'cabin', 'daisy', 'elope',
        'fairy', 'gloom', 'harsh', 'image', 'jelly',
        'kayak', 'ledge', 'motel', 'niche', 'oasis',
        'petal', 'quilt', 'reach', 'shard', 'table',
        'urban', 'venue', 'wrist', 'xenon', 'young',
        'amber', 'bunch', 'chase', 'debut', 'elbow',
        'feast', 'glide', 'harpy', 'inbox', 'jaunt',
        'knock', 'limit', 'mirth', 'nerdy', 'offer',
        'pouch', 'quota', 'risky', 'salty', 'tempo',
        'under', 'vouch', 'weary', 'xylem', 'yield',
        'zippy', 'beach', 'crisp', 'drama', 'excel',
        'flute', 'ghost', 'hound', 'index', 'juice',
        'knead', 'label', 'march', 'nerve', 'opera',
        'plaza', 'quirk', 'roast', 'sling', 'torch',
        'upset', 'vigil', 'wedge', 'xerox', 'young',
        'zesty', 'alien', 'briar', 'clasp', 'drive',
        'equal', 'forge', 'grind', 'helix', 'inert',
        'jolly', 'karma', 'leapt', 'molar', 'novel',
        'optic', 'prank', 'quark', 'repay', 'spoke',
        'trunk', 'unite', 'vapor', 'wound', 'xerus',
        'yacht', 'zonal', 'zonal'
    ];

    const [comWord, setComWord] = useState('');

    const [feedback, setFeedback] = useState(
        Array(6).fill(null).map(() => Array(5).fill(null))
    );

    const [gameOver, setGameOver] = useState(false);
    const [gameResult, setGameResult] = useState(''); // 'won' | 'lost' | ''

    const divRef = useRef(null);

    useEffect(() => {
        startNewGame();

        // Focus the div so keyboard input works immediately
        if (divRef.current) {
            divRef.current.focus();
        }
    }, []);

    const startNewGame = () => {
        const ranInd = Math.floor(Math.random() * words.length);
        setComWord(words[ranInd].toUpperCase());

        setBoard(Array(6).fill(null).map(() => Array(5).fill('')));
        setFeedback(Array(6).fill(null).map(() => Array(5).fill(null)));
        setRowI(0);
        setColI(0);
        setGameOver(false);
        setGameResult('');
    };

    const compareGuess = (guess, target) => {
        const result = Array(5).fill('absent');
        const targetLetters = target.split('');

        guess.split('').forEach((letter, i) => {
            if (letter === targetLetters[i]) {
                result[i] = 'correct';
                targetLetters[i] = null;
            }
        });

        guess.split('').forEach((letter, i) => {
            if (result[i] !== 'correct') {
                const foundIndex = targetLetters.indexOf(letter);
                if (foundIndex !== -1) {
                    result[i] = 'present';
                    targetLetters[foundIndex] = null;
                }
            }
        });

        return result;
    };

    const handelInp = (e) => {
        if (gameOver) return; // block input if game ended

        const key = e.key.toUpperCase();
        const newBoard = board.map((row) => [...row]);
        const newFeedback = feedback.map((row) => [...row]);

        if (/^[A-Z]$/.test(key)) {
            if (colI < 5) {
                newBoard[rowI][colI] = key;
                setBoard(newBoard);

                if (colI === 4) {
                    // Row completed, compare guess
                    const guessWord = newBoard[rowI].join('');
                    const result = compareGuess(guessWord, comWord);
                    newFeedback[rowI] = result;
                    setFeedback(newFeedback);

                    if (result.every((status) => status === 'correct')) {
                        setGameOver(true);
                        setGameResult('won');
                        return;
                    }

                    if (rowI === 5) {
                        setGameOver(true);
                        setGameResult('lost');
                        return;
                    }

                    setRowI(rowI + 1);
                    setColI(0);
                } else {
                    setColI(colI + 1);
                }
            }
        } else if (key === 'BACKSPACE') {
            if (colI > 0) {
                const newCol = colI - 1;
                newBoard[rowI][newCol] = '';
                newFeedback[rowI][newCol] = null;
                setBoard(newBoard);
                setFeedback(newFeedback);
                setColI(newCol);
            }
        }
    };

    const getBgColor = (status) => {
        switch (status) {
            case 'correct':
                return 'bg-green-500 text-white';
            case 'present':
                return 'bg-yellow-400 text-white';
            case 'absent':
                return 'bg-gray-400 text-white';
            default:
                return 'bg-white text-black';
        }
    };

    return (
        <div
            ref={divRef}
            onKeyDown={handelInp}
            tabIndex={0}
            className="flex flex-col items-center justify-center w-[100%] min-h-[100vh] p-4"
            style={{ outline: 'none' }}
        >
            <h1 className="text-4xl mb-6 font-bold">Scribble Game</h1>
            <div className="flex flex-col gap-3 mb-6">
                {board.map((row, rowIndex) => (
                    <ul key={rowIndex} className="flex gap-3">
                        {row.map((letter, colIndex) => (
                            <li
                                key={colIndex}
                                className={`border-2 border-black w-12 h-12 flex justify-center items-center text-xl font-bold uppercase select-none
                ${getBgColor(feedback[rowIndex][colIndex])}`}
                            >
                                {letter}
                            </li>
                        ))}
                    </ul>
                ))}
            </div>

            {gameOver && (
                <div className="text-center space-y-4">
                    <p className="text-2xl font-semibold">
                        {gameResult === 'won' ? '🎉 You Won!' : `😞 You Lost! Word was ${comWord}`}
                    </p>
                    <button
                        onClick={startNewGame}
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        Restart Game
                    </button>
                </div>
            )}
        </div>
    );
};

export default Scribble;

