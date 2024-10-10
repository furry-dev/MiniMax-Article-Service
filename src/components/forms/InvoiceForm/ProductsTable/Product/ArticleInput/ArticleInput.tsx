import React from "react"
import toast from "react-hot-toast"

interface CountInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    tabulationOnEnter: React.KeyboardEventHandler,
    containerRef: React.RefObject<HTMLElement | null>,
}

export default function ArticleInput({tabulationOnEnter, containerRef, ...props}: CountInputProps) {
    const handleArticleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const activeElement = document.activeElement

        if (activeElement && activeElement.tagName === "INPUT" && containerRef?.current) {
            const inputs = Array.from(containerRef.current.querySelectorAll("input[name$='-article']")) as HTMLInputElement[]
            const index = inputs.indexOf(activeElement as HTMLInputElement)

            const nextArticle = () => {
                inputs[index + 1].focus()
            }

            if (e.key === "ArrowUp" && index > 0) {
                inputs[index - 1].focus()
                e.preventDefault()
            } else if (e.key === "ArrowDown" && index < inputs.length - 1) {
                nextArticle()
                e.preventDefault()
            } else if (e.key === "Enter") {
                tabulationOnEnter(e)
            } else if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab" && e.key !== "ArrowRight" && e.key !== "ArrowLeft" && !(e.ctrlKey && e.code === "KeyA") && !(e.ctrlKey && e.code === "KeyC")) {
                e.preventDefault()
            }
        }
    }

    const onCopyHandler = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const target = e.target

        if (target instanceof HTMLInputElement && containerRef?.current) {
            toast.success("Артикул скопійовано")

            const inputs = Array.from(containerRef.current.querySelectorAll("input[name$='-article']")) as HTMLInputElement[]
            const index = inputs.indexOf(target)
            
            setTimeout(() => {
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus()
                } else {
                    const button = document.getElementById("payInvoiceBtn") || document.getElementById("closeInvoiceBtn")

                    if (button instanceof HTMLButtonElement) button.focus()
                }
            }, 100)
        }
    }

    const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select()
    }

    return (
        <input
            type="number"
            min={0}
            step={1}
            onKeyDown={handleArticleKeyDown}
            onFocus={handleInputFocus}
            onCopy={onCopyHandler}
            {...props}
        />
    )
}