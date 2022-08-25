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
  // i should change this to a merge sort
  const root = buildTree(mergeSort(valArray));
  const prettyPrint = (node = root, prefix = '', isLeft = true) => {
    if (node.right !== null) {
      prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
    }
    console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
    if (node.left !== null) {
      prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
    }
  };
  return { root, insert, deleteNode, find, levelOrder, inorder, preorder, postorder, prettyPrint };
};

const Node = (data = null, left = null, right = null) => {
  return { data, left, right };
};

const tree = Tree([5, 6, 2, 9, 1, 3, 16, 17, 18, 15]);
tree.insert(10);
tree.insert(4);
tree.prettyPrint();
tree.deleteNode(6);
tree.prettyPrint();
// tree.levelOrder((node) => console.log(node.data * -1));
// console.log(tree.levelOrder());
// console.log('find 5 node:');
// console.log(tree.find(5));
// console.log('find nonexistant node:');
// console.log(tree.find(2000));
// console.log([].concat([5, 6]));
console.log(tree.inorder());
// console.log(tree.inorder((node) => console.log(node.data * -1)));
console.log(tree.preorder());
console.log(tree.postorder());
