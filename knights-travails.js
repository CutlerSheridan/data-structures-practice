const Gameboard = () => {
  const grid = [];
  for (let i = 0; i < 8; i++) {
    grid.push([]);
    for (let n = 0; n < 8; n++) {
      grid[i].push([{ isUsed: false }]);
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
  const createPathsTree = (startingCoord, targetCoord, grid = null, counter = 0) => {
    if (startingCoord[0] === targetCoord[0] && startingCoord[1] === targetCoord[1]) {
      return Node(startingCoord);
    }
    const newGrid = Gameboard();
    if (grid !== null) {
      for (let i = 0; i < grid.length; i++) {
        for (let n = 0; n < grid[0].length; n++) {
          newGrid[i][n].isUsed = grid[i][n].isUsed;
        }
      }
    }
    newGrid[startingCoord[0]][startingCoord[1]].isUsed = true;
    const moves = getPossibleMoves(startingCoord, newGrid);
    if (moves.length === 0) {
      return null;
    }
    const newNode = Node(startingCoord);
    for (let i = 0; i < moves.length; i++) {
      if (moves[i][0] === targetCoord[0] && moves[i][1] === targetCoord[1]) {
        newNode.move0 = Node(moves[i]);
        return newNode;
      }
    }
    for (let i = 0; i < moves.length; i++) {
      newNode[`move${i}`] = createPathsTree(moves[i], targetCoord, newGrid, ++counter);
    }
    return newNode;
  };
  const _isMoveWithinBounds = (coord, grid) => {
    if (coord[0] >= 0 && coord[1] >= 0 && coord[0] < grid.length && coord[1] < grid[0].length) {
      return true;
    }
  };
  const _isTargetSpaceUnused = (coord, grid) => {
    return !grid[coord[0]][coord[1]].isUsed;
  };

  return { getPossibleMoves, createPathsTree };
};
const Node = (coord = null, nextMoves = null) => {
  const obj = { coord };
  if (!nextMoves) {
    obj.move0 = null;
  } else {
    nextMoves.forEach((m, index) => {
      obj[`move${index}`] = m;
    });
  }
  return obj;
};

tests = (() => {
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
  let k = Knight();
  let board = Gameboard();
  let exp = [
    [0, 3],
    [2, 3],
    [3, 0],
    [3, 2],
  ];
  test('get possible moves for [1, 1]', k.getPossibleMoves, exp, [1, 1], board);
  console.log(k.createPathsTree([0, 0], [1, 2]));
  console.log(k.createPathsTree([0, 0], [3, 3]));
  // console.log(k.createPathsTree([3, 3], [4, 3]));

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
