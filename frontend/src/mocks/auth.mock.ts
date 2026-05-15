import type { AuthData } from "@/hooks/useAuth";

export const MOCK_AUTH: AuthData = {
    token: "dev-token",
    user: {
        id: "1",
        name: "Yujan Dev",
        email: "yujan@dev.com",
        role: "admin",
    },
};
