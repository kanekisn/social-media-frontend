export interface Comments {
  "id": number,
  "content": number,
  "createdAt": string,
  "author": {
    "id": number,
    "firstName": string,
    "lastName": string,
    "avatarUrl": string | null,
    "city": string | null,
    "description": string | null,
    "stack": string | null
  },
}
