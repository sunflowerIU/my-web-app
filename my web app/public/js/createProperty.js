const formSelect = document.querySelector('.form-select')

formSelect.addEventListener('change',function(){
  showOtherForm()
})


// to show other forms according to type
function showOtherForm() {
  const select = document.querySelector('.select-type')
  const other = document.querySelector('.other')
  let html;

  if (select.value === 'house') {
    html = `
    <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <div class="form-group">
        <label class="profile_details_text">Plinth Area:</label>
        <input type="text" name="plinth_area" class="form-control property-plinth-area" value="" required>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <div class="form-group">
        <label class="profile_details_text">Bedrooms:</label>
        <input type="text" name="bedroom" class="form-control property-bedroom" value="" required>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <div class="form-group">
        <label class="profile_details_text">Bathroom:</label>
        <input type="text" name="Bathroom" class="form-control property-bathroom" value="" required>
      </div>
    </div>
  </div>
</div>
<div class="row">
<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
  <div class="form-group">
    <label class="profile_details_text">Total rooms:</label>
    <input type="text" name="total_rooms" class="form-control property-total-room" value="" required>
  </div>
</div>
</div>
<div class="row">
<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
  <div class="form-group">
    <label class="profile_details_text">Floors:</label>
    <input type="text" name="total_floors" class="form-control property-total-floor" value="" required>
  </div>
</div>
</div>
<div class="row">
<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 submit">
  <div class="form-group">
    <input type="submit" class="btn btn-success" value="Submit">
  </div>
</div>
</div>
    `
  } else {
    html = `

  <div class="row">
<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 submit">
  <div class="form-group">
    <input type="submit" class="btn btn-success" value="Submit">
  </div>
</div>
</div>
    `
  }
  other.innerHTML = html

}




///for creating product
const createForm = document.querySelector('.create-property')

if (createForm) {
  createForm.addEventListener('submit', async function (e) {
    e.preventDefault()


    const formData = new FormData()
    formData.append('name', document.querySelector('.property-name').value)
    formData.append('description', document.querySelector('.property-description').value)
    formData.append('imageCover', document.querySelector('.property-cover-image').files[0]||'')
    formData.append('summary', document.querySelector('.property-summary').value)
    formData.append('location', document.querySelector('.property-location').value)
    formData.append('type', document.querySelector('.select-type').value)
    formData.append('roadWidth', document.querySelector('.property-road-width').value)
    formData.append('landArea', document.querySelector('.property-land-area').value)


    //to append all images to formdata
    const images = document.querySelector('.property-images').files

    for (const img of images) {
      formData.append('images', img)
    }

    const type = document.querySelector('.select-type').value
    if (type === 'house') {
      formData.append('plinthArea', document.querySelector('.property-plinth-area').value)
      formData.append('bedroom', document.querySelector('.property-bedroom').value)
      formData.append('bathroom', document.querySelector('.property-bathroom').value)
      formData.append('totalRoom', document.querySelector('.property-total-room').value)
      formData.append('floors', document.querySelector('.property-total-floor').value)

    }

    // for (var value of formData.values()) {
    //   console.log(value);
    // }

    //if there is no images in form data
    if(!formData.has('images')){
      return showAlert('error','Images are required')
    }
    if(!formData.has('imageCover')){
      return showAlert('error','Image cover is required')
    }

    try {
      const res = await axios({
        method: 'POST',
        url: '/api/product/create-product',
        data: formData
      })
      if(res.status===200){
        showAlert('success',"Created successful")
        setTimeout(window.location.reload(true),3000)
      }
    } catch (err) {
      showAlert('error', err.response.data.message)
    }


  })
}