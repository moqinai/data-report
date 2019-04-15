export const hasClass = function(obj: any, cls: string): boolean {
  return new RegExp('(\\s|^)' + cls + '(\\s|$)').test(obj.className);
}

export const addClass = function(obj: any, cls: string): void {
  if (!hasClass(obj, cls)) obj.className += ' ' + cls
}

export const removeClass = function(obj: any, cls: string): void {
  if (hasClass(obj, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    obj.className = obj.className.replace(reg, ' ')
  }
}

export const toggleClass = function(obj: any, cls: string): void {
  if (hasClass(obj, cls)) {
    removeClass(obj, cls)
  } else {
    addClass(obj, cls)
  }
}