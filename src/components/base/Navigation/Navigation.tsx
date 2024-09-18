"use client"

import Image from "next/image"
import styles from "./Navigation.module.sass"
import {useEffect, useRef} from "react"
import Link from "next/link"
import {useUser} from "@/context/UserContext"

export default function Navigation() {
    const navRef = useRef<HTMLElement | null>(null)

    const user = useUser()

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

    console.log(user?.role)

    return (
        <nav className={styles.nav} ref={navRef}>
            <Image className={styles.logo} src={"/images/mini-max_logo.png"} alt={"logo"} width={69} height={51}/>
            <ul className={styles.links}>
                {
                    (
                        user?.role === "consultant" ||
                        user?.role === "cashbox" ||
                        user?.role === "admin" ||
                        user?.role === "developer"
                    ) && (
                        <li>
                            <Link href={"/"} className={styles.navBtn}>
                                <Image src={"/icons/invoice.png"} alt={"invoices"} width={32} height={32}/>
                                Накладні
                            </Link>
                        </li>
                    )
                }
                {
                    (
                        user?.role === "consultant" ||
                        user?.role === "labeler" ||
                        user?.role === "admin" ||
                        user?.role === "developer"
                    ) && (
                        <li>
                            <Link href={"/revaluation"} className={styles.navBtn}>
                                <Image src={"/icons/revaluation.png"} alt={"revaluation"} width={32} height={32}/>
                                Переоцінка
                            </Link>
                        </li>
                    )
                }
            </ul>
        </nav>
    )
}