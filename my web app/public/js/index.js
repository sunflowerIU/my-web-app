//1. setup alert window
function showAlert(type, message) {
    hideAlert()
    const html = `<div class='alert alert--${type}'>${message}</div>`
    const body = document.querySelector('body')
    body.insertAdjacentHTML('beforebegin', html)
    setTimeout(hideAlert, 3000)
}

function hideAlert() {
    const alert = document.querySelector('.alert')
    if (alert) {
        alert.parentElement.removeChild(alert)
    }
}




//2. paginate
paginate()


//3. open auth page for login and signup btn
const signupBtn = document.querySelector('.signupBtn')
const loginBtn = document.querySelector('.loginBtn')

if (signupBtn) {
    signupBtn.addEventListener('click', function () {
        window.location.href = '/auth'
        document.cookie = 'goToPage=signup'
    })
}

if (loginBtn) {
    loginBtn.addEventListener('click', function () {
        window.location.href = '/auth'
        document.cookie = 'goToPage=login'
    })
}

//4. logout user
const logoutBtn = document.querySelector('.logout-btn')

if (logoutBtn) {
    logoutBtn.addEventListener('click', async function (e) {
        e.preventDefault()
        try {
            const res = await axios({
                withCredentials: true,
                method: 'POST',
                url: '/api/user/logout'
            })

            if(res.status === 200){
                showAlert('success','Logged out successfully.')
                window.location.href = '/'
            }
        } catch (err) {
            showAlert('error', err.response.data.message)
        }
    })
}