(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

const toggleMenu = document.getElementById("menu");
const navToggle = document.querySelector(".navigation");
console.log(navToggle)
console.log(toggleMenu)

toggleMenu.addEventListener("click",()=>{
        navToggle.classList.toggle("active");
  
   
   console.log("working")
  })