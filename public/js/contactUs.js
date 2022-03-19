const form = document.querySelector('.form')
const name = document.querySelector('#name')
const email = document.querySelector('#email')
const subject = document.querySelector('#subject')
const message = document.querySelector('#message')
const submit = document.querySelector('#submit')


form.addEventListener('submit', async function (e) {
    e.preventDefault()
    submit.value = 'sending...'
    try {
        // 1. first get the form data
        const formData = {
            name: name.value,
            email: email.value,
            subject: subject.value,
            message: message.value
        }

        //2. post request to send email using our api
        const res = await axios({
            withCredentials: true,
            method: "POST",
            url: "/api/contact-us",
            data: formData

        })


        //alert success message
        if(res.status === 200){
            showAlert('success','Thank you for contacting us.')
        }

        ///goto main page
        setTimeout(location.assign('/'),6000)

    } catch (err) {
        console.log(err)
    }
})