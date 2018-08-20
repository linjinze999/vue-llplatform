const getItem = (key) => {
  let ca = document.cookie.split('; ');
  for(let i = 0; i < ca.length; i++) {
    let item = ca[i].split('=')
    if(item[0]===key){
      return item[1]
    }
  }
  return ''
}

const setItem = (key, value, second=86400) => {
  let d = new Date()
  d.setTime(d.getTime() + (second * 1000))
  let expires = "expires="+d.toUTCString()
  document.cookie = key + "=" + value + "; " + expires
}

const deleteItem = (key) => {
  setItem(key, '', -1)
}

export default {
  getItem,
  setItem,
  deleteItem
}
