"use client"

import Image from "next/image"
import styles from "./Navigation.module.sass"
import {useEffect, useRef} from "react"
import Link from "next/link"

export default function Navigation() {
    const navRef = useRef<HTMLElement | null>(null)

    useEffect(() => {
        const changeWindowSize = () => {
            const navWidth = navRef.current?.clientWidth
            const navHeight = navRef.current?.clientHeight

            const root = document.querySelector(":root")

            if (!(root instanceof HTMLElement) || !navWidth) return

            root.style.setProperty("--nav-width", `${navWidth}px`)
            root.style.setProperty("--nav-height", `${navHeight}px`)
        }

        window.addEventListener("resize", changeWindowSize)
        changeWindowSize()

        return () => {
            window.removeEventListener("resize", changeWindowSize)
        }
    })

    return (
        <nav className={styles.nav} ref={navRef}>
            <Image className={styles.logo} src={"/mini-max_logo.png"} alt={"logo"} width={69} height={51}/>
            <ul className={styles.links}>
                <li>
                    <Link href={"/"} className={styles.navBtn}>
                        <Image src={"/icons/invoice.png"} alt={"revaluation"} width={32} height={32}/>
                        Накладні
                    </Link>
                </li>
                <li>
                    <Link href={"/revaluation"} className={styles.navBtn}>
                        <Image src={"/icons/revaluation.png"} alt={"revaluation"} width={32} height={32}/>
                        Переоцінка
                    </Link>
                </li>
            </ul>
        </nav>
    )
}