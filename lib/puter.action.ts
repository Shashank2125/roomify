import puter from "@heyputer/puter.js";
import {getOrCreateHostingConfig, uploadImageToHosting} from "./puter.hosting";

export const signIn=async ()=>await puter.auth.signIn();
export const signOut=()=>puter.auth.signOut();
export const getCurrentUser=async()=>{
    try {
        return await puter.auth.getUser();

    }catch {
        return null;
    }
}

export const createProject=async ({items}:CreateProjectParams):
Promise<DesignItem | null | undefined>=>{
    const projectId=item.id;
    const hosting= await getOrCreateHostingConfig();
    const hostedSource=projectId?
        await uploadImageToHosting()
}