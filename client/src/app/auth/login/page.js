"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useState } from "react";
import axiosInstance from "@/axiosInstance/axiosIInstance";

export default function Login() {
    const router = useRouter()
    const { toast } = useToast()

    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("user")

    const handleSelect = (e) => {
        setRole(e.target.value)
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            if (role === "admin") {
                const response = await axiosInstance.post("/api/auth/loginAdmin", {
                    username: userName,
                    password: password,
                    role: role
                })

                if (response.status === 200) {
                    toast({
                        title: "User logged in successfully"
                    })
                    router.push("/admin/addBus")
                } else {
                    toast({
                        title: "Uh oh! Something went wrong.",
                        description: "There was a problem with your request.",
                    })
                }
            }
            else {
                const response = await axiosInstance.post("/api/auth/loginUser", {
                    username: userName,
                    password: password,
                    role: role
                })

                if (response.status === 200) {
                    toast({

                        title: "User logged in successfully"
                    })
                    router.push("/user");
                } else {
                    toast({
                        title: "Uh oh! Something went wrong.",
                        description: "There was a problem with your request.",
                    })
                }
            }
        } catch (error) {
            toast({
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
            })
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <form
                className="flex flex-col gap-4 w-96 bg-white p-8 rounded-lg shadow-lg"
                onSubmit={onSubmit}
            >
                <h1 className="text-4xl font-bold">Login</h1>
                <Input
                    type="text"
                    label="Username"
                    onChange={(e) => {
                        // store form state
                        setUserName(e.target.value)
                    }}
                    placeholder="Username"
                />
                <Input
                    type="password"
                    label="Password"
                    onChange={(e) => {
                        setPassword(e.target.value)
                    }}
                    placeholder="Password"
                />

                <select onChange={handleSelect} className="w-full p-2 border border-gray-300 rounded-md">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>

                <Button type="submit">Login</Button>
            </form>
        </main>
    )
}
