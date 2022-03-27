import {ApolloServer} from "apollo-server";
import { typeDefs } from "./schema/schema";
import  {PrismaClient, Prisma} from "@prisma/client"
import { Mutation, Query } from "./resolvers";
import { getUserToken } from "./utils/getUserToken";



 const prisma = new PrismaClient();

export interface Context{
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>
  userInfo: {
    userid: number;
} | null
}


const server = new ApolloServer({
  typeDefs,
  resolvers: {
   Query,
   Mutation
  },
  context: async ({req}:any):Promise<Context>=>{
   const userInfo = await getUserToken(req.headers.authorization)   
    console.log(userInfo);
    
   return {
    prisma,
    userInfo
   }
  }
});


server.listen().then(({url})=>{
    console.log(`server listening at`, url);
    
})