import { useMemo } from 'react';
import { Company } from '../types/InvoiceTypes';
type Props = {
    datas: Company,
    setDatas: (input:Company) => void,
    files:string,
}

const ImageInput = ( {datas, setDatas, files}:Props ) => {

    const _setImage = ( e: React.ChangeEvent<HTMLInputElement> ) =>{
        e.preventDefault();
        if(e.target.files){
            let file = e.target.files[0];

            let filesize = 1024 * 1024 * 2;
            let fileTypes = ["image/jpeg", "image/jpg", "image/png"];
            if(file){
                if(fileTypes.includes(file.type)){
                    if(file.size < filesize){
                        let reader = new FileReader();
                        reader.onloadend = () => {
                            if(reader.result){
                                if(reader.result.toString().indexOf(';base64') != -1){
                                    setDatas({...datas, image:reader.result});
                                }
                            }  
                        }
                        reader.readAsDataURL(file);
                    }else{
                        window.toast.fire({
                            icon: 'warning',
                            title: `File is oversized` ,
                        })
                    }
                }else{
                    window.toast.fire({
                        icon: 'warning',
                        title: `Only allow image type: png, jpeg, jpg` ,
                    })
                }
            }
        }
     }
   
       let image_url = useMemo(() => {
           let photo = null;
           if(datas.image){
               if(datas.image.toString().indexOf(';base64') != -1){
                   photo = datas?.image;
               }else{
                   if(files){
                       photo = `${import.meta.env.VITE_LARAVEL_REACT_API_BASE_URL}/${files}/${datas?.image}`;
                   }
               }
           }
           return photo;
       },[datas.image]);

     
  return (
    <div className="image-input-box">
       {
         image_url ? <img src={image_url.toString()} alt="invoice-image" />:<p>No Image</p>
       }
        <input type="file" className="image" id="image" onChange={(e) => _setImage(e)}/>
    </div>
  )
}

export default ImageInput