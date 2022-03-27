import { Context } from "../..";
import validator from "validator"
import bcrypt from "bcrypt"
import JWT from "jsonwebtoken"
import { JSON_SIGNATURE } from "../../key";
interface SignUpArgs{
    input:{
        username?: string,
        email: string,
        password: string,
    }
}


interface UserPayLoad{
    userError: {
      message: string
    }[],
    token: string | null
}

export const authResolvers = {

    signUp: async (parent:any, {input}:SignUpArgs, {prisma}:Context): Promise<UserPayLoad> =>{
      
        const {username, email, password} = input;       

        if(!username || !email || !password){
            return {
                userError: [
                    {
                        message: "add username, email or password",
                    }
                ],
                token: null,
            }
        }

        const  isEmail = validator.isEmail(email);

        const isPassword = validator.isLength(password, {
          min: 5  
        })

         if(!isEmail){
             return {
                 userError: [
                     {
                         message: "invalid email address"
                     }
                 ],
                 token: null
             }
         }

       if(!isPassword){
           return {
               userError: [
                   {
                       message: "password must be more than 5 characters"
                   }
               ],
               token: null
           }

         
       }


       const hashedPassword =  await bcrypt.hash(password, 10)

       const user = await prisma.user.create({
           data: {
                username,
                password: hashedPassword,
                email
           }
       });


       const  token = await  JWT.sign({
           user_id: user.id
       },JSON_SIGNATURE, {
           expiresIn: 360000
       })
       return {
           userError: [],
           token: token
       }
    },

    signIn: async (parent:SignUpArgs, {input}: SignUpArgs, {prisma}:Context): Promise<UserPayLoad> =>{
        
        const {email, password} = input;

        if(!email || !password){
            return {
                userError: [
                    {
                        message: "enter email or password"
                    }
                ],
                token: null,
            }
        }



        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if(!user){
            return {
                userError: [
                    {
                        message: "invalid credentials"
                    }
                ],
                token: null,
            }
        }


        const isMatch = bcrypt.compare(password, user.password);

        if(!isMatch){
            return {
                userError: [
                    {
                        message: "invalid credentials"
                    }
                ],
                token: null,
            }
        }

        const token = JWT.sign({
            userid: user.id
        }, JSON_SIGNATURE, {
            expiresIn: 360000
        })

        return {
            userError: [],
            token: token
        }
       
    }
} 