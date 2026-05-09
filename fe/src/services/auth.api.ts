import type { ProfileResponse, SigninFormData, SigninResponse, SignupFormData, SignupResponse } from "@/types/auth";


export async function signup(payload: SignupFormData) {
    const response = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
    const data: SignupResponse = await response.json()
    if (!response.ok) {
        throw new Error(data.message || 'Signup failed')
    }
    return data
}
export async function signin(payload: SigninFormData) {
    const response = await fetch("http://localhost:3000/api/auth/signin",
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        }
    )
    const data: SigninResponse = await response.json()
    if (!response.ok) {
        throw new Error(data.message || 'Signin failed')
    }
    return data

}

export async function getProfile() {
    const token = localStorage.getItem("token")

    const response = await fetch("http://localhost:3000/api/auth/profile", {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })
    const data: ProfileResponse = await response.json()
    if (!response.ok) {
        throw new Error(data.message || 'Get profile failed')
    }
    return data
} 