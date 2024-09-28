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
                e.preventDefault()
            }

            if (e.key === "ArrowUp" && index > 0) {
                inputs[index - 1].focus()
                e.preventDefault()
            } else if (e.key === "ArrowDown" && index < inputs.length - 1) {
                nextArticle()
            } else if (e.key === "Enter") {
                tabulationOnEnter(e)
            } else if (e.ctrlKey && e.code === "KeyC") {
                toast.success("Артикул скопійовано")
                if (index < inputs.length - 2) {
                    nextArticle()
                } else {
                    const closeInvoiceBtn = document.getElementById("payInvoiceBtn")

                    if (closeInvoiceBtn instanceof HTMLButtonElement) closeInvoiceBtn.focus()
                }
            } else if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab" && e.key !== "ArrowRight" && e.key !== "ArrowLeft" && !(e.ctrlKey && e.code === "KeyA")) {
                e.preventDefault()
            }
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
            {...props}
        />
    )
}