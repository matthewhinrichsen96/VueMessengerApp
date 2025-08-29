interface User {
  userId: string
  username: string
  firstName: string
  lastName: string
  avatar: string
}

interface Message {
  chatId: string
  senderId: string
  text: string
  timeStamp: string
}

interface Teams {
  teamId: number
  name: string
  avatar: string
}
