// const imgs = document.querySelectorAll('.img-select a');
// const imgBtns = [...imgs];
// let imgId = 1;

// imgBtns.forEach((imgItem) => {
//     imgItem.addEventListener('click', (event) => {
//         event.preventDefault();
//         imgId = imgItem.dataset.id;
//         slideImage();
//     });
// });

// function slideImage(){
//     const displayWidth = document.querySelector('.img-showcase img:first-child').clientWidth;

//     document.querySelector('.img-showcase').style.transform = `translateX(${- (imgId - 1) * displayWidth}px)`;
// }

// window.addEventListener('resize', slideImage);


// // to show other forms according to type
// function showOtherForm() {
//     const select = document.querySelector('.select-type')
//     const typeDiv = document.querySelector('.type-div')
//     const other = document.querySelector('.other')
//     let html;

//     if (select.value === 'house') {
//         html = `
//     <div class="row">
//     <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
//       <div class="form-group">
//         <label class="profile_details_text">Plinth Area:</label>
//         <input type="text" name="plinth_area" class="form-control" value="" required>
//       </div>
//     </div>
//   </div>
//   <div class="row">
//     <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
//       <div class="form-group">
//         <label class="profile_details_text">Bedrooms:</label>
//         <input type="text" name="bedroom" class="form-control" value="" required>
//       </div>
//     </div>
//   </div>
//   <div class="row">
//     <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
//       <div class="form-group">
//         <label class="profile_details_text">Bathroom:</label>
//         <input type="text" name="Bathroom" class="form-control" value="" required>
//       </div>
//     </div>
//   </div>
// </div>
// <div class="row">
// <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
//   <div class="form-group">
//     <label class="profile_details_text">Total rooms:</label>
//     <input type="text" name="total_rooms" class="form-control" value="" required>
//   </div>
// </div>
// </div>
// <div class="row">
// <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
//   <div class="form-group">
//     <label class="profile_details_text">Floors:</label>
//     <input type="text" name="total_floors" class="form-control" value="" required>
//   </div>
// </div>
// </div>
// <div class="row">
// <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 submit">
//   <div class="form-group">
//     <input type="submit" class="btn btn-success" value="Submit">
//   </div>
// </div>
// </div>
//     `
//     } else {
//         html = `
//     <div class="row">
//     <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
//       <div class="form-group">
//         <label class="profile_details_text">Land area:</label>
//         <input type="text" name="land_area" class="form-control" value="" required>
//       </div>
//     </div>
//   </div>

//   <div class="row">
//     <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
//       <div class="form-group">
//         <label class="profile_details_text">Road width:</label>
//         <input type="text" name="road_width" class="form-control" value="" required>
//       </div>
//     </div>
//   </div>
//   <div class="row">
// <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 submit">
//   <div class="form-group">
//     <input type="submit" class="btn btn-success" value="Submit">
//   </div>
// </div>
// </div>
//     `
//     }
//     other.innerHTML = html

// }



//for sign up form animation
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.querySelector('.signup-container');

signUpButton.addEventListener('click', () =>
container.classList.add('right-panel-active'));

signInButton.addEventListener('click', () =>
container.classList.remove('right-panel-active'));