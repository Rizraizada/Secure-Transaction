
//     function previewImage(event) {
//         const file = event.target.files[0];
//         const reader = new FileReader();

//         reader.onload = function () {
//             const imagePreview = document.getElementById('imagePreview');
//             imagePreview.src = reader.result;
//             imagePreview.style.display = 'block';
//         };

//         reader.readAsDataURL(file);
//     }

// var loadFile = function(event) {
//     var output = document.getElementById('output');
//     output.src = URL.createObjectURL(event.target.files[0]);
//     output.onload = function() {
//       URL.revokeObjectURL(output.src) // free memory
//     }
//   };


// //   valid Input


//     function validateForm(event) {
//         const form = event.target;
        
//         // Fetching all input elements inside the form
//         const inputs = form.querySelectorAll('input, select, textarea');
        
//         // Flag to check if form is valid
//         let isValid = true;

//         inputs.forEach(input => {
//             // Check if input is required and empty
//             if (input.hasAttribute('required') && input.value.trim() === '') {
//                 isValid = false;
//                 // Add error class to input parent div or directly style it to highlight error
//                 input.classList.add('error');
//                 // You can also display an error message
//                 // alert(`Please fill in ${input.getAttribute('placeholder')}`);
//             } else {
//                 // Remove error class if previously added
//                 input.classList.remove('error');
//             }

//             // Additional validation based on input type
//             if (input.hasAttribute('data-validation')) {
//                 const validationType = input.getAttribute('data-validation');
//                 const value = input.value.trim();

//                 switch (validationType) {
//                     case 'number':
//                         if (!(/^\d+$/.test(value))) {
//                             isValid = false;
//                             input.classList.add('error');
//                             // You can also display an error message
//                             // alert(`Please enter only numbers in ${input.getAttribute('placeholder')}`);
//                         }
//                         break;
//                     case 'text':
//                         if (!(/^[A-Za-z\s]+$/.test(value))) {
//                             isValid = false;
//                             input.classList.add('error');
//                             // You can also display an error message
//                             // alert(`Please enter only text in ${input.getAttribute('placeholder')}`);
//                         }
//                         break;
//                     case 'email':
//                         if (!(/\S+@\S+\.\S+/.test(value))) {
//                             isValid = false;
//                             input.classList.add('error');
//                             // You can also display an error message
//                             // alert(`Please enter a valid email address in ${input.getAttribute('placeholder')}`);
//                         }
//                         break;
//                     default:
//                         break;
//                 }
//             }
//         });

//         if (!isValid) {
//             // Prevent form submission if not valid
//             event.preventDefault();
//         }
//     }

