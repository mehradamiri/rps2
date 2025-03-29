# Rock paper scissors and more

## Gameplay Features
	1.	Standard Moves: Choose rock (✊), paper (✋), or scissors (✌️). The AI will pick the winning standard move.
	2.	Custom Item: Enter any random or quirky item in the text box. The AI will respond with a whimsical, logical “counter” that beats your item.
	3.	Visual Feedback:
	•	Real-time countdown for each move.
	•	Animated confetti whenever the player wins.
	•	Score tracking for both Player and AI.
	4.	Responsive Design: Adjusts to various screen sizes and mobile devices.

## API Endpoint

The API route is located at /api/rps. It expects a POST request with JSON data containing a userItem string:

```js
{
  "userItem": "guitar"
}
```

```js
{
  "win": false,
  "counter": "راک‌استار",
  "emoji": "🤘🏻",
  "userEmoji": "🎸",
  "reason": "چون راک‌استار گیتار را در کنسرت‌ها نابود می‌کند!"
}
```

•	win: Always false in this project’s logic because the AI always wins.
•	counter: The name of the counter item.
•	emoji: An emoji representing the counter item.
•	userEmoji: An emoji representing the user’s item.
•	reason: A short explanation in Farsi of why the counter item wins.

demo : https://rps-ivory.vercel.app

license

This project is open source. You’re free to modify and use it for personal or commercial projects.
Consider giving credit or linking back if you find it helpful! 