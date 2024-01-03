import { useMemo } from 'react';

type Props = {
    url:string,
    files:string
}

const Image = ( {url, files }:Props ) => {
    
    const image = useMemo<string>( () => {
        let photo = "";
        if(url){
            if(url.indexOf(';base64') != -1){
                photo = url;
            }else{
                photo = `${import.meta.env.VITE_LARAVEL_REACT_API_BASE_URL}/${files}/${url}`;
            }
        }
        return photo;
    }, [url])

    
  return (
    <div className='invoice-image-box'>
        <img src={image} alt="invoice_img" className='img-fluid'/>
    </div>
  )

}

export default Image