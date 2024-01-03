import React from 'react';
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom';
import router from './route/Router.tsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Swal from 'sweetalert2';

import '../src/assets/main.scss';

 //Sweet alert message
  declare global {
    interface Window {
      Swal: any; 
      toast:any;
    }
  }

window.Swal = Swal;
 
const toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  grow:"row",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
  didOpen: (toast:any) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});
window.toast = toast;



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
