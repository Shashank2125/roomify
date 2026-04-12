import puter from "@heyputer/puter.js";
import {createHostingSlug, HOSTING_CONFIG_KEY} from "./utils";
import Interceptors from "undici-types/interceptors";
import retry = Interceptors.retry;
import {create} from "node:domain";
type HostingConfig={subdomain: string};
type HostingAsset={url: string};
export const getOrCreateHostingConfig=async ():Promise<HostingConfig | null>=>{
    const existing=(await puter.kv.get(HOSTING_CONFIG_KEY)) as HostingConfig | null;
    if (existing?.subdomain) return { subdomain: existing.subdomain };
    const subdomain=createHostingSlug();
    try{
        const created=await puter.hosting.create(subdomain,'.');

        return {subdomain:created.subdomain};
    }catch (e){
        console.warn(`Could not find subdomain: ${e}`);
        return null;
    }

}