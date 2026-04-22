import puter from "@heyputer/puter.js";
import {ROOMIFY_RENDER_PROMPT} from "./constants";
//typescript function which takes url string and returns a promise string
//converting string into base64 image
export const fetchAsDataUrl=async (url:string):Promise<string> => {
    const response = await fetch(url);
    if(!response.ok){
        throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    //try to take blob version of image read it
    const blob = await response.blob();
    //and return it
    return new Promise((resolve, reject)=>{
        const reader = new FileReader();
        reader.onloadend = ()=>resolve(reader.result as string);
        reader.onerror = error => reject;
        reader.readAsDataURL(blob);
    });
};
export const generate3DView=async ({sourceImage}:Generate3DViewParams)=>{
   const dataUrl=sourceImage.startsWith('data:')
    ? sourceImage
       :await fetchAsDataUrl(sourceImage);
   const base64Data=dataUrl.split(',')[1];
   //type of the image
   const mimeType=dataUrl.split(';')[0].split(':')[1];
   if(!mimeType || !base64Data) throw new Error('invalid source image payload');
   //if properly extracted
    const response=await puter.ai.txt2img(ROOMIFY_RENDER_PROMPT,{
        provider:"gemini",
        model:"gemini-2.5-flash-image-preview",
        input_image: base64Data,
        input_image_mime_type:mimeType,
        ratio:{w:1024, h:1024}
    });
    const rawImageUrl=(response as HTMLImageElement).src ?? null;
    if(!rawImageUrl)return {renderedImage:null,renderedPath:undefined};
    //both the ways we are returning rendered image properly
    const renderedImage=rawImageUrl.startsWith('data:')
    ? rawImageUrl: await fetchAsDataUrl(rawImageUrl);

    return { renderedImage,renderedPath:undefined};

}