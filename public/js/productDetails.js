//1. for sliding images
const imgs = document.querySelectorAll('.img-select a');
const imgBtns = [...imgs];
let imgId = 1;

imgBtns.forEach((imgItem) => {
    imgItem.addEventListener('click', (event) => {
        event.preventDefault();
        imgId = imgItem.dataset.id;
        slideImage();
    });
});

function slideImage(){
    const displayWidth = document.querySelector('.img-showcase img:first-child').clientWidth;

    document.querySelector('.img-showcase').style.transform = `translateX(${- (imgId - 1) * displayWidth}px)`;
}

window.addEventListener('resize', slideImage);


//2.for deleting property
const deleteBtn = document.querySelector('.delete-property-btn')

if(deleteBtn){
    deleteBtn.addEventListener('click',async function(e){
        try{
            const res = await axios({
                method:'DELETE',
                url:'/api/product/delete-product',
                data:{
                    slug: location.href.split('/')[4]
                }
            })

            if(res.status === 200){
                showAlert('success','Deleted successfully')
                setTimeout(window.location.assign('/'),3000)
            }
        }catch(err){
            showAlert('error',res.response.data.message)
        }
    })
}



//3. social media share links
const facebookBtn = document.querySelector('.facebook-btn')
const twitterBtn = document.querySelector('.twitter-btn')
const whatsappBtn = document.querySelector('.whatsapp-btn')
const pinterestBtn = document.querySelector('.pinterest-btn')

const postTitle = encodeURI(window.location.href.split('/')[4].split('-').join(' '))
const postUrl = encodeURI(window.location.href)
const imageSrc = encodeURI(`${window.location.protocol}//${window.location.host}`+ document.querySelector('.img-showcase').children[0].getAttribute('src'))

facebookBtn.setAttribute('href',`https://www.facebook.com/sharer.php?u=${postUrl}`)
twitterBtn.setAttribute('href',`https://twitter.com/share?url=${postUrl}&text=${postTitle}`)
whatsappBtn.setAttribute('href',`https://api.whatsapp.com/send?text=${postTitle} ${postUrl}`)
pinterestBtn.setAttribute('href',`https://pinterest.com/pin/create/bookmarklet/?media=${imageSrc}&url=${postUrl}&is_video=no&description=${postTitle}`)

