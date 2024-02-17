// Detail Basic (require)
const DATE_START = "01-12-2024" // Time Of Start Daily Hastag
const MEDIA_URL  = "https://ernestoyoofi.github.io/ernestoyoofi/data/media/content/ygbenerajerugidong-dailymeme/rugidong.mp4" // URL of media, learn in facebook graph
const DESC_POST  = "🗣️ Rugi dong, yang bener aje #{STD}\n\nOriginal: https://vt.tiktok.com/ZSNwJMJXP/ tiktok/atilanjiwo\n\n#rugidong #yangbeneraje #semprulsendiri #geksorsendiri #xyzbca #meme #memedaily #dailypost" // {STD} Create to time start post like #1 or day1 from #{STD} or day{STD}

// Instagram API (require)
const ACCESS_TOKEN = "" // Get By Instagram Bussiness Work > Basic Management Instagram
const INSTAGRAM_ID = "" // Get Via Pages

// Log Messageing (optional)
const USE_LOG    = true // Set false If You Not This Logs
const TELEGRAM_TOKEN = ''
const TELEGRAM_SEND = ''

function LoggingApplication(msgcontent) {
  if(!USE_LOG) return;
  const urlPost = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`
  try {
    const dataRespon = UrlFetchApp.fetch(urlPost, {
      'method': "POST",
      'headers': {
        "content-type": "application/json"
      },
      'payload': JSON.stringify({
        chat_id: TELEGRAM_SEND,
        text: `[${new Date().toISOString()}] [dailymeme_rugidong]: ${msgcontent}`
      })
    })
    console.log('LOG HAS SENDING TO TELEGRAM >', dataRespon.getContentText())
  } catch(err) {
    console.error('LOG HAS NOT SENDING TO INSTAGRAM >', err)
  }
}

function objToStringdata(obj) {
  return (
    Object.entries(obj).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&')
  )
}

function PostProses_MediaContent() {
  const formatDate = Math.floor((new Date().getTime() - new Date(DATE_START).getTime())/(1000*60*60*24))
  const urlBody = {
    media_type: "REELS",
    video_url: MEDIA_URL,
    caption: DESC_POST.replace(/{STD}/g, formatDate),
    share_to_feed: "true",
    access_token: ACCESS_TOKEN
  }
  try {
    //  ---  Try Post Media Content  ---
    const URL_PostMedia = `https://graph.facebook.com/${INSTAGRAM_ID}/media?`+objToStringdata(urlBody)
    console.log("[ Wait Content  ]: Start Posted Prosesing...")
    const fetch_postmedia = UrlFetchApp.fetch(URL_PostMedia, {
      'method': "POST"
    })
    const fetch_postmedia_data = JSON.parse(fetch_postmedia.getContentText())
    console.log("[Success Content]: Success Posted...")
    LoggingApplication(`Success ${fetch_postmedia.getContentText()}`)
    Utilities.sleep(15000) // Waiting For 15 Seconds

    //  ---  Getting Status Information  ---
    console.log("[ Wait Content  ]: Start Getting Status...")
    const URL_MediaStatus = `https://graph.facebook.com/${fetch_postmedia_data.id}?`+objToStringdata({
      fields: "status_code",
      access_token: ACCESS_TOKEN
    })
    const fetch_poststatus = UrlFetchApp.fetch(URL_MediaStatus)
    const fetch_poststatus_data = JSON.parse(fetch_poststatus.getContentText())
    console.log(`[Success Content]: Status Is ${fetch_poststatus_data.status_code}`)
    LoggingApplication(`Success ${fetch_poststatus.getContentText()}`)
    Utilities.sleep(4000) // Waiting For 4 Seconds

    //  ---  Post Media After Ready  ---
    console.log("[ Wait Content  ]: Media Publishing...")
    const URL_PostSubmit = `https://graph.facebook.com/${INSTAGRAM_ID}/media_publish?`+objToStringdata({
      access_token: ACCESS_TOKEN,
      creation_id: fetch_postmedia_data.id
    })
    const fetch_postsubmit = UrlFetchApp.fetch(URL_PostSubmit, {
      'method': "POST"
    })
    console.log("[Success Content]: Reels has posted !", fetch_postsubmit.getContentText())
    LoggingApplication(`Success Upload To Post ${fetch_postsubmit.getContentText()}`)
  } catch(err) {
    LoggingApplication(`Error Messageing About Posted !\n${err.message}`)
  }
}
