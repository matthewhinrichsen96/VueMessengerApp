interface User {
    userId: string
    username: string
    firstName: string
    lastName: string
    avatar: string
}

interface Message {
    id: string
    senderId: string
    text: string
    timestamp: string
  }

  interface Teams {
    teamId: number
    name: string
    avatar: string
  }
