const Gameboard = (gridToCopy = null) => {
  const grid = [];
  for (let i = 0; i < 8; i++) {
    grid.push([]);
    for (let n = 0; n < 8; n++) {
      if (gridToCopy) {
        grid[i].push(gridToCopy[i][n]);
      } else {
        grid[i].push({ isUsed: false });
      }
    }
  }
  return grid;
};

const Knight = () => {
  const getPossibleMoves = (startingCoord, grid) => {
    const moves = [];
    for (let i = -2; i < 3; i++) {
      if (i === 0) {
        continue;
      }
      const nextIteratorBase = Math.abs(i) === 2 ? -1 : -2;
      for (let n = nextIteratorBase; n <= nextIteratorBase * -1; n += 2) {
        if (n === 0) {
          continue;
        }
        const move = [startingCoord[0] + i, startingCoord[1] + n];
        if (_isMoveWithinBounds(move, grid) && _isTargetSpaceUnused(move, grid)) {
          moves.push(move);
        }
      }
    }
    return moves;
  };
  const createPathsTree = (startingCoord, targetCoord) => {
    const board = Gameboard();
    board[startingCoord[0]][startingCoord[1]].isUsed = true;
    const root = Node(startingCoord, board);
    if (startingCoord[0] === targetCoord[0] && startingCoord[1] === targetCoord[1]) {
      return root;
    }
    const nodesArr = [root];
    while (nodesArr.length > 0) {
      const moves = getPossibleMoves(nodesArr[0].coord, nodesArr[0].grid);
      if (!moves) {
        nodesArr[0].move0 = null;
        nodesArr.shift();
        continue;
      }
      for (let i = 0; i < moves.length; i++) {
        const newGrid = Gameboard(nodesArr[0].grid);
        newGrid[moves[i][0]][moves[i][1]].isUsed = true;
        const newNode = Node(moves[i], newGrid);
        nodesArr[0][`move${i}`] = newNode;
        if (moves[i][0] === targetCoord[0] && moves[i][1] === targetCoord[1]) {
          nodesArr[0].move0 = newNode;
          for (let n = 1; n <= i; n++) {
            nodesArr[0][`move${n}`] = null;
          }
          nodesArr.splice(0);
          break;
        }
        nodesArr.push(newNode);
      }
      nodesArr.shift();
    }
    return root;
  };
  const findShortestPath = (node, targetCoord, shortestPath = null, currentPath = []) => {
    const newArr = Array.from(currentPath);
    newArr.push(node.coord);
    if (node.coord[0] === targetCoord[0] && node.coord[1] === targetCoord[1]) {
      if (!shortestPath) {
        shortestPath = Array.from(newArr);
      } else if (shortestPath.length > newArr.length) {
        shortestPath.splice();
        for (let i = 0; i < newArr.length; i++) {
          shortestPath.push(newArr[i]);
        }
      }
      return shortestPath;
    }
    if (!node.move0) {
      return null;
    }
    let paths = [];
    for (let i = 0; i < 8; i++) {
      if (node[`move${i}`]) {
        const nextPath = findShortestPath(node[`move${i}`], targetCoord, shortestPath, newArr);
        if (nextPath) {
          paths.push(Array.from(nextPath));
        }
      } else {
        break;
      }
    }
    if (paths.length === 0) {
      return null;
    }
    if (paths.length === 1) {
      return paths[0];
    }
    paths = paths.filter((x) => x != false);
    return paths.reduce((x, y) => (x.length < y.length ? x : y));
  };
  const _isMoveWithinBounds = (coord, grid) => {
    if (coord[0] >= 0 && coord[1] >= 0 && coord[0] < grid.length && coord[1] < grid[0].length) {
      return true;
    }
  };
  const _isTargetSpaceUnused = (coord, grid) => {
    return !grid[coord[0]][coord[1]].isUsed;
  };

  return { getPossibleMoves, createPathsTree, findShortestPath };
};
const Node = (coord = null, grid = null) => {
  let move0 = null;
  return { coord, grid, move0 };
};

const tests = (() => {
  const test = (text, func, expectedResult, ...params) => {
    const result = func(...params);
    let areEqual;
    if (typeof expectedResult !== 'object') {
      areEqual = result === expectedResult;
    } else if (Array.isArray(expectedResult)) {
      areEqual = checkArrayEquality(result, expectedResult);
    } else {
      areEqual = JSON.stringify(result) === JSON.stringify(expectedResult);
    }

    console.log(text);
    console.log(`${areEqual ? 'success' : 'fail'}`);
    if (!areEqual) {
      console.log('Expected:');
      console.log(expectedResult);
      console.log('Actual:');
      console.log(result);
    }
    return areEqual;
  };
  const checkArrayEquality = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
      return false;
    }
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
      return false;
    }
    let areEqual = true;
    for (let i = 0; i < arr1.length; i++) {
      if (Array.isArray(arr1[i])) {
        if (!checkArrayEquality(arr1[i], arr2[i])) {
          areEqual = false;
        }
      } else {
        if (arr1[i] !== arr2[i]) {
          areEqual = false;
        }
      }
    }
    return areEqual;
  };
  const printTree = (nodeArr) => {
    while (nodeArr.length > 0) {
      const moves = [];
      for (let prop in nodeArr[0]) {
        if (prop === 'coord') {
          console.log(`\ncoord: ${nodeArr[0].coord}`);
        } else if (prop !== 'grid' && nodeArr[0][prop]) {
          moves.push(nodeArr[0][prop].coord);
          nodeArr.push(nodeArr[0][prop]);
        }
      }
      console.log('moves:');
      console.log(moves);
      nodeArr.shift();
    }
  };
  let k = Knight();
  let board = Gameboard();
  let exp = [
    [0, 3],
    [2, 3],
    [3, 0],
    [3, 2],
  ];
  test('get possible moves for [1, 1]', k.getPossibleMoves, exp, [1, 1], board);
  // console.log(k.createPathsTree([0, 0], [1, 2]));
  const tree1 = k.createPathsTree([0, 0], [1, 2]);
  // printTree([tree1]);
  const tree2 = k.createPathsTree([0, 0], [3, 3]);
  printTree([tree2]);
  let path = k.findShortestPath(tree2, [3, 3]);
  console.log(`\nshortest path from [0, 0] to [3, 3]:`);
  console.log(path);
  const tree3 = k.createPathsTree([3, 3], [4, 3]);
  // printTree([tree3]);
  path = k.findShortestPath(tree3, [4, 3]);
  console.log(`\nshortest path from [3, 3] to [4, 3]:`);
  console.log(path);
  const tree4 = k.createPathsTree([0, 0], [7, 7]);
  path = k.findShortestPath(tree4, [7, 7]);
  console.log(`\nshortest path from [0, 0] to [7, 7]:`);
  console.log(path);

  // const testNode = Node(
  //   [1, 1],
  //   [
  //     [2, 2],
  //     [3, 3],
  //   ]
  // );
  // console.log(testNode);
  // const node2 = Node([1, 1]);
  // console.log(node2);
  // const arr1 = [1, 2, 3];
  // const arr2 = [1, 2, 3];
  // const arr3 = [1, 2, 3];
  // const arr4 = [4, 2, 3];
  // const arr5 = [1];
  // const arr6 = [1, 3];
  // const arr7 = [5];
  // const arr8 = 5;
  // const arr9 = [
  //   [1, 2],
  //   [3, 4],
  // ];
  // const arr10 = [
  //   [1, 2],
  //   [3, 4],
  // ];
  // test('test arr1 and arr2', checkArrayEquality, true, arr1, arr2);
  // test('test arr9 and arr10', checkArrayEquality, true, arr9, arr10);
  // test('rand arrays are equal', (x) => x, arr1, arr2);
  // test('arr1 and arr4 are equal', (x) => x, arr4, arr1);
})();
