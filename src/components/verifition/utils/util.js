export function resetSize (vm) {
  var imgWidth, imgHeight, barWidth, barHeight  // 图片的宽度、高度，移动条的宽度、高度

  var parentWidth = vm.$el.parentNode.offsetWidth || window.offsetWidth || 385
  var parentHeight = vm.$el.parentNode.offsetHeight || window.offsetHeight || 250

  if (vm.imgSize.width.indexOf('%') != -1) {
    imgWidth = parentWidth + 'px'
    // imgWidth = parseInt(this.imgSize.width) / 100 * parentWidth + 'px'
  } else {
    imgWidth = parentWidth + 'px'
    // imgWidth = this.imgSize.width
  }

  if (vm.imgSize.height.indexOf('%') != -1) {
    imgHeight = (parentWidth * 0.5) + 'px'
    // imgHeight = parseInt(this.imgSize.height) / 100 * parentHeight + 'px'
  } else {
    // imgHeight = this.imgSize.height
    imgHeight = (parentWidth * 0.5) + 'px'
  }

  if (vm.barSize.width.indexOf('%') != -1) {
    barWidth = parseInt(this.barSize.width) / 100 * parentWidth + 'px'
  } else {
    barWidth = this.barSize.width
  }

  if (vm.barSize.height.indexOf('%') != -1) {
    barHeight = parseInt(this.barSize.height) / 100 * parentHeight + 'px'
  } else {
    barHeight = this.barSize.height
  }

  return { imgWidth: imgWidth, imgHeight: imgHeight, barWidth: barWidth, barHeight: barHeight, parentWidth }
}

export const codeChars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
export const codeColor1 = ['#fffff0', '#f0ffff', '#f0fff0', '#fff0f0']
export const codeColor2 = ['#FF0033', '#006699', '#993366', '#FF9900', '#66CC66', '#FF33CC']
