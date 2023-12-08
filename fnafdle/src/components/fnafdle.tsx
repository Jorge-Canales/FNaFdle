import { useEffect, useState } from "react";
import RowCompleted from "./rowCompleted";
import RowCurrent from "./rowCurrent";
import RowEmpty from "./rowEmpty";
import { GameStatus } from "./types";
import { useWindow } from "../hooks/useWindow";

const keys = ["A", "B", "C", "D", "E", "F", "G",
    "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q",
    "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

export default function Fnafdle() {
    const [wordOfTheDay, setWordOfTheDay] = useState<string>("");
    const [turn, setTurn] = useState<number>(1);
    const [currentWord, setCurrentWord] = useState<string>("");
    const [completedWords, setCompletedWords] = useState<string[]>([]);
    const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.Playing);

    useWindow("keydown", handleKeyDown);

    useEffect(() => {
        setWordOfTheDay("BREAK");
    }, []);

    function handleKeyDown(event: KeyboardEvent) {
        const letter = event.key.toUpperCase();

        if(gameStatus !== GameStatus.Playing){
            return;
        }

        if (event.key === "Backspace" && currentWord.length > 0) {
            onDelete();
            return;
        }

        if (event.key === "Enter" && currentWord.length === 5 && turn <= 6) {
            onEnter();
            return;
        }

        if (currentWord.length >= 5) return;

        if (keys.includes(letter)) {
            onInput(letter);
            return;
        }
    }

    function onInput(letter: string) {
        const newWord = currentWord + letter;
        setCurrentWord(newWord);
    }

    function onDelete() {
        const newWord = currentWord.slice(0, -1);
        setCurrentWord(newWord);
    }

    function onEnter() {
        if (currentWord === wordOfTheDay) {
            setCompletedWords([...completedWords, currentWord]);
            setGameStatus(GameStatus.Won);
            return;
        }

        if (turn === 6) {
            setCompletedWords([...completedWords, currentWord]);
            setGameStatus(GameStatus.Lost);
            return;
        }

        setCompletedWords([...completedWords, currentWord]);
        setTurn(turn + 1);
        setCurrentWord("");
    }

    return (
        <div>
            {completedWords.map((word, i) => (
                <RowCompleted word={word} solution={wordOfTheDay} />
            ))}

            {gameStatus === GameStatus.Playing ? (
                <RowCurrent word={currentWord} />
            ) : null}

            {Array.from(Array(6 - turn)).map((_, i) => (
                <RowEmpty key={i} />
            ))}
        </div>
    );
}