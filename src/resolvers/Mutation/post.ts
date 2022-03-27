import { Post, Prisma } from "@prisma/client"
import { Context } from "../.."
 

interface PostCreateArgs{
    title: string
    description: string
}

interface PostUpdateArgs{
    id: number
    title: string
    description: string
}


interface PostDeleteArgs{
    id: number
}
interface PostPayLoadType{
    userErrors: {
        message: string
    }[]
   
    post:  Post | null 
}

interface Data {
    data: Prisma.Without<Prisma.PostUncheckedCreateInput, Prisma.PostCreateInput> & Prisma.PostCreateInput
}

 

export const postResolvers = {
    createPost: async (_:any, {title, description}:PostCreateArgs, {prisma, userInfo}: Context): Promise<PostPayLoadType> =>{

        if(!title || !description){

            if(!userInfo){
                return {
                    userErrors: [
                        {
                            message: "unauthorized user"
                        }
                    ],
                    post: null
                }
            }
          
          return {
              userErrors: [
                  {
                      message: "provide post title or description"
                  }
              ],
              post: null
          }
        }
  
       const post = await prisma.post.create({
              data:{
                  title,
                  description,
                   user_id: 5
              }
          });
  
          return {
              userErrors: [],
              post
          }
      },
  
      updatePost: async (parent:any, {id,title, description}: PostUpdateArgs, {prisma}:Context): Promise<PostPayLoadType> =>{
       
          if(!title || !description){
              return {
                   userErrors: [
                       {
                           message: "enter title or description"
                       }
                   ],
                   post: null,
              }
          }
  
        
          const postExistinDb = await prisma.post.findUnique({
              where: {
                  id: id
              }
          })
  
           if(!postExistinDb){
  
              return {
                  userErrors: [
                      {
                          message: "Post not found"
                      }
                  ],
                  post: null
  
              }
           }
          const post = await prisma.post.update({
              where:{
                  id: id
              },
  
              data: {
                  title,
                  description
              }
          });
  
          return {
              userErrors: [],
              post
          }
      },
  
      deletePost: async (parent:any, {id}:PostDeleteArgs,{prisma}:Context) :Promise<PostPayLoadType> =>{
  
          const postExist = await prisma.post.findUnique({
              where: {
                  id: id
              }
          });
  
         if(!postExist){
  
              return {
                  userErrors: [
                      {
                          message: "Post not found"
                      }
                  ],
                  post: null
  
              }
           }
  
           const post = await prisma.post.delete({
               where: {
                   id: id
               }
           });
           
           return {
               userErrors: [],
               post
           }
      }
}