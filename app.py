import io, base64, os
from telegram import Update
from telegram.ext import ApplicationBuilder, MessageHandler, ContextTypes, filters
import openai

openai.api_key = os.getenv("OPEN_AI_KEY"
)

async def handle_photo(update: Update, context: ContextTypes.DEFAULT_TYPE):
    file = await update.message.photo[-1].get_file()
    img_bytes = await file.download_as_bytearray()
    img_b64 = base64.b64encode(img_bytes).decode()

    completion = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[{
            "role": "user",
            "content": [
                {"type": "text", "text": "Answer the question shown in this picture concisely and correctly."},
                {"type": "image_url", "image_url": f"data:image/jpeg;base64,{img_b64}"}
            ]
        }]
    )
    answer = completion["choices"][0]["message"]["content"].strip()

    tts = openai.audio.speech.create(
        model="gpt-4o-mini-tts",
        voice="alloy",   # British accent
        input=answer
    )
    audio = io.BytesIO(tts.read())
    audio.seek(0)

    await update.message.reply_text(answer)
    await update.message.reply_voice(voice=audio)

app = ApplicationBuilder().token(os.getenv(8403658742:AAGRvDwr4KI4ni6aTwTAQS423Grbjvy7AlU)).build()
app.add_handler(MessageHandler(filters.PHOTO, handle_photo))

if __name__ == "__main__":
    app.run_polling()
