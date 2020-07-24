import { config } from 'dotenv'
import api from './services/axios'

config()

api.get('/streams?game_id=33214', {
  headers: {
    'Client-ID': process.env.TWITCH_ID,
    authorization: `Bearer ${process.env.TWITCH_SECRET}`,
  },
}).then(({ data }) => { console.log(data) }).catch((error) => console.log(error))
