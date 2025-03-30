const env = import.meta.env;



const url = env.VITE_API_URL || "http://localhost:3000";
const password = env.VITE_API_PASSWORD || "password";

export const login = async () => {
    try {
        const response = await fetch(`${url}/auth/login`, {
            body: JSON.stringify({ password }),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            return null;
        }
        const json = await response.json();
        return json.token;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const get_all_subjects = async (token: string) => {
    try {
        const response = await fetch(`${url}/subjects`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
            );
        if (!response.ok) {
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const get_all_quizzes = async (token: string) => {
    try {
        const response = await fetch(`${url}/quizzes`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
        if (!response.ok) {
            return null;
        }
        return await response.json();
    }
    catch (error) {
        console.error(error);
        return null;
    }
}

export const get_quizzes_by_subject_id = async (token: string, subject_id: string) => {
    try {
        const response = await fetch(`${url}/quizzes/${subject_id}`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
        if (!response.ok) {
            return null;
        }
        return await response.json();
    }
    catch (error) {
        console.error(error);
        return null;
    }
}