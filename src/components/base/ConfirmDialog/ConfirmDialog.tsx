"use client"

import {ReactNode, useEffect, useState} from "react"

import styles from "./ConfirmDialog.module.sass"

interface ConfirmDialogProps {
    message: string
    children?: ReactNode
    buttons: {
        text: string
        onclick?: () => void
        className?: string
        keyCode?: string
    }[];
}

function ConfirmDialog({message, children, buttons}: ConfirmDialogProps) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const button = buttons.find(button => button.keyCode === event.code)
            if (button && button.onclick) {
                button.onclick()
            }
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [buttons])

    return (
        <div className={styles.window}>
            <p className={styles.title}>{message}</p>
            {children && (<div>{children}</div>)}
            <div className={styles.buttons}>
                {buttons.map((button, index) => (
                    <button className={`${styles.button} ${button.className || ""}`} key={index}
                        onClick={button.onclick}>
                        {button.text} {button.keyCode && <small>({button.keyCode})</small>}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default function useConfirm() {
    const [isVisible, setIsVisible] = useState(false)
    const [dialogProps, setDialogProps] = useState<ConfirmDialogProps | null>(null)

    const confirm = (message: string, buttons: ConfirmDialogProps["buttons"], children?: ReactNode) => {
        return new Promise<void>((resolve) => {
            const handleClose = () => setIsVisible(false)

            const updatedButtons = buttons.map(button => ({
                ...button,
                onclick: () => {
                    console.log(button.onclick)
                    if (button.onclick) button.onclick()
                    resolve()
                    handleClose()
                }
            }))

            console.log(updatedButtons)

            setDialogProps({
                message,
                buttons: updatedButtons,
                children,
            })

            setIsVisible(true)
        })
    }

    const ConfirmDialogComponent = isVisible && dialogProps ? (
        <ConfirmDialog
            message={dialogProps.message}
            buttons={dialogProps.buttons}
        >
            {dialogProps.children}
        </ConfirmDialog>
    ) : null

    return {confirm, ConfirmDialogComponent}
}
