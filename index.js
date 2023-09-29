import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const ChatUi = document.createElement('div')
ChatUi.innerHTML = `<form action="submit" id="Forum">
     <input type="text" placeHolder="Type your message here">
  </form>`
const chatId = GenerateChatId()

/**
 * @param {string} sb_url
 * @param {string} sb_key
*/
function init({sb_url, sb_key}) {
   // base variables
   let isChatting
   const supabase = createClient(sb_url, sb_key)
   const ChatBtnDiv = document.createElement('div')
   
   ChatBtnDiv.innerHTML = `
   <button type="submit" id="startChat">Chat With Support</button>
   `
   document.body.append(ChatBtnDiv)
   const StartChatBtn = document.getElementById('startChat')
   
   // starting the chat
   StartChatBtn.onclick = (e) => {
     e.preventDefault()
     isChatting = true
      console.log(isChatting);
      document.body.append(ChatUi)
      // submit event
      const Forum = document.getElementById('Forum')
      Forum.onsubmit = (e) => {
      e.preventDefault()
        InsertMessage({message: 
        e.target[0].value,
        chat_id: chatId
        }, supabase)
      }
      fetch_from_db(supabase)
    }
}
// fetch from db (realtime)
async function fetch_from_db(sb) {
const messages = sb.channel('messages')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'messages' },
    (payload) => {
      console.log('Change received!', payload)
      RenderMessage(payload.new.message)
    }
  )
  .subscribe()
}
// insert message to db
/**
 * Inserts message object to db
 * @param {{message: string, chat_id: ChatId}} message
 * @param {supabase} sb
*/
async function InsertMessage(message, sb){
   const { error } = await sb
   .from('messages')
   .insert(message)
}
// render the message
function RenderMessage(message) {
   const MessageHtml = document.createElement('p')
   MessageHtml.innerText = message
   ChatUi.append(MessageHtml)
}
// ChatId
/**
 * generate a chat id for the chat to be identified with
 * @returns {chat_id}
*/
function GenerateChatId() {
  let base = ''
   for(let i = 0; i < 8; i++) {
     const num = Math.round(Math.random() * 9)
     base += num
   }
   return Number(base)
}


init({
   sb_key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpueWl5cmVraGp0Y3F5eXlndHBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQ5NTYzNTgsImV4cCI6MjAxMDUzMjM1OH0.GPsdEbigABYGsFCJGau2XtSZmfgqfFr3X9FPT6VM2zE',
   sb_url: 'https://jnyiyrekhjtcqyyygtpm.supabase.co',
})

