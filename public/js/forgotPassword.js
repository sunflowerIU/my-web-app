const forgotPasswordForm = document.querySelector('.forgot-password-form')


forgotPasswordForm.addEventListener('submit', async function (e) {
    e.preventDefault()

    try {
        const email = document.querySelector('#reset-email').value
        const res = await axios({
            method: 'POST',
            url: '/api/user/forgot-password',
            data: {
                email
            }
        })

        if (res.status === 200) {
            showAlert('success', 'Please check your email to reset your password.')
        }

    } catch (err) {
        showAlert('error', err.response.data.message)
    }

})