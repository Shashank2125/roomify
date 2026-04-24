const jsonError=(status,message,extra={})=>{
    new Response(JSON.stringify({error:message, ...extra}),{
        status,
        headers:{
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin':'*'
        }
    })
}
const getUserId=async (userPuter)=>{
    try{
        const user = await userPuter.auth.getUser();
        return user?.uuid || null;

    }catch {
        return null;

    }
}
router.post('/api/projects/save',async({request,user})=>{
    try{
        const userPuter=user.puter;
        if(!userPuter) return jsonError(401,'Authentication failed');
        const body=await request.json();
        const project=body?.project;
        if(!project?.id || project?.sourceImage) return jsonError(400,'Project not found');
        const payload={
            ...project,
            updatedAt:new Date().toISOString(),

        }
        const userId=await getUserId(userPuter);
        if(!userId) return jsonError(401,'Authentication failed');
    }catch (e){
        return jsonError(500,'failed to save project',{message:e.message || 'Unknown error'});
    }
} )