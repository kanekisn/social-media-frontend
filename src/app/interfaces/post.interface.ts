export interface Post {
  "id": number,
  "content": string,
  "commentsCount" : number | null,
  "likesCount" : number,
  "likedByCurrentUser" : boolean,
  "createdAt": string,
  "updatedAt": string,
  "author": {
    "id": 1,
    "firstName": string | null,
    "lastName": string | null,
    "avatarUrl": string | null,
    "city": string | null,
    "description": string | null,
    "stack": string | null
  }
}
