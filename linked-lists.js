const LinkedList = (firstValue = null) => {
  let list = firstValue === null ? null : Node(firstValue);
  const append = (...value) => {
    value.forEach((v) => {
      const newNode = Node(v);
      if (list === null) {
        list = newNode;
      } else {
        tail().next = newNode;
      }
    });
  };
  const prepend = (...value) => {
    for (let i = value.length - 1; i >= 0; i--) {
      const newNode = Node(value[i]);
      if (list === null) {
        list = newNode;
      } else {
        newNode.next = list;
        list = newNode;
      }
    }
  };
  const size = (val = list) => {
    if (val === null) {
      return 0;
    }
    if (val.next === null) {
      return 1;
    }
    return 1 + size(val.next);
  };
  const head = () => list;
  const tail = (node = list) => {
    if (node === null) {
      return node;
    }
    if (node.next === null) {
      return node;
    }
    return tail(node.next);
  };
  const at = (index) => {
    if (list === null) {
      return null;
    }
    let node = list;
    for (let i = index; i >= 0; i--) {
      if (i === 0) {
        return node;
      }
      if (node.next === null) {
        return null;
      }
      node = node.next;
    }
  };
  const pop = () => {
    const index = size() - 2;
    at(index).next = null;
  };
  const contains = (value) => {
    let node = list;
    for (let i = size() - 1; i > 0; i--) {
      if (node.data === value) {
        return true;
      }
      node = node.next;
    }
    return false;
  };
  const find = (value, node = list, index = 0) => {
    if (list === null) {
      return null;
    }
    if (node.data === value) {
      return index;
    }
    if (node.next === null) {
      return null;
    }
    return find(value, node.next, ++index);
  };
  const toString = () => {
    if (list === null) {
      return 'null';
    }
    let stringList = '';
    let node = list;
    do {
      if (node === list) {
        stringList += `( ${node.data} )`;
      }
      stringList += ` -> ( ${node.next.data} )`;
      node = node.next;
    } while (node.next !== null);
    return stringList;
  };
  const insertAt = (value, index) => {
    if (list === null || index - 1 < 0) {
      list.prepend(value);
      return;
    }
    const frontNode = at(index - 1);
    if (frontNode === null) {
      return;
    }
    const backOfList = frontNode.next;
    const newNode = Node(value);
    newNode.next = backOfList;
    frontNode.next = newNode;
  };
  const removeAt = (index) => {
    if (list === null) {
      return;
    }
    const nodeBeforeTarget = at(index - 1);
    if (nodeBeforeTarget === null || nodeBeforeTarget.next === null) {
      return;
    }
    nodeBeforeTarget.next = nodeBeforeTarget.next.next;
  };
  return {
    append,
    prepend,
    size,
    head,
    tail,
    at,
    pop,
    contains,
    find,
    toString,
    insertAt,
    removeAt,
  };
};

const Node = (data = null, next = null) => {
  return { data, next };
};

const testList = LinkedList(4);
testList.append(5);
testList.append(6);
testList.prepend(7);
console.log(`size: ${testList.size()}`);
console.log(testList.head());
console.log(`tail:`);
console.log(testList.tail());
console.log('node at index 2:');
console.log(testList.at(2));
console.log('node at index 100:');
console.log(testList.at(100));
testList.append(8, 9);
testList.prepend(10, 11);
console.log(testList.toString());
console.log(testList.tail());
console.log(`size: ${testList.size()}`);
testList.pop();
console.log(`popped size: ${testList.size()}`);
console.log(`true contains: ${testList.contains(6)}`);
console.log(`false contains: ${testList.contains(5461)}`);
console.log(`find index 6 for val 8: ${testList.find(8)}`);
console.log(`find null index for val 2000: ${testList.find(2000)}`);
console.log(testList.toString());
testList.insertAt(25, 1);
console.log('insert 25 at index 1');
console.log(testList.toString());
testList.removeAt(1);
console.log('remove at index 1');
console.log(testList.toString());
testList.removeAt(6);
console.log('remove at index 6');
console.log(testList.toString());
