
//for updating information
const form = document.querySelector('.update-data-form')

form.addEventListener('submit',async function(e){
    e.preventDefault()

    const formData = new FormData()
    formData.append('photo',document.querySelector('#photo').files[0])
    formData.append('email',document.querySelector('.update-email').value)
    formData.append('name',document.querySelector('.update-name').value)
    try{
        const res = await axios({
            method:'PATCH',
            url:'/api/user/update-me',
            data:formData
        })
        if(res.status===200){
            showAlert('success','Updated successfully.')
            setTimeout(location.reload(true),3000)
            
        }
    }catch(err){
        showAlert('error',err.response.data.message)
    }
    
})


//for updating password
const passwordForm = document.querySelector('.update-password-form')


passwordForm.addEventListener('submit',async function(e){
    e.preventDefault()
    const newPassword = document.querySelector('.new-password').value
    const password = document.querySelector('.current-password').value

    try{
        const res = await axios({
            method:'PATCH',
            url:'/api/user/update-my-password',
            data:{
                newPassword,
                password
            }
        })

        if(res.status === 200){
            showAlert('success','password updated successfully')
            setTimeout(window.location.href='/',2500)
        }
    }catch(err){
        showAlert('error',err.response.data.message)
    }
})