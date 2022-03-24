const resetPasswordForm = document.querySelector('.reset-password-form')

resetPasswordForm.addEventListener('submit',async function(e){
    e.preventDefault()
    const password = document.querySelector('.new-password').value
    const passwordConfirm = document.querySelector('.password-confirm').value
    // console.log(window.location.href.split('/')[4])
    if(password !== passwordConfirm) {
        return showAlert('error','Password and password confirm must be same')
    }
    try {
        const res = await axios({
            method:'POST',
            url:`/api/user/reset-password/${window.location.href.split('/')[4]}`,
            data:{
                password,
                passwordConfirm
            }
        })

        if(res.status === 200){
            showAlert('success','Password updated successfully')
            location.assign('/')
        }
        
    } catch (err) {
        showAlert('error',err.response.data.message)

    }
})