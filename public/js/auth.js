//this script will control login and signup 

//for sign up form animation
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.querySelector('.signup-container');
const signupForm = document.querySelector('.signupForm')


// console.log(document.cookie.split(';').find(el=>el.startsWith('goToPage')).split('=')[1])
const pageTitle = document.cookie.split(';').find(el=>el.startsWith('goToPage')).split('=')[1]

//if page title is signup then goto login slide
if (pageTitle === 'signup') {
    container.classList.add('right-panel-active');
}


//other event listener to slide between login and signup slide
signUpButton.addEventListener('click', () =>
    container.classList.add('right-panel-active'));

signInButton.addEventListener('click', () =>
    container.classList.remove('right-panel-active'));



////to signup using api
signupForm.addEventListener('submit', async function (e) {
    e.preventDefault()
    document.querySelector('.signup').textContent = 'signing up...'
    const name = document.querySelector('#signup-name').value
    const email = document.querySelector('#signup-email').value
    const password = document.querySelector('#signup-password').value
    const passwordConfirm = document.querySelector('#signup-password-confirm').value
    const secretKey = document.querySelector('#signup-secret-key').value

    // axios request for api
    try {
        const formData = {
            name,
            email,
            password,
            passwordConfirm,
            secretKey
        }
        //errors
        if (password !== passwordConfirm) {
            return showAlert('error', 'Password and password confirm are not same')
        }
        //
        console.log('aaaa')
        const res = await axios({
            withCredentials: true,
            method: 'POST',
            url: '/api/user/signup',
            data: formData

        })
        //show success message
        console.log(res.status)
        if (res.status === 200) {
            showAlert('success', 'Signup succeed. Please login to continue.')
            //set every value to ''
            document.querySelector('#signup-name').value = ''
            document.querySelector('#signup-email').value = ''
            document.querySelector('#signup-password').value = ''
            document.querySelector('#signup-password-confirm').value = ''
            document.querySelector('#signup-secret-key').value = ''

            
            container.classList.remove('right-panel-active');

        }

    } catch (err) {
        showAlert('error', err.response.data.message)
        // console.log(err.response.data.message)
    }

})


//signin using our api
const signinForm = document.querySelector('.signinForm')

signinForm.addEventListener('submit',async function(e){
    e.preventDefault();
    const email = document.querySelector('#login-email').value
    const password = document.querySelector('#login-password').value

    const data = {
        email,
        password
    }

    try{
        const res = await axios({
            withCredentials:true,
            method:'POST',
            url:'/api/user/login',
            data
        })

        if(res.status === 200){
            showAlert('success','Login successful.')
            window.location.href = '/'
        }
    }catch(err){
        showAlert('error',err.response.data.message)
    }
})


