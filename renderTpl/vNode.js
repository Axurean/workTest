class VNode{
  constructor(tag, attr, parent, children, childrenTemplate, uuid) {
    this.tag = tag
    this.attr = attr
    this.parent = parent
    this.children = children
    this.childrenTemplate = childrenTemplate
    this.uuid = uuid
  }
}