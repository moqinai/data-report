function get (key) {
  let result = localStorage.getItem(key)
  try {
    result = JSON.parse(result)
  } catch (e) {}
  return result
}
function set (key, value) {
  let toString = Object.prototype.toString
  if (toString.call(value) === '[object Array]' || toString.call(value) === '[object Object]') {
    value = JSON.stringify(value)
  }
  return localStorage.setItem(key, value)
}
function remove (key) {
  return localStorage.removeItem(key)
}
function clear () {
  return localStorage.clear()
}
export { get, set, remove, clear }
