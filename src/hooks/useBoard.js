import { useState, useMemo } from "react";

// init
const SIZE = 48;
const SIZE_INDEX = SIZE - 1;
const DEFAULT_LIVE_THRESHOLD = 0.25;

const BIRTH_THRESHOLD = 3;
const OVER_THRESHOLD = 4;
const UNDER_THRESHOLD = 1;

function createItem(id, threshold) {
  return {
    id,
    live: Math.random() < threshold
  };
}

function createColumn(id) {
  return {
    id: `column_${id}`,
    itemList: createItemList(SIZE, id)
  };
}

function createItemList(size, id) {
  const itemList = [];

  for (let i = 0; i < size; i++) {
    itemList.push(createItem(`column_${id}-item_${i}`, DEFAULT_LIVE_THRESHOLD));
  }

  return itemList
}

export function createBoard() {
  const board = [];

  for (let i = 0; i < SIZE; i++) {
    board.push(createColumn(i));
  }

  return board;
}

// board
function countNeighborLives(flattenBoard, { y, x }) {
  // 隣接セルの座標
  const neighborPositionList = [
    { y: -1, x: 1 },
    { y: -1, x: 0 },
    { y: -1, x: -1 },
    { y: 0, x: 1 },
    { y: 0, x: -1 },
    { y: 1, x: 1 },
    { y: 1, x: 0 },
    { y: 1, x: -1 }
  ]

  // 隣接セルのid文字列のリスト
  let neighborIds = neighborPositionList.map(item => {
    return `column_${y + item.y}-item_${x + item.x}`
  })

  // 不要分をフィルタ
  if (y === 0) {
    neighborIds = neighborIds.filter(id => !id.includes(`column_${y - 1}`));
  }

  if (y === SIZE_INDEX) {
    neighborIds = neighborIds.filter(id => !id.includes(`column_${y + 1}`));
  }

  if (x === 0) {
    neighborIds = neighborIds.filter(id => !id.includes(`item_${x - 1}`));
  }

  if (x === SIZE_INDEX) {
    neighborIds = neighborIds.filter(id => !id.includes(`item_${x + 1}`));
  }

  const length = flattenBoard
    .filter(item => {
      return neighborIds.includes(item.id) && item.live;
    })
    .map(item => item.live).length

  return length;
}

function getNextItem(flattenBoard, item, { y, x }) {
  const length = countNeighborLives(flattenBoard, { y, x });

  if (length >= OVER_THRESHOLD) {
    return { ...item, live: false };
  }

  if (length <= UNDER_THRESHOLD) {
    return { ...item, live: false };
  }

  if (length === BIRTH_THRESHOLD) {
    return { ...item, live: true };
  }

  return item;
}

function getNextBoard(board, flattenBoard) {
  return board.map((column, columnIndex) => {
    return {
      ...column,
      itemList: column.itemList.map((item, itemIndex) => {
        return getNextItem(flattenBoard, item, { y: columnIndex, x: itemIndex });
      })
    }
  });
}

// hooks
export default function useBoard(arr) {
  const [board, setBoard] = useState(arr);

  const flattenBoard = useMemo(
    () => board.map(column => column.itemList).flat(),
    [board]
  );

  function update() {
    setBoard(getNextBoard(board, flattenBoard))
  }

  function start() {
    update()
  }

  function stop() {

  }

  return {
    board,
    start,
    stop,
    update
  };
}