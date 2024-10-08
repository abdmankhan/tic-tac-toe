import { useState } from "react";

export default function Game() {
  
  const [history, setHistory] = useState([
    { squares: Array(9).fill(null), cood: [null, null] },
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares, cood) {
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { squares: nextSquares, cood },
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function test2(move, description) {
    if (move === currentMove) {
      return <p>{description}</p>;
    } else {
      return <button onClick={() => jumpTo(move)}>{description}</button>;
    }
  }
  function jumpTo(nextMove) {
    const newHistory = history.slice(0, nextMove + 1);
    setHistory(newHistory);
    setCurrentMove(nextMove);
  }
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move # " + squares.cood[0] + "," + squares.cood[1];
    } else {
      description = "Go to game start #";
    }
    return <li key={move}>{test2(move, description)}</li>;
  });
  
  let endNotif;
  console.log(currentMove);
  if(currentMove === 9){
    endNotif = 'Result is Draw';
  }

  return (
    <>
      <div className="game">
        <div className="game-board">
          <Board
            squares={currentSquares}
            xIsNext={xIsNext}
            onPlay={handlePlay}
            
          />
        </div>
        <div className="game-info">
          <div className="status"> Moves History</div>
          <ol>{moves}</ol>
        </div>
      </div>
      <div className="status">
        <label >{endNotif}</label>
      </div>
    </>
  );
}

function Board({ squares, xIsNext, onPlay }) {
  const [winCood, setWinCood] = useState(Array(3).fill(null));
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) return;
    const nextSquares = [...squares];
    if (xIsNext) nextSquares[i] = "X";
    else nextSquares[i] = "O";
    const cood = [Math.floor(i / 3), i % 3];
    onPlay(nextSquares, cood);
  }

  const winner = calculateWinner(squares, setWinCood, winCood);
  
  let status;
  if (winner) {
    status = "Winner is : " + winner;
  } else {
    status = "Next is : " + (xIsNext ? "X" : "O");
  }

  let test1;
  test1 = () => {
    let squaresArray = [];
    for (let k = 0; k <= 6; k = k + 3) {
      for (let i = k + 0; i <= 2 + k; i++) {
        const highlight = winCood.includes(i) ? "yellow" : "";
        squaresArray.push(
          <Square value={squares[i]} onSquareClick={() => handleClick(i)} sentColor={highlight}/>
        );
      }
      squaresArray.push(<div className="board-row"></div>);
    }
    return squaresArray;
  };

  return (
    <>
      <div className="status">{status}</div>
      {test1()}
    </>
  );
}

function Square({ value, onSquareClick, sentColor }) {
  return (
    <button className="square" onClick={onSquareClick} style={{backgroundColor : sentColor}}>
      {value}
    </button>
  );
}

function calculateWinner(squares, setWinCood, winCood) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] == squares[b] && squares[a] == squares[c])
    {
      if(!winCood || winCood[0] === null){
        setWinCood([a,b,c]);
      }
      return squares[a];
    }
  }
  return null;
}
