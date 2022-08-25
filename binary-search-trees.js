const Tree = (valArray) => {
  const mergeSort = (array) => {
    if (array.length <= 1) {
      return array;
    }
    let rightArr = mergeSort(array.splice(Math.floor(array.length / 2)));
    let leftArr = mergeSort(array);
    const newArr = [];
    do {
      if (leftArr[0] === rightArr[0]) {
        newArr.push(leftArr.shift(), rightArr.shift());
      } else if (leftArr.length > 0 && rightArr.length > 0) {
        newArr.push(leftArr[0] < rightArr[0] ? leftArr.shift() : rightArr.shift());
      } else {
        newArr.push(leftArr.length > 0 ? leftArr.shift() : rightArr.shift());
      }
    } while (leftArr.length > 0 || rightArr.length > 0);
    return newArr;
  };
  const insert = (value, node = root) => {
    if (value < node.data) {
      if (!node.left) {
        node.left = Node(value);
      } else {
        insert(value, node.left);
      }
    } else if (value > node.data) {
      if (!node.right) {
        node.right = Node(value);
      } else {
        insert(value, node.right);
      }
    }
  };
  const deleteNode = (value, node = root) => {
    if (value < node.data) {
      node.left = deleteNode(value, node.left);
    } else if (value > node.data) {
      node.right = deleteNode(value, node.right);
    } else if (value === node.data) {
      if (!node.left) {
        return node.right;
      } else if (!node.right) {
        return node.left;
      } else {
        const orderedArr = inorder(null, node);
        const currentIndex = orderedArr.indexOf(value);
        const replacementNode = find(orderedArr[currentIndex + 1]);
        node.data = replacementNode.data;
        node.right = deleteNode(replacementNode.data, node.right);
      }
    }
    return node;
  };
  const find = (value, node = root) => {
    if (node.data === value) {
      return node;
    }
    const direction = value < node.data ? 'left' : 'right';
    if (!node[direction]) {
      return null;
    }
    return find(value, node[direction]);
  };
  const levelOrder = (func, nodeArr = [root]) => {
    const current = nodeArr.shift();
    if (current.left) {
      nodeArr.push(current.left);
    }
    if (current.right) {
      nodeArr.push(current.right);
    }
    if (!func) {
      return nodeArr.length === 0
        ? [current.data]
        : [current.data].concat(levelOrder(func, nodeArr));
    }
    func(current);
    if (nodeArr.length !== 0) {
      levelOrder(func, nodeArr);
    }
  };
  const inorder = (func, node = root) => {
    if (!node) {
      return [];
    }
    if (!func) {
      return inorder(func, node.left).concat(node.data).concat(inorder(func, node.right));
    }
    inorder(func, node.left);
    func(node);
    inorder(func, node.right);
  };
  const preorder = (func, node = root) => {
    if (!node) {
      return [];
    }
    if (!func) {
      return preorder(func, node.left).concat(preorder(func, node.right)).concat(node.data);
    }
    preorder(func, node.left);
    preorder(func, node.right);
    func(node);
  };
  const postorder = (func, node = root) => {
    if (!node) {
      return [];
    }
    if (!func) {
      return [node.data].concat(postorder(func, node.left)).concat(postorder(func, node.right));
    }
    func(node);
    postorder(func, node.left);
    postorder(func, node.right);
  };
  const depth = (value, node = root) => {
    if (!node) {
      return null;
    }
    if (node.data === value) {
      return 0;
    }
    const direction = value < node.data ? 'left' : 'right';
    if (node[direction]) {
      return 1 + depth(value, node[direction]);
    }
    return null;
  };
  const height = (value = null, node = root) => {
    if (!node) {
      return 0;
    }
    let leftCounter = 0;
    let rightCounter = 0;
    if (node === root && node.data !== value && value !== null) {
      node = find(value);
    }
    if (node.left) {
      leftCounter = 1 + height(value, node.left);
    }
    if (node.right) {
      rightCounter = 1 + height(value, node.right);
    }
    return leftCounter > rightCounter ? leftCounter : rightCounter;
  };
  const isBalanced = (node = root) => {
    if (!node) {
      return true;
    }
    if (!node.left && !node.right) {
      return true;
    }
    let leftIsBalanced = true;
    let rightIsBalanced = true;
    if (node.left) {
      leftIsBalanced = isBalanced(node.left);
    }
    if (node.right) {
      rightIsBalanced = isBalanced(node.right);
    }
    if (!leftIsBalanced || !rightIsBalanced) {
      return false;
    }
    return 1 >= height(null, node.right) - height(null, node.left);
  };
  const rebalance = () => {
    root = buildTree(inorder());
  };
  const buildTree = (arr) => {
    const arrSize = arr.length;
    if (arrSize === 1) {
      return Node(arr[0]);
    }
    const middleLoc = Math.floor((arrSize - 1) / 2);
    const newNode = Node(arr[middleLoc]);
    const rightArr = arr.splice(middleLoc + 1);
    arr.splice(middleLoc);
    const leftArr = arr;
    if (middleLoc > 0) {
      newNode.left = buildTree(leftArr);
    }
    if (middleLoc < arrSize - 1) {
      newNode.right = buildTree(rightArr);
    }
    return newNode;
  };
  let root = buildTree(mergeSort(valArray));
  const prettyPrint = (node = root, prefix = '', isLeft = true) => {
    if (node.right !== null) {
      prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
    }
    console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
    if (node.left !== null) {
      prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
    }
  };
  return {
    root,
    insert,
    deleteNode,
    find,
    levelOrder,
    inorder,
    preorder,
    postorder,
    depth,
    height,
    isBalanced,
    rebalance,
    prettyPrint,
  };
};

const Node = (data = null, left = null, right = null) => {
  return { data, left, right };
};

const tree = Tree([5, 6, 2, 9, 1, 3, 15, 17, 19, 14]);
tree.insert(10);
tree.insert(4);
tree.prettyPrint();
tree.deleteNode(6);
tree.deleteNode(1);
console.log('delete 6 and 1');
tree.prettyPrint();
console.log(`isBalanced expect false: ${tree.isBalanced()}`);
console.log('rebalance');
tree.rebalance();
tree.prettyPrint();
console.log(`isBalanced expect true: ${tree.isBalanced()}`);

// const tree2 = Tree([5, 15, 4, 20, 19]);
// tree2.prettyPrint();
// console.log(`isBalanced expect true: ${tree2.isBalanced()}`);
// const tree3 = Tree([5, 15, 4, 20, 19, 2, 21]);
// tree3.prettyPrint();
// console.log(`isBalanced expect true: ${tree3.isBalanced()}`);
// tree3.insert(22);
// tree3.insert(23);
// tree3.insert(24);
// tree3.prettyPrint();
// console.log(`isBalanced expect false: ${tree3.isBalanced()}`);
// tree.levelOrder((node) => console.log(node.data * -1));
// console.log(tree.levelOrder());
// console.log('find 5 node:');
// console.log(tree.find(5));
// console.log('find nonexistant node:');
// console.log(tree.find(2000));
// console.log([].concat([5, 6]));
// console.log(tree.inorder());
// console.log(tree.inorder((node) => console.log(node.data * -1)));
// console.log(tree.preorder());
// console.log(tree.postorder());
// console.log(`depth expect 3: ${tree.depth(10)}`);
// console.log(`depth expect 0: ${tree.depth(9)}`);
// console.log(`height expect 4: ${tree.height(9)}`);
// console.log(`height expect 4: ${tree.height()}`);
// console.log(`height expect 2: ${tree.height(15)}`);
