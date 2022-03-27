import JWT from "jsonwebtoken"
import { JSON_SIGNATURE } from "../key"

export const getUserToken = (token: string) =>{
    try {
        return JWT.verify(token ,JSON_SIGNATURE) as unknown as  {
            userid: number
        }
    } catch (error) {
        
        return null
    }
}