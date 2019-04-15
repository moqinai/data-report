/**
 * @param {String} url
 * @description 从URL中解析参数
 */

export const getParams = (url) => {
  const keyValueArr = url.split('?')[1].split('&')
  let paramObj = {}
  keyValueArr.forEach((item) => {
    const keyValue = item.split('=')
    paramObj[keyValue[0]] = keyValue[1]
  })
  return paramObj
}

// 获取url后面的参数
const getQueryString = (name) => {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  let r = window.location.search.substr(1).match(reg)
  if (r != null) {
    return (r[2])
  } else {
    return null
  }
}

// 获取textarea光标位置 和 选中文本
const getTextareaCursor = (textarea) => {
  let rangeData = {
    text: '',
    start: 0,
    end: 0
  }
  if (textarea.setSelectionRange) {
    textarea.focus()
    rangeData.start = textarea.selectionStart
    rangeData.end = textarea.selectionEnd
    rangeData.text = (rangeData.start !== rangeData.end) ? textarea.value.substring(rangeData.start, rangeData.end) : ''
  } else if (document.selection) { // IE
    textarea.focus()
    let i
    let oS = document.selection.createRange()
    let oR = document.body.createTextRange()
    oR.moveToElementText(textarea)
    rangeData.text = oS.text
    rangeData.bookmark = oS.getBookmark()
    for (i = 0; oR.compareEndPoints('StartToStart', oS) < 0 && oS.moveStart('character', -1) !== 0; i++) {
      if (textarea.value.charAt(i) === '/r') {
        i++
      }
    }
    rangeData.start = i
    rangeData.end = rangeData.text.length + rangeData.start
  }
  return rangeData
}
// 设置光标回原先位置 在插入文本时调用
const setTextareaCursor = (textarea, rangeData) => {
  // let oR, start, end
  let oR
  textarea.focus()
  if (textarea.setSelectionRange) {
    textarea.setSelectionRange(rangeData.start, rangeData.end)
  } else if (textarea.createtextRange) { // IE
    oR = textarea.createTextRange()
    if (textarea.value.length === rangeData.start) {
      oR.collapse(false)
      oR.select()
    } else {
      oR.moveToBookmark(rangeData.bookmark)
      oR.select()
    }
  }
}
// 在获取的光标位置插入指定文本 或 替换选定文本
const addTextareaCursor = (textarea, cursor, text) => {
  // textarea 容器； cursor：光标位置和选中内容； text：要插入的文本
  // let oValue, nValue, oR, nStart, nEnd, st
  let oValue, nValue, nStart, nEnd, st
  const sR = ''
  setTextareaCursor(textarea, cursor) // 调用获取位置
  if (textarea.setSelectionRange) {
    oValue = textarea.value
    nValue = oValue.substring(0, cursor.start) + text + oValue.substring(cursor.end)
    nStart = nEnd = cursor.start + text.length
    st = textarea.scrollTop
    textarea.value = nValue
    if (textarea.scrollTop !== st) {
      textarea.scrollTop = st
    }
    textarea.setSelectionRange(nStart, nEnd)
  } else if (textarea.createTextRange) { // IE
    sR.document.selection.createRange()
    sR.text = text
    sR.select()
  }
}

export { getQueryString, getTextareaCursor, setTextareaCursor, addTextareaCursor }
