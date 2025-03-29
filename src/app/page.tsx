"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { GamepadIcon as Gameboy, FileType, Trophy, Wand2, Loader2 } from "lucide-react"
import confetti from "canvas-confetti"
import { Input } from "@/components/ui/input"

export default function RockPaperScissors() {
  const [playerChoice, setPlayerChoice] = useState<string | null>(null)
  const [computerChoice, setComputerChoice] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [playerScore, setPlayerScore] = useState(0)
  const [computerScore, setComputerScore] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [customItem, setCustomItem] = useState("")
  const [customMode, setCustomMode] = useState(false)
  const [customEmojis, setCustomEmojis] = useState<{ userEmoji: string; aiEmoji: string } | null>(null)
  const [isTyping, setIsTyping] = useState(false)

  // NEW state for showing the reason returned by the API
  const [customReason, setCustomReason] = useState<string | null>(null)

  const choices = ["rock", "paper", "scissors"]

  const emojis: Record<string, string> = {
    rock: "✊",
    paper: "✋",
    scissors: "✌️",
  }

  const getComputerChoice = () => {
    if (playerChoice === "rock") return "paper"
    if (playerChoice === "paper") return "scissors"
    if (playerChoice === "scissors") return "rock"

    // Fallback to random if somehow playerChoice is not set
    const randomIndex = Math.floor(Math.random() * choices.length)
    return choices[randomIndex]
  }

  const determineWinner = (player: string, computer: string) => {
    if (player === computer) return "draw"
    if (
      (player === "rock" && computer === "scissors") ||
      (player === "paper" && computer === "rock") ||
      (player === "scissors" && computer === "paper")
    ) {
      return "player"
    }
    return "computer"
  }

  const handlePlayerChoice = (choice: string) => {
    if (isAnimating) return

    setIsAnimating(true)
    setPlayerChoice(choice)
    setComputerChoice(null)
    setResult(null)
    setCustomMode(false)
    setCustomEmojis(null)
    // Reset reason whenever a new round starts
    setCustomReason(null)

    // Start countdown
    setCountdown(3)
  }

  const handleCustomItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customItem.trim() || isAnimating) return

    setIsAnimating(true)
    setPlayerChoice(customItem.trim())
    setComputerChoice(null)
    setResult(null)
    setCustomMode(true)
    setCustomEmojis(null)
    // Reset reason whenever a new round starts
    setCustomReason(null)

    // Start countdown
    setCountdown(3)
  }

  useEffect(() => {
    if (countdown === null) return

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 500)
      return () => clearTimeout(timer)
    } else {
      // When countdown reaches 0
      if (customMode) {
        // Call the API for custom items
        fetchCustomResult(playerChoice!)
      } else {
        // Standard RPS game
        const computer = getComputerChoice()
        setComputerChoice(computer)

        const gameResult = determineWinner(playerChoice!, computer)
        setResult(gameResult)

        if (gameResult === "player") {
          setPlayerScore((prev) => prev + 1)
          // Trigger confetti for player win
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          })
        } else if (gameResult === "computer") {
          setComputerScore((prev) => prev + 1)
        }

        setIsAnimating(false)
      }
    }
  }, [countdown, playerChoice, customMode])

  const fetchCustomResult = async (userItem: string) => {
    try {
      const response = await fetch("/api/rps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userItem }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response from API")
      }

      const data = await response.json()

      setComputerChoice(data.counter)
      setResult(data.win ? "player" : "computer")
      setCustomEmojis({
        userEmoji: data.userEmoji,
        aiEmoji: data.emoji,
      })
      // Store the reason (if provided by the API)
      setCustomReason(data.reason || null)

      if (data.win) {
        setPlayerScore((prev) => prev + 1)
        // Trigger confetti for player win
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      } else {
        setComputerScore((prev) => prev + 1)
      }

    } catch (error) {
      console.error("Error fetching custom result:", error)
      setResult("error")

    } finally {
      setIsAnimating(false)
    }
  }

  const getResultMessage = () => {
    if (result === "player") return "You Win!"
    if (result === "computer") return "AI Wins!"
    if (result === "draw") return "It's a Draw!"
    if (result === "error") return "Error Occurred!"
    return ""
  }

  return (<div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white flex flex-col items-center justify-center p-4">
    <Card className="w-full max-w-md bg-indigo-800 border-4 border-yellow-400 rounded-xl shadow-[0_0_15px_rgba(255,255,0,0.5)] p-6">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-yellow-300 mb-2 tracking-wider flex items-center justify-center gap-2">
          <Gameboy className="h-8 w-8" />
          <span className="text-shadow">سنگ کاغذ قیچی</span>
        </h1>
        
      </div>
  
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-indigo-700 p-3 rounded-lg text-center border-2 border-cyan-400">
          <div className="text-lg font-bold text-cyan-300">شما</div>
          <div className="h-24 flex items-center justify-center">
            {countdown !== null ? (
              <div className="text-6xl animate-pulse">
                {countdown > 0 ? (
                  countdown
                ) : customMode ? (
                  customEmojis ? (
                    customEmojis.userEmoji
                  ) : (
                    <div className="text-2xl px-2 break-all overflow-hidden max-h-full">
                      {playerChoice}
                    </div>
                  )
                ) : (
                  playerChoice
                )}
              </div>
            ) : (
              <div className="text-4xl text-gray-500">?</div>
            )}
          </div>
          <div className="bg-yellow-300 text-indigo-900 font-bold rounded-full px-3 py-1 text-xl">
            {playerScore}
          </div>
        </div>
  
        <div className="bg-indigo-700 p-3 rounded-lg text-center border-2 border-pink-400">
          <div className="text-lg font-bold text-pink-300">هوش مصنوعی</div>
          <div className="h-24 flex flex-col items-center justify-center">
            {countdown === 0 ? (
              <div className="text-center flex flex-col items-center">
                {customMode ? (
                  <>
                    {customEmojis ? (
                      <span className="text-5xl mb-1">{customEmojis.aiEmoji}</span>
                    ) : (
                      <span className="text-3xl">
                        <Loader2 className="animate-spin"/>
                      </span>
                    )}
                    <span className="text-xs font-bold mt-1 bg-indigo-950 px-2 py-1 rounded-md">
                      {computerChoice}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-5xl mb-1">
                      {emojis[computerChoice ?? -1]}
                    </span>
                    <span className="text-xs font-bold mt-1 bg-indigo-950 px-2 py-1 rounded-md">
                      {computerChoice?.toUpperCase()}
                    </span>
                  </>
                )}
              </div>
            ) : (
              <div className="text-4xl text-gray-500">?</div>
            )}
          </div>
          <div className="bg-pink-300 text-indigo-900 font-bold rounded-full px-3 py-1 text-xl">
            {computerScore}
          </div>
        </div>
      </div>
  
      {result && (
        <div
          className={`text-center mb-2 text-2xl font-bold ${
            result === "player"
              ? "text-green-300"
              : result === "computer"
              ? "text-red-300"
              : result === "draw"
              ? "text-yellow-300"
              : "text-gray-300"
          } animate-bounce`}
        >
          {result === "player"
            ? "شما برنده شدید!"
            : result === "computer"
            ? "هوش مصنوعی برنده شد!"
            : result === "draw"
            ? "مساوی شد!"
            : "خطایی رخ داد!"}
        </div>
      )}
  
      {customMode && customReason && result && result !== "draw" && (
        <div className="text-center text-sm text-indigo-300 mb-4 italic">
          {customReason}
        </div>
      )}
  
      <div className="grid grid-cols-3 gap-3 mb-4 transition-all duration-300">
        <Button
          onClick={() => handlePlayerChoice("rock")}
          disabled={isAnimating}
          className={`bg-red-500 hover:bg-red-600 text-white h-16 rounded-xl border-b-4 border-red-700 hover:border-red-800 transition-all duration-300 ${
            isTyping ? "opacity-30" : "opacity-100"
          }`}
        >
          <div className="flex flex-col items-center">
            <span className="text-2xl">✊</span>
            <span className="text-xs font-bold">سنگ</span>
          </div>
        </Button>
  
        <Button
          onClick={() => handlePlayerChoice("paper")}
          disabled={isAnimating}
          className={`bg-blue-500 hover:bg-blue-600 text-white h-16 rounded-xl border-b-4 border-blue-700 hover:border-blue-800 transition-all duration-300 ${
            isTyping ? "opacity-30" : "opacity-100"
          }`}
        >
          <div className="flex flex-col items-center">
            <span className="text-2xl">✋</span>
            <span className="text-xs font-bold">کاغذ</span>
          </div>
        </Button>
  
        <Button
          onClick={() => handlePlayerChoice("scissors")}
          disabled={isAnimating}
          className={`bg-green-500 hover:bg-green-600 text-white h-16 rounded-xl border-b-4 border-green-700 hover:border-green-800 transition-all duration-300 ${
            isTyping ? "opacity-30" : "opacity-100"
          }`}
        >
          <div className="flex flex-col items-center">
            <span className="text-2xl">✌️</span>
            <span className="text-xs font-bold">قیچی</span>
          </div>
        </Button>
      </div>
  
      <form onSubmit={handleCustomItemSubmit} className="mb-6">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="آیتم سفارشی خود را وارد کنید..."
            value={customItem}
            onChange={(e) => {
              setCustomItem(e.target.value)
              setIsTyping(e.target.value.length > 0)
            }}
            onFocus={() => setIsTyping(customItem.length > 0)}
            onBlur={() => setTimeout(() => setIsTyping(false), 200)}
            className="bg-indigo-950 border-indigo-600 text-white placeholder:text-indigo-400"
            disabled={isAnimating}
          />
          <Button
            type="submit"
            disabled={isAnimating || !customItem.trim()}
            className="bg-purple-500 hover:bg-purple-600 border-b-4 border-purple-700"
          >
            <Wand2 className="h-5 w-5" />
          </Button>
        </div>
      </form>
  
    
    </Card>
  
    <div className="mt-6 text-xs text-indigo-300 flex items-center">
      <Trophy className="h-3 w-3 mr-1" />
      ساخته شده توسط مهراد | نسخه 1.0
    </div>
  </div>)
}