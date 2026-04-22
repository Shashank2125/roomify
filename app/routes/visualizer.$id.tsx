import React, {useEffect, useRef, useState} from 'react'
import {useLocation, useNavigate} from "react-router";
import {generate3DView} from "../../lib/ai.action";

const VisualizerId = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {initialImage,initialRender, name}=location.state|| {};

    const hasInitialGenerated=useRef(false);

    const[isProcessing, setIsProcessing] = useState(false);
    const[currentImage, setCurrentImage] = useState<string | null>(initialRender || null);
    //when we want to navigate back to homepage
    const handleBack =()=>navigate('/');

    const runGeneration=async ()=>{
        if(!initialImage) return;

        try{
            setIsProcessing(true);
            //if we get renered ai image in result
            const result=await generate3DView({sourceImage:initialImage});
            if(result.renderedImage){
                setCurrentImage(result.renderedImage);
                //Update project into database with rendered image.
            }
        }
        catch (error) {
            console.error('Generation Failed', error);
        }
        finally {
            setIsProcessing(false);
        }
    }
    //checking what is the state after image generation
    useEffect(() => {
        if(!initialImage|| hasInitialGenerated.current) return;
        if(initialRender){
            setCurrentImage(initialRender);
            hasInitialGenerated.current = true;
            return;
        }

        hasInitialGenerated.current = true;
        runGeneration();
    }, [initialImage,initialRender]);
    return (
        <section>
            <h1>
                {name || 'Untitled Project'}
            </h1>
            <div className="visualizer">
                {initialImage &&(
                    <div className="image-container">
                        <h2>Source Image</h2>
                        <img src={initialImage} alt="source" />
                    </div>

                )}
            </div>
        </section>
    )
}
export default VisualizerId
