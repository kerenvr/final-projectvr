import { JSONFilePreset } from "lowdb/node"
import { nanoid } from "nanoid"

const initialData = {
  subscribers: [
    {
      id: "b1245",
      fname: "Pierce",
      lname: "Brosnan",
      sex: "Male",
    },
    {
      id: "c5431",
      fname: "Jennifer",
      lname: "Garner",
      sex: "Female",
    },
    {
      id: "d6790",
      fname: "Harrison",
      lname: "Ford",
      sex: "Male",
    },
  ],
}

// Initialize the database
let db = await JSONFilePreset("db.json", initialData)

async function getSubscribers() {
  await db.read()
  return db.data.subscribers
}

async function addSubscriber(subscriber) {
  subscriber.id = nanoid(5)
  db.data.subscribers.push(subscriber)
  await db.write()
}

async function removeSubscriber(id) {
  const index = db.data.subscribers.findIndex(
    (subscriber) => subscriber.id === id
  )
  db.data.subscribers.splice(index, 1)
  await db.write()
}

async function favoriteSubscriber(id) {
  const index = db.data.subscribers.findIndex(
    (subscriber) => subscriber.id === id
  )
  db.data.subscribers[index].isFavorite = !db.data.subscribers[index].isFavorite
  await db.write()
}

export const database = {
  getSubscribers,
  addSubscriber,
  removeSubscriber,
  favoriteSubscriber,
}
