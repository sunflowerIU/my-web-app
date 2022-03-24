//for pagination
const pagination = document.querySelector('.pagination')
const nextBtn = document.querySelector('.nextBtn')
const previousBtn = document.querySelector('.previousBtn')



function paginate(){
if (nextBtn) {
    nextBtn.addEventListener('click', function (e) {
        e.preventDefault()
        // console.log(e.target.dataset.nextPage)
        // console.log(window.location.href)
        window.location.assign(`?page=${e.target.dataset.nextPage}`)
        // console.log(url)

    })
}

if (previousBtn) {
    previousBtn.addEventListener('click', function (e) {
        e.preventDefault()
        // console.log(e.target.dataset.nextPage)
        // console.log(window.location.href)
        window.location.assign(`?page=${e.target.dataset.previousPage}`)
        // console.log(url)

    })
}


}