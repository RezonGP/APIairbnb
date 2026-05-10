import type { RoomsResponse } from "../types/room"


export async function getRooms() {
    const response = await fetch("http://localhost:3000/api/phong-thue/", {
        method: "GET",
    })
    const data: RoomsResponse = await response.json()
    if (!response.ok) {
        throw new Error(data.message || 'Get rooms failed')
    }
    return data
}
