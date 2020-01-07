import React from "react";

export default function Item({ key, live }) {
  return (
    <div key={key} className='board-item'>
      {live ? "■" : "□"}
    </div>
  );
}