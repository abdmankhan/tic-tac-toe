import { useState } from "react";

export default function Game(){
  const [history, setHistory] = useState([
    {squares : Array(9).fill(null), cood : [null, null]}
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  // const [xIsNext, setXIsNext] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  // const currSquares = history[history.length - 1];
  const currSquares = history[currentMove].squares;

  function handlePlay(nextSquares, cood){
    const nextHistory = [...history, {squares : nextSquares, cood : cood}];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    
  }
  function jumpTo(nextMove){
    const newHistory = history.slice(0, nextMove + 1);
    setHistory(newHistory);
    setCurrentMove(nextMove);
  }
  function historyButtons(move, description){
    let showElement;
    if(move === currentMove){
      showElement = <p>{description}</p>;
    } else{
      showElement = <button onClick={() => jumpTo(move)}>{description}</button>
    }
    return showElement;
  }
  const moves = history.map((squares, move) =>{
    let description;
    if(move > 0){
      description = 'Go to move # ' + squares.cood[0] + "," + squares.cood[1];
    } else{
      description = 'Go to game start # ';
    }
    return (
      <li key={move}>
        {historyButtons(move, description)}
      </li>
    )
  });
  let endNotif;
  if(currentMove === 9){
    endNotif = "Result is Draw";
  }
  return (
    <>
    <div className="game">
      <div className="game-board">
        <Board 
        xIsNext={xIsNext} 
        squares={currSquares} 
        onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <div className="status">Moves History</div>
        <ol>{moves}</ol>
      </div>
    </div>
    <div className="status">
      <label> {endNotif} </label>
    </div>
    </>
    
  );
}

function Board({squares, xIsNext, onPlay}){
  const [winCood, setWinCood] = useState(Array(3).fill(null));
  
  function handleClick(i){
    
    if(squares[i] || calculateWinner(squares)) return;
    const newSquares = [...squares];
    if(xIsNext) newSquares[i] = 'X';
    else newSquares[i] = 'O';
    const cood = [Math.floor(i / 3), i % 3];
    onPlay(newSquares, cood);
  }
  const winner = calculateWinner(squares, winCood, setWinCood);
  let status;
  if(winner){
    status = " Winner is : " + (winner);
  } else {
    status = " Next is : " + (xIsNext ? 'X' : 'O');
  }

  let loopSquares;
  loopSquares = () =>{
    let rows = new Array();
    for(let i = 0; i < 3; i++){
      let cols = new Array();
      
      for(let j = 3 * i; j < 3 * (i + 1); j++){
        const highlight = winCood.includes(j) ? "yellow" : "";
        cols.push(<Square key={j} value={squares[j]} onClick={() => handleClick(j)} sentColor={highlight} />);
      }
      rows.push(<div key={i} className="board-row">{cols}</div>);
      //This is correct way.
    }
    
    return rows;
  }
  
  return (
    <>
      <div className="status">{status}</div>
      {loopSquares()}
      
    </>
  );
}

function Square({value, onClick, sentColor}){
  return (
    <button className="square" onClick={onClick} style={{backgroundColor : sentColor}}>{value}</button>
  );
}

function calculateWinner(squares, winCood, setWinCood){
  let lines = [
    [0,1,2], [3,4,5], [6,7,8], [0,4,8], [2,4,6], [0,3,6], [1,4,7], [2,5,8]
  ];
  for(let i = 0; i < lines.length; i++){
    const [a,b,c] = lines[i];
    if(squares[a] && squares[a] == squares[b] && squares[a] == squares[c]){
      if(winCood[0] === null){
        setWinCood([a,b,c]);
      }
      return squares[a];
    }
  }
  return null;
}