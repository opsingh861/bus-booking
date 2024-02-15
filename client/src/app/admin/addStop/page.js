"use client";

import React from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from "next/navigation"
import { useSearchParams } from 'next/navigation';
import axiosInstance from '@/axiosInstance/axiosIInstance';

function AddStop(props) {
    const router = useRouter();
    const { toast } = useToast();
    const searchParams = useSearchParams();

    const busNs = searchParams.get('busNumber');

    const [busNumber, setBusNumber] = useState(busNs || "");
    const [sequence, setSequence] = useState(1);
    const [location, setLocation] = useState("");
    const [distanceFromPrevious, setDistanceFromPrevious] = useState(0);
    const [travelTimeFromPrevious, setTravelTimeFromPrevious] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post("/api/admin/addStop", {
                busNumber: busNumber,
                sequence: Number(sequence),
                location: location,
                distanceFromPrevious: Number(distanceFromPrevious),
                travelTimeFromPrevious: Number(travelTimeFromPrevious)
            })

            if (response.data.success === true) {
                toast({
                    title: "Stop added successfully"
                })
                router.push("/admin/addStop")

                // setSequence(sequence + 1);
                // setLocation("");
                // setDistanceFromPrevious("");
                // setTravelTimeFromPrevious("");
            } else {
                toast({
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem with your request.",
                })
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <form className="flex flex-col gap-4 w-96 bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold">Add Stop</h1>
                <div className="flex flex-col gap-2">
                    <label className="text-lg font-semibold" htmlFor="busNumber">
                        Bus Number
                    </label>
                    <Input
                        type="text"
                        value={busNumber}
                        onChange={(e) => setBusNumber(e.target.value)}
                        placeholder="Enter Bus Number"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-lg font-semibold" htmlFor="sequence">
                        Sequence
                    </label>
                    <Input
                        type="number"
                        value={sequence}
                        onChange={(e) => setSequence(e.target.value)}
                        placeholder="Enter Sequence"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-lg font-semibold" htmlFor="location">
                        Location
                    </label>
                    <Input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Enter Location"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-lg font-semibold" htmlFor="distanceFromPrevious">
                        Distance from Previous Stop
                    </label>
                    <Input
                        type="number"
                        value={distanceFromPrevious}
                        onChange={(e) => setDistanceFromPrevious(e.target.value)}
                        placeholder="Enter Distance from Previous Stop"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-lg font-semibold" htmlFor="travelTimeFromPrevious">
                        Travel Time from Previous Stop
                    </label>
                    <Input
                        type="number"
                        value={travelTimeFromPrevious}
                        onChange={(e) => setTravelTimeFromPrevious(e.target.value)}
                        placeholder="Enter Travel Time from Previous Stop"
                    />
                </div>
                <Button onClick={handleSubmit}>Add Stop</Button>
            </form>
        </main>
    )
}

export default AddStop