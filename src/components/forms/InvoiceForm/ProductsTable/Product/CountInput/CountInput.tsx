import React from "react"
import toast from "react-hot-toast"

interface CountInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    tabulationOnEnter: React.KeyboardEventHandler
}

export default function CountInput({tabulationOnEnter, ...props}: CountInputProps) {
    const handleCountKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            tabulationOnEnter(e)
        } else if (e.ctrlKey && e.code === "KeyC") {
            toast.success("Кількість скопійовано")
        } else if (!/[0-9]/.test(e.key) && e.key !== "ArrowUp" && e.key !== "ArrowDown" && e.key !== "Backspace" && e.key !== "Tab") {
            e.preventDefault()
        }
    }

    const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select()
    }

    return (
        <input
            type="number"
            min={1}
            step={1}
            onKeyDown={handleCountKeyDown}
            onFocus={handleInputFocus}
            {...props}
        />
    )
}