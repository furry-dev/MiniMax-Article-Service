"use client"

import * as UserManager from "@/utils/UserManager/UserManager"
import {USER_ROLES_DICT, UserEntityWithId} from "@/utils/UserManager/User.interfaces"

import styles from "./LoginForm.module.sass"
import React, {useEffect, useState} from "react"
import toast from "react-hot-toast"

import * as LoginManager from "@/utils/LoginManager/LoginManager"

import Cookies from "js-cookie"
import {useRouter} from "next/navigation"

export default function LoginForm() {
    const [users, setUsers] = useState<UserEntityWithId[]>([])

    const router = useRouter()

    useEffect(() => {
        UserManager.GetUsers().then(users => setUsers(users))
    }, [])

    const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.target as HTMLFormElement)
        if (!formData.get("uid") || !formData.get("password")) return toast.error("Не всі данні введено!")

        toast.promise(LoginManager.Login(formData), {
            loading: "Вхід...",
            success: "Успішно!",
            error: "Помилка!"
        }).then(token => {
            if (!token) return toast.error("Користувача не знайдено!")
            Cookies.set("token", token, {expires: 1, sameSite: "Lax"})
            router.push("/")
        })
    }

    return (
        <form className={styles.form} onSubmit={onSubmitHandler}>
            <label>
                Користувач:
                <select name="uid">
                    {users.map(user => <option key={user.id}
                        value={user.id}>{user.name} ({USER_ROLES_DICT[user.role]})</option>)}
                </select>
            </label>
            <label>
                Пароль:
                <input type="password" name={"password"} placeholder="Пароль"/>
            </label>
            <button type={"submit"}>Логін</button>
        </form>
    )
}