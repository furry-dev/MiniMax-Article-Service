import React, {useRef, useState} from "react"
import styles from "./WeightCalculatorForm.module.sass"

const QUANTITY_BUTTONS = [10, 20, 50]

export type WeightCalculatorMode = "weightToQuantity" | "quantityToWeight";

interface WeightCalculatorProps {
    mode?: WeightCalculatorMode;
    itemCount?: number;
    setProductCount?: (count: number) => void;
}

export default function WeightCalculatorForm({
    mode,
    itemCount,
    setProductCount,
}: WeightCalculatorProps) {
    const [calcMode, setCalcMode] = useState<WeightCalculatorMode>(mode || "quantityToWeight")
    const [weight, setWeight] = useState<number>(0)
    const [count, setCount] = useState<number>(itemCount || 100)
    const [quantity, setQuantity] = useState<number>(50)
    const [quantityWeight, setQuantityWeight] = useState<number>(96)

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
            {!mode && (
                <div className={styles.modeSelect}>
                    <button
                        className={`black-cyan ${calcMode === "quantityToWeight" ? "active" : ""}`}
                        onClick={() => setCalcMode("quantityToWeight")}
                        type={"button"}
                    >
                        QTW(вага)
                    </button>
                    <button
                        className={`black-cyan ${calcMode === "weightToQuantity" ? "active" : ""}`}
                        onClick={() => setCalcMode("weightToQuantity")}
                        type={"button"}
                    >
                        WTQ(кількість)
                    </button>
                </div>
            )}
            <div className={styles.quantityButtons}>
                {QUANTITY_BUTTONS.map((button) => (
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
                <input
                    type="number"
                    name={"quantityWeight"}
                    ref={quantityWeightInputRef}
                    value={quantityWeight}
                    step="0.01"
                    onChange={(e) => setQuantityWeight(parseFloat(e.target.value))}
                    onKeyDown={keyDownHandler}
                    onFocus={handleInputFocus}
                />
            </label>
            {calcMode === "quantityToWeight" ? (
                <>
                    <label>
                        <span>К-сть:</span>
                        <input
                            type="number"
                            name={"count"}
                            value={count}
                            step="0.01"
                            onChange={(e) => setCount(parseFloat(e.target.value))}
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
                        <input
                            type="number"
                            name={"weight"}
                            value={weight}
                            step="0.01"
                            onChange={(e) => setWeight(parseFloat(e.target.value))}
                            onKeyDown={keyDownHandler}
                            onFocus={handleInputFocus}
                        />
                    </label>
                    <div className={styles.result}>
                        К-сть({weight}г): <span>{calculateQuantity().toFixed(2)}</span>
                    </div>
                    {setProductCount && (
                        <button
                            className={`lime-button ${styles.button}`}
                            type={"button"}
                            onClick={() => setProductCount(calculateQuantity())}
                        >
                            Встановити кількість
                        </button>
                    )}
                </>
            )}
        </form>
    )
}