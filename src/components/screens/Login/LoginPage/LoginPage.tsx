import LoginForm from "@/components/forms/LoginForm/LoginForm"

import styles from "./LoginPage.module.sass"
import Image from "next/image"

export default function LoginPage() {
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <Image className={styles.logo} src={"/images/mini-max_logo.png"} alt={"logo"} width={79} height={61}/>
                <LoginForm/>
            </div>
        </main>
    )
}