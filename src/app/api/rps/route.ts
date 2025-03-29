import { NextResponse } from 'next/server'
import { generateText } from 'ai'
import { deepseek } from '@ai-sdk/deepseek'

export async function POST(request: Request) {
  try {
    const { userItem } = await request.json()

    if (!userItem || typeof userItem !== 'string') {
      return NextResponse.json({ error: 'Invalid input. Please provide a userItem string.' }, { status: 400 })
    }

    const prompt = `You are a creative game engine for a rock-paper-scissors-style game with weird and imaginative items.

Rules:
 • you always win. So set "win": false.
 • You must choose a counter item that can clearly defeat  user’s item — symbolically or logically — like in rock-paper-scissors. This is crucial.
 • Do not choose an item just because it’s related to user’s item. your item must be stronger or more dominant than the user’s item.
 • Be imaginative and funny and quirky, but make sure the logic holds — for example: user chooses guitar, you choose a rockstar(because they destroy guitars at their concerts)
Or if the user chose god, you choose an atheist cause they completely deny god’s existence.
 • Use an emoji for both items.
 • DONT USE MARKDOWN
 • if user chose me or him self say you are already a loser and chose miror
 • if user chose number chose grater number like if its 12 say 13

JSON format:
{
    "win": false,
    "counter": "name of the item that the user beats in Farsi",
    "emoji": "emoji for the counter item",
    "userEmoji": "emoji for the user’s item",
    "reason" : "the reason why its counter in Farsi"
}

User item: ${userItem}
`

    const { text } = await generateText({
      model: deepseek('deepseek-chat'),
      
      prompt,
      
    })
   console.log(text)
    const json = JSON.parse(text)

    return NextResponse.json(json)
  } catch (error) {
    console.error('Error using DeepSeek AI:', error)
    return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 })
  }
}