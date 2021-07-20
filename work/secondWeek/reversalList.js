/* 链表反转 */

// 定义链表
const link4 = {
  name: 'link4',
  next: null
}
const link3 = {
  name: 'link3',
  next: link4
}
const link2 = {
  name: 'link2',
  next: link3
}
const link1 = {
  name: 'link1',
  next: link2
}
const linkList = [
  link1,
  link2,
  link3,
  link4
]

function reversalList(linkList) {
  // return linkList.reverse()
  let list = linkList[0] // 存放当前位置
  let next = null // 下一个
  let pre = null  // 上一个
  let newList = []
  while (list.next) {
    next = list.next // 当前节点的下一节点
    list.next = pre
    pre = list
    list = next // 指向下一个节点继续比较
    newList.push(pre)
  }
  linkList[linkList.length - 1].next = linkList[linkList.length - 2]
  return 
}
reversalList(linkList)