;(function() {
  const Doc = document
  let renderTem = {
    nodes: null,
    el: null,
    renderData: null,
    tpl: null,
    init: function() {
      this.nodes = new Map()
      this.render()
    },

    render: function() {
      this.parseMap().then(template => {
        const renderData = this.renderData
        const nodeDom = this.parseToNode(template, renderData)
        const dom = this.parseNodeToDom(nodeDom, renderData)
      })
    },

    parseMap: function() {
      return new Promise(resolve => {
        const reg1 = /<(\w+)\s*([^>]*)>([^<]*)<\/\1>/gm;
        const reg2 = /<(\w+)\s*([^(/>)]*)\/>/gm;
        let template = this.tpl;
        while (reg1.test(template) || reg2.test(template)) {
          template = template.replace(reg1, (s0, s1, s2, s3) => {
            const attrMap = this.setAttrMap(s2)
            const uuid = Tools.uuid()
            s3 = s3.trim().replace(/\s*/g, '')
            const nodes = new VNode(s1, attrMap, null, [], s3, uuid)
            this.nodes.set(uuid, nodes)
            return `(${uuid})`
          })
          template = template.replace(reg2, (s0, s1, s2) => {
            const attrMap = this.setAttrMap(s2)
            const uuid = Tools.uuid()
            const nodes = new VNode(s1, attrMap, null, [], '', uuid)
            this.nodes.set(uuid, nodes)
            return `(${uuid})`
          })
        }
        resolve(template)
      })
    },

    parseToNode: function(template) {
      const reg = /\((.*?)\)/g //(uuid)(uuid)
      const parent = new VNode('root', null, null, [], template, Tools.uuid())
      const stack = [parent]
      while (stack.length > 0) {
        const parentNode = stack.pop() // stack = []
        const tplUUID = parentNode.childrenTemplate.trim().replace(/\s*/g, '');
        [...tplUUID.matchAll(reg)].forEach(item => {
          const parseNode = this.nodes.get(item[1])
          const newNode = new VNode(
            parseNode.tag,
            parseNode.attr,
            parentNode,
            [],
            parseNode.childrenTemplate,
            parseNode.uuid
          )
          parentNode.children.unshift(newNode)
          stack.push(newNode)
        })
      }
      return parent.children[0]
    },

    parseNodeToDom: function(root, data) {
      const fragment = document.createDocumentFragment();
      const stack = [[root, fragment, data]]
      while (stack.length > 0) {
        let [pNode, pDom, scope] = stack.pop()
        if (pNode.attr.get('if')) {
          let [key, value] = pNode.attr.get('if').split('.')
          key = key.trim()
          value = value.trim()
          if (!scope[key][value]) {
            continue
          }
        }
        let html = this.scopeHtmlParse(pNode, data, scope);
        let ele = this.createElement(pNode, html);
        this.scopeAttrParse(ele, pNode, data, scope);
        pDom.appendChild(ele)
        pNode.children.forEach(item => {
          stack.push([item, ele, scope]);
        });
      }
      console.log(this.el)
      this.el.appendChild(fragment)
    },

    scopeAttrParse: function(ele, node, globalScope, currentScope) {
      const reg = /\{\{(.*?)\}\}/;
      for (let [key, value] of node.attr) {
        const result = reg.exec(value);
        if (result && result.length) {
          const props = result[1].split('.');
          let val = currentScope[props[0]] || globalScope[props[0]];
          console.log(val)
          props.slice(1).forEach(item => {
            val = val[item];
          });
          console.log(val)
          ele.setAttribute(key, val);
        }
      }
    },

    scopeHtmlParse: function(pNode, data, scopeData) {
      const reg = /\{\{(.*?)\}\}/g
      const template = pNode.childrenTemplate;
      return template.replace(reg, (s0, s1) => {
        const props = s1.split('.');
        let val = scopeData[props[0]] || data[props[0]]
        props.slice(1).forEach(item => {
          val = val[item]
        })
        return val
      })
    },

    createElement: function(node, html) {
      const otherAttr = ['for', 'click', 'if'];
      const dom = document.createElement(node.tag)
      for (let [key, value] of node.attr) {
        if (!otherAttr.includes(key)) {
          dom.setAttribute(key, value)
        }
      }
      if (!node.children) {
        dom.innerHTML = html
      }
      return dom
    },

    setAttrMap: function(str) {
      const reg = /(\w+)(\s*=\s*)['"](.*?)['"]/gm
      const attrMap = new Map()
      str.replace(reg, (s0, s1, s2, s3) => {
        attrMap.set(s1, s3)
        return s0
      })
      return attrMap
    },

    mounted: function(el, data, tpl) {
      this.el = el || Doc.body
      this.renderData = data
      this.tpl = tpl
      this.init()
    }
  }
  window.$renderTem = renderTem
})()