"use client"

import {isUserRole, USER_ROLES_DICT, UserEntity, UserEntityWithId, UserRole} from "@/utils/UserManager/User.interfaces"
import React, {useState} from "react"
import Image from "next/image"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faTrash} from "@fortawesome/free-solid-svg-icons"

import styles from "./UserForm.module.sass"
import toast from "react-hot-toast"
import {getBase64} from "@/utils/images"

import * as UserManager from "@/utils/UserManager/UserManager"
import {useRouter} from "next/navigation"

interface UserFormProps {
    user?: UserEntityWithId
    className?: string
}

export default function UserForm({user, className}: UserFormProps) {
    const [userData, setUserData] = useState<UserEntity>(user ?
        {
            ...user,
            password: ""
        } : {
            name: "",
            password: Math.random().toString(36).slice(-8),
            role: "consultant",
        })

    const router = useRouter()

    const deleteAvatar = () => {
        setUserData(oldData => {
            return {
                ...oldData,
                avatar: undefined
            }
        })
    }

    const changeNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserData(oldData => {
            return {
                ...oldData,
                name: e.target.value,
            }
        })
    }

    const changePasswordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserData(oldData => {
            return {
                ...oldData,
                password: e.target.value,
            }
        })
    }

    const changeAvatarHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return toast.error("Файл відсутній!")
        toast.promise(getBase64(file), {
            loading: "Завантаження...",
            success: "Успішно!",
            error: "Помилка!"
        }).then((result) => {
            if (typeof result === "string") {
                setUserData(oldData => {
                    return {
                        ...oldData,
                        avatar: result
                    }
                })
            }
        })
    }

    const changeRoleHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const role = e.target.value

        if (!isUserRole(role)) return toast.error("Такої ролі не існує!")

        setUserData(oldData => {
            return {
                ...oldData,
                role: role
            }
        })
    }

    const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault()

        const formData = new FormData(e.target as HTMLFormElement)
        if ((formData.get("avatar") as File).size < 1) formData.delete("avatar")

        if (!formData.get("name") || (!formData.get("password") && !user?.id) || !formData.get("role")) return toast.error("Не всі поля заповнені!")

        if (user?.id) {
            if (userData.password.length < 1) formData.delete("password")
            formData.set("id", user.id)

            toast.promise(UserManager.UpdateUser(formData), {
                loading: "Збереження...",
                success: "Зміни збережено!",
                error: "Невідома помилка!"
            }).then(value => {
                window.location.reload()
            })
        } else {
            toast.promise(UserManager.CreateUser(formData), {
                loading: "Збереження...",
                success: "Успішно!",
                error: "Невідома помилка!"
            }).then((user) => {
                if (user) router.push(`/admin/users/${user.userId}`)
            })
        }
    }

    return (
        <form className={`${styles.form} ${className || ""}`} onSubmit={submitHandler}>
            <div className={styles.column}>
                <label className={styles.avatarInput}>
                    <Image
                        className={styles.avatarImage}
                        src={`/images/avatars/${userData.avatar || "empty-avatar.png"}`}
                        alt={"avatar"}
                        width={80}
                        height={80}/>
                    <input
                        type="file"
                        name={"avatar"}
                        onChange={changeAvatarHandler}
                        accept="image/*"
                    />
                </label>
                <button type={"button"} className={styles.deleteAvatarBtn} onClick={deleteAvatar}>
                    <FontAwesomeIcon icon={faTrash}/>
                    Delete avatar
                </button>
            </div>
            <div className={styles.column}>
                <label>
                    Ім&apos;я:
                    <input
                        type="text"
                        name={"name"}
                        placeholder={"Ім'я"}
                        value={userData.name}
                        onChange={changeNameHandler}
                    />
                </label>
                <label>
                    Пароль:
                    <input
                        type="text"
                        name={"password"}
                        placeholder={"Пароль"}
                        value={userData.password}
                        onChange={changePasswordHandler}
                    />
                </label>
                <label>
                    Роль:
                    <select name="role" value={userData.role} onChange={changeRoleHandler}>
                        {Object.keys(USER_ROLES_DICT).map((key) => (
                            <option value={key} key={key}>{USER_ROLES_DICT[key as UserRole]}</option>
                        ))}
                    </select>
                </label>
                <button type={"submit"}>Зберегти</button>
            </div>
        </form>
    )
}