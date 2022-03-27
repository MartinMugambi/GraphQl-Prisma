import {gql} from "apollo-server"

export const typeDefs = gql`
  type Query{
    me: User
    posts: [Post!]!
    post(id: Int): Post      
  }

  type Post{
    id: Int!
    title: String!
    description: String!
    published: Boolean!
    user: User!
  }

  type User{
    id: Int!
    username: String!
    email: String!
    password: String!
    posts: [Post!]!
  }

  type Mutation{
    createPost(title: String!, description: String!): PostPayLoad!
    updatePost(id: Int!, title: String!, description: String!): PostPayLoad!
    deletePost(id:Int!) : PostPayLoad!
    signUp(input: AuthDetails): AuthPayLoad!
    signIn(input: AuthDetails) : AuthPayLoad!

  }

  type userError{
    message: String
  }

  type PostPayLoad{
    userErrors: [userError]
    post: Post!
  }
 
 input AuthDetails{
   username: String
   email: String!
   password: String!
 }

 type AuthPayLoad{
   userErrors: [userError]
   token: String!
 }
`