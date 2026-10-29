
 export function Set_Screen_Mode(){
  const media=window.matchMedia("(prefers-color-scheme:dark)")

  if(media.matches){document.documentElement.classList.add('dark')}
  else{document.documentElement.classList.remove('dark')}

  function Change_Screen_Mode(){
    if(media.matches){document.documentElement.classList.add('dark')}
    else{document.documentElement.classList.remove('dark')}
  }

  media.addEventListener("change",Change_Screen_Mode)

  return Change_Screen_Mode
 }


