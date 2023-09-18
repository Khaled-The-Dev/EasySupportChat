import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

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
     const ChatUi = document.createElement('div')
      ChatUi.innerHTML = `<form action="submit">
            <input type="text" placeHolder="Type your message here">
          </form>`
      console.log(isChatting);
      document.body.append(ChatUi)
      fetch_from_db(supabase)
      InsertMessage('hi', supabase)
    }
}
// fetch from db (realtime)
async function fetch_from_db(sb) {
     const { data, error } = await sb
     .from('messages')
     .on('INSERT', (message) => {
        console.log(message);
        RenderMessage(message.new)
     })
}
// insert message to db
async function InsertMessage(message, sb){
   const { error } = await sb
   .from('messages')
   .insert(message)
}
// render the message
function RenderMessage(message) {
   const MessageHtml = document.createElement('p')
   MessageHtml.innerText = message
}
init({
   sb_key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpueWl5cmVraGp0Y3F5eXlndHBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQ5NTYzNTgsImV4cCI6MjAxMDUzMjM1OH0.GPsdEbigABYGsFCJGau2XtSZmfgqfFr3X9FPT6VM2zE',
   sb_url: 'https://jnyiyrekhjtcqyyygtpm.supabase.co',
})
