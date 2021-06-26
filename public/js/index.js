const sidebarOpener = document.querySelector("body > header > div.one > button")
const sidebar = document.querySelector("#sidebar")
const sidebarCloser = document.querySelector("#sidebar > div.top > button")
const wrapper = document.querySelector("#wrapper")


sidebarOpener.addEventListener('click', () => {
  wrapper.style.display = 'block'
  sidebar.style.transform = 'translateX(0%)'

})

sidebarCloser.addEventListener('click', () => {
  sidebar.style.transform = 'translateX(-100%)'
  wrapper.style.display = 'none'
})

wrapper.addEventListener('click', () => {
  sidebar.style.transform = 'translateX(-100%)'
  wrapper.style.display = 'none'
})