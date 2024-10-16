import React, {useRef, useState} from "react"

import styles from "./WeightCalculatorForm.module.sass"

const QUANTITY_BUTTONS = [10, 20, 50]

export type WeightCalculatorMode = "weightToQuantity" | "quantityToWeight"

export default function WeightCalculatorForm() {
    const [mode, setMode] = useState<WeightCalculatorMode>("quantityToWeight")
    const [weight, setWeight] = useState(0)
    const [count, setCount] = useState(100)
    const [quantity, setQuantity] = useState(50)
    const [quantityWeight, setQuantityWeight] = useState(96)

    const quantityWeightInputRef = useRef<HTMLInputElement | null>(null)
    const formRef = useRef<HTMLFormElement | null>(null)

    const changeQuantityHandler = (quantity: number) => {
        setQuantity(quantity)
        quantityWeightInputRef.current?.focus()
    }

    const keyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") tabulationOnEnter(e)
    }

    const calculateQuantity = () => {
        if (quantityWeight > 0 && quantity > 0) {
            return weight / (quantityWeight / quantity)
        }
        return 0
    }

    const calculateWeight = () => {
        if (quantity > 0) {
            return (quantityWeight / quantity) * count
        }
        return 0
    }

    const tabulationOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const activeElement = document.activeElement

        if (activeElement && activeElement.tagName === "INPUT" && formRef?.current) {
            const inputs = Array.from(formRef.current.querySelectorAll("input"))
            const index = inputs.indexOf(activeElement as HTMLInputElement)

            if (index >= 0 && index < inputs.length - 1) {
                inputs[index + 1].focus()
                e.preventDefault()
            }
        }
    }

    const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select()
    }

    return (
        <form className={styles.calculator} ref={formRef}>
            <div className={styles.modeSelect}>
                <button
                    className={`black-cyan ${mode === "quantityToWeight" ? "active" : ""}`}
                    onClick={() => setMode("quantityToWeight")}
                    type={"button"}
                >
                    QTW(вага)
                </button>
                <button
                    className={`black-cyan ${mode === "weightToQuantity" ? "active" : ""}`}
                    onClick={() => setMode("weightToQuantity")}
                    type={"button"}
                >
                    WTQ(кількість)
                </button>
            </div>
            <div className={styles.quantityButtons}>
                {QUANTITY_BUTTONS.map(button => (
                    <button
                        className={`black-cyan ${quantity === button ? "active" : ""}`}
                        key={button}
                        onClick={() => changeQuantityHandler(button)}
                        type="button"
                    >
                        {button.toString()}
                    </button>
                ))}
            </div>
            <label>
                <span>Вага({quantity}):</span>
                <input type="number" name={"quantityWeight"} ref={quantityWeightInputRef} value={quantityWeight}
                    onChange={(e) => setQuantityWeight(parseInt(e.target.value))}
                    onKeyDown={keyDownHandler}
                    onFocus={handleInputFocus}
                />
            </label>
            {mode === "quantityToWeight" ? (
                <>
                    <label>
                        <span>К-сть:</span>
                        <input type="number" name={"count"} value={count}
                            onChange={(e) => setCount(parseInt(e.target.value))}
                            onKeyDown={keyDownHandler}
                            onFocus={handleInputFocus}
                        />
                    </label>
                    <div className={styles.result}>
                        Вага({count}шт.): <span>{calculateWeight().toFixed(2)}</span>
                    </div>
                </>
            ) : (
                <>
                    <label>
                        <span>Вага:</span>
                        <input type="number" name={"weight"} value={weight}
                            onChange={(e) => setWeight(parseInt(e.target.value))}
                            onKeyDown={keyDownHandler}
                            onFocus={handleInputFocus}
                        />
                    </label>
                    <div className={styles.result}>
                        К-сть({}): <span>{calculateQuantity().toFixed(2)}</span>
                    </div>
                </>
            )}
        </form>
    )
}