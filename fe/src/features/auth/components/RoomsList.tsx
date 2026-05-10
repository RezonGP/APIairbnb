import { useEffect, useState } from "react";
import { getRooms } from "../services/room.api";
import type { Room } from "../types/room";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";




function RoomsList() {
    const [rooms, setRooms] = useState<Room[]>([])
    const [errorMessage, setErrorMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)


    const handleGetRooms = async () => {
        setErrorMessage('')
        setIsLoading(true)
        try {
            const result = await getRooms()
            setRooms(result.data)
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message)
            } else {
                setErrorMessage('Lấy danh sách phòng thất bại.')
            }
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        handleGetRooms()
    }, [])
    if (errorMessage) {
        return <div className="text-sm text-red-500">{errorMessage}</div>
    }

    return (
        <div className="w-full space-y-4">
            <div className="text-lg font-semibold">Danh sách phòng</div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rooms.map((room) => (
                    <Card key={room.id} className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base">{room.tenPhong}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1 text-sm text-slate-700">
                            <div>Giá: {room.giaTien}</div>
                            <div>Khách: {room.khach}</div>
                            <div>
                                Vị trí: {room.viTri.tenViTri}, {room.viTri.tinhThanh}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default RoomsList
