import { Context } from "..";

export const Query={
  posts: async (parent:any, args:any, {prisma}:Context) =>{
    
    return await prisma.post.findMany({
        select:{
            title: true,
            description: true,
            published: true,
        }
    });
  },
  
  me:  async (parent:any, args:any, {prisma, userInfo}:Context)=>{
    
    if(!userInfo){
      return null
    }
    return  await prisma.user.findUnique({
      where: {
        id: userInfo?.userid
      }
    })
  }
}