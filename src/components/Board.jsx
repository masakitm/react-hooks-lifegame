import React from "react";
import useBoard, { createBoard } from "../hooks/useBoard";
import Item from "./BoardItem";

export default function Board() {
  const { board, start } = useBoard(createBoard());

  return (
    <div>
      <h1>life game</h1>
      <button type='button' onClick={() => start()}>start</button>

      {board && board.length > 0 && (
        <div>
          {board.map(column => {
            return (
              <div key={column.id} style={boardColumn}>
                {column.itemList.map(item => (
                  <Item key={item.id} live={item.live} />
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// styles
const boardColumn = {
  display: "flex"
};
