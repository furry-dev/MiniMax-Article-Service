import React, {useState} from "react"
import toast from "react-hot-toast"

interface CountInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    tabulationOnEnter: React.KeyboardEventHandler,
    onLongPress?: React.TouchEventHandler,
}

export default function CountInput({tabulationOnEnter, onLongPress, ...props}: CountInputProps) {
    const handleCountKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            tabulationOnEnter(e)
        } else if (!/[0-9]/.test(e.key) && e.key !== "ArrowUp" && e.key !== "ArrowDown" && e.key !== "Backspace" && e.key !== "Tab" && !(e.ctrlKey && e.code === "KeyA") && !(e.ctrlKey && e.code === "KeyC")) {
            e.preventDefault()
        }
    }

    const onCopyHandler = () => {
        toast.success("Кількість скопійовано")
    }

    const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select()
    }

    const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null)

    const startPressTimer = (e: React.TouchEvent) => {
        if (onLongPress) {
            setPressTimer(setTimeout(() => {
                onLongPress(e)
            }, 500))
        }
    }

    const clearPressTimer = () => {
        if (pressTimer) {
            clearTimeout(pressTimer)
        }
    }

    return (
        <input
            type="number"
            min={1}
            step={1}
            onKeyDown={handleCountKeyDown}
            onFocus={handleInputFocus}
            onCopy={onCopyHandler}
            onTouchStart={startPressTimer}
            onTouchEnd={clearPressTimer}
            {...props}
        />
    )
}