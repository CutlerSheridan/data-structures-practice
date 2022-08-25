const Tree = (valArray) => {
  const insert = (value, node = root) => {
    if (value < node.data) {
      if (node.left === null) {
        node.left = Node(value);
      } else {
        insert(value, node.left);
      }
    } else if (value > node.data) {
      if (node.right === null) {
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
      if (node.left === null) {
        return node.right;
      } else if (node.right === null) {
        return node.left;
      } else {
        // find inorder successor and assign that node to the current node, then call delete on the right branch of the tree
      }
    }
  };
  // const buildTree = (arr) => {
  //   if (arr.length === 1) {
  //     return Node(arr[0]);
  //   }
  //   const newRoot = Node(arr.shift());
  //   while (arr.length > 0) {
  //     const nextNum = arr.shift();
  //     insert(nextNum, newRoot);
  //   }
  //   return newRoot;
  // };
  const buildBalancedTree = (arr) => {
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
      newNode.left = buildBalancedTree(leftArr);
    }
    if (middleLoc < arrSize - 1) {
      newNode.right = buildBalancedTree(rightArr);
    }
    return newNode;
  };
  // const root = buildTree(valArray);
  // i should change this to a merge sort
  const root = buildBalancedTree(valArray.sort((a, b) => a - b));
  const prettyPrint = (node = root, prefix = '', isLeft = true) => {
    if (node.right !== null) {
      prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
    }
    console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
    if (node.left !== null) {
      prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
    }
  };
  return { root, insert, deleteNode, prettyPrint };
};

const Node = (data = null, left = null, right = null) => {
  return { data, left, right };
};

const tree = Tree([5, 6, 2, 9, 1, 3, 16, 17, 18, 15]);
tree.insert(10);
tree.insert(4);
tree.prettyPrint();
