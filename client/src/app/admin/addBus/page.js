"use client";

import React from 'react'
import { Input } from "@/components/ui/input"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import axiosInstance from '@/axiosInstance/axiosIInstance';
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

function AddBus() {
    const router = useRouter()
    const { toast } = useToast()
    const { query } = router

    const [busNumber, setBusNumber] = useState("")
    const [busName, setBusName] = useState("")
    const [totalSeats, setTotalSeats] = useState("")
    const [availableDays, setAvailableDays] = useState([])

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await axiosInstance.post("/api/admin/addBus", {
                busNumber: busNumber,
                busName: busName,
                totalSeats: totalSeats,
                availableDays: availableDays
            })

            if (response.data.success === true) {
                toast({
                    title: "Bus added successfully"
                })
                router.push(`/admin/addStop?busNumber=${busNumber}`)
            } else {
                toast({
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem with your request.",
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <form className="flex flex-col gap-4 w-96 bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold">Add Bus</h1>
                <Input
                    type="text"
                    label="Bus Number"
                    value={busNumber}
                    onChange={(e) => setBusNumber(e.target.value)}
                    placeholder="Enter Bus Number"
                />
                <Input
                    type="text"
                    label="Bus Name"
                    value={busName}
                    onChange={(e) => setBusName(e.target.value)}
                    placeholder="Enter Bus Name"
                />
                <Input
                    type="number"
                    label="Total Seats"
                    value={totalSeats}
                    onChange={(e) => setTotalSeats(e.target.value)}
                    placeholder="Enter Total Seats"
                />

                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold">Available Days</h2>
                    <div className="sunday flex gap-2">
                        <input type="checkbox" id="sunday" name="sunday" value="sunday" onChange={(e) => setAvailableDays([...availableDays, e.target.value])} />
                        <label htmlFor="sunday">Sunday</label>
                    </div>
                    <div className="monday flex gap-2">
                        <input type="checkbox" id="monday" name="monday" value="monday" onChange={(e) => setAvailableDays([...availableDays, e.target.value])} />
                        <label htmlFor="monday">Monday</label>
                    </div>
                    <div className="tuesday flex gap-2">
                        <input type="checkbox" id="tuesday" name="tuesday" value="tuesday" onChange={(e) => setAvailableDays([...availableDays, e.target.value])} />
                        <label htmlFor="tuesday">Tuesday</label>
                    </div>
                    <div className="wednesday flex gap-2">
                        <input type="checkbox" id="wednesday" name="wednesday" value="wednesday" onChange={(e) => setAvailableDays([...availableDays, e.target.value])} />
                        <label htmlFor="wednesday">Wednesday</label>
                    </div>
                    <div className="thursday flex gap-2">
                        <input type="checkbox" id="thursday" name="thursday" value="thursday" onChange={(e) => setAvailableDays([...availableDays, e.target.value])} />
                        <label htmlFor="thursday">Thursday</label>
                    </div>
                    <div className="friday flex gap-2">
                        <input type="checkbox" id="friday" name="friday" value="friday" onChange={(e) => setAvailableDays([...availableDays, e.target.value])} />
                        <label htmlFor="friday">Friday</label>
                    </div>
                    <div className="saturday flex gap-2">
                        <input type="checkbox" id="saturday" name="saturday" value="saturday" onChange={(e) => setAvailableDays([...availableDays, e.target.value])} />
                        <label htmlFor="saturday">Saturday</label>
                    </div>
                </div>

                <Button asChild>
                    <button onClick={handleSubmit}>Add Bus</button>
                </Button>
            </form>
        </main>
    )
}

export default AddBus